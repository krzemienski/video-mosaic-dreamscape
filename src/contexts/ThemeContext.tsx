
import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeColors = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
};

export type ThemeFonts = {
  heading: string;
  body: string;
  mono: string;
};

export type ThemeGradient = {
  from: string;
  to: string;
  direction: string;
};

export type ThemeIcons = "rounded" | "sharp" | "outlined" | "minimal" | "duotone";

export type Theme = {
  name: string;
  colors: ThemeColors;
  fonts?: ThemeFonts;
  gradient?: ThemeGradient;
  iconStyle?: ThemeIcons;
  borderRadius?: string;
};

// Available font options
export const fontOptions = {
  headings: ["Inter", "Poppins", "Playfair Display", "Roboto", "Montserrat", "Oswald", "Raleway"],
  body: ["Inter", "Roboto", "Open Sans", "Lato", "Source Sans Pro", "Nunito"],
  mono: ["SF Mono", "Fira Code", "JetBrains Mono", "Roboto Mono", "Source Code Pro"]
};

// Gradient direction options
export const gradientDirections = ["to right", "to left", "to top", "to bottom", "to right top", "to right bottom", "to left top", "to left bottom"];

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
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
      mono: "SF Mono"
    },
    gradient: {
      from: "#9B00FF",
      to: "#FF007F",
      direction: "to right"
    },
    iconStyle: "rounded",
    borderRadius: "0.5rem"
  },
  {
    name: "cyberpunk",
    colors: {
      primary: "#F9CB40",
      secondary: "#00FF9F",
      accent: "#FF003C",
      background: "#140032",
      text: "#FFFFFF"
    },
    fonts: {
      heading: "Oswald",
      body: "Roboto",
      mono: "JetBrains Mono"
    },
    gradient: {
      from: "#F9CB40",
      to: "#FF003C",
      direction: "to right bottom"
    },
    iconStyle: "sharp",
    borderRadius: "0.25rem"
  },
  {
    name: "neonNights",
    colors: {
      primary: "#00FFFF",
      secondary: "#FF00FF",
      accent: "#FFFF00",
      background: "#000000",
      text: "#FFFFFF"
    },
    fonts: {
      heading: "Montserrat",
      body: "Nunito",
      mono: "Fira Code"
    },
    gradient: {
      from: "#00FFFF",
      to: "#FF00FF",
      direction: "to right"
    },
    iconStyle: "duotone",
    borderRadius: "0.5rem"
  },
  {
    name: "mintChocolate",
    colors: {
      primary: "#75DDDD",
      secondary: "#508991",
      accent: "#23395B",
      background: "#050A0E",
      text: "#E8E9EB"
    },
    fonts: {
      heading: "Raleway",
      body: "Source Sans Pro",
      mono: "Source Code Pro"
    },
    gradient: {
      from: "#508991",
      to: "#23395B",
      direction: "to bottom"
    },
    iconStyle: "minimal",
    borderRadius: "0.375rem"
  },
  {
    name: "retroWave",
    colors: {
      primary: "#FF00FF",
      secondary: "#00FFFF",
      accent: "#FFFF00",
      background: "#121212",
      text: "#F5F5F5"
    },
    fonts: {
      heading: "Poppins",
      body: "Roboto",
      mono: "Roboto Mono"
    },
    gradient: {
      from: "#FF00FF",
      to: "#00FFFF",
      direction: "to right top"
    },
    iconStyle: "outlined",
    borderRadius: "0.75rem"
  },
  {
    name: "forestMist",
    colors: {
      primary: "#4CAF50",
      secondary: "#7CB342",
      accent: "#2E7D32",
      background: "#0A1E14",
      text: "#E0E0E0"
    },
    fonts: {
      heading: "Montserrat",
      body: "Open Sans",
      mono: "Fira Code"
    },
    gradient: {
      from: "#2E7D32",
      to: "#7CB342",
      direction: "to top"
    },
    iconStyle: "duotone",
    borderRadius: "0.625rem"
  },
  {
    name: "oceanBreeze",
    colors: {
      primary: "#0288D1",
      secondary: "#29B6F6",
      accent: "#01579B",
      background: "#021B29",
      text: "#ECEFF1"
    },
    fonts: {
      heading: "Raleway",
      body: "Lato",
      mono: "JetBrains Mono"
    },
    gradient: {
      from: "#01579B",
      to: "#29B6F6",
      direction: "to right"
    },
    iconStyle: "rounded",
    borderRadius: "1rem"
  },
  {
    name: "sunsetGlow",
    colors: {
      primary: "#FF6F00",
      secondary: "#FF9800",
      accent: "#E65100",
      background: "#1A0F00",
      text: "#FAFAFA"
    },
    fonts: {
      heading: "Playfair Display",
      body: "Source Sans Pro",
      mono: "Source Code Pro"
    },
    gradient: {
      from: "#E65100",
      to: "#FF9800",
      direction: "to top"
    },
    iconStyle: "minimal",
    borderRadius: "0.5rem"
  },
  {
    name: "modernMono",
    colors: {
      primary: "#9E9E9E",
      secondary: "#616161",
      accent: "#424242",
      background: "#121212",
      text: "#FAFAFA"
    },
    fonts: {
      heading: "Montserrat",
      body: "Roboto",
      mono: "SF Mono"
    },
    gradient: {
      from: "#424242",
      to: "#9E9E9E",
      direction: "to right bottom"
    },
    iconStyle: "sharp",
    borderRadius: "0"
  },
  {
    name: "cottonCandy",
    colors: {
      primary: "#EC407A",
      secondary: "#AB47BC",
      accent: "#7E57C2",
      background: "#12052E",
      text: "#F5F5F5"
    },
    fonts: {
      heading: "Poppins",
      body: "Nunito",
      mono: "Fira Code"
    },
    gradient: {
      from: "#EC407A",
      to: "#7E57C2",
      direction: "to left top"
    },
    iconStyle: "duotone",
    borderRadius: "1.5rem"
  }
];

