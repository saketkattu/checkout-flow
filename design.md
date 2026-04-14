# Design System Inspired by Xflow

## 1. Visual Theme & Atmosphere

Xflow's design system embodies the precision and trustworthiness required of a global fintech infrastructure brand. The visual language is rooted in a deep navy-indigo palette that conveys authority and security, juxtaposed against clean, luminous white surfaces that signal clarity and simplicity. The dark hero sections create dramatic, immersive entry points with subtle gradient overlays and glassmorphic card elements that evoke a sense of modern financial technology, while the light content sections below provide a crisp, breathable reading experience. Typography is ultra-refined — using the geometric sans-serif TWKLausanne at notably light weights (200–300 for headings) to achieve an elegant, editorial quality that feels premium without being ostentatious. The overall impression is of a sophisticated API-first platform: technically capable yet visually approachable, with restrained use of color and an emphasis on spatial harmony and information hierarchy.

**Key Characteristics**
- Deep navy-to-indigo dark mode hero sections with glassmorphic UI card illustrations
- Ultra-light typographic weight (200–300) for headings creating an airy, modern feel
- Cool-toned neutral palette built on slate-blues rather than pure grays
- Minimal accent color usage — relying on structural hierarchy rather than color decoration
- Generous whitespace and large section padding for a premium, unhurried reading pace
- Subtle, diffused shadows with blue-tinted undertones matching the overall palette
- Two-tone page structure: dark immersive sections alternating with bright informational sections
- Clean card-based content layout with soft radius and delicate elevation

## 2. Color Palette & Roles

### Primary
- **Navy Core** (`#1F2741`): Primary brand color, dominant text color on light backgrounds, dark section backgrounds, navigation text
- **Deep Indigo** (`#2D3C83`): Primary interactive color, CTA button backgrounds, link hover states, accent highlights
- **Midnight** (`#12141D`): Deepest background used for immersive hero sections and footer areas

### Accent Colors
- **Soft Lavender** (`#E4E9FF`): Light accent for tags, badges, highlighted sections, and subtle background tints
- **Muted Sage** (`#DAEEDF`): Success-adjacent accent for positive status indicators, confirmation badges, and payment-received highlights
- **Periwinkle Mist** (`#E8E8F8`): Secondary surface accent for alternating card backgrounds and hover states

### Interactive
- **Deep Indigo** (`#2D3C83`): Primary CTA button fill, active navigation underline
- **Navy Core** (`#1F2741`): Default text links on light backgrounds, ghost button text
- **Slate Blue** (`#4D5578`): Secondary body text, descriptive copy, form labels
- **Steel Lavender** (`#818BAF`): Placeholder text, disabled states, tertiary information

### Neutral Scale
- **Black** (`#000000`): Reserved for maximum contrast contexts (rarely used)
- **Navy Core** (`#1F2741`): Primary text (de facto black equivalent within the brand palette)
- **Slate Blue** (`#4D5578`): Secondary text and descriptions
- **Steel Lavender** (`#818BAF`): Tertiary text, metadata, timestamps
- **Pale Indigo** (`#CCD2E9`): Muted text on dark backgrounds, icon fills on dark sections
- **Silver** (`#CDCDCD`): Disabled elements, divider lines in neutral contexts

### Surface & Borders
- **Ice Lavender** (`#E7EBF8`): Primary border color, divider lines, card outlines, input field borders
- **Ghost White** (`#F8F9FD`): Light section backgrounds, alternating row fills, subtle surface tint
- **Near White** (`#FEFEFE`): Card backgrounds, elevated content surfaces
- **Pure White** (`#FFFFFF`): Page background, modal backgrounds, input field fills

### Semantic / Status
- **Muted Sage** (`#DAEEDF`): Success / payment confirmed states
- **Deep Indigo** (`#2D3C83`): Informational highlights and active states
- **Steel Lavender** (`#818BAF`): Neutral / pending status indicators

### Shadow Colors
- **Card Shadow** (`rgba(129, 139, 175, 1.0)`): Cool-toned shadow base for elevated cards
- **Inset Glow** (`rgba(204, 210, 233, 0.36)`): Subtle inner shadow for recessed surfaces
- **Dropdown Shadow** (`rgba(11, 27, 84, 0.13)`): Deep indigo-tinted shadow for floating elements

## 3. Typography Rules

