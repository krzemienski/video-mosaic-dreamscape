
import React from "react";
import { Theme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ThemePreviewProps {
  theme: Theme;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ theme }) => {
  const { colors, fonts, gradient, borderRadius } = theme;
  
  // Create a mini preview of UI components with the theme applied
  const previewStyle = {
    "--preview-primary": colors.primary,
    "--preview-secondary": colors.secondary,
    "--preview-accent": colors.accent,
    "--preview-background": colors.background,
    "--preview-text": colors.text,
    "--preview-border-radius": borderRadius || "0.5rem",
    "--preview-font-heading": fonts?.heading || "Inter",
    "--preview-font-body": fonts?.body || "Inter",
    "--preview-gradient": gradient ? 
      `linear-gradient(${gradient.direction}, ${gradient.from}, ${gradient.to})` : 
      `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`,
  } as React.CSSProperties;
  
  return (
    <div style={previewStyle} className="w-full space-y-4 p-4 rounded-lg" 
         style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="flex justify-between items-center">
        <h3 style={{ fontFamily: "var(--preview-font-heading)" }} className="text-sm font-bold">
          Preview
        </h3>
        <Badge style={{ 
          backgroundColor: colors.accent, 
          color: "#fff",
          borderRadius: "var(--preview-border-radius)"
        }}>
          New
        </Badge>
      </div>
      
      <div className="flex gap-2">
        <div 
          style={{ 
            backgroundColor: colors.primary, 
            color: "#fff",
            borderRadius: "var(--preview-border-radius)",
            fontFamily: "var(--preview-font-body)"
          }} 
          className="px-2 py-1 text-xs inline-flex items-center"
        >
          Primary
        </div>
        <div 
          style={{ 
            backgroundColor: colors.secondary, 
            color: "#fff",
            borderRadius: "var(--preview-border-radius)",
            fontFamily: "var(--preview-font-body)"
          }} 
          className="px-2 py-1 text-xs inline-flex items-center"
        >
          Secondary
        </div>
      </div>
      
      <div 
        style={{ 
          background: "var(--preview-gradient)",
          borderRadius: "var(--preview-border-radius)",
        }} 
        className="h-3 w-full"
      />
      
      <div style={{ 
        backgroundColor: colors.background, 
        borderColor: `${colors.text}20`,
        borderWidth: "1px",
        borderRadius: "var(--preview-border-radius)",
        fontFamily: "var(--preview-font-body)",
        padding: "4px"
      }}>
        <span className="text-xs">Sample text</span>
      </div>
    </div>
  );
};

export default ThemePreview;
