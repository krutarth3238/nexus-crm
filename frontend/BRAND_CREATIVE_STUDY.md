# NEXUS CRM — Brand Identity Study & Logo Design Brief

**Target Audience for this document:** Logo Designer, Brand Identity Architect, Visual Artist.  
**Product:** NEXUS CRM — Enterprise Engineering Incident Triage & Customer Support Cockpit.

---

## 1. Brand Essence & Positioning

### 1.1 One-Sentence Summary
> **NEXUS CRM is a high-velocity, industrial-grade customer support cockpit designed for engineering-led teams to triage incidents with zero drag and sub-millisecond precision.**

### 1.2 Brand Archetype & Vibe
- **Archetype:** *The Precision Tool / Mission Control Cockpit.*
- **Keywords:** Velocity, Telemetry, Industrial, Kinetic, Razor-sharp, Functional, Reliable.
- **Personality:** Authoritative, high-density, technical, disciplined. 
- **What it is NOT:** It is *not* friendly pastel SaaS, *not* playful bouncy cartoon icons, *not* generic AI gradient blobs, and *not* a smiling customer service headset illustration.

### 1.3 The Design Ethos: "Form Follows Velocity"
Every element in the UI is structured with **1px crisp borders, monochrome architectural planes, and a single high-energy punch of Kinetic Signal Vermilion**. The logo must reflect that exact same restraint: functional geometry that looks like it belongs on aviation hardware or a mission control terminal.

---

## 2. Typography System

The logo designer should match or harmonize with these specific type families currently integrated into the product:

| Role | Font Family | Weights | Character & Feeling |
| :--- | :--- | :--- | :--- |
| **Brand Wordmark & Display** | **Bricolage Grotesque** | 700 Bold / 800 ExtraBold | Neo-grotesque with warm optical quirks, technical compression, high character. Avoids generic Inter/Helvetica look. |
| **System Interface & Labels** | **IBM Plex Sans** | 400, 500, 600, 700 | Engineered for clarity at dense sizes, corporate tech authority, zero ambiguity. |
| **Telemetry, IDs & Data** | **IBM Plex Mono** | 500 Medium, 600 SemiBold | High-precision monospace for ticket numbers (`TKT-101`), timestamps, and metric telemetry. |

### Wordmark Construction Guideline
- In the UI, the logotype is rendered as:
  **`NEXUS`** (in primary neutral) + **`.CRM`** (with `.CRM` or the dot in `#FF4400`).
- Kerning: Slightly tracked-in / tight (`-0.03em` to `-0.05em`) to emphasize density and speed.

---

## 3. Color Palette & Exact HEX Tokens

NEXUS CRM strictly adheres to **ONE Confident Accent + ONE Base Neutral Family**. There are no rainbow gradients.

### 3.1 Primary Brand Accent: Kinetic Signal Vermilion
This is the heartbeat of the identity. An uncompromising, high-visibility orange-red inspired by flight-recorder telemetry, emergency response toggles, and industrial equipment.

| Token | HEX Code | RGB | HSL | Intended Logo & Brand Use |
| :--- | :--- | :--- | :--- | :--- |
| **Accent Core** | **`#FF4400`** | `255, 68, 0` | `16°, 100%, 50%` | **Primary Logo Mark**, icon badges, active state indicators. |
| **Accent Hover / Deep** | **`#E63D00`** | `230, 61, 0` | `16°, 100%, 45%` | Press states, shadowless border accents, printed merchandise. |
| **Accent Tint (Light)** | **`#FFF1EB`** | `255, 241, 235` | `18°, 100%, 96%` | Icon background badge on light mode, watermark wash. |
| **Accent Tint (Dark)** | **`#2A130A`** | `42, 19, 10` | `17°, 62%, 10%` | Icon container tint in dark mode cockpit views. |

---

### 3.2 Dual-Mode Neutrals (Light vs. Dark Mode)

The logo mark MUST function with 100% legibility on both backgrounds:

#### Light Mode Palette (Default Canvas)
- **App Canvas Background:** `#F8F9FA` (Warm Off-White Zinc)
- **Card / Surface Background:** `#FFFFFF` (Pure Crisp White)
- **Primary Ink / Typography:** `#111827` (Deep Obsidian Charcoal, 16.5:1 contrast)
- **Secondary Ink:** `#4B5563` (Cool Muted Slate)
- **Border Structural Line:** `#E5E7EB` (Subtle 1px boundary)

#### Dark Mode Palette (Cockpit Canvas)
- **App Canvas Background:** `#0D0F12` (Deep Void Carbon)
- **Card / Surface Background:** `#15181E` (Stealth Tech Plate)
- **Primary Ink / Typography:** `#F9FAFB` (Polar White)
- **Secondary Ink:** `#9CA3AF` (Muted Steel)
- **Border Structural Line:** `#262B35` (Hairline Wireframe)

---

