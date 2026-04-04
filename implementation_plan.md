# AI Usage Portal Renewal Plan

Complete renewal of the current site into a portal for AI usage, specifically targeting beginners (low-entry users).

## Team Personas & Roles

| Persona | Role & Responsibility | Initial Vision / Tasks |
| :--- | :--- | :--- |
| **AI Analyst** | Researching latest AI agents, comparing costs, determining best use cases, and content structure. | "I'll curate the most entry-level-friendly AI tools and create a matrix comparing ChatGPT, Gemini, and Claude specifically for beginners." |
| **Web Designer** | Visual identity (modern, premium), UI/UX for the portal, dark mode, responsive layout. | "I'll design a 'Gateway' experience that feels high-tech yet welcoming, using soft glows and clear typography to avoid overwhelming new users." |
| **Front-end Engineer** | Next.js implementation, React components, state management, animations (Framer Motion). | "I'll build a performant, i18n-ready frontend with smooth transitions and 'wow' animations to represent the cutting edge of AI." |
| **Back-end Engineer** | Content API (Markdown/CMS), multi-language data fetching, potentially integration with search. | "I'll set up a robust localization-first architecture to ensure seamless switching between JP and EN content." |
| **Marketer** | SEO strategy ("AIの使い方", "初心者向けAIエージェント"), funnel design, landing page optimization. | "I'll focus on 'solving user pain points' through SEO, targeting keywords that beginners use when they're lost in the AI wave." |
| **Tester** | Cross-browser testing, multilingual verification (JP/EN), mobile responsiveness audit. | "I'll ensure the complex animations and i18n switching work perfectly across all devices, leaving no user behind." |

## Site Structure (Proposed)

We will transition the current folder-based structure to a locale-prefixed structure:

| Path | Purpose | Content |
| :--- | :--- | :--- |
| `/` | Multi-locale dispatcher | Automatically redirect based on browser language. |
| `/[lang]/` | Home | Featured Guides, "Pick your first AI", and Latest News. |
| `/[lang]/getting-started` | Onboarding | Step-by-step setup guides for agents (OpenAI, Google, Anthropic). |
| `/[lang]/tools` | Tool Catalog | Comprehensive list of AI tools, filtered by "Purpose" and "Cost". |
| `/[lang]/pricing` | Cost Guide | Comparison of Free vs Pro vs Enterprise plans. |
| `/[lang]/use-cases` | practical | "AI for writing", "AI for data analysis", etc. |

## Proposed Changes

### [Architectural Pivot]
The current codebase will be audited. Any legacy WordPress-dependent scripts or files that do not serve the new "AI Usage Portal" purpose will be archived or removed in favor of a clean, modern Next.js architecture.

### [UI/UX Concept]
- **Theme**: "The Gateway to AI" - Clean, futuristic, but accessible.
- **Color Palette**: Cyber blue, Slate dark backgrounds, Glassmorphism accents.
- **Core Navigation**:
  - `Getting Started` (Initial settings, etc.)
  - `Tool Catalog` (ChatGPT, Gemini, Claude, and Agent-specific tools)
  - `Comparison & Pricing` (Free vs Paid, Enterprise vs Solo)
  - `Use Cases` (Writing, Coding, Image Gen,## Proposed Changes

### [Component] Intro Sequence (`src/components/IntroSequence.tsx`)

#### [MODIFY] Typewriter & Typography:
- **Typewriter Effect**: Implement a logic to reveal "BE THE FRONTIER" character by character during the 2s fade-in phase.
- **Bolder Font**: Switch to the thickest available font weight (e.g., *Impact* or *Arial Black* system feeling, or a custom Bold Sans).
- **Phased Progress**: Ensure the typewriter ends before the "Sustain" phase (2-6s) begins.

***

### [Component] GLSL Shaders (`src/lib/shaders.ts`)

#### [MODIFY] Noise & Glitch:
- Ensure the `glitchTransitionShader` complements the typewriter reveal with micro-flickers.

#### [MODIFY] Contrast & Scaling:
- **Red Contrast**: Revert thermal effects to the Red palette.
- **SP Scaling**: Precise adjustment of font sizes to ensure the "Cramped" but "Beautifully Broken" look.

### [Next.js Structure]
#### [NEW] `src/app/[locale]/...`
Implementing internationalization (i18n) from the start. Support for `ja` and `en`.

#### [NEW] `src/components/ui/...`
High-quality, reusable UI components following the "Web Application Development" guidelines (Premium aesthetics).

## Verification Plan

### Automated Tests
- `npm run lint` & `npm run build` to ensure project integrity.
- E2E tests for navigation between Japanese and English pages.

### Manual Verification
1. **AI Analyst Review**: Ensure the tool comparison data is accurate.
2. **Designer Review**: Check if the UI meets "Premium" standards across resolutions.
3. **Tester Audit**: Verify mobile responsiveness and correct i18n switching.
