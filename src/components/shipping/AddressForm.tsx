import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface CourierAddress {
  line1: string;
  line2?: string;
  postal_code: string;
  city: string;
  country?: string;
}

interface AddressFormProps {
  value: CourierAddress;
  onChange: (value: CourierAddress) => void;
}

const AddressForm = ({ value, onChange }: AddressFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="addressLine1">Ulica i numer</Label>
        <Input
          id="addressLine1"
          value={value.line1}
          onChange={(event) => onChange({ ...value, line1: event.target.value })}
          placeholder="ul. Marszałkowska 10"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="addressLine2">Mieszkanie / lokal (opcjonalnie)</Label>
        <Input
          id="addressLine2"
          value={value.line2 ?? ""}
          onChange={(event) => onChange({ ...value, line2: event.target.value })}
          placeholder="np. lokal 3"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="postalCode">Kod pocztowy</Label>
          <Input
            id="postalCode"
            value={value.postal_code}
            onChange={(event) => onChange({ ...value, postal_code: event.target.value })}
            placeholder="00-001"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Miasto</Label>
          <Input
            id="city"
            value={value.city}
            onChange={(event) => onChange({ ...value, city: event.target.value })}
            placeholder="Warszawa"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
