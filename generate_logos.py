import os

# === SETTINGS ===
BRAND_NAME_1 = "AWESOME"
BRAND_NAME_2 = "VIDEO"
WORD_SPACING = 25  # pixels between the two words
FONTS = {
    "RobotoMono": {
        "family": "Roboto Mono, monospace",
        "weight": "bold"
    },
    "Inter": {
        "family": "Inter, sans-serif",
        "weight": "700"
    },
    "SpaceGrotesk": {
        "family": "Space Grotesk, sans-serif",
        "weight": "700"
    },
    "Sora": {
        "family": "Sora, sans-serif",
        "weight": "600"
    }
}
COLORS = {
    "bg": "#0B0D10",
    "pink": "#FF2DA0",
    "cyan": "#00F0FF",
    "white": "#FFFFFF"
}

# === TEMPLATES ===
def svg_template(width, height, body):
    return f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="{COLORS['bg']}"/>
  {body}
</svg>'''

ICON_LINES = f'''
  <line x1="60" y1="130" x2="100" y2="40" stroke="{COLORS['pink']}" stroke-width="6"/>
  <line x1="100" y1="40" x2="140" y2="130" stroke="{COLORS['pink']}" stroke-width="6"/>
  <line x1="70" y1="40" x2="100" y2="130" stroke="{COLORS['cyan']}" stroke-width="6"/>
  <line x1="100" y1="130" x2="130" y2="40" stroke="{COLORS['cyan']}" stroke-width="6"/>
  <line x1="80" y1="100" x2="120" y2="100" stroke="{COLORS['cyan']}" stroke-width="4"/>
'''

def generate_svgs():
    os.makedirs("awesome-video-logos", exist_ok=True)
    readme_lines = ["# Awesome Video Logo Assets\n", "\n## Font & Color Info\n"]

    for name, font in FONTS.items():
        font_family = font['family']
        font_weight = font['weight']
        folder = os.path.join("awesome-video-logos", name)
        os.makedirs(folder, exist_ok=True)

        readme_lines.append(f"### {name}\n- Font: `{font_family}`\n- Weight: `{font_weight}`\n- Colors: Pink `{COLORS['pink']}`, Cyan `{COLORS['cyan']}`, Background `{COLORS['bg']}`\n- Layouts: Horizontal, Stacked, Text-Only, Icon-Only\n")

        # Horizontal
        horizontal = svg_template("800", "180", f'''
  {ICON_LINES}
  <text x="180" y="105" font-family="{font_family}" font-size="48" font-weight="{font_weight}" fill="{COLORS['pink']}">{BRAND_NAME_1}</text>
  <text x="395" y="105" font-family="{font_family}" font-size="48" font-weight="{font_weight}" fill="{COLORS['cyan']}">{BRAND_NAME_2}</text>
        ''')
        with open(os.path.join(folder, "horizontal.svg"), "w") as f:
            f.write(horizontal)

        # Stacked
        stacked = svg_template("320", "250", f'''
  {ICON_LINES.replace('60', '80').replace('100', '120').replace('140', '160').replace('70', '90').replace('130', '150').replace('80', '100').replace('120', '140')}
  <text x="50" y="200" font-family="{font_family}" font-size="32" font-weight="{font_weight}" fill="{COLORS['pink']}">{BRAND_NAME_1}</text>
  <text x="210" y="200" font-family="{font_family}" font-size="32" font-weight="{font_weight}" fill="{COLORS['cyan']}">{BRAND_NAME_2}</text>
        ''')
        with open(os.path.join(folder, "stacked.svg"), "w") as f:
            f.write(stacked)

        # Text Only
        text_only = svg_template("600", "100", f'''
  <text x="40" y="70" font-family="{font_family}" font-size="48" font-weight="{font_weight}" fill="{COLORS['pink']}">{BRAND_NAME_1}</text>
  <text x="265" y="70" font-family="{font_family}" font-size="48" font-weight="{font_weight}" fill="{COLORS['cyan']}">{BRAND_NAME_2}</text>
        ''')
        with open(os.path.join(folder, "text_only.svg"), "w") as f:
            f.write(text_only)

        # Icon Only
        icon_only = svg_template("180", "180", ICON_LINES)
        with open(os.path.join(folder, "icon_only.svg"), "w") as f:
            f.write(icon_only)

    # Write README
    with open("awesome-video-logos/README.md", "w") as f:
        f.write("\n".join(readme_lines))

# === Run the script ===
if __name__ == "__main__":
    generate_svgs()
    print("✅ Logo files and README generated in 'awesome-video-logos/' folder.")
