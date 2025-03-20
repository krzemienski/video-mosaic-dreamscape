
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shuffle, Palette, FileDown, FileUp, Sparkles, Font, GalleryHorizontalEnd, X, Square, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme, themes, fontOptions, ThemeIcons } from "@/contexts/ThemeContext";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import ThemePreset from "./ThemePreset";
import ThemePreview from "./ThemePreview";
import ColorPicker from "./ColorPicker";
import FontPicker from "./FontPicker";
import GradientPicker from "./GradientPicker";

const iconStyleOptions: { value: ThemeIcons; label: string }[] = [
  { value: "rounded", label: "Rounded" },
  { value: "sharp", label: "Sharp" },
  { value: "outlined", label: "Outlined" },
  { value: "minimal", label: "Minimal" },
  { value: "duotone", label: "Duotone" }
];

const ThemeSelector = () => {
  const { 
    currentTheme, 
    setTheme, 
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
  } = useTheme();
  
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("colors");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importedTheme, setImportedTheme] = useState("");
  const { toast } = useToast();

  const handleThemePresetClick = (theme: typeof themes[0]) => {
    setTheme(theme);
  };

  const handleColorChange = (colorType: string, value: string) => {
    customizeColors({ [colorType]: value } as any);
  };
  
  const handleFontChange = (fontType: string, value: string) => {
    customizeFonts({ [fontType]: value } as any);
  };
  
  const handleBorderRadiusChange = (value: number[]) => {
    setBorderRadius(`${value[0]}rem`);
  };
  
  const handleExportTheme = () => {
    const themeJson = exportTheme();
    navigator.clipboard.writeText(themeJson)
      .then(() => {
        toast({
          title: "Theme copied to clipboard",
          description: "You can now paste and save it anywhere"
        });
      })
      .catch(err => {
        console.error("Failed to copy theme to clipboard:", err);
      });
  };
  
  const handleImportTheme = () => {
    try {
      importTheme(importedTheme);
      setImportDialogOpen(false);
      setImportedTheme("");
      toast({
        title: "Theme imported successfully",
        description: "The new theme has been applied"
      });
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Invalid theme format",
        variant: "destructive"
      });
    }
  };
  
  const getCurrentBorderRadiusValue = () => {
    const radius = currentTheme.borderRadius || "0.5rem";
    return [parseFloat(radius)];
  };

  return (
    <>
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
        <PopoverContent side="top" align="end" className="w-96 p-0 max-h-[80vh] overflow-auto">
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
            
            <ThemePreview theme={currentTheme} />
            
            <Tabs defaultValue="colors" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="colors">
                  <Palette className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Colors</span>
                </TabsTrigger>
                <TabsTrigger value="typography">
                  <Font className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Typography</span>
                </TabsTrigger>
                <TabsTrigger value="effects">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Effects</span>
                </TabsTrigger>
                <TabsTrigger value="presets">
                  <GalleryHorizontalEnd className="h-4 w-4 mr-2" />
                  <span className="sr-only sm:not-sr-only sm:inline-block">Presets</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
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
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2" 
                  onClick={randomizeColors}
                >
                  <Shuffle className="h-4 w-4" />
                  Randomize Colors
                </Button>
              </TabsContent>
              
              <TabsContent value="typography" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <FontPicker 
                    label="Heading Font" 
                    value={currentTheme.fonts?.heading || "Inter"} 
                    options={fontOptions.headings}
                    onChange={(value) => handleFontChange('heading', value)} 
                  />
                  
                  <FontPicker 
                    label="Body Font" 
                    value={currentTheme.fonts?.body || "Inter"} 
                    options={fontOptions.body}
                    onChange={(value) => handleFontChange('body', value)} 
                  />
                  
                  <FontPicker 
                    label="Monospace Font" 
                    value={currentTheme.fonts?.mono || "SF Mono"} 
                    options={fontOptions.mono}
                    onChange={(value) => handleFontChange('mono', value)} 
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center gap-2" 
                  onClick={randomizeFonts}
                >
                  <Shuffle className="h-4 w-4" />
                  Randomize Fonts
                </Button>
              </TabsContent>
              
              <TabsContent value="effects" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Border Radius</label>
                    <div className="flex flex-col space-y-2">
                      <Slider 
                        value={getCurrentBorderRadiusValue()} 
                        min={0} 
                        max={2} 
                        step={0.125} 
                        onValueChange={handleBorderRadiusChange} 
                      />
                      <span className="text-xs text-muted-foreground">
                        {currentTheme.borderRadius || "0.5rem"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Icon Style</label>
                    <div className="grid grid-cols-3 gap-2">
                      {iconStyleOptions.map((style) => (
                        <Button
                          key={style.value}
                          variant={currentTheme.iconStyle === style.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setIconStyle(style.value)}
                          className="h-10"
                        >
                          {style.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <GradientPicker 
                    value={currentTheme.gradient || {
                      from: currentTheme.colors.primary,
                      to: currentTheme.colors.secondary,
                      direction: "to right"
                    }}
                    onChange={customizeGradient}
                  />
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2" 
                    onClick={randomizeGradient}
                  >
                    <Shuffle className="h-4 w-4" />
                    Randomize Gradient
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="presets" className="space-y-4">
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
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setExportDialogOpen(true)}
                  >
                    <FileDown className="h-4 w-4" />
                    Export Theme
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setImportDialogOpen(true)}
                  >
                    <FileUp className="h-4 w-4" />
                    Import Theme
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="w-full flex items-center gap-2 bg-primary" 
                    onClick={randomizeTheme}
                  >
                    <Shuffle className="h-4 w-4" />
                    Randomize Everything
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setTheme(themes[0])}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset to Default
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </PopoverContent>
      </Popover>
      
      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Export Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Copy this JSON to save your current theme configuration. You can import it later.
            </p>
            <Textarea
              readOnly
              value={exportTheme()}
              className="h-48 font-mono text-xs"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportTheme}>
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Import Theme</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Paste a theme JSON configuration to import it.
            </p>
            <Textarea
              placeholder="Paste your theme configuration here..."
              value={importedTheme}
              onChange={(e) => setImportedTheme(e.target.value)}
              className="h-48 font-mono text-xs"
            />
          </div>
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportTheme}>
              Import Theme
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ThemeSelector;
