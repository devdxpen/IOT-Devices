/**
 * ============================================
 * DESIGN TOKENS - TYPOGRAPHY
 * ============================================
 * 
 * This file defines all typography-related design tokens.
 * Includes font families, sizes, weights, line heights, and letter spacing.
 * 
 * To change typography globally:
 * 1. Update the values in this file
 * 2. All text throughout the UI will update automatically
 */

/**
 * Font Families
 * Define the primary and secondary font stacks
 */
export const fontFamily = {
  /** Primary font for body text and UI elements */
  sans: "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  /** Monospace font for code blocks and technical content */
  mono: "'JetBrains Mono', 'Fira Code', Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
  /** Display font for headings (optional, defaults to sans) */
  display: "'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

/**
 * Font Sizes
 * Follows a modular scale for consistent sizing
 * Base size: 1rem (16px)
 */
export const fontSize = {
  /** Extra small - labels, captions, fine print (12px) */
  xs: '0.75rem',
  /** Small - secondary text, helper text (14px) */
  sm: '0.875rem',
  /** Base - body text, default size (16px) */
  base: '1rem',
  /** Large - emphasized text, subheadings (18px) */
  lg: '1.125rem',
  /** Extra large - section headings (20px) */
  xl: '1.25rem',
  /** 2XL - page headings (24px) */
  '2xl': '1.5rem',
  /** 3XL - major headings (30px) */
  '3xl': '1.875rem',
  /** 4XL - display headings (36px) */
  '4xl': '2.25rem',
  /** 5XL - hero headings (48px) */
  '5xl': '3rem',
  /** 6XL - large display text (60px) */
  '6xl': '3.75rem',
} as const;

/**
 * Font Weights
 * Standard weight scale for typographic hierarchy
 */
export const fontWeight = {
  /** Thin - rarely used, decorative (100) */
  thin: 100,
  /** Extra light (200) */
  extralight: 200,
  /** Light (300) */
  light: 300,
  /** Normal - body text default (400) */
  normal: 400,
  /** Medium - slightly emphasized (500) */
  medium: 500,
  /** Semibold - headings, labels (600) */
  semibold: 600,
  /** Bold - strong emphasis (700) */
  bold: 700,
  /** Extra bold (800) */
  extrabold: 800,
  /** Black - maximum weight (900) */
  black: 900,
} as const;

/**
 * Line Heights
 * Control vertical rhythm and readability
 */
export const lineHeight = {
  /** None - single line, no extra space (1) */
  none: '1',
  /** Tight - compact headings (1.25) */
  tight: '1.25',
  /** Snug - slightly compact (1.375) */
  snug: '1.375',
  /** Normal - body text default (1.5) */
  normal: '1.5',
  /** Relaxed - comfortable reading (1.625) */
  relaxed: '1.625',
  /** Loose - spacious, large text (2) */
  loose: '2',
} as const;

/**
 * Letter Spacing (Tracking)
 * Fine-tune character spacing
 */
export const letterSpacing = {
  /** Tighter - compact headings (-0.05em) */
  tighter: '-0.05em',
  /** Tight - slightly condensed (-0.025em) */
  tight: '-0.025em',
  /** Normal - default (0) */
  normal: '0',
  /** Wide - slightly spaced (0.025em) */
  wide: '0.025em',
  /** Wider - spaced out (0.05em) */
  wider: '0.05em',
  /** Widest - uppercase, small caps (0.1em) */
  widest: '0.1em',
} as const;

/**
 * Combined typography tokens object
 */
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
} as const;

/**
 * Type exports
 */
export type FontSize = keyof typeof fontSize;
export type FontWeight = keyof typeof fontWeight;
export type LineHeight = keyof typeof lineHeight;
export type LetterSpacing = keyof typeof letterSpacing;