type ThemeContextType = {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  customizeTheme: (updates: Partial<Theme>) => void;
  customizeColors: (colors: Partial<ThemeColors>) => void;
  customizeFonts: (fonts: Partial<ThemeFonts>) => void;
  customizeGradient: (gradient: Partial<ThemeGradient>) => void;
  setIconStyle: (style: ThemeIcons) => void;
  setBorderRadius: (radius: string) => void;
  randomizeTheme: () => void;
  randomizeColors: () => void;
  randomizeFonts: () => void;
  randomizeGradient: () => void;
  exportTheme: () => string;
  importTheme: (themeJson: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper to generate random colors
const generateRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

// Random selection from an array
const randomFrom = <T,>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate random fonts
const generateRandomFonts = (): ThemeFonts => {
  return {
    heading: randomFrom(fontOptions.headings),
    body: randomFrom(fontOptions.body),
    mono: randomFrom(fontOptions.mono)
  };
};

// Generate random gradient
const generateRandomGradient = (): ThemeGradient => {
  return {
    from: generateRandomColor(),
    to: generateRandomColor(),
    direction: randomFrom(gradientDirections)
  };
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
    },
    fonts: generateRandomFonts(),
    gradient: generateRandomGradient(),
    iconStyle: randomFrom(["rounded", "sharp", "outlined", "minimal", "duotone"]),
    borderRadius: randomFrom(["0", "0.25rem", "0.5rem", "0.75rem", "1rem", "1.5rem"])
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  // Apply theme to CSS variables
  useEffect(() => {
    applyThemeToDocument(currentTheme);
    // Also load required Google Fonts if they're not already loaded
    loadRequiredFonts(currentTheme.fonts);
  }, [currentTheme]);

  // Load Google Fonts
  const loadRequiredFonts = (fonts?: ThemeFonts) => {
    if (!fonts) return;
    
    const fontFamilies = [
      fonts.heading !== 'Inter' ? fonts.heading : null,
      fonts.body !== 'Inter' && fonts.body !== fonts.heading ? fonts.body : null,
      fonts.mono !== 'SF Mono' ? fonts.mono : null
    ].filter(Boolean) as string[];
    
    if (fontFamilies.length === 0) return;
    
    // Create a link element for Google Fonts
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    
    // Format the font families for the Google Fonts URL
    const formattedFamilies = fontFamilies.map(font => {
      // Replace spaces with '+' and add weights
      return `${font.replace(/\s+/g, '+')}:400,500,700`;
    }).join('|');
    
    link.href = `https://fonts.googleapis.com/css2?${formattedFamilies}&display=swap`;
    
    // Check if we already have this link
    const existingLink = document.querySelector(`link[href="${link.href}"]`);
    if (!existingLink) {
      document.head.appendChild(link);
    }
  };

  const applyThemeToDocument = (theme: Theme) => {
    const root = document.documentElement;
    
    // Apply colors (convert hex to hsl)
    const primaryHSL = hexToHSL(theme.colors.primary);
    root.style.setProperty("--primary", primaryHSL);
    root.style.setProperty("--primary-foreground", "0 0% 100%");
    
    const secondaryHSL = hexToHSL(theme.colors.secondary);
    root.style.setProperty("--secondary", secondaryHSL);
    root.style.setProperty("--secondary-foreground", "0 0% 100%");
    
    const accentHSL = hexToHSL(theme.colors.accent);
    root.style.setProperty("--accent", accentHSL);
    root.style.setProperty("--accent-foreground", "0 0% 100%");
    
    const backgroundHSL = hexToHSL(theme.colors.background);
    root.style.setProperty("--background", backgroundHSL);
    
    const foregroundHSL = hexToHSL(theme.colors.text);
    root.style.setProperty("--foreground", foregroundHSL);
    
    // Also set card and popover to use a slightly lighter version of background
    const cardBgHSL = adjustHSLLightness(backgroundHSL, 4);
    root.style.setProperty("--card", cardBgHSL);
    root.style.setProperty("--card-foreground", foregroundHSL);
    root.style.setProperty("--popover", cardBgHSL);
    root.style.setProperty("--popover-foreground", foregroundHSL);
    
    const mutedBgHSL = adjustHSLLightness(backgroundHSL, 10);
    root.style.setProperty("--muted", mutedBgHSL);
    root.style.setProperty("--muted-foreground", "0 0% 75%");
    
    const borderHSL = adjustHSLLightness(backgroundHSL, 15);
    root.style.setProperty("--border", borderHSL);
    root.style.setProperty("--input", borderHSL);
    
    // Set ring color same as primary
    root.style.setProperty("--ring", primaryHSL);
    
    // Apply fonts if available
    if (theme.fonts) {
      root.style.setProperty("--font-heading", theme.fonts.heading);
      root.style.setProperty("--font-body", theme.fonts.body);
      root.style.setProperty("--font-mono", theme.fonts.mono);
    }
    
    // Apply border radius if available
    if (theme.borderRadius) {
      root.style.setProperty("--radius", theme.borderRadius);
    }
    
    // Apply gradient if available
    if (theme.gradient) {
      const gradientValue = `linear-gradient(${theme.gradient.direction}, ${theme.gradient.from}, ${theme.gradient.to})`;
      root.style.setProperty("--gradient", gradientValue);
    }
    
    // Apply icon style if available
    if (theme.iconStyle) {
      root.style.setProperty("--icon-style", theme.iconStyle);
    }
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

  const customizeTheme = (updates: Partial<Theme>) => {
    setCurrentTheme(prev => ({
      ...prev,
      ...updates,
      name: "custom"
    }));
  };
  
  const customizeColors = (colors: Partial<ThemeColors>) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
      name: "custom"
    }));
  };
  
  const customizeFonts = (fonts: Partial<ThemeFonts>) => {
    setCurrentTheme(prev => ({
      ...prev,
      fonts: { ...prev.fonts, ...fonts },
      name: "custom"
    }));
  };
  
  const customizeGradient = (gradient: Partial<ThemeGradient>) => {
    setCurrentTheme(prev => ({
      ...prev,
      gradient: { ...prev.gradient, ...gradient },
      name: "custom"
    }));
  };
  
  const setIconStyle = (iconStyle: ThemeIcons) => {
    setCurrentTheme(prev => ({
      ...prev,
      iconStyle,
      name: "custom"
    }));
  };
  
  const setBorderRadius = (borderRadius: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      borderRadius,
      name: "custom"
    }));
  };

  const randomizeTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]);
  };

  const randomizeColors = () => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        primary: generateRandomColor(),
        secondary: generateRandomColor(),
        accent: generateRandomColor(),
        background: "#0A0A0A", // Keep background dark for better readability
        text: "#F5F5F5" // Keep text light for better readability
      },
      name: "custom"
    }));
  };
  
  const randomizeFonts = () => {
    setCurrentTheme(prev => ({
      ...prev,
      fonts: generateRandomFonts(),
      name: "custom"
    }));
  };
  
  const randomizeGradient = () => {
    setCurrentTheme(prev => ({
      ...prev,
      gradient: generateRandomGradient(),
      name: "custom"
    }));
  };
  
  const exportTheme = (): string => {
    return JSON.stringify(currentTheme, null, 2);
  };
  
  const importTheme = (themeJson: string) => {
    try {
      const importedTheme = JSON.parse(themeJson) as Theme;
      
      // Basic validation of the imported theme
      if (!importedTheme.colors || !importedTheme.name) {
        throw new Error("Invalid theme format");
      }
      
      setCurrentTheme(importedTheme);
    } catch (error) {
      console.error("Failed to import theme:", error);
      // You could integrate with a toast here to show an error message
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      currentTheme, 
      setTheme, 
      customizeTheme,
      customizeColors,
      customizeFonts,
      customizeGradient,
      setIconStyle,
      setBorderRadius,
      randomizeTheme,
      randomizeColors,
      randomizeFonts,
      randomizeGradient,
      exportTheme,
      importTheme
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
