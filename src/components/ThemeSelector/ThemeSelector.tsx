
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Shuffle, Palette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, themes, Theme } from "@/contexts/ThemeContext";
import ThemePreset from "./ThemePreset";
import ColorPicker from "./ColorPicker";

const ThemeSelector = () => {
  const { currentTheme, setTheme, customizeTheme, randomizeTheme, randomizeColors } = useTheme();
  const [open, setOpen] = useState(false);

  const handleThemePresetClick = (theme: Theme) => {
    setTheme(theme);
  };

  const handleColorChange = (colorType: string, value: string) => {
    customizeTheme({ [colorType]: value } as any);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 bg-primary hover:bg-primary/90"
        >
          <Palette className="h-6 w-6 text-primary-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 p-0">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Theme Explorer</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <ColorPicker 
              label="Primary Color" 
              value={currentTheme.colors.primary} 
              onChange={(value) => handleColorChange('primary', value)} 
            />
            
            <ColorPicker 
              label="Secondary Color" 
              value={currentTheme.colors.secondary} 
              onChange={(value) => handleColorChange('secondary', value)} 
            />
            
            <ColorPicker 
              label="Accent Color" 
              value={currentTheme.colors.accent} 
              onChange={(value) => handleColorChange('accent', value)} 
            />
            
            <ColorPicker 
              label="Background Color" 
              value={currentTheme.colors.background} 
              onChange={(value) => handleColorChange('background', value)} 
            />
            
            <ColorPicker 
              label="Text Color" 
              value={currentTheme.colors.text} 
              onChange={(value) => handleColorChange('text', value)} 
            />
          </div>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={randomizeColors}
            >
              <Shuffle className="h-4 w-4" />
              Randomize Colors
            </Button>
            
            <Button onClick={() => setOpen(false)}>
              Apply
            </Button>
          </div>
          
          <div className="border-t border-border pt-4">
            <h4 className="mb-2 text-sm font-medium">Preset Themes</h4>
            <div className="grid grid-cols-5 gap-2">
              {themes.map((theme) => (
                <ThemePreset 
                  key={theme.name} 
                  theme={theme} 
                  isActive={currentTheme.name === theme.name}
                  onClick={() => handleThemePresetClick(theme)} 
                />
              ))}
            </div>
          </div>
          
          <Button 
            variant="default" 
            className="w-full flex items-center gap-2 bg-primary" 
            onClick={randomizeTheme}
          >
            <Shuffle className="h-4 w-4" />
            Randomize Theme
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ThemeSelector;
