import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockPaczkomaty } from "@/lib/mock-data";
import { 
  Laptop, 
  Monitor, 
  HardDrive,
  Upload,
  MapPin,
  Package,
  CheckCircle,
  ArrowRight,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCreateRepair } from "@/hooks/useRepairs";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

type DeviceType = Database["public"]["Enums"]["device_type"];

const deviceTypes: { id: DeviceType; label: string; icon: typeof Laptop }[] = [
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'pc', label: 'Komputer PC', icon: Monitor },
  { id: 'other', label: 'Inne', icon: HardDrive },
];

const RepairRequest = () => {
  const [step, setStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const [selectedPaczkomat, setSelectedPaczkomat] = useState<string | null>(null);
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const { data: profile } = useProfile();
  const createRepair = useCreateRepair();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;

  const canProceedToStep2 = selectedDevice !== null;
  const canProceedToStep3 = problemDescription.trim().length >= 10;
  const canProceedToStep4 = selectedPaczkomat !== null;
  const canSubmit = termsAccepted && selectedDevice && problemDescription.trim();

  const handleSubmit = async () => {
    if (!selectedDevice || !problemDescription.trim()) {
      toast({
        title: "Błąd",
        description: "Wypełnij wszystkie wymagane pola",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Błąd",
        description: "Musisz zaakceptować regulamin",
        variant: "destructive",
      });
      return;
    }

    try {
      await createRepair.mutateAsync({
        device_type: selectedDevice,
        device_brand: deviceBrand.trim() || null,
        device_model: deviceModel.trim() || null,
        problem_description: problemDescription.trim(),
        shipping_method: 'inpost',
        paczkomat_id: selectedPaczkomat,
        status: 'pending',
      });

      // Send confirmation email
      const userName = profile?.first_name || profile?.email?.split('@')[0] || 'Użytkowniku';
      try {
        await supabase.functions.invoke('send-repair-confirmation', {
          body: {
            to: profile?.email,
            userName,
            deviceType: selectedDevice,
            deviceBrand: deviceBrand.trim() || undefined,
            deviceModel: deviceModel.trim() || undefined,
            problemDescription: problemDescription.trim(),
            paczkomatId: selectedPaczkomat || undefined,
          },
        });
        console.log('Confirmation email sent');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't fail the submission if email fails
      }

      toast({
        title: "Zgłoszenie wysłane!",
        description: "Twoje zgłoszenie zostało przyjęte. Otrzymasz wkrótce powiadomienie email.",
      });

      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się wysłać zgłoszenia. Spróbuj ponownie.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (step === 1 && !canProceedToStep2) {
      toast({
        title: "Wybierz typ urządzenia",
        description: "Musisz wybrać typ urządzenia przed kontynuowaniem",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !canProceedToStep3) {
      toast({
        title: "Opisz problem",
        description: "Opis problemu musi mieć co najmniej 10 znaków",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && !canProceedToStep4) {
      toast({
        title: "Wybierz paczkomat",
        description: "Musisz wybrać paczkomat przed kontynuowaniem",
        variant: "destructive",
      });
      return;
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Zgłoś naprawę
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Wypełnij formularz, aby zgłosić urządzenie do naprawy
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-display font-semibold text-sm transition-colors",
                s < step
                  ? "bg-primary text-primary-foreground"
                  : s === step
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(82_100%_46%_/_0.3)]"
                  : "bg-secondary text-muted-foreground"
              )}>
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < totalSteps && (
                <div className={cn(
                  "flex-1 h-1 mx-2",
                  s < step ? "bg-primary" : "bg-secondary"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-between text-xs sm:text-sm">
          <span className={cn("font-sans", step >= 1 ? "text-primary" : "text-muted-foreground")}>
            Urządzenie
          </span>
          <span className={cn("font-sans", step >= 2 ? "text-primary" : "text-muted-foreground")}>
            Problem
          </span>
          <span className={cn("font-sans", step >= 3 ? "text-primary" : "text-muted-foreground")}>
            Wysyłka
          </span>
          <span className={cn("font-sans", step >= 4 ? "text-primary" : "text-muted-foreground")}>
            Podsumowanie
          </span>
        </div>

        {/* Step Content */}
        <div className="rounded-xl bg-card border border-border p-6 sm:p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Wybierz typ urządzenia
                </h2>
                <p className="font-sans text-sm text-muted-foreground">
                  Jakiego rodzaju sprzęt chcesz naprawić?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {deviceTypes.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all text-left",
                      selectedDevice === device.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-secondary/30"
                    )}
                  >
                    <device.icon className={cn(
                      "w-8 h-8 mb-3",
                      selectedDevice === device.id ? "text-primary" : "text-muted-foreground"
                    )} />
                    <p className="font-display font-semibold text-foreground">
                      {device.label}
                    </p>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="font-sans">Marka</Label>
                  <Input 
                    id="brand" 
                    placeholder="np. Dell, HP, Lenovo" 
                    className="font-sans"
                    value={deviceBrand}
                    onChange={(e) => setDeviceBrand(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="font-sans">Model</Label>
                  <Input 
                    id="model" 
                    placeholder="np. XPS 15, ThinkPad X1" 
                    className="font-sans"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Opisz problem
                </h2>
                <p className="font-sans text-sm text-muted-foreground">
                  Im dokładniej opiszesz usterkę, tym szybciej postawimy diagnozę
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problem" className="font-sans">Opis problemu *</Label>
                <Textarea
                  id="problem"
                  placeholder="Opisz szczegółowo, co dzieje się ze sprzętem. Kiedy problem się pojawił? Czy występuje regularnie?"
                  className="font-sans min-h-[150px]"
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value.slice(0, 1000))}
                />
                <p className={cn(
                  "font-sans text-xs text-right",
                  problemDescription.length < 10 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {problemDescription.length} / 1000 znaków (min. 10)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-sans">Załączniki (opcjonalnie)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-sans text-sm text-muted-foreground">
                    Przeciągnij pliki lub kliknij, aby dodać
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">
                    Zdjęcia lub wideo problemu (max. 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Wybierz metodę wysyłki
                </h2>
                <p className="font-sans text-sm text-muted-foreground">
                  Gdzie chcesz nadać paczkę?
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-sans flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Wybierz paczkomat InPost *
                </Label>
                <Select onValueChange={setSelectedPaczkomat} value={selectedPaczkomat || undefined}>
                  <SelectTrigger className="font-sans">
                    <SelectValue placeholder="Wybierz paczkomat" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockPaczkomaty.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-sans">
                        <span className="font-mono text-xs text-muted-foreground mr-2">
                          {p.id}
                        </span>
                        {p.address}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPaczkomat && (
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Package className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-sans font-medium text-foreground">
                        Wybrany paczkomat: {selectedPaczkomat}
                      </p>
                      <p className="font-sans text-sm text-muted-foreground">
                        {mockPaczkomaty.find(p => p.id === selectedPaczkomat)?.address}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <h3 className="font-display font-semibold text-foreground mb-4">
                  Dane do wysyłki zwrotnej
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-sans">Imię i nazwisko</Label>
                    <Input 
                      id="name" 
                      defaultValue={profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : ''} 
                      className="font-sans" 
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="font-sans">Telefon</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      defaultValue={profile?.phone || ''} 
                      className="font-sans"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="email" className="font-sans">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      defaultValue={profile?.email || ''} 
                      className="font-sans"
                      readOnly
                    />
                  </div>
                </div>
                <p className="font-sans text-xs text-muted-foreground mt-2">
                  Dane pobrane z Twojego profilu. Możesz je zmienić w ustawieniach.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Podsumowanie zgłoszenia
                </h2>
                <p className="font-sans text-sm text-muted-foreground">
                  Sprawdź dane przed wysłaniem zgłoszenia
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Urządzenie
                  </p>
                  <p className="font-sans font-medium text-foreground">
                    {deviceTypes.find(d => d.id === selectedDevice)?.label}
                    {deviceBrand || deviceModel ? ` - ${[deviceBrand, deviceModel].filter(Boolean).join(' ')}` : ''}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Problem
                  </p>
                  <p className="font-sans text-foreground">
                    {problemDescription.length > 100 
                      ? `${problemDescription.slice(0, 100)}...` 
                      : problemDescription}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Paczkomat nadania
                  </p>
                  <p className="font-sans font-medium text-foreground">
                    {selectedPaczkomat} - {mockPaczkomaty.find(p => p.id === selectedPaczkomat)?.address}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <p className="font-sans font-medium text-foreground">
                    Darmowa wysyłka i diagnoza
                  </p>
                </div>
                <p className="font-sans text-sm text-muted-foreground">
                  Po nadaniu paczki otrzymasz powiadomienie email z numerem śledzenia.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="mt-1"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms" className="font-sans text-sm text-muted-foreground">
                  Akceptuję <a href="/regulamin" className="text-primary hover:underline">regulamin</a> i{" "}
                  <a href="/polityka-prywatnosci" className="text-primary hover:underline">politykę prywatności</a> serwisu ServiceLab.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || createRepair.isPending}
          >
            Wstecz
          </Button>
          <Button
            variant="hero"
            onClick={handleNext}
            disabled={createRepair.isPending || (step === 4 && !canSubmit)}
          >
            {createRepair.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Wysyłanie...
              </>
            ) : step === totalSteps ? (
              <>
                Wyślij zgłoszenie
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                Dalej
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RepairRequest;
