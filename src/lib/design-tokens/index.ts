/**
 * ============================================
 * DESIGN TOKENS - MAIN EXPORT
 * ============================================
 *
 * This is the central entry point for all design tokens.
 * Import from this file to access any token category.
 *
 * Usage:
 * ```typescript
 * import { tokens, primary, fontSize, spacing } from '@/lib/design-tokens';
 *
 * // Access nested tokens
 * const primaryColor = tokens.colors.primary[500];
 * const baseFontSize = tokens.typography.fontSize.base;
 * ```
 *
 * AI/Automation Notes:
 * - To change primary color: modify `colors.ts` → `primary` object
 * - To change border radius: modify `spacing.ts` → `borderRadius` object
 * - To change spacing scale: modify `spacing.ts` → `spacing` object
 * - All changes propagate automatically through CSS variables
 */

// Re-export all color tokens
export {
  primary,
  secondary,
  success,
  warning,
  error,
  neutral,
  info,
  colorPalettes,
  type ColorScale,
  type ColorPaletteName,
  type ColorPalette,
} from "./colors";

// Re-export all typography tokens
export {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
  type FontSize,
  type FontWeight,
  type LineHeight,
  type LetterSpacing,
} from "./typography";

// Re-export all spacing and effect tokens
export {
  spacing,
  borderRadius,
  shadows,
  zIndex,
  animationDuration,
  animationEasing,
  spacingTokens,
  type Spacing,
  type BorderRadius,
  type Shadow,
  type ZIndex,
  type AnimationDuration,
  type AnimationEasing,
} from "./spacing";

// Import for combined tokens object
import { colorPalettes } from "./colors";
import { typography } from "./typography";
import { spacingTokens } from "./spacing";

/**
 * Combined tokens object
 * Single source of truth for all design tokens
 *
 * Structure:
 * - tokens.colors.{palette}.{scale}
 * - tokens.typography.{category}.{size}
 * - tokens.spacing.{size}
 * - tokens.borderRadius.{size}
 * - tokens.shadows.{size}
 * - tokens.zIndex.{layer}
 * - tokens.animation.duration.{speed}
 * - tokens.animation.easing.{curve}
 */
export const tokens = {
  colors: colorPalettes,
  typography,
  ...spacingTokens,
  animation: {
    duration: spacingTokens.animationDuration,
    easing: spacingTokens.animationEasing,
  },
} as const;

/**
 * Helper function to convert hex color to RGB values
 * Useful for CSS rgba() usage with opacity
 */
export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "0 0 0";
  return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
}

/**
 * Helper function to get a CSS variable reference
 */
export function cssVar(name: string, fallback?: string): string {
  return fallback ? `var(--${name}, ${fallback})` : `var(--${name})`;
}

export default tokens;
