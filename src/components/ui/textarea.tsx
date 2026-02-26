import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * ============================================
 * TEXTAREA COMPONENT
 * ============================================
 *
 * Token-driven textarea component matching Input styling.
 * All styling uses design tokens - no hardcoded values.
 *
 * Token Dependencies:
 * - --color-input, --color-border (border colors)
 * - --color-foreground, --color-muted-foreground (text)
 * - --color-ring (focus ring)
 * - --radius-md (border radius)
 *
 * Usage:
 * ```tsx
 * <Textarea placeholder="Enter your message..." />
 * <Textarea rows={5} disabled />
 * ```
 */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

/**
 * Textarea Component
 * Multi-line text input with token-based styling
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        className={cn(
          // Base sizing and layout
          "flex min-h-[80px] w-full",
          // Padding and spacing
          "px-3 py-2",
          // Typography - uses token font sizes
          "text-base md:text-sm",
          // Visual styling using tokens
          "rounded-md border border-input bg-background",
          // Placeholder styling
          "placeholder:text-muted-foreground",
          // Shadow
          "shadow-xs",
          // Transitions
          "transition-[color,box-shadow]",
          // Focus states
          "outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Invalid/error state
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          // Dark mode adjustments
          "dark:bg-input/30",
          // Resize behavior
          "resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };

