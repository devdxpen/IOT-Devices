/**
 * ============================================
 * DESIGN TOKENS - SPACING & SIZING
 * ============================================
 * 
 * This file defines spacing, border radius, shadows, z-index, and animation tokens.
 * All values follow consistent scales for visual harmony.
 * 
 * To change spacing globally:
 * 1. Update the values in this file
 * 2. All layout and spacing throughout the UI will update automatically
 */

/**
 * Spacing Scale
 * Based on 4px (0.25rem) base unit
 * Used for: margins, padding, gaps
 */
export const spacing = {
  /** 0px */
  0: '0',
  /** 1px */
  px: '1px',
  /** 2px - minimal space */
  0.5: '0.125rem',
  /** 4px - tight space */
  1: '0.25rem',
  /** 6px */
  1.5: '0.375rem',
  /** 8px - small space */
  2: '0.5rem',
  /** 10px */
  2.5: '0.625rem',
  /** 12px - medium-small */
  3: '0.75rem',
  /** 14px */
  3.5: '0.875rem',
  /** 16px - base space */
  4: '1rem',
  /** 20px */
  5: '1.25rem',
  /** 24px - medium space */
  6: '1.5rem',
  /** 28px */
  7: '1.75rem',
  /** 32px - large space */
  8: '2rem',
  /** 36px */
  9: '2.25rem',
  /** 40px */
  10: '2.5rem',
  /** 44px */
  11: '2.75rem',
  /** 48px - extra large */
  12: '3rem',
  /** 56px */
  14: '3.5rem',
  /** 64px - 2x large */
  16: '4rem',
  /** 80px */
  20: '5rem',
  /** 96px - 3x large */
  24: '6rem',
  /** 112px */
  28: '7rem',
  /** 128px - 4x large */
  32: '8rem',
  /** 144px */
  36: '9rem',
  /** 160px */
  40: '10rem',
  /** 176px */
  44: '11rem',
  /** 192px */
  48: '12rem',
  /** 208px */
  52: '13rem',
  /** 224px */
  56: '14rem',
  /** 240px */
  60: '15rem',
  /** 256px */
  64: '16rem',
  /** 288px */
  72: '18rem',
  /** 320px */
  80: '20rem',
  /** 384px */
  96: '24rem',
} as const;

/**
 * Border Radius Scale
 * Controls the roundness of corners
 * To make the UI more/less rounded, adjust these values
 */
export const borderRadius = {
  /** No rounding (0) */
  none: '0',
  /** Slight rounding (2px) */
  sm: '0.125rem',
  /** Default rounding (4px) */
  DEFAULT: '0.25rem',
  /** Medium rounding (6px) */
  md: '0.375rem',
  /** Large rounding (8px) */
  lg: '0.5rem',
  /** Extra large (12px) */
  xl: '0.75rem',
  /** 2x large (16px) */
  '2xl': '1rem',
  /** 3x large (24px) */
  '3xl': '1.5rem',
  /** Full/pill shape */
  full: '9999px',
} as const;

/**
 * Box Shadows
 * Elevation and depth effects
 */
export const shadows = {
  /** No shadow */
  none: 'none',
  /** Extra small - subtle elevation */
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  /** Small - cards, dropdowns */
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  /** Default - standard elevation */
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  /** Medium - modals, popovers */
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  /** Large - dialogs */
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  /** Extra large - prominent modals */
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  /** 2x large - maximum elevation */
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  /** Inner shadow - inset elements */
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

/**
 * Z-Index Scale
 * Layering order for overlapping elements
 */
export const zIndex = {
  /** Behind everything (-1) */
  behind: -1,
  /** Default layer (0) */
  base: 0,
  /** Slightly elevated (10) */
  docked: 10,
  /** Dropdowns, selects (20) */
  dropdown: 20,
  /** Sticky headers (30) */
  sticky: 30,
  /** Fixed elements (40) */
  fixed: 40,
  /** Overlays, backdrops (50) */
  overlay: 50,
  /** Modal dialogs (60) */
  modal: 60,
  /** Popovers (70) */
  popover: 70,
  /** Tooltips (80) */
  tooltip: 80,
  /** Toast notifications (90) */
  toast: 90,
  /** Maximum - always on top (100) */
  max: 100,
} as const;

/**
 * Animation Durations
 * Consistent timing for transitions and animations
 */
export const animationDuration = {
  /** Instant - no animation (0ms) */
  0: '0ms',
  /** Ultra fast - micro-interactions (75ms) */
  75: '75ms',
  /** Fast - quick feedback (150ms) */
  150: '150ms',
  /** Default - standard transitions (200ms) */
  200: '200ms',
  /** Medium - noticeable animations (300ms) */
  300: '300ms',
  /** Slow - deliberate animations (500ms) */
  500: '500ms',
  /** Very slow - emphasis animations (700ms) */
  700: '700ms',
  /** Slowest - dramatic effects (1000ms) */
  1000: '1000ms',
} as const;

/**
 * Animation Easing Functions
 * Control the acceleration curve of animations
 */
export const animationEasing = {
  /** Linear - constant speed */
  linear: 'linear',
  /** Ease in - starts slow, ends fast */
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  /** Ease out - starts fast, ends slow (most common) */
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Ease in-out - slow start and end */
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Spring - bouncy, playful */
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  /** Smooth - Apple-like smooth */
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const;

/**
 * Combined spacing and effects tokens
 */
export const spacingTokens = {
  spacing,
  borderRadius,
  shadows,
  zIndex,
  animationDuration,
  animationEasing,
} as const;

/**
 * Type exports
 */
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type ZIndex = keyof typeof zIndex;
export type AnimationDuration = keyof typeof animationDuration;
export type AnimationEasing = keyof typeof animationEasing;
