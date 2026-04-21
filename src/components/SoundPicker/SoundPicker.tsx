import { useState } from "react";
import { Check, Link as LinkIcon, Youtube } from "lucide-react";
import { SOUNDS, findSound } from "../../data/sounds";
import { extractYouTubeVideoId } from "../../utils/YouTubeAudioPlayer.class";
import "./SoundPicker.css";

export const CUSTOM_SOUND_ID = "custom";

interface SoundPickerProps {
  selectedSoundId: string;
  customUrl: string;
  onSelectSound: (soundId: string) => void;
  onApplyCustomUrl: (url: string) => void;
}

function describeCustomUrl(url: string): { label: string; icon: "yt" | "url" } {
  const ytId = extractYouTubeVideoId(url);
  if (ytId) return { label: `YouTube · ${ytId}`, icon: "yt" };
  try {
    const host = new URL(url).hostname;
    return { label: host, icon: "url" };
  } catch {
    return { label: "URL inválida", icon: "url" };
  }
}

const SoundPicker = ({
  selectedSoundId,
  customUrl,
  onSelectSound,
  onApplyCustomUrl,
}: SoundPickerProps) => {
  const [draftUrl, setDraftUrl] = useState(customUrl);
  const draftIsValid = /^https?:\/\//i.test(draftUrl.trim());
  const customActive = selectedSoundId === CUSTOM_SOUND_ID;

  return (
    <div className="sound-picker">
      <h3 className="sound-picker-heading">Som ambiente</h3>

      <div className="sound-grid" role="radiogroup" aria-label="Som ambiente">
        {SOUNDS.map((sound) => {
          const Icon = sound.icon;
          const selected = !customActive && sound.id === selectedSoundId;
          return (
            <button
              key={sound.id}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`sound-card${selected ? " sound-card--selected" : ""}`}
              onClick={() => onSelectSound(sound.id)}
            >
              <Icon className="sound-card-icon" aria-hidden="true" />
              <span className="sound-card-label">{sound.label}</span>
            </button>
          );
        })}
      </div>

      <div className="sound-custom">
        <label htmlFor="sound-url" className="sound-custom-label">
          Ou use um link (YouTube ou MP3 direto)
        </label>
        <div className="sound-custom-row">
          <input
            id="sound-url"
            type="url"
            inputMode="url"
            placeholder="https://..."
            value={draftUrl}
            onChange={(e) => setDraftUrl(e.target.value)}
            className="sound-custom-input"
          />
          <button
            type="button"
            className="sound-custom-apply"
            onClick={() => {
              if (draftIsValid) onApplyCustomUrl(draftUrl.trim());
            }}
            disabled={!draftIsValid}
            aria-label="Usar link"
          >
            <Check size={16} />
            <span>Usar</span>
          </button>
        </div>
        {customActive && customUrl ? (
          <div
            className={`sound-custom-active${
              findSound(selectedSoundId) ? "" : " sound-custom-active--on"
            }`}
          >
            {describeCustomUrl(customUrl).icon === "yt" ? (
              <Youtube size={14} aria-hidden="true" />
            ) : (
              <LinkIcon size={14} aria-hidden="true" />
            )}
            <span>{describeCustomUrl(customUrl).label}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SoundPicker;