### Font Family
- **Primary**: `'TWKLausanne', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`
- **Monospace** (code/data): `'SF Mono', 'Fira Code', 'Cascadia Mono', Consolas, monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|---|---|---|---|---|---|---|
| Display / Hero H1 | TWKLausanne | 48px | 200 | 56px | `-0.02em` | Ultra-light for dramatic hero headlines |
| Section H2 | TWKLausanne | 32px | 300 | 36px | `-0.01em` | Light weight for section titles |
| Subsection H3 | TWKLausanne | 24px | 400 | 32px | `0em` | Regular weight for card titles and subsections |
| Card Title H4 | TWKLausanne | 32px | 200 | 36px | `-0.01em` | Ultra-light variant for large card headings |
| Body | TWKLausanne | 16px | 300 | 24px | `0em` | Light weight for paragraph text, descriptions |
| Body Emphasis | TWKLausanne | 16px | 400 | 24px | `0em` | Regular weight for inline emphasis, nav items |
| Button Label | TWKLausanne | 16px | 400 | 24px | `0.01em` | Regular weight with slight tracking for CTAs |
| Link | TWKLausanne | 16px | 400 | 24px | `0em` | Regular weight, underline on hover |
| Small / Caption | TWKLausanne | 14px | 400 | 20px | `0.01em` | Metadata, timestamps, helper text |
| Overline / Label | TWKLausanne | 12px | 500 | 16px | `0.06em` | Uppercase labels, tag text, badges |
| Code / Data | SF Mono | 14px | 400 | 20px | `0em` | Account numbers, transaction amounts |

### Principles
- Lean into ultra-light weights (200) for large display text to create a premium, editorial feel that distinguishes Xflow from typical bold fintech branding
- Use weight variation (200→300→400→500) rather than size variation as the primary hierarchy mechanism
- Maintain consistent 16px body size across the entire system — hierarchy comes from weight and context, not proliferation of sizes
- Negative letter-spacing on larger headings to maintain visual density at light weights
- Line heights follow a ~1.15–1.5× ratio: tighter for headings (1.12×), more generous for body (1.5×)

## 4. Component Stylings

### Buttons

**Primary CTA (Dark Fill)**
- `background-color`: `#2D3C83`
- `color`: `#FFFFFF`
- `font-family`: `'TWKLausanne', sans-serif`
- `font-size`: `16px`
- `font-weight`: `400`
- `line-height`: `24px`
- `letter-spacing`: `0.01em`
- `padding`: `12px 24px`
- `border-radius`: `8px`
- `border`: `none`
- `box-shadow`: `none`
- `cursor`: `pointer`
- **Hover**: `background-color`: `#1F2741`; `box-shadow`: `rgba(11, 27, 84, 0.13) 0px 4px 16px 0px`
- **Active**: `background-color`: `#12141D`
- **Disabled**: `background-color`: `#CCD2E9`; `color`: `#818BAF`; `cursor`: `not-allowed`

**Secondary (Outlined)**
- `background-color`: `transparent`
- `color`: `#1F2741`
- `font-family`: `'TWKLausanne', sans-serif`
- `font-size`: `16px`
- `font-weight`: `400`
- `line-height`: `24px`
- `padding`: `12px 24px`
- `border-radius`: `8px`
- `border`: `1px solid #1F2741`
- `box-shadow`: `none`
- **Hover**: `background-color`: `#F8F9FD`; `border-color`: `#2D3C83`; `color`: `#2D3C83`
- **Active**: `background-color`: `#E7EBF8`
- **Disabled**: `border-color`: `#CCD2E9`; `color`: `#CCD2E9`; `cursor`: `not-allowed`

**Ghost (Text-only)**
- `background-color`: `transparent`
- `color`: `#1F2741`
- `font-family`: `'TWKLausanne', sans-serif`
- `font-size`: `16px`
- `font-weight`: `400`
- `line-height`: `24px`
- `padding`: `0px`
- `border-radius`: `0px`
- `border`: `none`
- `box-shadow`: `none`
- **Hover**: `color`: `#2D3C83`; `text-decoration`: `underline`
- **Active**: `color`: `#12141D`

**Primary CTA on Dark Background**
- `background-color`: `#FFFFFF`
- `color`: `#1F2741`
- `font-size`: `16px`
- `font-weight`: `400`
- `padding`: `12px 24px`
- `border-radius`: `8px`
- `border`: `none`
- **Hover**: `background-color`: `#E7EBF8`

### Cards & Containers

**Content Card (Elevated)**
- `background-color`: `#FEFEFE`
- `color`: `#1F2741`
- `font-family`: `'TWKLausanne', sans-serif`
- `padding`: `8px`
- `border-radius`: `12px`
- `border`: `none`
- `box-shadow`: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(129, 139, 175) 0px 1px 10px -4px`
- **Hover**: `box-shadow`: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(11, 27, 84, 0.13) 0px 8px 50px 0px`; `transform`: `translateY(-2px)`
- `transition`: `box-shadow 0.25s ease, transform 0.25s ease`

