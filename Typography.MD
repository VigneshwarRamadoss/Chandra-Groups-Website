# CHANDRA — Typography System

## 1. Typography Goal
The approved design uses a strong contrast between:
- **high-fashion editorial serif** for emotion and scale
- **clean geometric sans-serif** for navigation, labels, and utility text

The typography should feel premium and contemporary, not wedding-like, classical, or decorative.

## 2. Recommended Font Pair

### Display / Editorial
**Bodoni Moda**
- Use: H1, H2, featured project titles, large statements
- Weights: 400, 500
- Avoid bold/heavy weights
- Use italics sparingly, only for deliberate editorial emphasis

Google/Figma-friendly and close to the approved high-contrast luxury direction.

### UI / Utility / Body
**Manrope**
- Use: navigation, buttons, body copy, labels, stats, metadata
- Weights: 400, 500, 600

### Fallback stacks
```css
--font-display: "Bodoni Moda", "Didot", "Bodoni 72", Georgia, serif;
--font-ui: "Manrope", Inter, Arial, sans-serif;
```

## 3. Desktop Type Scale
| Style | Font | Size | Line Height | Weight | Tracking |
|---|---|---:|---:|---:|---:|
| Hero H1 | Bodoni Moda | 112–136 px | 0.86–0.92 | 400 | -0.035em |
| Section H2 | Bodoni Moda | 64–80 px | 0.94 | 400 | -0.025em |
| Feature title | Bodoni Moda | 54–68 px | 0.96 | 400 | -0.02em |
| Card title | Bodoni Moda | 28–34 px | 1.0 | 400 | -0.015em |
| Large stat | Bodoni Moda | 36–48 px | 1.0 | 400 | -0.02em |
| Body L | Manrope | 18 px | 1.6 | 400 | 0 |
| Body | Manrope | 16 px | 1.6 | 400 | 0 |
| Nav | Manrope | 12–13 px | 1 | 600 | 0.12em |
| Eyebrow | Manrope | 11–12 px | 1.2 | 600 | 0.24em |
| Button | Manrope | 11–12 px | 1 | 600 | 0.16em |
| Microcopy | Manrope | 10–11 px | 1.4 | 500 | 0.16em |

## 4. Tablet Type Scale
- Hero H1: 80–96 px
- H2: 52–64 px
- Feature title: 44–54 px
- Body: 16–17 px
- Labels/buttons: 11–12 px

## 5. Mobile Type Scale
- Hero H1: 56–68 px
- H2: 42–50 px
- Feature title: 38–44 px
- Card title: 26–30 px
- Body: 15–16 px
- Nav/menu: 13 px
- Eyebrow: 10–11 px

## 6. Copy Styling Rules
### Hero
Keep the hero headline to **2–4 words** whenever possible.
Preferred:
`MOVE PEOPLE`

Avoid:
`We create unforgettable premium events that connect audiences and brands`

### Section headings
Short, editorial, emotional.
Examples:
- `More Than Events`
- `Every Event. A New Story`
- `Experiences People Never Forget`

### Eyebrows
All caps with generous tracking.
Examples:
- `EVENTS THAT`
- `OUR PHILOSOPHY`
- `FEATURED EXPERIENCE`
- `HOW WE BRING IT TO LIFE`

## 7. Line-Length Rules
- Body text: 42–65 characters per line
- Hero headline: maximum 8–11 characters average per line where possible
- H2: 2–4 lines maximum on mobile

## 8. Letter-Spacing Rules
- Never add wide tracking to serif display headlines
- Use generous tracking only on uppercase Manrope labels
- Wordmark `CHANDRA`: Manrope 500, uppercase, **0.28–0.36em** tracking

## 9. Figma Text Styles
Create these named styles:
- `Display/Hero`
- `Display/H2`
- `Display/Feature`
- `Display/Card`
- `Display/Stat`
- `Body/Large`
- `Body/Default`
- `UI/Nav`
- `UI/Eyebrow`
- `UI/Button`
- `UI/Micro`

## 10. Typography Anti-Patterns
Do not use:
- Script fonts
- Calligraphy
- Ultra-condensed display fonts
- More than two font families
- Heavy 700–900 serif headings
- Center alignment for long body copy
- Large paragraphs over busy imagery
- Excessive italics
