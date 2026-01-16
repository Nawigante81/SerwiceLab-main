import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ShippingMethodSelector from "@/components/shipping/ShippingMethodSelector";
import InpostPointPickerModal from "@/components/shipping/InpostPointPickerModal";
import AddressForm, { CourierAddress } from "@/components/shipping/AddressForm";
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
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useCreateRepair, useUpdateRepair } from "@/hooks/useRepairs";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useInpostMethods, useInpostPoints } from "@/hooks/useInpost";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { InpostMethod, InpostPoint } from "@/lib/inpost-types";

type DeviceType = Database["public"]["Enums"]["device_type"];

const deviceTypes: { id: DeviceType; label: string; icon: typeof Laptop }[] = [
  { id: 'laptop', label: 'Laptop', icon: Laptop },
  { id: 'pc', label: 'Komputer PC', icon: Monitor },
  { id: 'other', label: 'Inne', icon: HardDrive },
];

const RepairRequest = () => {
  const [step, setStep] = useState(1);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<InpostPoint | null>(null);
  const [selectedMethodCode, setSelectedMethodCode] = useState<string | null>(null);
  const [pointModalOpen, setPointModalOpen] = useState(false);
  const [pointQuery, setPointQuery] = useState("");
  const [pointFilter, setPointFilter] = useState<"locker" | "partner" | "all">("all");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [courierAddress, setCourierAddress] = useState<CourierAddress>({
    line1: "",
    line2: "",
    postal_code: "",
    city: "",
    country: "PL",
  });
  const [deviceBrand, setDeviceBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: inpostMethods = [], isLoading: methodsLoading } = useInpostMethods();
  const { data: points = [], isLoading: pointsLoading } = useInpostPoints({
    query: pointQuery,
    lat: userLocation?.lat ?? null,
    lng: userLocation?.lng ?? null,
    type: pointFilter === "all" ? undefined : pointFilter,
  });
  const createRepair = useCreateRepair();
  const updateRepair = useUpdateRepair();
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalSteps = 4;
  const maxAttachments = 5;
  const maxFileSizeMb = 10;
  const maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

  const selectedMethod = inpostMethods.find((method) => method.code === selectedMethodCode) ?? null;

  useEffect(() => {
    if (!selectedMethodCode && inpostMethods.length > 0) {
      const featured = inpostMethods.find((method) => method.featured) ?? inpostMethods[0];
      setSelectedMethodCode(featured.code);
    }
  }, [selectedMethodCode, inpostMethods]);

  useEffect(() => {
    if (profile) {
      setCourierAddress((prev) => ({
        ...prev,
        line1: profile.street || prev.line1,
        postal_code: profile.postal_code || prev.postal_code,
        city: profile.city || prev.city,
      }));
    }
  }, [profile]);

  useEffect(() => {
    const stored = localStorage.getItem("inpost-last-point");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as InpostPoint;
        if (parsed?.point_id) {
          setSelectedPoint(parsed);
        }
      } catch {
        localStorage.removeItem("inpost-last-point");
      }
    }
  }, []);

  useEffect(() => {
    if (pointModalOpen && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => {
          setUserLocation(null);
        },
        { timeout: 8000 }
      );
    }
  }, [pointModalOpen, userLocation]);

  const canProceedToStep2 = selectedDevice !== null;
  const canProceedToStep3 = problemDescription.trim().length >= 10;
  const courierAddressValid =
    courierAddress.line1.trim().length > 3 &&
    courierAddress.postal_code.trim().length > 3 &&
    courierAddress.city.trim().length > 1;
  const canProceedToStep4 =
    Boolean(selectedMethod) &&
    (selectedMethod?.type === "locker" ? Boolean(selectedPoint) : courierAddressValid);
  const canSubmit = termsAccepted && selectedDevice && problemDescription.trim();
  const isBusy = createRepair.isPending || isUploading;

  const handleSelectMethod = (method: InpostMethod) => {
    if (!method) return;
    setSelectedMethodCode(method.code);
    if (method.type === "locker") {
      setPointModalOpen(true);
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    const kb = size / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const isSupportedFile = (file: File) =>
    file.type.startsWith("image/") || file.type.startsWith("video/");

  const addAttachments = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const validFiles = incoming.filter((file) => isSupportedFile(file) && file.size <= maxFileSizeBytes);
    const rejected = incoming.filter((file) => !isSupportedFile(file) || file.size > maxFileSizeBytes);

    if (rejected.length > 0) {
      toast({
        title: "Nieprawidłowe pliki",
        description: `Dozwolone są obrazy i wideo do ${maxFileSizeMb} MB.`,
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    setAttachments((prev) => {
      const combined = [...prev, ...validFiles];
      if (combined.length > maxAttachments) {
        toast({
          title: "Za dużo plików",
          description: `Możesz dodać maksymalnie ${maxAttachments} plików.`,
          variant: "destructive",
        });
      }
      return combined.slice(0, maxAttachments);
    });
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAttachments = async (repairId: string) => {
    if (!user || attachments.length === 0) return { uploaded: [], failed: [] as string[] };

    setIsUploading(true);
    const uploaded: string[] = [];
    const failed: string[] = [];

    try {
      for (const file of attachments) {
        const ext = file.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "") ?? "";
        const randomId = typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const fileName = ext ? `${randomId}.${ext}` : randomId;
        const filePath = `${user.id}/${repairId}/${fileName}`;

        const { error } = await supabase.storage
          .from("repair-attachments")
          .upload(filePath, file, { cacheControl: "3600", upsert: false, contentType: file.type });

        if (error) {
          failed.push(file.name);
          continue;
        }

        uploaded.push(filePath);
      }
    } finally {
      setIsUploading(false);
    }

    return { uploaded, failed };
  };

  const handleSubmit = async () => {
    if (!selectedDevice || !problemDescription.trim()) {
      toast({
        title: "Nie udało się wysłać zgłoszenia",
        description: "Uzupełnij wymagane pola: typ urządzenia i opis problemu.",
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: "Wymagana akceptacja regulaminu",
        description: "Zaznacz zgodę, aby kontynuować.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedMethod) {
      toast({
        title: "Wybierz metodę dostawy",
        description: "Wybierz sposób dostawy przed wysłaniem zgłoszenia.",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod.type === "locker" && !selectedPoint) {
      toast({
        title: "Wybierz punkt odbioru",
        description: "Wybierz Paczkomat® lub PaczkoPunkt, aby kontynuować.",
        variant: "destructive",
      });
      return;
    }

    if (selectedMethod.type === "courier" && !courierAddressValid) {
      toast({
        title: "Uzupełnij adres dostawy",
        description: "Podaj poprawny adres dla kuriera InPost.",
        variant: "destructive",
      });
      return;
    }

    const receiverName = profile
      ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
      : "";
    const receiverEmail = profile?.email?.trim() || "";
    const receiverPhone = profile?.phone?.trim() || "";

    if (!receiverEmail || !receiverPhone) {
      toast({
        title: "Uzupełnij dane kontaktowe",
        description: "Email i telefon są wymagane do utworzenia przesyłki InPost.",
        variant: "destructive",
      });
      return;
    }

    try {
      const createdRepair = await createRepair.mutateAsync({
        device_type: selectedDevice,
        device_brand: deviceBrand.trim() || null,
        device_model: deviceModel.trim() || null,
        problem_description: problemDescription.trim(),
        shipping_method: 'inpost',
        paczkomat_id: selectedPoint?.point_id ?? null,
        status: 'pending',
      });

      try {
        await supabase.functions.invoke("inpost-shipments", {
          body: {
            order_id: createdRepair.id,
            service_code: selectedMethod.code,
            type: selectedMethod.type,
            pickup_point_id: selectedPoint?.point_id ?? null,
            receiver: {
              name: receiverName || receiverEmail.split("@")[0],
              email: receiverEmail,
              phone: receiverPhone,
            },
            address: selectedMethod.type === "courier" ? courierAddress : null,
          },
        });
      } catch (shipmentError) {
        console.error("Failed to create InPost shipment:", shipmentError);
        toast({
          title: "Nie udało się utworzyć przesyłki",
          description: "Zgłoszenie zapisane, ale przesyłka nie została utworzona.",
          variant: "destructive",
        });
      }

      if (attachments.length > 0) {
        const { uploaded, failed } = await uploadAttachments(createdRepair.id);

        if (uploaded.length > 0) {
          try {
            await updateRepair.mutateAsync({
              id: createdRepair.id,
              attachments: uploaded,
            });
          } catch {
            toast({
              title: "Nie udało się zapisać załączników",
              description: "Twoje zgłoszenie zostało przyjęte, ale pliki nie zostały zapisane.",
              variant: "destructive",
            });
          }
        }

        if (failed.length > 0) {
          toast({
            title: "Nie wszystkie pliki zostały dodane",
            description: `Nie udało się dodać: ${failed.join(", ")}`,
            variant: "destructive",
          });
        }
      }

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
            paczkomatId: selectedPoint?.point_id || undefined,
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
        title: "Nie udało się wysłać zgłoszenia",
        description: "Spróbuj ponownie za chwilę.",
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (step === 1 && !canProceedToStep2) {
      toast({
        title: "Brakuje informacji o urządzeniu",
        description: "Wybierz typ urządzenia, aby przejść dalej.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !canProceedToStep3) {
      toast({
        title: "Brakuje opisu problemu",
        description: "Wpisz co najmniej 10 znaków, aby przejść dalej.",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && !canProceedToStep4) {
      toast({
        title: "Niekompletne dane dostawy",
        description: selectedMethod?.type === "courier"
          ? "Uzupełnij adres dostawy, aby przejść dalej."
          : "Wybierz punkt odbioru, aby przejść dalej.",
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
      <div className="max-w-3xl mx-auto space-y-8 px-4 sm:px-0">
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
        <nav aria-label="Postęp formularza">
          <div className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:justify-between" role="list">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className="flex items-center sm:flex-1"
                role="listitem"
                aria-current={s === step ? "step" : undefined}
                aria-label={`Krok ${s} z ${totalSteps}`}
              >
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
                  "hidden sm:block flex-1 h-1 mx-2",
                  s < step ? "bg-primary" : "bg-secondary"
                )} />
              )}
              </div>
            ))}
          </div>
        </nav>

        {/* Step Labels */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs sm:text-sm">
          <span className={cn("font-sans text-center", step >= 1 ? "text-primary" : "text-muted-foreground")}>
            Urządzenie
          </span>
          <span className={cn("font-sans text-center", step >= 2 ? "text-primary" : "text-muted-foreground")}>
            Problem
          </span>
          <span className={cn("font-sans text-center", step >= 3 ? "text-primary" : "text-muted-foreground")}>
            Wysyłka
          </span>
          <span className={cn("font-sans text-center", step >= 4 ? "text-primary" : "text-muted-foreground")}>
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
                    type="button"
                    onClick={() => setSelectedDevice(device.id)}
                    aria-pressed={selectedDevice === device.id}
                    aria-label={`Wybierz urz¥dzenie: ${device.label}`}
                    className={cn(
                      "p-6 rounded-xl border-2 transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
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
                  aria-required="true"
                  aria-describedby="problem-help"
                />
                <p className={cn(
                  "font-sans text-xs text-right",
                  problemDescription.length < 10 ? "text-destructive" : "text-muted-foreground"
                )} id="problem-help" aria-live="polite">
                  {problemDescription.length} / 1000 znaków (min. 10)
                </p>
              </div>

              <div className="space-y-2">
                <Label className="font-sans">Załączniki (opcjonalnie)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addAttachments(e.target.files);
                    e.currentTarget.value = "";
                  }}
                />
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault();
                    setIsDragging(false);
                    addAttachments(event.dataTransfer.files);
                  }}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  )}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="font-sans text-sm text-muted-foreground">
                    Przeciągnij pliki lub kliknij, aby dodać
                  </p>
                  <p className="font-sans text-xs text-muted-foreground mt-1">
                    Zdjęcia lub wideo problemu (max. {maxFileSizeMb}MB, do {maxAttachments} plików)
                  </p>
                </div>
                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="font-sans text-sm text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="font-sans text-xs text-destructive hover:underline"
                          onClick={() => removeAttachment(index)}
                        >
                          Usuń
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-xl font-semibold text-foreground mb-2">
                  Wybierz metodę dostawy
                </h2>
                <p className="font-sans text-sm text-muted-foreground">
                  Wybierz sposób dostawy oraz punkt odbioru lub adres.
                </p>
              </div>

              {methodsLoading ? (
                <p className="text-sm text-muted-foreground">Wczytywanie metod dostawy…</p>
              ) : (
                <ShippingMethodSelector
                  methods={inpostMethods}
                  selected={selectedMethod}
                  onSelect={handleSelectMethod}
                />
              )}

              {selectedMethod?.type === "locker" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="font-sans flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Punkt odbioru InPost *
                    </Label>
                    <Button variant="outline" size="sm" onClick={() => setPointModalOpen(true)}>
                      {selectedPoint ? "Zmień punkt" : "Wybierz punkt"}
                    </Button>
                  </div>

                  {selectedPoint ? (
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-start gap-3">
                        <Package className="w-5 h-5 text-primary mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-sans font-medium text-foreground">
                            {selectedPoint.name}
                          </p>
                          <p className="font-sans text-sm text-muted-foreground">
                            {selectedPoint.address}
                          </p>
                          {selectedPoint.hours && (
                            <p className="font-sans text-xs text-muted-foreground">
                              Godziny: {selectedPoint.hours}
                            </p>
                          )}
                          {selectedPoint.description && (
                            <p className="font-sans text-xs text-muted-foreground">
                              {selectedPoint.description}
                            </p>
                          )}
                        </div>
                        <div className="ml-auto w-16 h-16 rounded-lg bg-secondary/60 border border-border flex items-center justify-center overflow-hidden">
                          {selectedPoint.image_url ? (
                            <img
                              src={selectedPoint.image_url}
                              alt={selectedPoint.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-muted-foreground text-center px-1">
                              Zdjęcie
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Wybierz Paczkomat® lub PaczkoPunkt, aby kontynuować.
                    </p>
                  )}
                </div>
              )}

              {selectedMethod?.type === "courier" && (
                <div className="space-y-3">
                  <Label className="font-sans">Adres dostawy kurierem</Label>
                  <AddressForm value={courierAddress} onChange={setCourierAddress} />
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
                    Metoda dostawy
                  </p>
                  <p className="font-sans font-medium text-foreground">
                    {selectedMethod?.name || "Nie wybrano"}
                  </p>
                </div>
                {selectedMethod?.type === "locker" && selectedPoint && (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Punkt odbioru
                    </p>
                    <p className="font-sans font-medium text-foreground">
                      {selectedPoint.name}
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">
                      {selectedPoint.address}
                    </p>
                  </div>
                )}
                {selectedMethod?.type === "courier" && (
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="font-sans text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Adres dostawy
                    </p>
                    <p className="font-sans font-medium text-foreground">
                      {courierAddress.line1}
                    </p>
                    <p className="font-sans text-sm text-muted-foreground">
                      {courierAddress.postal_code} {courierAddress.city}
                    </p>
                  </div>
                )}
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
                  aria-required="true"
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
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || isBusy}
            className="sm:w-auto"
          >
            Wstecz
          </Button>
          <Button
            variant="hero"
            onClick={handleNext}
            disabled={isBusy || (step === 4 && !canSubmit)}
            className="sm:w-auto"
          >
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isUploading ? "Dodawanie plików..." : "Wysyłanie..."}
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

        <InpostPointPickerModal
          open={pointModalOpen}
          onOpenChange={setPointModalOpen}
          points={points}
          isLoading={pointsLoading}
          selectedPoint={selectedPoint}
          onSelectPoint={(point) => {
            setSelectedPoint(point);
            localStorage.setItem("inpost-last-point", JSON.stringify(point));
            if (profile) {
              updateProfile.mutate({ paczkomat_id: point.point_id });
            }
            setPointModalOpen(false);
          }}
          onSearch={(query) => setPointQuery(query)}
          onFilterType={setPointFilter}
          activeType={pointFilter}
          userLocation={userLocation}
        />
      </div>
    </DashboardLayout>
  );
};

export default RepairRequest;
