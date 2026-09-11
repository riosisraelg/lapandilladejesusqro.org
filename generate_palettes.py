import re
import random

# Generate 50 Day and 50 Night palettes avoiding hues between 260 and 310
def random_hue():
    h = random.randint(0, 359)
    while 260 <= h <= 310:
        h = random.randint(0, 359)
    return h

day_palettes = []
night_palettes = []

for i in range(1, 51):
    h1 = random_hue()
    h2 = (h1 + random.randint(10, 30)) % 360
    while 260 <= h2 <= 310: h2 = (h2 + 10) % 360
    h3 = (h1 - random.randint(10, 30)) % 360
    while 260 <= h3 <= 310: h3 = (h3 - 10) % 360
    
    # Day
    day_palettes.append(f"  {{ hues: [{h1}, {h2}, {h3}], sat: [40, 55], light: [55, 68] }}, // Day {i}")
    
    # Night
    h1_n = random_hue()
    h2_n = (h1_n + random.randint(10, 30)) % 360
    while 260 <= h2_n <= 310: h2_n = (h2_n + 10) % 360
    h3_n = (h1_n - random.randint(10, 30)) % 360
    while 260 <= h3_n <= 310: h3_n = (h3_n - 10) % 360
    night_palettes.append(f"  {{ hues: [{h1_n}, {h2_n}, {h3_n}], sat: [30, 48], light: [14, 25] }}, // Night {i}")

with open("src/app/AppleMusicLyrics.tsx", "r") as f:
    content = f.read()

# Replace DAY_PALETTES
day_str = "const DAY_PALETTES: PaletteDef[] = [\n" + "\n".join(day_palettes) + "\n];"
content = re.sub(r'const DAY_PALETTES: PaletteDef\[\] = \[.*?\];', day_str, content, flags=re.DOTALL)

# Replace NIGHT_PALETTES
night_str = "const NIGHT_PALETTES: PaletteDef[] = [\n" + "\n".join(night_palettes) + "\n];"
content = re.sub(r'const NIGHT_PALETTES: PaletteDef\[\] = \[.*?\];', night_str, content, flags=re.DOTALL)

# Replace generateGradientColors function
new_func = """function generateGradientColors(): string[] {
  const isDark = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches 
    : false;
  
  const poolName = isDark ? 'NIGHT_PALETTES' : 'DAY_PALETTES';
  const pool = isDark ? NIGHT_PALETTES : DAY_PALETTES;
  
  let usedIndices: number[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`used_palettes_${poolName}`);
      if (stored) usedIndices = JSON.parse(stored);
    } catch (e) {}
  }
  
  let availableIndices = pool.map((_, i) => i).filter(i => !usedIndices.includes(i));
  if (availableIndices.length === 0) {
    availableIndices = pool.map((_, i) => i);
    usedIndices = [];
  }
  
  const randomAvailableIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  usedIndices.push(randomAvailableIndex);
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`used_palettes_${poolName}`, JSON.stringify(usedIndices));
    } catch (e) {}
  }

  const palette = pool[randomAvailableIndex];
  
  return palette.hues.map((h) => {
    const s = palette.sat[0] + Math.random() * (palette.sat[1] - palette.sat[0]);
    const l = palette.light[0] + Math.random() * (palette.light[1] - palette.light[0]);
    const jitteredH = (h + Math.floor(Math.random() * 10 - 5) + 360) % 360;
    return `hsl(${jitteredH}, ${Math.round(s)}%, ${Math.round(l)}%)`;
  });
}"""

content = re.sub(r'function generateGradientColors\(\): string\[\] \{.*?\}', new_func, content, flags=re.DOTALL)

with open("src/app/AppleMusicLyrics.tsx", "w") as f:
    f.write(content)

print("Updated AppleMusicLyrics.tsx successfully")
