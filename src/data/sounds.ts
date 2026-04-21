import { CloudRain, Coffee, Flame, Music4, Trees, VolumeX, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import focusBackground from "../assets/focus-background.mp3";

export type SoundType = "local" | "silence";

export interface Sound {
  id: string;
  label: string;
  icon: LucideIcon;
  src: string | null;
  type: SoundType;
}

export const SOUNDS: Sound[] = [
  {
    id: "original",
    label: "Original",
    icon: Music4,
    src: focusBackground,
    type: "local",
  },
  {
    id: "silence",
    label: "Silêncio",
    icon: VolumeX,
    src: null,
    type: "silence",
  },
];

// Para adicionar mais sons ambientes, coloque os arquivos em `src/assets/sounds/`
// e registre-os abaixo. Exemplo:
//
// import rain from "../assets/sounds/rain.mp3";
// SOUNDS.push({ id: "rain", label: "Chuva", icon: CloudRain, src: rain, type: "local" });
//
// Ícones sugeridos já importados: CloudRain, Coffee, Flame, Trees, Waves.
export const PLACEHOLDER_ICONS = { CloudRain, Coffee, Flame, Trees, Waves };

export const DEFAULT_SOUND_ID = "original";

export function findSound(id: string): Sound | undefined {
  return SOUNDS.find((s) => s.id === id);
}
