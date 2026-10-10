---
name: UI Standards
description: This file describes the UI standards and guidelines for the project. Read this before making any UI-related changes.
---

# UI Standards

These rules govern every user-facing interface change in this application.

## Authority

- This app uses shadcn/ui as the single UI primitive system.
- All visible interface elements must be built from shadcn components or the existing shadcn primitives under `components/ui/`.
- Tailwind utility classes may be used for layout, spacing, and styling only. They do not replace a missing shadcn component.
- Do not create custom React components for reusable UI patterns, especially buttons, inputs, cards, dialogs, forms, menus, tabs, alerts, badges, tables, or other interface elements.

## Required Pattern

- Prefer the installed shadcn component library under `components/ui/`.
- Import from the app's shadcn aliases, such as `@/components/ui/...`.
- Use the project's existing shadcn styles, design tokens, and CSS variables instead of introducing ad hoc styling.
- Keep composition simple: assemble interfaces from shadcn primitives instead of creating new wrapper components.

## Prohibited

- Hand-written custom button, card, input, modal, dialog, badge, dropdown, form, table, or action component files.
- Recreating a shadcn component with different naming or custom behavior in a new file.
- Styling a raw HTML element as a replacement for a shadcn component when a shadcn equivalent exists.
- Adding UI or control logic to non-shadcn wrapper components that duplicate shadcn patterns.

## Allowed

- Native HTML elements only for semantic layout such as `main`, `section`, `header`, `footer`, `nav`, `ul`, `li`, `form`, and `button` when they are not being treated as styled design primitives.
- Tailwind layout utilities for spacing, alignment, grid/flex structure, color usage, and responsive behavior.
- Existing shadcn primitives already present in `components/ui/`.
- Adding a new shadcn component only through the project-approved shadcn pattern or generated component command when the app truly needs it.

## Implementation Boundaries

- `components/ui/` is the only location for reusable UI building blocks.
- `app/` should consume shadcn components directly or compose them with layout utilities.
- `lib/` and other folders must not define custom visual components.
- Keep component logic minimal and aligned with shadcn conventions; do not invent alternative component APIs.

## Design Rules

- Dark mode is the app's only supported appearance. Keep the app in dark mode at all times; do not add a light theme, system-preference switching, or a theme toggle.
- Ensure the root document always activates the existing `.dark` theme, and use the dark theme tokens for all surfaces, text, borders, and controls. Do not rely on the user's operating-system preference to activate dark mode.
- Match the active shadcn theme and tokens already configured in the app.
- Use consistent spacing, rounded corners, borders, focus rings, and motion patterns defined by the existing shadcn design system.
- Favor shadcn's documented patterns for accessibility, keyboard support, focus states, and semantic structure.
- If a UI requirement cannot be met by an existing shadcn primitive, add the missing shadcn component rather than writing a custom one.

## Required Verification

After every source-code change, whether or not it appears UI-related, run the app and verify that it still renders in dark mode. Confirm the root document activates `.dark` and that the page background and foreground use the dark theme; repeat this check after any fixes. Also run the narrowest relevant check for the change and `npm run lint`.

## Change Checklist

Before considering a UI change complete, verify:

- The app remains in dark mode after the change, with no light-mode or system-preference fallback.
- Every visible control is built from shadcn ui or the existing project-level shadcn primitives.
- No custom component was introduced for a button, form control, modal, card, or other interface element.
- Existing `components/ui/` patterns were reused where possible.
- Tailwind is used for layout/styling only, not as a substitute for shadcn primitives.
- No duplicate or parallel component system was added.
- `npm run lint` pass check
