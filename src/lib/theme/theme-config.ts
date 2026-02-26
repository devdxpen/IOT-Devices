/**
 * ============================================
 * THEME CONFIGURATION
 * ============================================
 * 
 * This file defines the semantic color mappings for light and dark themes.
 * Semantic colors reference the base color palettes and provide
 * consistent meaning across the UI (e.g., 'background', 'foreground', 'primary').
 * 
 * WCAG Compliance:
 * - Light mode: Dark text on light backgrounds (contrast ratio >= 4.5:1)
 * - Dark mode: Light text on dark backgrounds (contrast ratio >= 4.5:1)
 * 
 * To add a new theme:
 * 1. Create a new theme object following the ThemeColors structure
 * 2. Add it to the themes object
 * 3. Theme will be available in ThemeProvider
 */

import {
  primary,
  secondary,
  success,
  warning,
  error,
  neutral,
  info,
} from '../design-tokens/colors';

/**
 * Theme color structure
 * These semantic tokens are used by all components
 */
export interface ThemeColors {
  // Base colors
  background: string;
  foreground: string;
  
  // Card/Surface colors
  card: string;
  cardForeground: string;
  
  // Popover colors
  popover: string;
  popoverForeground: string;
  
  // Primary colors (main brand)
  primary: string;
  primaryForeground: string;
  
  // Secondary colors
  secondary: string;
  secondaryForeground: string;
  
  // Muted colors (subtle backgrounds)
  muted: string;
  mutedForeground: string;
  
  // Accent colors (highlights)
  accent: string;
  accentForeground: string;
  
  // Semantic colors
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  error: string;
  errorForeground: string;
  info: string;
  infoForeground: string;
  
  // Destructive (alias for error, used in buttons)
  destructive: string;
  destructiveForeground: string;
  
  // UI element colors
  border: string;
  input: string;
  ring: string;
}

/**
 * Light Theme
 * Default theme with light backgrounds and dark text
 */
export const lightTheme: ThemeColors = {
  // Base - light background, dark text
  background: neutral[50],
  foreground: neutral[900],
  
  // Cards - white surface
  card: '#ffffff',
  cardForeground: neutral[900],
  
  // Popovers - white with slight elevation
  popover: '#ffffff',
  popoverForeground: neutral[900],
  
  // Primary - blue
  primary: primary[500],
  primaryForeground: '#ffffff',
  
  // Secondary - muted gray
  secondary: neutral[100],
  secondaryForeground: neutral[900],
  
  // Muted - subtle gray
  muted: neutral[100],
  mutedForeground: neutral[500],
  
  // Accent - light gray highlight
  accent: neutral[100],
  accentForeground: neutral[900],
  
  // Semantic colors
  success: success[500],
  successForeground: '#ffffff',
  warning: warning[500],
  warningForeground: '#ffffff',
  error: error[500],
  errorForeground: '#ffffff',
  info: info[500],
  infoForeground: '#ffffff',
  
  // Destructive
  destructive: error[500],
  destructiveForeground: '#ffffff',
  
  // UI elements
  border: neutral[200],
  input: neutral[200],
  ring: primary[500],
};

/**
 * Dark Theme
 * Dark backgrounds with light text
 * Uses lighter color variants for better contrast
 */
export const darkTheme: ThemeColors = {
  // Base - dark background, light text
  background: neutral[950],
  foreground: neutral[50],
  
  // Cards - slightly lighter than background
  card: neutral[900],
  cardForeground: neutral[50],
  
  // Popovers
  popover: neutral[900],
  popoverForeground: neutral[50],
  
  // Primary - lighter blue for dark mode
  primary: primary[400],
  primaryForeground: neutral[900],
  
  // Secondary
  secondary: neutral[800],
  secondaryForeground: neutral[50],
  
  // Muted
  muted: neutral[800],
  mutedForeground: neutral[400],
  
  // Accent
  accent: neutral[800],
  accentForeground: neutral[50],
  
  // Semantic colors - use lighter variants
  success: success[400],
  successForeground: neutral[900],
  warning: warning[400],
  warningForeground: neutral[900],
  error: error[400],
  errorForeground: neutral[900],
  info: info[400],
  infoForeground: neutral[900],
  
  // Destructive
  destructive: error[600],
  destructiveForeground: '#ffffff',
  
  // UI elements - darker borders
  border: neutral[700],
  input: neutral[700],
  ring: primary[400],
};

/**
 * Available themes
 */
export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Helper to convert theme colors to CSS variables
 */
export function themeToCssVars(theme: ThemeColors): Record<string, string> {
  return {
    '--background': theme.background,
    '--foreground': theme.foreground,
    '--card': theme.card,
    '--card-foreground': theme.cardForeground,
    '--popover': theme.popover,
    '--popover-foreground': theme.popoverForeground,
    '--primary': theme.primary,
    '--primary-foreground': theme.primaryForeground,
    '--secondary': theme.secondary,
    '--secondary-foreground': theme.secondaryForeground,
    '--muted': theme.muted,
    '--muted-foreground': theme.mutedForeground,
    '--accent': theme.accent,
    '--accent-foreground': theme.accentForeground,
    '--success': theme.success,
    '--success-foreground': theme.successForeground,
    '--warning': theme.warning,
    '--warning-foreground': theme.warningForeground,
    '--error': theme.error,
    '--error-foreground': theme.errorForeground,
    '--info': theme.info,
    '--info-foreground': theme.infoForeground,
    '--destructive': theme.destructive,
    '--destructive-foreground': theme.destructiveForeground,
    '--border': theme.border,
    '--input': theme.input,
    '--ring': theme.ring,
  };
}

