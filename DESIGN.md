---
name: Trademor
description: Your Partner in Growth
colors:
  orange: "#ff7300"
  orange-text: "#cf5900"
  paper: "#faf9f6"
  ink: "#171714"
  line: "#dfdfd7"
  muted: "#66665e"
  export-surface: "#e2ded2"
  operations-surface: "#d8efe2"
  growth-surface: "#ffe3bb"
  quiet-text: "#626257"
  focus: "#276ef1"
typography:
  display:
    fontFamily: '"Sora Variable", sans-serif'
    fontSize: "clamp(48px, 5.55vw, 78px)"
    fontWeight: 600
    lineHeight: 1.095
    letterSpacing: "-0.04em"
  headline:
    fontFamily: '"Sora Variable", sans-serif'
    fontSize: "clamp(34px, 4vw, 54px)"
    fontWeight: 600
    lineHeight: 1.16
    letterSpacing: "-0.04em"
  title:
    fontFamily: '"Sora Variable", sans-serif'
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.04em"
  body:
    fontFamily: '"Sora Variable", sans-serif'
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: '"Sora Variable", sans-serif'
    fontSize: "12px"
    fontWeight: 550
rounded:
  square: "0px"
  circular: "50%"
spacing:
  compact: "8px"
  control: "17px 22px"
  service: "23px 25px 28px"
  panel: "35px 37px"
  desktop-gutter: "56px"
  mobile-gutter: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "white"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "{spacing.control}"
  button-primary-hover:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
  button-orange:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "{spacing.control}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "8px 0"
  navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  card-export:
    backgroundColor: "{colors.export-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "{spacing.service}"
---

# Design System: Trademor

## Overview

**Creative North Star: "The Growth Partner"**

The Growth Partner expresses Trademor’s supplied identity through warm paper, confident ink typography and the original orange growth arrow. Sora supplies one clear voice for Pakistani manufacturers, suppliers and business owners moving toward global trade.

The finished system is spacious and largely flat: split compositions, open editorial sections and quiet rules organize content. Service illustrations carry restrained tactile detail; dark proof sections and the orange enquiry section establish contrast without adding a second brand identity.

**Key Characteristics:**

- Original orange growth arrow and supplied logos.
- Sora throughout, with tightly tracked balanced headings.
- Warm paper, square surfaces and thin dividing rules.
- Tonal service surfaces and clear, staged enquiry controls.

## Colors

The palette combines vivid brand orange with warm paper, near-black ink and restrained tonal service surfaces. Frontmatter records the normative values extracted from the final stylesheet cascade.

### Primary

- **Brand Orange:** identity logos, arrow assets, contact background, chart accents and interactive hover fills.
- **Readable Orange:** emphasized words on warm paper; a contrast derivative rather than an asset replacement.

### Secondary

- **Export Stone:** export-service surface.
- **Operations Mint:** operations-service surface and success confirmation circle.
- **Growth Apricot:** growth-service surface, featured plan and chosen-plan summary.

### Neutral

- **Warm Paper:** page background, form panels and reversed text.
- **Ink:** headings, body text, primary actions and dark sections.
- **Quiet Rule:** paper-background borders and dividers.
- **Muted Text:** supporting paragraphs.
- **Quiet Text:** form supporting text and hero proof copy.

Focus blue is a functional keyboard-outline color, not a brand accent.

**The Brand Orange Rule.** Use original orange for identity assets and large accent surfaces; use the darker orange-text derivative for emphasized text on warm paper.

## Typography

**Display Font:** Sora Variable, with sans-serif fallback.  
**Body Font:** Sora Variable, with sans-serif fallback.

One geometric voice connects the supplied identity to the interface. Headlines use balanced wrapping, semibold weight and tight tracking; supporting copy uses regular weight and generous leading.

### Hierarchy

- **Display:** frontmatter default for desktop hero headings; the home hero moves to `clamp(39px, 10.3vw, 62px)` on mobile and 37px below 370px.
- **Headline:** frontmatter default for section headings; process, contact and dark-section headings have context-specific sizes. Contact display is 76px on desktop, 59px on mobile and 53px below 370px.
- **Title:** frontmatter default for tertiary headings; service titles are 25px on desktop and 29px on mobile, while form questions are 30px on desktop and 29px on mobile.
- **Body:** 14px is the recurring explanatory role. Hero copy is 15px on desktop; service copy is 13px on desktop and 14px on mobile. Hero paragraphs are capped at 440px; shorter section copy typically at 310–315px.
- **Label:** primary button role; desktop navigation uses 13px, open mobile navigation 15px, field labels 12px. Numeric metrics and prices use tabular figures.