### 3.3 Semantic Triage Colors (Contextual Reference)
These secondary colors appear throughout the UI for ticket lifecycle states. The logo should not clash with them:
- **Open / Backlog:** `#FF4400` (Kinetic Vermilion)
- **In Progress / Investigation:** `#2563EB` (Steel Cobalt)
- **Closed / Resolved:** `#16A34A` (Precision Green)

---

## 4. Logo Concept Directions for the Designer

Here are 3 distinct design pathways the logo maker can explore:

### Direction A: The Monogram "NX" Telemetry Mark *(Current In-App Archetype)*
- **Concept:** A robust, faceted monogram combining the letters **"N"** and **"X"**.
- **Geometry:** Heavy strokes, 45-degree angle intersections, sharp 90-degree corners.
- **Physical Feel:** Resembles an aerospace stencil or an industrial laser-etched stamp.
- **Micro Form:** Scalable down to a crisp 16×16 favicon inside a rounded squircle badge (`border-radius: 6px`).

### Direction B: The Intersection / Nexus Node
- **Concept:** "Nexus" means a central link or connection point.
- **Visuals:** Two angular data paths or vectors crossing at high speed to form an abstract focal point (a spark, crosshair, or directional node).
- **Execution:** Zero soft curves. Hard diagonal cuts with the kinetic energy moving from bottom-left to top-right.

### Direction C: The Terminal Bracket / Incident Shield
- **Concept:** Combining the visual of code brackets (`>_` or `[ / ]`) with a compact industrial security seal.
- **Visuals:** Minimalist architectural frame containing the core signal dot (`#FF4400`).

### 4.4 Final Approved Identity: The Industrial Kinetic "NX" Monogram
The official production logo for NEXUS CRM has been finalized and integrated across the frontend:
- **Geometry & Structure:** A 3-piece angular vector glyph:
  1. **Left Stem & Lower-Left Arm:** A vertical spine with rounded outer corners (`r=4px`), carrying a 45° triangular negative-space notch at the baseline, transitioning seamlessly into the bottom-left diagonal arm of the "X".
  2. **Central Kinetic Bar:** A heavy 45° diagonal beam cutting cleanly from top-left to bottom-right across the full glyph height.
  3. **Upper-Right Wing:** A 45° faceted wing mirroring the lower-left arm with 180° rotational symmetry across the central axis.
- **Colorway:** Kinetic Signal Vermilion (`#FF4400`) on white or dark surfaces; knockout white (`#FFFFFF`) when embedded in tactile squircle badges.
- **Production Asset:** Vector source maintained in `/public/nexus-logo.svg` and componentized in `/src/components/common/NexusLogo.tsx`.

---

## 5. Logo Maker Guidelines: The "Do's" and "Don'ts"

###  DO
1. **Design for Scalability:** Must look razor-sharp at **16×16 px** (browser tab favicon), **32×32 px** (in-app header badge), and **512×512 px** (app store / splash screen).
2. **Monochrome Versatility:** Must work as:
   - **Full Color:** `#FF4400` on black (`#0D0F12`) or white (`#FFFFFF`).
   - **Solid Monochrome:** 100% white on dark, 100% deep black on light.
3. **Flat Geometry:** Rely on silhouette, optical negative space, and precise angles.
4. **Clean Grid Alignment:** Align to an 8px or 4px layout grid to match the UI's spacing system.

### ❌ DO NOT
1. **No Purple-to-Blue Gradients:** The brand explicitly rejects cliché tech gradients.
2. **No Generic "Helpdesk" Imagery:** No headphones, chat bubbles with smiles, telephone receivers, or life-preservers.
3. **No AI Sparkles / Stars:** The brand is an operational command cockpit, not a magic wizard tool.
4. **No Heavy Skeuomorphism or 3D Renderings:** No chrome bevels, 3D spheres, or glossy glass dropshadows.

---

## 6. Deliverable Asset Checklist for the Designer

When commissioning the logo, request the following deliverables:

1. **Primary Lockup:** Icon + Wordmark (`[NX] NEXUS.CRM`) horizontally stacked.
2. **Stacked / Vertical Lockup:** Icon centered above `NEXUS.CRM`.
3. **App Icon / Favicon Mark:** Standalone `NX` or Symbol mark enclosed in a squircle container (`6px` border-radius at 32px, `24%` radius proportionally).
4. **Colorways Required:**
   - **Light Mode Native:** Dark wordmark (`#111827`) + Vermilion Mark (`#FF4400`) on Transparent.
   - **Dark Mode Native:** White wordmark (`#F9FAFB`) + Vermilion Mark (`#FF4400`) on Transparent.
   - **High-Contrast Monochrome:** Pure `#FFFFFF` and Pure `#000000`.
   - **Inverted Badge Variant:** Solid `#FF4400` background tile with white knockout lettering.
5. **File Formats:**
   - Vector: `.SVG` (clean paths, no embedded raster), `.AI` or `.EPS`.
   - Raster: `.PNG` with transparent background (1x, 2x, 4x, and 512x512).
   - Web: `favicon.ico`, `favicon.svg`.
