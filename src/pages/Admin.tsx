import { useQuery } from "@tanstack/react-query";
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

type Repair = Database["public"]["Tables"]["repairs"]["Row"];
type CostEstimate = Database["public"]["Tables"]["cost_estimates"]["Row"];
type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

const Admin = () => {
  const {
    data: repairs,
    isLoading: repairsLoading,
    error: repairsError,
  } = useQuery({
    queryKey: ["admin", "repairs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("repairs")
        .select("id,user_id,status,device_type,device_brand,device_model,created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as Repair[];
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
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Panel admina
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Podglad napraw, kosztorysow i wiadomosci kontaktowych.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Naprawy</p>
            <p className="text-2xl font-semibold text-foreground">
              {repairsLoading ? "-" : repairs?.length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Kosztorysy</p>
            <p className="text-2xl font-semibold text-foreground">
              {estimatesLoading ? "-" : estimates?.length ?? 0}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Wiadomosci</p>
            <p className="text-2xl font-semibold text-foreground">
              {messagesLoading ? "-" : messages?.length ?? 0}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Naprawy</h2>
            {repairsError && (
              <span className="text-sm text-destructive">Blad pobierania danych</span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Uzytkownik</TableHead>
                  <TableHead>Urzadzenie</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairsLoading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Ladowanie...
                    </TableCell>
                  </TableRow>
                )}
                {!repairsLoading && (repairs?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Brak danych.
                    </TableCell>
                  </TableRow>
                )}
                {repairs?.map((repair) => (
                  <TableRow key={repair.id}>
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
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Kosztorysy</h2>
            {estimatesError && (
              <span className="text-sm text-destructive">Blad pobierania danych</span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Ladowanie...
                    </TableCell>
                  </TableRow>
                )}
                {!estimatesLoading && (estimates?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Brak danych.
                    </TableCell>
                  </TableRow>
                )}
                {estimates?.map((estimate) => (
                  <TableRow key={estimate.id}>
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
            <h2 className="text-lg font-semibold text-foreground">Wiadomosci kontaktowe</h2>
            {messagesError && (
              <span className="text-sm text-destructive">Blad pobierania danych</span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Ladowanie...
                    </TableCell>
                  </TableRow>
                )}
                {!messagesLoading && (messages?.length ?? 0) === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      Brak danych.
                    </TableCell>
                  </TableRow>
                )}
                {messages?.map((message) => (
                  <TableRow key={message.id}>
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