**Feature Card (Inset)**
- `background-color`: `#F8F9FD`
- `color`: `#1F2741`
- `padding`: `24px`
- `border-radius`: `20px`
- `border`: `none`
- `box-shadow`: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(204, 210, 233, 0.36) 0px 0px 6px 0px inset`

**Dark Section Card (Glassmorphic)**
- `background-color`: `rgba(31, 39, 65, 0.6)`
- `color`: `#CCD2E9`
- `padding`: `24px`
- `border-radius`: `20px`
- `border`: `1px solid rgba(204, 210, 233, 0.15)`
- `backdrop-filter`: `blur(12px)`
- `box-shadow`: `rgba(11, 27, 84, 0.2) 0px 8px 32px 0px`

**Section Container**
- `background-color`: `transparent`
- `padding`: `0px 0px 0px 40px` (left-padded for text-media layouts)
- `border-radius`: `0px`
- `border`: `none`

### Inputs & Forms

**Text Input**
- `background-color`: `#FFFFFF`
- `color`: `#1F2741`
- `font-family`: `'TWKLausanne', sans-serif`
- `font-size`: `16px`
- `font-weight`: `300`
- `line-height`: `24px`
- `padding`: `12px 16px`
- `border-radius`: `8px`
- `border`: `1px solid #E7EBF8`
- `box-shadow`: `none`
- **Placeholder**: `color`: `#818BAF`
- **Focus**: `border-color`: `#2D3C83`; `box-shadow`: `0 0 0 3px rgba(45, 60, 131, 0.12)`; `outline`: `none`
- **Error**: `border-color`: `#C53030`; `box-shadow`: `0 0 0 3px rgba(197, 48, 48, 0.1)`
- **Disabled**: `background-color`: `#F8F9FD`; `color`: `#CCD2E9`; `cursor`: `not-allowed`

**Input Label**
- `color`: `#4D5578`
- `font-size`: `14px`
- `font-weight`: `400`
- `line-height`: `20px`
- `margin-bottom`: `8px`

### Navigation

**Top Navigation Bar**
- `background-color`: `#12141D` (dark hero) / `#FFFFFF` (light sections)
- `padding`: `16px 48px`
- `height`: `64px`
- `border-bottom`: `none` (dark) / `1px solid #E7EBF8` (light, on scroll)
- `position`: `sticky`
- `top`: `0`
- `z-index`: `100`

**Nav Link (Default)**
- `color`: `#4D5578` (light bg) / `#CCD2E9` (dark bg)
- `font-family`: `'TWKLausanne', sans-serif`
- `font-size`: `16px`
- `font-weight`: `400`
- `line-height`: `24px`
- `padding`: `0px`
- `text-decoration`: `none`
- **Hover**: `color`: `#1F2741` (light bg) / `#FFFFFF` (dark bg)
- **Active**: `color`: `#1F2741`; `text-decoration`: `underline`; `text-underline-offset`: `4px`

**Nav CTA Button (Sign up)**
- `background-color`: `#2D3C83`
- `color`: `#FFFFFF`
- `font-size`: `16px`
- `font-weight`: `400`
- `padding`: `8px 20px`
- `border-radius`: `8px`
- `border`: `none`
- **Hover**: `background-color`: `#1F2741`

### Badges & Tags

**Status Badge**
- `background-color`: `#DAEEDF`
- `color`: `#1F2741`
- `font-size`: `12px`
- `font-weight`: `500`
- `line-height`: `16px`
- `padding`: `4px 12px`
- `border-radius`: `8px`
- `letter-spacing`: `0.02em`

**Info Badge**
- `background-color`: `#E4E9FF`
- `color`: `#2D3C83`
- `font-size`: `12px`
- `font-weight`: `500`
- `padding`: `4px 12px`
- `border-radius`: `8px`

### Dropdown / Flyout Menu

- `background-color`: `#FFFFFF`
- `padding`: `12px 0px`
- `border-radius`: `12px`
- `border`: `1px solid #E7EBF8`
- `box-shadow`: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(11, 27, 84, 0.13) 0px 8px 50px 0px`

**Dropdown Item**
- `padding`: `8px 16px`
- `color`: `#1F2741`
- `font-size`: `16px`
- `font-weight`: `300`
- **Hover**: `background-color`: `#F8F9FD`

## 5. Layout Principles

