
import React from "react";
import { Theme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemePresetProps {
  theme: Theme;
  onClick: () => void;
  isActive: boolean;
}

const ThemePreset: React.FC<ThemePresetProps> = ({ theme, onClick, isActive }) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "h-12 w-full rounded-md overflow-hidden flex flex-col",
        isActive && "ring-2 ring-ring ring-offset-2 ring-offset-background"
      )}
    >
      <div 
        className="flex-1 flex"
        title={theme.name}
      >
        <div style={{ backgroundColor: theme.colors.primary }} className="flex-1" />
        <div style={{ backgroundColor: theme.colors.secondary }} className="flex-1" />
        <div style={{ backgroundColor: theme.colors.accent }} className="flex-1" />
      </div>
    </button>
  );
};

export default ThemePreset;
