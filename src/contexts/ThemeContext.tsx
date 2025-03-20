
import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type Theme = {
  name: string;
  colors: ThemeColors;
};

// Predefined themes
export const themes: Theme[] = [
  {
    name: "hyperTermBlack",
    colors: {
      primary: "#9B00FF",
      secondary: "#00AEEF",
      accent: "#FF007F",
      background: "#0A0A0A",
      text: "#F5F5F5"
    }
  },
  {
    name: "cyberpunk",
    colors: {
      primary: "#F9CB40",
      secondary: "#00FF9F",
      accent: "#FF003C",
      background: "#140032",
      text: "#FFFFFF"
    }
  },
  {
    name: "neonNights",
    colors: {
      primary: "#00FFFF",
      secondary: "#FF00FF",
      accent: "#FFFF00",
      background: "#000000",
      text: "#FFFFFF"
    }
  },
  {
    name: "mintChocolate",
    colors: {
      primary: "#75DDDD",
      secondary: "#508991",
      accent: "#23395B",
      background: "#050A0E",
      text: "#E8E9EB"
    }
  },
  {
    name: "retroWave",
    colors: {
      primary: "#FF00FF",
      secondary: "#00FFFF",
      accent: "#FFFF00",
      background: "#121212",
      text: "#F5F5F5"
    }
  }
];

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  customizeTheme: (colors: Partial<ThemeColors>) => void;
  randomizeTheme: () => void;
  randomizeColors: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to generate random colors
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

// Generate a completely random theme
const generateRandomTheme = (): Theme => {
  return {
    name: "random",
    colors: {
      primary: generateRandomColor(),
      secondary: generateRandomColor(),
      accent: generateRandomColor(),
      background: "#0A0A0A", // Keep background dark for better readability
      text: "#F5F5F5" // Keep text light for better readability
    }
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  // Apply theme to CSS variables
  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme]);

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement;
    
    // Convert hex to hsl for primary
    const primaryHSL = hexToHSL(theme.colors.primary);
    root.style.setProperty("--primary", primaryHSL);
    root.style.setProperty("--primary-foreground", "0 0% 100%");
    
    // Convert hex to hsl for secondary
    const secondaryHSL = hexToHSL(theme.colors.secondary);
    root.style.setProperty("--secondary", secondaryHSL);
    root.style.setProperty("--secondary-foreground", "0 0% 100%");
    
    // Convert hex to hsl for accent
    const accentHSL = hexToHSL(theme.colors.accent);
    root.style.setProperty("--accent", accentHSL);
    root.style.setProperty("--accent-foreground", "0 0% 100%");
    
    // Convert hex to hsl for background
    const backgroundHSL = hexToHSL(theme.colors.background);
    root.style.setProperty("--background", backgroundHSL);
    
    // Convert hex to hsl for text/foreground
    const foregroundHSL = hexToHSL(theme.colors.text);
    root.style.setProperty("--foreground", foregroundHSL);
    
    // Also set card and popover to use a slightly lighter version of background
    const cardBgHSL = adjustHSLLightness(backgroundHSL, 4);
    root.style.setProperty("--card", cardBgHSL);
    root.style.setProperty("--card-foreground", foregroundHSL);
    root.style.setProperty("--popover", cardBgHSL);
    root.style.setProperty("--popover-foreground", foregroundHSL);
    
    // Set muted color
    const mutedBgHSL = adjustHSLLightness(backgroundHSL, 10);
    root.style.setProperty("--muted", mutedBgHSL);
    root.style.setProperty("--muted-foreground", "0 0% 75%");
    
    // Set border color
    const borderHSL = adjustHSLLightness(backgroundHSL, 15);
    root.style.setProperty("--border", borderHSL);
    root.style.setProperty("--input", borderHSL);
    
    // Set ring color same as primary
    root.style.setProperty("--ring", primaryHSL);
  };
  
  // Helper function to convert hex to HSL format
  const hexToHSL = (hex: string): string => {
    // Remove the # if it exists
    hex = hex.replace("#", "");
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find greatest and smallest channel values
    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;
    
    let h = 0;
    let s = 0;
    let l = 0;
    
    // Calculate hue
    if (delta === 0) {
      h = 0;
    } else if (cmax === r) {
      h = ((g - b) / delta) % 6;
    } else if (cmax === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    
    // Calculate lightness
    l = (cmax + cmin) / 2;
    
    // Calculate saturation
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    // Convert to percentages
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    
    return `${h} ${s}% ${l}%`;
  };
  
  // Helper to adjust lightness of HSL value
  const adjustHSLLightness = (hsl: string, amount: number): string => {
    const [h, s, l] = hsl.split(' ');
    const lightness = parseInt(l, 10);
    const newLightness = Math.min(100, Math.max(0, lightness + amount));
    return `${h} ${s} ${newLightness}%`;
  };

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const customizeTheme = (colors: Partial<ThemeColors>) => {
    setCurrentTheme(prev => ({
      name: "custom",
      colors: { ...prev.colors, ...colors }
    }));
  };

  const randomizeTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  };

  const randomizeColors = () => {
    setCurrentTheme(generateRandomTheme());
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      customizeTheme, 
      randomizeTheme,
      randomizeColors
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