### Spacing System
Base unit: `4px`. The scale is built on 4px increments with preferred stops:

- `4px`: Inline icon-to-text gaps, tight badge padding
- `8px`: Card inner padding, compact element spacing
- `12px`: Button vertical padding, input padding, small component gaps
- `16px`: Standard component padding, paragraph spacing, nav bar vertical padding
- `20px`: Medium gap between related elements
- `24px`: Section-internal padding, card content padding, space between heading and body
- `32px`: Gap between card groups, between content blocks
- `40px`: Major section left padding, asymmetric layout offsets
- `48px`: Navigation horizontal padding, large section inner padding
- `56px`: Gap between feature sections
- `60px`: Large vertical spacing between major sections
- `80px`: Hero section vertical padding, major section separators

### Grid & Container
- **Max width**: `1200px` (centered with `margin: 0 auto`)
- **Column strategy**: Fluid two-column split layout (text + illustration) as primary pattern, with `486px` text column and `713px` media column at full width
- **Card grid**: 2-column grid for feature cards at `326px` each with `32px` gap
- **Section pattern**: Full-bleed background color with centered max-width content container; alternating dark (`#12141D`) and light (`#F8F9FD` / `#FFFFFF`) sections
- **Side padding**: `48px` at desktop, collapsing to `24px` on tablet and `16px` on mobile

### Whitespace Philosophy
Xflow uses generous, deliberate whitespace to create a sense of premium quality and reduce cognitive load. Sections are separated by significant vertical space (60–80px) to let each proposition breathe independently. Within sections, a tighter but still comfortable rhythm (24–32px) groups related content. The asymmetric text-media split layout uses the rightward visual weight of illustrations to balance the leftward alignment of text, creating dynamic but controlled compositions.

### Border Radius Scale
- `0px`: Navigation links, ghost buttons, full-width section containers
- `8px`: Buttons, input fields, badges, small interactive elements
- `12px`: Content cards, dropdown menus, small containers
- `20px`: Feature cards, large containers, dark section glassmorphic cards, illustration wrappers

## 6. Depth & Elevation

| Level | Treatment | Use |
|---|---|---|
| Level 0 (Flat) | No shadow, no border | Page background, inline text, flat sections |
| Level 1 (Inset) | `rgba(204, 210, 233, 0.36) 0px 0px 6px 0px inset` | Recessed surfaces, feature card backgrounds, subtle container depth |
| Level 2 (Resting) | `rgb(129, 139, 175) 0px 1px 10px -4px` | Content cards at rest, product illustration cards |
| Level 3 (Raised) | `rgba(11, 27, 84, 0.13) 0px 8px 50px 0px` | Dropdown menus, hovered cards, floating modals, elevated UI |
| Level 4 (Glassmorphic) | `rgba(11, 27, 84, 0.2) 0px 8px 32px 0px` + `backdrop-filter: blur(12px)` | Dark section overlay cards, hero illustration elements |

Xflow's shadow philosophy is distinctly cool-toned — every shadow uses blue-indigo tints rather than neutral black, which keeps the elevation system harmonious with the overall color palette. Shadows are wide and diffused rather than tight and harsh, creating a floating, ethereal quality. The inset shadow (Level 1) is a unique choice that adds depth without elevation, creating recessed "wells" for feature content. The glassmorphic Level 4 is reserved exclusively for dark hero sections where it creates the signature layered financial dashboard aesthetic.

## 7. Do's and Don'ts

### Do
- Use weight 200 for hero headlines and weight 300 for body text — the ultra-light aesthetic is core to the brand identity
- Maintain the two-tone page structure: dark immersive hero → light informational sections → dark footer
- Use `#1F2741` as the de facto text color everywhere on light backgrounds instead of pure black
- Apply cool-toned blue shadows (`#818BAF`, `rgba(11, 27, 84, ...)`) rather than neutral gray/black shadows
- Keep CTAs restrained — one primary CTA per section, placed below descriptive text
- Use `#F8F9FD` for subtle background differentiation between adjacent white sections
- Pair large text (48px) with light weight (200) and small text (16px) with regular weight (400) for natural hierarchy
- Maintain generous section spacing (60–80px vertical) to create the premium, unhurried feel
- Use the glassmorphic card style only within dark sections where the contrast and blur effect is meaningful

