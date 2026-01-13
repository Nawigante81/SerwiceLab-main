import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { User, Mail, Phone, MapPin, Bell, Shield, Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    street: "",
    postal_code: "",
    city: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        street: profile.street || "",
        postal_code: profile.postal_code || "",
        city: profile.city || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(formData);
      toast.success("Zmiany zostały zapisane");
    } catch {
      toast.error("Wystąpił błąd podczas zapisywania zmian");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-3xl">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
            Ustawienia
          </h1>
          <p className="font-sans text-muted-foreground mt-1">
            Zarządzaj swoim kontem i preferencjami
          </p>
        </div>

        {/* Profile Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Dane osobowe
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="font-sans">Imię</Label>
                <Input
                  id="firstName"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="font-sans"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="font-sans">Nazwisko</Label>
                <Input
                  id="lastName"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="font-sans"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-sans flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="font-sans"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="font-sans flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                Telefon
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="font-sans"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Adres do wysyłki
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="street" className="font-sans">Ulica i numer</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
                className="font-sans"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode" className="font-sans">Kod pocztowy</Label>
                <Input
                  id="postalCode"
                  value={formData.postal_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                  className="font-sans"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="font-sans">Miasto</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  className="font-sans"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Powiadomienia
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-foreground">Powiadomienia email</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Otrzymuj aktualizacje o statusie napraw
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-foreground">Powiadomienia SMS</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Ważne powiadomienia na telefon
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-foreground">Newsletter</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Promocje i aktualności
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Bezpieczeństwo
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-foreground">Zmień hasło</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Ostatnia zmiana: 30 dni temu
                </p>
              </div>
              <Button variant="outline" size="sm">
                Zmień
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-foreground">Weryfikacja dwuetapowa</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Dodatkowa warstwa ochrony konta
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex items-center gap-3">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">
              Wygląd
            </h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans font-medium text-foreground">Tryb ciemny</p>
                <p className="font-sans text-sm text-muted-foreground">
                  Włącz ciemny motyw interfejsu
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Anuluj</Button>
          <Button 
            variant="hero" 
            onClick={handleSave}
            disabled={updateProfile.isPending}
          >
            {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Zapisz zmiany
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
