import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ============================================
 * ALERT COMPONENT
 * ============================================
 *
 * Token-driven alert component for displaying messages.
 * All styling uses design tokens - no hardcoded values.
 *
 * Token Dependencies:
 * - --color-{variant} (background colors)
 * - --color-{variant}-foreground (text colors)
 * - --radius-lg (border radius)
 *
 * Usage:
 * ```tsx
 * <Alert variant="success">
 *   <AlertTitle>Success!</AlertTitle>
 *   <AlertDescription>Your changes have been saved.</AlertDescription>
 * </Alert>
 * ```
 */

/**
 * Alert Variants
 * Uses semantic color tokens for each variant
 */
const alertVariants = cva(
  // Base styles - uses token-based border radius
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        // Default - neutral styling
        default: "bg-background text-foreground border-border",
        // Info - informational messages
        info: "bg-info-50 text-info-900 border-info-200 dark:bg-info-950 dark:text-info-100 dark:border-info-800 [&>svg]:text-info-500",
        // Success - positive/success messages
        success:
          "bg-success-50 text-success-900 border-success-200 dark:bg-success-950 dark:text-success-100 dark:border-success-800 [&>svg]:text-success-500",
        // Warning - warning messages
        warning:
          "bg-warning-50 text-warning-900 border-warning-200 dark:bg-warning-950 dark:text-warning-100 dark:border-warning-800 [&>svg]:text-warning-500",
        // Error/Destructive - error messages
        error:
          "bg-error-50 text-error-900 border-error-200 dark:bg-error-950 dark:text-error-100 dark:border-error-800 [&>svg]:text-error-500",
        destructive:
          "bg-error-50 text-error-900 border-error-200 dark:bg-error-950 dark:text-error-100 dark:border-error-800 [&>svg]:text-error-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Icon mapping for each variant
 */
const variantIcons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  destructive: AlertCircle,
};

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Show the variant icon */
  showIcon?: boolean;
  /** Show a close button */
  dismissible?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

/**
 * Alert Component
 * Displays contextual feedback messages
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = "default",
      showIcon = true,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref,
  ) => {
    const Icon = variantIcons[variant || "default"];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && <Icon className="h-4 w-4" />}
        {children}
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70",
              "ring-offset-background transition-opacity",
              "hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    );
  },
);
Alert.displayName = "Alert";

/**
 * Alert Title
 * Uses typography tokens for heading style
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

/**
 * Alert Description
 * Secondary text content
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription, alertVariants };