### Don't
- Don't use pure `#000000` for text — always use `#1F2741` to stay within the brand's tonal palette
- Don't apply heavy font weights (600, 700, 800) for headings — the system maxes out at 500 for overlines
- Don't use warm-toned shadows or borders; the entire elevation system is built on cool indigo tints
- Don't overcrowd sections with multiple CTAs — the brand uses minimal, intentional call-to-action placement
- Don't use `border-radius` greater than `20px` — the system avoids pill shapes and fully rounded corners
- Don't place glassmorphic/translucent cards on light backgrounds where the blur effect has no visual payoff
- Don't use bright, saturated accent colors (no electric blues, greens, or oranges) — the palette is deliberately muted and cool
- Don't reduce section padding below `48px` vertical on desktop — whitespace is a feature, not wasted space
- Don't mix the dark section card style with light section cards; each has its own distinct visual language

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Desktop XL | ≥ `1280px` | Max-width container centered, full two-column split layouts, `48px` side padding |
| Desktop | `1024px` – `1279px` | Two-column layouts maintained, columns flex proportionally, `48px` side padding |
| Tablet | `768px` – `1023px` | Two-column splits stack vertically (text above media), card grid reduces to 1-column, `24px` side padding |
| Mobile L | `480px` – `767px` | Single-column everything, hero headline drops to `36px`/weight 200, `16px` side padding, nav collapses to hamburger |
| Mobile S | < `480px` | Hero headline `32px`, section padding reduces to `40px` vertical, cards fill full width with `12px` padding |

### Touch Targets
- Minimum interactive target size: `44px × 44px` (per WCAG 2.5.5)
- Button minimum height: `48px` (including padding)
- Navigation hamburger icon tap area: `48px × 48px`
- Dropdown menu item height: `44px` minimum
- Form input height: `48px` minimum on mobile
- Inline text links: ensure surrounding padding creates a `44px` effective touch zone

### Collapsing Strategy
- **Navigation**: Horizontal link bar collapses to a hamburger menu icon at `768px`. Mobile menu opens as a full-screen overlay with `#12141D` background and vertically stacked links at `20px` font size
- **Hero sections**: Two-column text + illustration splits stack vertically below `1024px`, with text block appearing first and illustration below. Hero vertical padding reduces from `80px` to `48px`
- **Card grids**: 2-column feature card grids collapse to single-column at `768px`. Cards maintain `12px` border-radius and full-width behavior
- **Typography**: H1 scales from `48px` → `36px` → `32px` across breakpoints. H2 scales from `32px` → `28px` → `24px`. Body remains `16px` at all sizes
- **Section spacing**: Vertical section gaps reduce from `80px` → `60px` → `40px` across breakpoints
- **Dark section illustrations**: On mobile, complex glassmorphic card stacks simplify to show fewer layers or are replaced with a single representative card

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA**: Deep Indigo (`#2D3C83`)
- **CTA on dark bg**: Pure White (`#FFFFFF`)
- **Page background**: Pure White (`#FFFFFF`)
- **Dark section background**: Midnight (`#12141D`)
- **Light section background**: Ghost White (`#F8F9FD`)
- **Card background**: Near White (`#FEFEFE`)
- **Heading text (light bg)**: Navy Core (`#1F2741`)
- **Body text (light bg)**: Slate Blue (`#4D5578`)
- **Muted text (light bg)**: Steel Lavender (`#818BAF`)
- **Text on dark bg**: Pale Indigo (`#CCD2E9`)
- **Primary border**: Ice Lavender (`#E7EBF8`)
- **Success accent**: Muted Sage (`#DAEEDF`)
- **Info accent**: Soft Lavender (`#E4E9FF`)
- **Hover / focus ring**: Deep Indigo at 12% opacity (`rgba(45, 60, 131, 0.12)`)

### Iteration Guide

1. **Always use `#1F2741` as primary text color** — never `#000000`. This navy-core color is the backbone of the entire visual system and appears 430+ times across the site.

2. **Set headings to weight 200–300 and body to weight 300–400.** The ultra-light heading weight is the single most distinctive visual trait of the Xflow brand. Do not use bold (600+) anywhere in the heading hierarchy.

3. **Use TWKLausanne as the sole typeface.** If unavailable, fall back to `-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`. Do not introduce a secondary display font.

4. **Apply the two-tone page rhythm:** dark hero (`#12141D`) → light content (`#FFFFFF` / `#F8F9FD`) → dark footer. Each section transition should have no visible border — the color change alone creates separation.

5. **Build cards with the three-tier system:** Elevated cards on white (`#FEFEFE`, `12px` radius, subtle cool shadow) → Feature cards on ghost white (`#F8F9FD`, `20px` radius, inset shadow) → Glassmorphic cards on dark (`rgba(31,39,65,0.6)`, `20px` radius, blur + border).
