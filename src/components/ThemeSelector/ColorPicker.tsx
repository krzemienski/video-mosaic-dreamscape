
import React from "react";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 p-0 border-0 cursor-pointer appearance-none bg-transparent"
            style={{ colorScheme: "dark" }}
          />
          <div 
            className="absolute inset-0 h-10 w-10 rounded border border-border pointer-events-none"
            style={{ backgroundColor: value }}
          />
        </div>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
