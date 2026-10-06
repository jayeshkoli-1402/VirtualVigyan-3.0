// ── Chemistry Constants ──
export const HCL_VOLUME_ML = 25;
export const HCL_MOLARITY = 0.1;
export const NAOH_MOLARITY = 0.1;
export const EQUIVALENCE_VOLUME_ML = 25; // (HCL_VOLUME_ML * HCL_MOLARITY) / NAOH_MOLARITY
export const DROP_SIZE_ML = 0.1;
export const BURETTE_MAX_ML = 50;

// ── Color thresholds ──
export const COLOR_CHANGE_START_ML = 22.5;   // 90% of equivalence
export const ENDPOINT_ML = 25;                // exact equivalence
export const OVERSHOOT_ML = 26;               // deep magenta beyond this

/**
 * Returns the CSS color string for the flask liquid based on how much
 * NaOH has been added and whether the indicator is present.
 *
 * Inspired by real-world phenolphthalein indicator behavior:
 * - Acidic (pH < 8.2): Crystal clear aqueous solution
 * - Endpoint (pH ~8.2-9): First persistent pale pink
 * - Excess base (pH > 10): Deep fuchsia/magenta
 */
export function getFlaskColor(
  volumeAdded: number,
  hasIndicator: boolean,
  isSwirling?: boolean
): string {
  // No indicator or in acidic solution → crystal clear aqueous solution
  if (!hasIndicator || volumeAdded < COLOR_CHANGE_START_ML) {
    return 'rgba(224, 242, 254, 0.35)';
  }

  // Near endpoint (22.5 - 24.8 mL): Transient local pink dissolves/mixes away when flask is swirled
  if (volumeAdded < 24.8 && isSwirling) {
    return 'rgba(224, 242, 254, 0.35)';
  }

  // 22.5 – 25.0 mL: faint pink appearing near equivalence point
  if (volumeAdded <= ENDPOINT_ML) {
    const t = (volumeAdded - COLOR_CHANGE_START_ML) / (ENDPOINT_ML - COLOR_CHANGE_START_ML);
    // Interpolate from very pale translucent pink to persistent pale pink (rgba 244, 114, 182, 0.75)
    const r = Math.round(253 - t * 9);
    const g = Math.round(232 - t * 118);
    const b = Math.round(241 - t * 59);
    const opacity = 0.40 + t * 0.35;
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
  }

  // 25.0 – 26.0 mL: persistent pink deepening to magenta
  if (volumeAdded <= OVERSHOOT_ML) {
    const t = (volumeAdded - ENDPOINT_ML) / (OVERSHOOT_ML - ENDPOINT_ML);
    const r = Math.round(244 - t * 25);
    const g = Math.round(114 - t * 75);
    const b = Math.round(182 - t * 63);
    const opacity = 0.75 + t * 0.20;
    return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
  }

  // > 26 mL: deep intense over-titrated magenta
  return 'rgba(219, 39, 119, 0.95)';
}

/**
 * Returns a human-readable description of the current color state.
 */
export function getColorDescription(volumeAdded: number, hasIndicator: boolean): string {
  if (!hasIndicator) return 'Colorless solution (no indicator)';
  if (volumeAdded < COLOR_CHANGE_START_ML) return 'Colorless acidic solution';
  if (volumeAdded < ENDPOINT_ML - 0.2) return 'Faint transient pink appearing';
  if (volumeAdded <= ENDPOINT_ML + 0.1) return 'Pale persistent pink (Endpoint)';
  if (volumeAdded <= OVERSHOOT_ML) return 'Pink deepening to magenta (Overshot)';
  return 'Deep magenta (Overshot)';
}

/**
 * Calculate expected concentration from a given titrant volume.
 * Formula: (V_NaOH × M_NaOH) / V_HCl
 */
export function calculateExpectedConcentration(volumeNaOH: number): number {
  return (volumeNaOH * NAOH_MOLARITY) / HCL_VOLUME_ML;
}
