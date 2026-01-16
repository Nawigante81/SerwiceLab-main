import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Repair = Database["public"]["Tables"]["repairs"]["Row"];
type CostEstimate = Database["public"]["Tables"]["cost_estimates"]["Row"];
type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

type TableRowData = {
  id: string;
  cells: string[];
};

const buildPrintHtml = (title: string, columns: string[], rows: TableRowData[]) => {
  const header = columns.map((col) => `<th>${col}</th>`).join("");
  const body = rows
    .map((row) => `<tr>${row.cells.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  return `<!DOCTYPE html>
  <html lang="pl">
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
        h1 { font-size: 20px; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; text-align: left; }
        th { background: #f5f5f5; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <table>
        <thead><tr>${header}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </body>
  </html>`;
};

const Admin = () => {
  const queryClient = useQueryClient();
  const [repairsPage, setRepairsPage] = useState(1);
  const repairsPageSize = 10;
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([]);
  const [selectedEstimates, setSelectedEstimates] = useState<string[]>([]);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const {
    data: repairs,
    isLoading: repairsLoading,
    error: repairsError,
  } = useQuery({
    queryKey: ["admin", "repairs", repairsPage],
    queryFn: async () => {
      const from = (repairsPage - 1) * repairsPageSize;
      const to = from + repairsPageSize - 1;
      const { data, error, count } = await supabase
        .from("repairs")
        .select("id,user_id,status,device_type,device_brand,device_model,created_at", {
          count: "exact",
        })
        .is("archived_at", null)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { data: data as Repair[], count: count ?? 0 };
    },
  });

  const {
    data: estimates,
    isLoading: estimatesLoading,
    error: estimatesError,
  } = useQuery({
    queryKey: ["admin", "estimates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cost_estimates")
        .select("id,repair_id,status,total_cost,created_at")
        .is("archived_at", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as CostEstimate[];
    },
  });

  const {
    data: messages,
    isLoading: messagesLoading,
    error: messagesError,
  } = useQuery({
    queryKey: ["admin", "contact_messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id,name,email,subject,created_at")
        .is("archived_at", null)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const repairsRows = useMemo(
    () =>
      (repairs?.data ?? []).map((repair) => ({
        id: repair.id,
        cells: [
          repair.id.slice(0, 8).toUpperCase(),
          repair.user_id.slice(0, 8).toUpperCase(),
          [repair.device_type, repair.device_brand, repair.device_model].filter(Boolean).join(" "),
          repair.status,
          new Date(repair.created_at).toLocaleDateString("pl-PL"),
        ],
      })),
    [repairs?.data]
  );

  const estimatesRows = useMemo(
    () =>
      (estimates ?? []).map((estimate) => ({
        id: estimate.id,
        cells: [
          estimate.id.slice(0, 8).toUpperCase(),
          estimate.repair_id.slice(0, 8).toUpperCase(),
          estimate.status,
          `${estimate.total_cost.toFixed(2)} PLN`,
          new Date(estimate.created_at).toLocaleDateString("pl-PL"),
        ],
      })),
    [estimates]
  );

  const messagesRows = useMemo(
    () =>
      (messages ?? []).map((message) => ({
        id: message.id,
        cells: [
          message.id.slice(0, 8).toUpperCase(),
          message.name,
          message.email,
          message.subject,
          new Date(message.created_at).toLocaleDateString("pl-PL"),
        ],
      })),
    [messages]
  );

  const handleExportPdf = (title: string, columns: string[], rows: TableRowData[], selected: string[]) => {
    const selectedRows = selected.length ? rows.filter((row) => selected.includes(row.id)) : rows;
    if (!selectedRows.length) {
      toast.info("Brak danych do eksportu.");
      return;
    }
    const html = buildPrintHtml(title, columns, selectedRows);
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (!win) {
      toast.error("Nie można otworzyć podglądu PDF.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  const handleArchive = async (table: "repairs" | "cost_estimates" | "contact_messages", ids: string[]) => {
    if (!ids.length) {
      toast.info("Najpierw wybierz elementy.");
      return;
    }
    const { error } = await supabase
      .from(table)
      .update({ archived_at: new Date().toISOString() })
      .in("id", ids);
    if (error) {
      toast.error("Nie udało się przenieść do archiwum.");
      return;
    }
    toast.success("Przeniesiono do archiwum.");
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  const handleDelete = async (table: "repairs" | "cost_estimates" | "contact_messages", ids: string[]) => {
    if (!ids.length) {
      toast.info("Najpierw wybierz elementy.");
      return;
    }
    const { error } = await supabase.from(table).delete().in("id", ids);
    if (error) {
      toast.error("Nie udało się usunąć.");
      return;
    }
    toast.success("Usunięto elementy.");
    queryClient.invalidateQueries({ queryKey: ["admin"] });
  };

  const toggleSelection = (
    id: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const toggleAll = (
    ids: string[],
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setSelected(selected.length === ids.length ? [] : ids);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Panel admina
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Podgląd napraw, kosztorysów i wiadomości kontaktowych.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Naprawy</p>
            <p className="text-2xl font-semibold text-foreground">
              {repairsLoading ? "-" : repairs?.count ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Kosztorysy</p>
            <p className="text-2xl font-semibold text-foreground">
              {estimatesLoading ? "-" : estimates?.length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Wiadomości</p>
            <p className="text-2xl font-semibold text-foreground">
              {messagesLoading ? "-" : messages?.length ?? 0}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Naprawy</h2>
            {repairsError && (
              <span className="text-sm text-destructive">Błąd pobierania danych</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportPdf(
                  "Naprawy",
                  ["ID", "Użytkownik", "Urządzenie", "Status", "Data"],
                  repairsRows,
                  selectedRepairs
                )
              }
            >
              Eksportuj do PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArchive("repairs", selectedRepairs)}
            >
              Przenieś do archiwum
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete("repairs", selectedRepairs)}
            >
              Usuń
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedRepairs.length === repairsRows.length && repairsRows.length > 0}
                      onCheckedChange={() => toggleAll(repairsRows.map((row) => row.id), selectedRepairs, setSelectedRepairs)}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Użytkownik</TableHead>
                  <TableHead>Urządzenie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairsLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Ładowanie...
                    </TableCell>
                  </TableRow>
                )}
                {!repairsLoading && (repairs?.data.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Brak danych.
                    </TableCell>
                  </TableRow>
                )}
                {repairs?.data.map((repair) => (
                  <TableRow key={repair.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRepairs.includes(repair.id)}
                        onCheckedChange={() => toggleSelection(repair.id, selectedRepairs, setSelectedRepairs)}
                      />
                    </TableCell>
                    <TableCell>{repair.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{repair.user_id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>
                      {[repair.device_type, repair.device_brand, repair.device_model]
                        .filter(Boolean)
                        .join(" ")}
                    </TableCell>
                    <TableCell>{repair.status}</TableCell>
                    <TableCell>
                      {new Date(repair.created_at).toLocaleDateString("pl-PL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!repairsLoading && (repairs?.count ?? 0) > repairsPageSize && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Strona {repairsPage} z {Math.max(1, Math.ceil((repairs?.count ?? 0) / repairsPageSize))}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-3 py-1 rounded-md border border-border hover:border-primary/40"
                  onClick={() => setRepairsPage((prev) => Math.max(1, prev - 1))}
                  disabled={repairsPage === 1}
                >
                  Poprzednia
                </button>
                <button
                  type="button"
                  className="px-3 py-1 rounded-md border border-border hover:border-primary/40"
                  onClick={() => setRepairsPage((prev) => prev + 1)}
                  disabled={repairsPage >= Math.ceil((repairs?.count ?? 0) / repairsPageSize)}
                >
                  Następna
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Kosztorysy</h2>
            {estimatesError && (
              <span className="text-sm text-destructive">Błąd pobierania danych</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportPdf(
                  "Kosztorysy",
                  ["ID", "Naprawa", "Status", "Suma", "Data"],
                  estimatesRows,
                  selectedEstimates
                )
              }
            >
              Eksportuj do PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArchive("cost_estimates", selectedEstimates)}
            >
              Przenieś do archiwum
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete("cost_estimates", selectedEstimates)}
            >
              Usuń
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedEstimates.length === estimatesRows.length && estimatesRows.length > 0}
                      onCheckedChange={() => toggleAll(estimatesRows.map((row) => row.id), selectedEstimates, setSelectedEstimates)}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Naprawa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Suma</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimatesLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Ładowanie...
                    </TableCell>
                  </TableRow>
                )}
                {!estimatesLoading && (estimates?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Brak danych.
                    </TableCell>
                  </TableRow>
                )}
                {estimates?.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEstimates.includes(estimate.id)}
                        onCheckedChange={() => toggleSelection(estimate.id, selectedEstimates, setSelectedEstimates)}
                      />
                    </TableCell>
                    <TableCell>{estimate.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{estimate.repair_id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{estimate.status}</TableCell>
                    <TableCell>{estimate.total_cost.toFixed(2)} PLN</TableCell>
                    <TableCell>
                      {new Date(estimate.created_at).toLocaleDateString("pl-PL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Wiadomości kontaktowe</h2>
            {messagesError && (
              <span className="text-sm text-destructive">Błąd pobierania danych</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                handleExportPdf(
                  "Wiadomości kontaktowe",
                  ["ID", "Nadawca", "Email", "Temat", "Data"],
                  messagesRows,
                  selectedMessages
                )
              }
            >
              Eksportuj do PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArchive("contact_messages", selectedMessages)}
            >
              Przenieś do archiwum
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete("contact_messages", selectedMessages)}
            >
              Usuń
            </Button>
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedMessages.length === messagesRows.length && messagesRows.length > 0}
                      onCheckedChange={() => toggleAll(messagesRows.map((row) => row.id), selectedMessages, setSelectedMessages)}
                    />
                  </TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Nadawca</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Temat</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messagesLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Ładowanie...
                    </TableCell>
                  </TableRow>
                )}
                {!messagesLoading && (messages?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground">
                      Brak danych.
                    </TableCell>
                  </TableRow>
                )}
                {messages?.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedMessages.includes(message.id)}
                        onCheckedChange={() => toggleSelection(message.id, selectedMessages, setSelectedMessages)}
                      />
                    </TableCell>
                    <TableCell>{message.id.slice(0, 8).toUpperCase()}</TableCell>
                    <TableCell>{message.name}</TableCell>
                    <TableCell>{message.email}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell>
                      {new Date(message.created_at).toLocaleDateString("pl-PL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
