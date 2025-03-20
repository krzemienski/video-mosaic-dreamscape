
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ThemeGradient, gradientDirections } from "@/contexts/ThemeContext";

interface GradientPickerProps {
  value: ThemeGradient;
  onChange: (value: Partial<ThemeGradient>) => void;
}

const GradientPicker: React.FC<GradientPickerProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-4">
      <label className="text-sm font-medium">Gradient</label>
      
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">From</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="color"
              value={value.from}
              onChange={(e) => onChange({ from: e.target.value })}
              className="h-8 w-8 p-0 border-0 cursor-pointer appearance-none bg-transparent"
              style={{ colorScheme: "dark" }}
            />
            <div 
              className="absolute inset-0 h-8 w-8 rounded border border-border pointer-events-none"
              style={{ backgroundColor: value.from }}
            />
          </div>
          <Input
            type="text"
            value={value.from}
            onChange={(e) => onChange({ from: e.target.value })}
            className="flex-1 h-8"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">To</label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Input
              type="color"
              value={value.to}
              onChange={(e) => onChange({ to: e.target.value })}
              className="h-8 w-8 p-0 border-0 cursor-pointer appearance-none bg-transparent"
              style={{ colorScheme: "dark" }}
            />
            <div 
              className="absolute inset-0 h-8 w-8 rounded border border-border pointer-events-none"
              style={{ backgroundColor: value.to }}
            />
          </div>
          <Input
            type="text"
            value={value.to}
            onChange={(e) => onChange({ to: e.target.value })}
            className="flex-1 h-8"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Direction</label>
        <Select 
          value={value.direction} 
          onValueChange={(direction) => onChange({ direction })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            {gradientDirections.map((direction) => (
              <SelectItem key={direction} value={direction}>
                {direction.replace(/-/g, ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div 
        className="h-6 w-full rounded-md" 
        style={{ 
          background: `linear-gradient(${value.direction}, ${value.from}, ${value.to})` 
        }}
      />
    </div>
  );
};

export default GradientPicker;