**The One Typeface Rule.** Use Sora for display, body and controls; vary scale and weight rather than introducing another voice.

## Layout

A centered container has a 1320px maximum width. Horizontal gutters are 56px on desktop, 36px below 1100px, 24px below 850px and 20px below 640px. The sticky header uses a separate 1440px maximum frame and follows the same gutters.

Desktop hero, process, world and enquiry sections use two-column grids with deliberately unequal proportions where useful. Services use three columns; plan comparison uses four, then two below 850px, then one below 640px. Major section spacing commonly spans 74–100px on desktop and roughly 44–60px on mobile. These are observed contextual rhythms, not a mandatory universal scale.

Below 640px the hero and major split sections stack; service cards place the illustration above the text, and enquiry fields become one column. Navigation opens as a paper dropdown beneath the 76px header. Touch menu controls are at least 44px; enquiry choice rows become 51px high. The contact panel grows to 610px minimum height on mobile. Below 370px typography and panel padding tighten. Above 1500px illustration and panel heights expand.

## Elevation & Depth

Most interface depth comes from tonal surfaces and thin rules rather than shadows. Illustration tags and the operations stack use faint diffuse shadows; mobile navigation casts a restrained shadow when open. The final header has no backdrop blur, and the earlier illustration grid is hidden.

### Shadow Vocabulary

- **Illustration tag:** `0 4px 12px #11111107`.
- **Operations illustration:** `5px 8px 16px #214f3512`.
- **Open mobile navigation:** `0 15px 25px #00000010`.

**The Quiet Depth Rule.** Keep content surfaces flat. Reserve diffuse shadows for illustration layers and the open mobile navigation.

## Shapes

Buttons, panels, fields, service cards and plans use square corners. Circles are reserved for orbit diagrams, live dots and the success indicator. Thin borders define groups and rows; inputs use only a bottom rule. The original angled growth arrow is the signature directional geometry. Illustration labels may rotate slightly; content panels stay aligned to the grid.

## Components

### Buttons

Square, compact and direct. Primary actions use ink with white text, a matching one-pixel border and the control padding token. Default minimum height is 54px. A stroke-based up-right arrow aligns to the far edge with a 32px gap. Hover changes to orange with ink text and translates the arrow `(2px, -2px)`; pressed buttons move down 1px. Disabled buttons use 45% opacity.

The orange variant appears on dark backgrounds and hovers to pale cream (`#fff6cc`). Text actions use an underline rule and a quiet arrow. All interactive controls receive a blue 3px keyboard outline offset by 5px. Background, color and arrow movement transition over 0.2 seconds.

### Cards / Containers

Service cards use the three named tonal surfaces, square corners and the service padding token. Their default desktop minimum height is 470px; hover lifts the card 5px over 0.25 seconds without adding a shadow. Titles sit above supporting copy and a ruled bottom action. Service illustration details remain part of the illustration rather than general container styling.

Plans form a continuous bordered grid with dividing rules; the featured plan uses growth apricot. Enquiry panels use warm paper and the panel padding token rather than a floating card treatment.

### Inputs / Fields

Transparent square fields have an understated bottom border (`#bfbfb3`), ink text and muted placeholder text (`#69695e`). Desktop entry text is 15px; mobile entry text is 16px. The focus outline is shared with buttons and links. Error copy is warm red (`#ac2300`); do not infer an additional invalid-field border variant from this text state.

### Navigation

A sticky warm-paper header uses a quiet bottom border and horizontal links. Default links use ink, medium weight and no underline; hover and current-page links use a darker orange (`#b34e00`). On mobile, a menu button opens stacked, divided links. Header translucency is retained, while blur is explicitly removed by the final source override.

### Staged Enquiry

Three thin progress segments and the actual `01 / 03` counter communicate current progress. Completed segments use brand orange. Choice rows have a one-pixel border, square corners and a far-edge SVG arrow or check; selection changes the fill to warm gray (`#efeee8`) and the border to ink. Next actions are full-width where appropriate. Success uses a mint circle and a real reference number. Step changes move focus to the current question, without a decorative focus outline on that heading.

## Do's and Don'ts

### Do:

- **Do** preserve the supplied logos and growth arrow.
- **Do** pair orange surfaces with ink text and paper text with ink surfaces.
- **Do** keep process numbers and form progress tied to actual sequence.
- **Do** maintain visible keyboard focus and reduced-motion behavior.
- **Do** retain comfortable mobile control heights and the single-column mobile form.

### Don't:

- **Don’t** recolor identity assets with the darker text derivative.
- **Don’t** reintroduce decorative heading preludes or unrelated numbering.
- **Don’t** use hard offset shadows as a reusable surface style.
- **Don’t** turn decorative illustration labels into a body-text size standard.
