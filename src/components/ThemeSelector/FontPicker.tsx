
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FontPickerProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FontPicker: React.FC<FontPickerProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a font" />
        </SelectTrigger>
        <SelectContent>
          {options.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FontPicker;
