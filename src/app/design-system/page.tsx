"use client";

/**
 * ============================================
 * DESIGN SYSTEM SHOWCASE
 * ============================================
 *
 * Comprehensive demonstration of the design token system.
 * Shows all components and how they respond to token changes.
 *
 * Key Features:
 * - Color palette display
 * - Typography scale
 * - Spacing scale
 * - All UI components
 * - Theme switching demo
 */

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  ModalClose,
} from "@/components/ui/modal";
import { ThemeToggle, ThemeIndicator } from "@/components/ui/theme-toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/lib/theme";

/**
 * Section Header Component
 */
function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

/**
 * Color Swatch Component
 */
function ColorSwatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-lg shadow-sm border border-border"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <span className="text-xs text-muted-foreground">{name}</span>
    </div>
  );
}

/**
 * Color Scale Component
 */
function ColorScale({ name, prefix }: { name: string; prefix: string }) {
  const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium capitalize">{name}</h4>
      <div className="flex gap-1">
        {scales.map((scale) => (
          <div
            key={scale}
            className="w-10 h-10 rounded text-[10px] flex items-end justify-center pb-1 font-mono"
            style={{ backgroundColor: `var(--color-${prefix}-${scale})` }}
          >
            <span className={scale < 500 ? "text-neutral-900" : "text-white"}>
              {scale}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Main Showcase Page
 */
export default function DesignSystemShowcase() {
  const { theme, resolvedTheme } = useTheme();

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Design System</h1>
          <p className="text-muted-foreground mt-2">
            Token-driven component library with full dark mode support
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeIndicator />
          <ThemeToggle />
        </div>
      </div>

      <Separator />

      {/* Color Tokens Section */}
      <section>
        <SectionHeader
          title="Color Tokens"
          description="Complete color palette with 50-900 scales. Changing primary color updates all components automatically."
        />

        <div className="space-y-6">
          <ColorScale name="Primary" prefix="primary" />
          <ColorScale name="Secondary" prefix="secondary" />
          <ColorScale name="Success" prefix="success" />
          <ColorScale name="Warning" prefix="warning" />
          <ColorScale name="Error" prefix="error" />
          <ColorScale name="Neutral" prefix="neutral" />
          <ColorScale name="Info" prefix="info" />
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-medium mb-4">Semantic Colors</h4>
          <div className="flex flex-wrap gap-4">
            <ColorSwatch name="Background" variable="--color-background" />
            <ColorSwatch name="Foreground" variable="--color-foreground" />
            <ColorSwatch name="Card" variable="--color-card" />
            <ColorSwatch name="Primary" variable="--color-primary" />
            <ColorSwatch name="Secondary" variable="--color-secondary" />
            <ColorSwatch name="Muted" variable="--color-muted" />
            <ColorSwatch name="Accent" variable="--color-accent" />
            <ColorSwatch name="Border" variable="--color-border" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Button Component */}
      <section>
        <SectionHeader
          title="Button Component"
          description="All button variants and sizes using design tokens."
        />

        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium mb-3">Variants</h4>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">Sizes</h4>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-3">States</h4>
            <div className="flex flex-wrap gap-3">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Input Components */}
      <section>
        <SectionHeader
          title="Input Components"
          description="Form inputs styled with design tokens."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input placeholder="Text input..." />
            <Input type="email" placeholder="Email input..." />
            <Input type="password" placeholder="Password input..." />
            <Input disabled placeholder="Disabled input..." />
          </div>

          <div className="space-y-4">
            <Textarea placeholder="Textarea input..." />
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Badge Component */}
      <section>
        <SectionHeader
          title="Badge Component"
          description="Status indicators and labels."
        />

        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      {/* Alert Component */}
      <section>
        <SectionHeader
          title="Alert Component"
          description="Contextual feedback messages with semantic colors."
        />

        <div className="space-y-4">
          <Alert variant="default">
            <AlertTitle>Default Alert</AlertTitle>
            <AlertDescription>
              This is a default alert message.
            </AlertDescription>
          </Alert>

          <Alert variant="info">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational message.
            </AlertDescription>
          </Alert>

          <Alert variant="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your operation completed successfully!
            </AlertDescription>
          </Alert>

          <Alert variant="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Please review this before proceeding.
            </AlertDescription>
          </Alert>

          <Alert variant="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Something went wrong. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      {/* Card Component */}
      <section>
        <SectionHeader
          title="Card Component"
          description="Content containers with token-based styling."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                Card description text goes here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Card content with some example text.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Action</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
              <CardDescription>With form elements inside.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Enter text..." />
              <Button className="w-full">Submit</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status Card</CardTitle>
              <CardDescription>Displaying status information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Theme</span>
                <span className="font-medium capitalize">{resolvedTheme}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Tabs Component */}
      <section>
        <SectionHeader
          title="Tabs Component"
          description="Tabbed navigation with token-based active states."
        />

        <Tabs defaultValue="tab1" className="w-full">
          <TabsList>
            <TabsTrigger value="tab1">Overview</TabsTrigger>
            <TabsTrigger value="tab2">Settings</TabsTrigger>
            <TabsTrigger value="tab3">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <Card>
              <CardContent className="pt-6">
                <p>
                  Overview content goes here. This demonstrates how tabs work
                  with design tokens.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab2">
            <Card>
              <CardContent className="pt-6">
                <p>Settings content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tab3">
            <Card>
              <CardContent className="pt-6">
                <p>Analytics content goes here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Separator />

      {/* Modal Component */}
      <section>
        <SectionHeader
          title="Modal Component"
          description="Dialog component with token-based overlay and content styling."
        />

        <div className="flex gap-4">
          <Modal>
            <ModalTrigger asChild>
              <Button>Open Modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Modal Title</ModalTitle>
                <ModalDescription>
                  This is a description of the modal content.
                </ModalDescription>
              </ModalHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">
                  Modal body content goes here. All styling uses design tokens.
                </p>
              </div>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button>Confirm</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal>
            <ModalTrigger asChild>
              <Button variant="outline">Form Modal</Button>
            </ModalTrigger>
            <ModalContent>
              <ModalHeader>
                <ModalTitle>Create New Item</ModalTitle>
                <ModalDescription>
                  Fill out the form below to create a new item.
                </ModalDescription>
              </ModalHeader>
              <div className="py-4 space-y-4">
                <Input placeholder="Item name..." />
                <Textarea placeholder="Description..." />
              </div>
              <ModalFooter>
                <ModalClose asChild>
                  <Button variant="outline">Cancel</Button>
                </ModalClose>
                <Button>Create</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </section>

      <Separator />

      {/* Token Usage Guide */}
      <section>
        <SectionHeader
          title="How Token Changes Work"
          description="Demonstration of how changing a single token updates the entire UI."
        />

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Example: Changing Primary Color
              </h4>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`/* In globals.css @theme block */
--color-primary-500: #3b82f6;  /* Current: Blue */

/* Change to purple */
--color-primary-500: #8b5cf6;  /* New: Purple */

/* All these update automatically: */
- Primary buttons
- Focus rings on inputs
- Active tab indicators
- Links
- Badges (default variant)
- Selection highlights`}
              </pre>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">
                Example: Changing Border Radius
              </h4>
              <pre className="text-xs bg-background p-3 rounded overflow-x-auto">
                {`/* In globals.css @theme block */
--radius-lg: 0.5rem;   /* Current */
--radius-lg: 1rem;     /* More rounded */

/* All these update automatically: */
- Cards
- Modals  
- Buttons (lg variant)
- Alerts`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
