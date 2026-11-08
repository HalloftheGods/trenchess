# Trenchess Glow-Up Style Guide

Goal: make web Trenchess (`/home/xopher/www/x/battle-chess`, React 19 / TS / Vite / Tailwind 4 / boardgame.io) read as a sibling of **Undead of Night: Last Round**, a Hall of the Gods, Inc. game.

Source of truth for every Undead of Night (UoN) fact below: `/home/xopher/www/x/Xophz-COMPASS/apps/zombie-survival/` (Vue 3, "UoN" from here on). Paths are relative to that folder unless they start with `/`. Everything was read from source; nothing was run or screenshotted. Pixel/animation behaviour that I describe from CSS has not been seen live.

---

## 1. The Hall of the Gods splash (what to port)

### Files
| Role | Path |
|---|---|
| Component (markup, CSS, skip logic) | `src/components/StudioSplash.vue` |
| Timing + skip-query + asset path + copyright line | `src/game/studio-splash.ts` |
| Mounted in | `src/App.vue` (last child of `<main class="game-root">`, `v-if="splashing"`, `@done="splashing = false"`) |
| Logo asset | `public/brand/hall-of-the-gods.webp` |
| Reduced-motion source | `src/game/motion.ts`, `src/game/motion-pref.ts` |
| Reused on title footer | `src/components/TitleScreen.vue` (small logo + `STUDIO_LINE`) |
| Font | `@fontsource/silkscreen` 400 + 700, imported in `src/main.ts` |

### Behaviour
- Full-screen fixed layer, `z-index: 100`, `background: #000`, `cursor: pointer`, `role="img"`, `aria-label="Presented by Hall of the Gods, Inc."`.
- Content, centred column: gold logo, then `PRESENTED BY` (Silkscreen, 0.85rem, letter-spacing .18em, uppercase, `#d9c27a`, opacity .85), then `Hall of the Gods, Inc.` (Silkscreen, `clamp(1.1rem, 4.6vmin, 1.6rem)`, `#ffd75e`, `text-shadow: 0 0 8px rgba(255,215,94,.5), 2px 2px 0 #4a3300`).
- Logo: `width: clamp(9rem, 38vmin, 16rem)`; `filter: drop-shadow(0 0 10px rgba(255,215,94,.6)) drop-shadow(0 0 28px rgba(224,160,32,.3))`.
- Phases `in -> hold -> out`. Mark starts `opacity 0, scale(.96)`, eases to `1 / scale(1)`; on exit goes to `opacity 0, scale(1.02)`.
- **Timing** (`splashTimings`): normal = fade-in **400 ms**, hold **1600 ms**, fade-out **500 ms** (about 2.5 s total, then `done` fires). Reduced motion = no fades, **1000 ms** hold.
- **Skip:** any `keydown` or `pointerdown`, listened on `window` in capture phase, calls `stopPropagation()` so the key does not also start the game, then `game.greet()` and starts the fade-out (ignored if already leaving).
- **Skip entirely:** `?nosplash` in the URL (`shouldShowSplash`).
- **Audio:** the splash plays **no sound of its own**. `game.greet()` is the first user gesture and only wakes/unlocks the audio engine (`src/game/sound-unlock.ts`). The only sound near it is the title music and UI blips afterwards.
- **CRT overlay** `.splash-scanlines` (z-index 2, `pointer-events: none`, `mix-blend-mode: multiply`): `repeating-linear-gradient(to bottom, transparent 0 2px, rgba(0,0,0,.28) 3px 4px)` plus `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.65) 100%)` vignette.
- **Logo asset caveat:** `hall-of-the-gods.webp` is a smooth, photoreal 3D brushed-gold Greek capital omega on a roughly 1:1 canvas, NOT pixel art. I viewed it once and could not confirm an alpha channel or its exact pixel size. Check before reuse. The splash is the one place UoN breaks pixel rules, and the glow is what sells it. Keep it that way: do not pixelate it.
- Footer credit on the title: `STUDIO_LINE = '© 2026 Hall of the Gods, Inc.'` with a ~14 px copy of the omega.
- Note: Trenchess's `index.html` already carries `data-copyright="Hall of the Gods, Inc. 2006-2026"`. Pick one wording across both games (UoN says "© 2026"; Trenchess says "2006-2026"). Commander decision.

### Porting plan for Trenchess (no code written yet)
- Copy `public/brand/hall-of-the-gods.webp` to `battle-chess/public/brand/`.
- New `src/shared/components/organisms/StudioSplash.tsx` + `src/shared/utilities/studioSplash.ts` (timings, `shouldShowSplash`, `?nosplash`). Mount in `src/trenchess.tsx` outside `<RouterProvider>` (or in `src/app/App.tsx`) so it covers the first route, not per-route. Show once per page load, not on every navigation.
- Same capture-phase skip, same 400/1600/500, same reduced-motion path (`prefers-reduced-motion` plus a Trenchess setting if one is added).
- Do not use a Tailwind blur/backdrop effect here; plain CSS block as in the UoN file.

---

## 2. UoN style tokens (extracted)

### 2.1 UI palette (`src/components/pixel-ui.css`, `:root`)
| Token | Hex | Use |
|---|---|---|
| `--ink` | `#0b0c10` | page and panel background |
| `--ink-raised` | `#17181f` | buttons, inputs, rows |
| `--ink-line` | `#33343c` | quiet edges, disabled, meter track |
| `--bone` | `#e4dcc3` | primary text, default button edge |
| `--bone-dim` | `#938d7a` | secondary text, labels, default frame edge |
| `--blood` | `#b3261e` | primary button, harm |
| `--blood-bright` | `#e0463a` | danger text, primary edge |
| `--sick` | `#8fbf3a` | good/health meter |
| `--amber` | `#e8a33d` | focus, hover, score, selected, `>` marker |
Overlay tints: `rgba(7,8,12,.6)` screens, `.35` sub-pages, `rgba(11,12,16,.74-.78)` sheets and HUD chips.
Colorblind option: `:root[data-palette='clear']` swaps blood to `#b8246f`/`#ff4fa8` and sick to `#5aaef0`. Trenchess already has four player colours, so a clear palette is worth copying.

### 2.2 Sprite master palette (`src/art/palette.ts`)
64 colours, hue-shifted ramps (shadows lean blue/purple, highlights lean warm), dark to light. Every sprite draws only from these; `inPalette()` enforces it.
- ink `0d0b16 1b1728` · skin `5c2f42 a05a4a dc9868 fad0a4` · rot `24343e 3c5e4a 6f9154 b4c47a` · ash `3a384e 6c6a78 a8a492`
- blood `3a0f2a 761830 b82a30 e85c40` · bone `6e6272 a89a80 dccca0 faf2d4` · denim `222c52 3a5288 6488bc` · teal `143e4a 1f8080 58d0a8`
- violet `34205c 6c3c9c b070d0` · olive `30362a 565c36 8c8c56` · wood `2c1c28 4e3432 7c5840 ac8458` · metal `242840 484e68 7c8494 c0c6c8`
- asphalt `15171f 1c1f29 262933` · concrete `30313d 44444f 5e5d64 7e7c7a` · brick `321c28 522a30 784038` · grass `15231f 213629 365030`
- fire `a03018 e8701c ffc03c fff0b4` · acid `246030 5ca82c c4f048`
- Studio gold (splash only): `#ffd75e`, `#d9c27a`, `#e0a020`, shadow `#4a3300`.

### 2.3 Type
- One family everywhere: **Silkscreen** (`@fontsource/silkscreen` 400 and 700), `font-family: 'Silkscreen', monospace`, uppercase for buttons/menu/headings, line-height 1.25.
- No webfonts from a CDN. Bundled via npm.
- Everything sizes from a unit: `--u: 2px` (title pages use `--title-u`), `font-size: calc(var(--u) * 8)` body, `* 9-12` links/sheet headings, `* 16` heading, `* 20` banner title, `* 12` stat numbers.

### 2.4 Pixel scale and rendering
- Art is drawn on a small grid in code (`PixelCanvas` in `src/art/kit.ts`, sprites cached in `src/engine/sprite-cache.ts`), then scaled by whole numbers. Canvas and sprites use `image-rendering: pixelated`. Title logo is 276x94 art pixels.
- Lighting is stippled, not blended: `src/engine/light-dither.ts` (Bayer threshold), damage vignette in `src/engine/screen-effects.ts` is a Bayer-dithered `rgb(122,16,12)` edge, not a gradient.
- Thin 1 unit outlines in `ink 0d0b16`; shading by stepping one colour along its ramp (`shift/lighter/darker`).

### 2.5 Frames, panels, buttons
- `.px-frame`: no border-radius, no border. Four hard offset `box-shadow`s (`±u 0`, `0 ±u`) in `--edge`, so corners are notched. Default edge `--bone-dim`.
- `.px-panel`: `--ink` background, `padding u*6`. `.px-sheet`: `rgba(11,12,16,.74)`, width `u*280`, wide `u*460`, extra-wide `u*540`, edge `--ink-line`.
- `.px-button` (`PixelButton.vue`): `--ink-raised` fill, bone edge, bold uppercase. Hover/focus: amber fill + amber edge + ink text. Active: `translateY(u)`. Disabled: `--ink-line` edge, dim text. `.is-primary`: blood fill, bright-blood edge; hover goes blood-bright fill with bone edge. `.is-chosen`: amber fill (selected in a row; red is reserved for the one run-starting action).
- Menu items (`.px-menu-item`): bare uppercase words, `bone-dim`; selected is `bone` with an amber `>` marker at left. No box. `text-shadow: u u 0 var(--ink)`.
- Inputs: `ink-raised`, `ink-line` edge, amber edge on focus. Slider: 6 px track, 8x14 px bone block thumb. Meter: `u*3` high, fill `--sick`.
- Scrollbar: custom blood-pool thumb with a drip (`pixel-ui.css`), rounded track. A detail players notice.

### 2.6 Title / logo
- Title: stacked logo sprite (`src/art/fx/logo.ts`: chamfered bone block capitals dipped in blood, cold moon sky, subtitle "LAST ROUND" on an empty ammo belt), over live gameplay canvas, `radial-gradient(rgba(7,8,12,.5) -> .08)` wash. Menu list below, `Privacy` + `© 2026 Hall of the Gods, Inc.` and version link in the footer corners (version is a dotted-underline link to the changelog).
- Title sub-pages share a 120 ms `steps(3)` fade (`.px-page`), so the world keeps moving behind a translucent sheet.

### 2.7 Transitions and motion
- Everything uses `steps()` easing (stop-motion feel), not smooth curves: banner `2.6s steps(13)`, place banner `2.2s steps(11)`, game over `0.7s steps(7)`, "new best" `0.8s steps(2)` blink at `opacity .35`.
- Only the studio splash uses eased fades.
- Screen effects: shake (max 7 px, decays), damage vignette, low-health heartbeat pulse, death desaturation. Motion has one switch (`motion.reduced`) mirrored to `<html data-motion>`; reduced mode removes animations and caps shake.
- Scene transition between bunker and map is a van (`VanTransition.vue`): a themed transition, not a generic wipe.

### 2.8 Sound (all synthesised, no UI audio files)
- Engine: `src/audio/voice-kit.ts` (`tone`, `noise` recipes) rendered by `audio-engine.ts`/`render.ts`; UI recipes in `src/audio/sfx-ui.ts`.
- `uiClick`: square 1400->900 Hz 30 ms + 3 kHz band noise 12 ms. `uiHover`: sine 1200 Hz 25 ms, gain .1. `uiStart`: rising noise sweep + square 220->440 then 440->660. `uiPause`: triangle 660 then 440. `uiResume`: triangle 440 then 660. Van depart/arrive/door: low saw engine, brake, thunk.
- Every `PixelButton` plays hover on `mouseenter` and click on press (`silent` prop opts out).
- Music: real MP3s in `public/music/` per level, victory (`victory-dark-salvation.mp3`), credits.

---

## 3. Mapping onto Trenchess screens

Current Trenchess baseline (read from source): Tailwind slate + `brand-red #ef4444` / `brand-blue #3b82f6` / yellow-500 / green-600; fonts Cinzel, Lora, Outfit from Google CDN; lucide-react line icons and hand SVG icons (`shared/components/atoms/UnitIcons.tsx`); glass/blur cards with large radii (`TCCard`, `TCOverlay blur="xl"`); no splash, no audio code (no `AudioContext`/audio files found in `src/`); `public/` holds only favicon + stockfish.

### 3.1 Player and terrain colour mapping (new tokens)
Players (keep four-player readability; use UoN ramps' mid/light steps, outline everything in `ink 0d0b16`):
| Player | Current | Glow-up | Hex (fill / light / dark) |
|---|---|---|---|
| red | `#ef4444` | UoN blood | `b82a30` / `e85c40` / `761830` |
| blue | `#3b82f6` | UoN denim | `3a5288` / `6488bc` / `222c52` |
| yellow | `#eab308` | UoN fire | `e8701c`..`ffc03c` / `fff0b4` / `a03018` |
| green | `#16a34a` | UoN acid | `5ca82c` / `c4f048` / `246030` |
Warning: UoN blood `e85c40` and fire `e8701c` sit close. Test red-vs-yellow on the 2v2 board; fall back to `ffc03c` for yellow only.

Terrain (note code names differ: `TERRAIN_TYPES` in `constants` uses TREES/PONDS/RUBBLE/DESERT in `TerrainOverlay.tsx`, while `blueprints/terrain.ts` calls them FORESTS/SWAMPS/MOUNTAINS):
| Terrain | Now | Glow-up ramp |
|---|---|---|
| Forest/trees | emerald tint | grass `15231f 213629 365030` + rot `3c5e4a 6f9154` pine-pixel tuft |
| Swamp/ponds | blue tint, Waves icon | teal `143e4a 1f8080 58d0a8` with 2-frame ripple |
| Mountains/rubble | brand-red tint, Mountain icon | concrete `30313d 44444f 5e5d64 7e7c7a` + brick `522a30 784038` chunks |
| Desert | amber tint, sun icon | wood `7c5840 ac8458` sand + bone `dccca0` dune highlight |

Board checker: replace `getQuadrantBaseStyle` Tailwind `*-400/60` and `*-600/80` washes with solid, hue-shifted two-tone per quadrant (dark step / mid step of the player ramp, desaturated to roughly 35 percent), 1 px `ink` grid lines instead of `border-[0.5px] border-black/20`.

### 3.2 Screen-by-screen
| Screen (file) | UoN convention | Concrete change |
|---|---|---|
| **Splash** (new; mount in `src/trenchess.tsx`) | `StudioSplash.vue` | Port as section 1. Then fade to the Trenchess title. |
| **Loading** (`shared/components/atoms/LoadingScreen.tsx`) | black ink bg, Silkscreen, no blur blobs | Drop the 1000 px blurred blobs, lucide Trees/Mountain/Waves float and `wave-pulse`. Use a centred pixel logo and a stepped 5-block progress meter (`px-meter`, `--sick` fill) plus rotating line (keep the existing messages). |
| **Main menu** (`app/client/home/MenuScreen.tsx`, `RouteCard`) | `TitleMenu`/`.px-menu-item` | Replace the 3x2 `RouteCard` grid (rounded, coloured, lucide icons, live board previews) with a centred uppercase word list and amber `>` marker, logo above. Keep the hover-preview as a framed board thumbnail beside the list rather than inside each card. Six entries stay: Hello, Battlefield, Lay, Lead, Educate, Study. Footer: `© Hall of the Gods, Inc.`, version link, privacy. |
| **Logo** (`TrenchessText.tsx`, red "Tren" + blue "chess") | UoN logo is a pixel lockup | Build a pixel logo sprite (see human-artist flag). Interim: Silkscreen 700, "TREN" in blood-bright `e0463a`, "CHESS" in denim `6488bc`, `2px 2px 0 #0b0c10` hard shadow, no `tracking-tighter` blur. |
| **Pre-game / setup** (`GameStartOverlay`, `PregameLayout`, `play/setup.tsx`) | `.px-sheet`, `.px-button.is-primary` for the one start action, `.is-chosen` amber for selection | `TCOverlay blur=xl` becomes a flat `rgba(7,8,12,.6)` scrim. Start/Lock In = primary blood button; mode/terrain choices = chosen-amber boxed buttons. Remove the red-blue shimmer bar and radial glow. |
| **Board** (`BoardCell.tsx`, `BoardGrid.tsx`, `GridFrame`, `TerrainOverlay`, `CellHighlight`) | pixel tiles, notched frame, stipple | Section 3.1 colours; `GridFrame` becomes a `.px-frame` (bone-dim notched edge); `image-rendering: pixelated` terrain tiles; selection = amber 2 px outline + `>`-style corner ticks; valid move = amber dot; capture = blood-bright dot; last move = stepped 2-frame flash (`steps(2)`), replacing `animate-path-trail`/`animate-spin-shrink`/blur ghost. Check overlay = blood vignette dither on board edge. |
| **Pieces** (`UnitIcons.tsx`, `CellUnitRenderer`) | pixel sprites with ink outline, ramp shading | Replace stroke SVGs with 16x16 (or 24x24) pixel sprites, one per piece, drawn from the section 2.2 palette, tinted by player ramp; scaled by integer; 2-frame idle bob on the selected piece. Existing piece roles (King crown/helmet, Queen sword+halo, Rook turret, Bishop crosshair) are good concept hooks: keep the metaphors, redraw as pixels. |
| **HUD** (`TopActionBar`, `BattleSidebar`, `ArmyRoster`, `PlayTurn`, `ConsolePlayerColumn`) | `.hud-chip` `rgba(11,12,16,.78)`, dim label over bright value, amber score, red threat, green good | Flatten glass cards into ink chips (no radius, no blur). Whose-turn banner like `WaveBanner`: `top:22%`, ink strip, 2.6 s `steps(13)`, player colour title. Captured-piece score = amber bold. Meter widgets use `px-meter`. |
| **Game over / Victory** (`VictoryOverlay.tsx`, `LoseScreen`) | `GameOverScreen.vue`: heading, stat grid, `px-blink` "NEW BEST", stacked actions | Drop ribbons/pennants/`text-9xl` trophy bounce/`blur-3xl` pulses. Keep layout order: skull or crown sprite (3x), `VICTORY`/`DEFEAT` in a px-heading (blood-bright for defeat, amber for victory), stat row (score, captures, turns), amber blinking "CHECKMATE", then primary `PLAY AGAIN` + plain `MAIN MENU`. Entrance `0.7s steps(7)`. Keep the final-board preview, framed. |
| **Learn / Rules / Stats pages** (`client/learn/**`, `tutorial/components/**`, `rules`, `stats`) | `.px-sheet`, `.px-rows`, `.px-label`, `.px-note` | Rebuild `PanelCard`, `SectionRibbon`, `StatBullet`, `NavButton` on sheet/row/frame primitives; stat bars become `px-meter`. |
| **Global** (`styles/base/theme.css`, `index.html`) | tokens, one font, scrollbar, `--u` unit | See section 4. |

---

## 4. Implementation spec (for the engineer, not done yet)

1. `pnpm add @fontsource/silkscreen`; import 400 and 700 in `src/trenchess.tsx`; delete Google Fonts links in `index.html`; set `--font-sans`/`--font-serif` to Silkscreen in `@theme`.
2. Add `src/styles/base/pixel-tokens.css` copying `--u`, `--ink`..`--amber` plus a `data-palette` clear variant; map Tailwind `@theme` colours onto them (`--color-brand-red: #e0463a`, `--color-brand-blue: #6488bc`, etc.).
3. New `src/styles/utilities/ui/pixel.css` with `.px-frame`, `.px-panel`, `.px-sheet`, `.px-button(.is-primary/.is-chosen)`, `.px-menu-item`, `.px-meter`, blood-pool scrollbar, `@keyframes px-fade-in/px-blink`. Rebuild `TCButton`, `TCCard`, `TCOverlay`, `TCBadge`, `TCDivider` on top of them (all consumers get the look automatically).
4. Add a CRT layer component (scanline + vignette from the splash) as an opt-out Options toggle for in-game; default on for splash/title, subtle on board.
5. Sound: new `src/shared/audio/` using WebAudio (Trenchess has none today). Port `tone`/`noise` helper concepts from `src/audio/voice-kit.ts` and the five recipes in `sfx-ui.ts`. Add chess cues in the same style: move (short square blip 900->600 Hz), capture (noise burst + low sine thump, like `vanDoor` thunk), check (two-tone triangle like `uiPause`), checkmate/victory sting (rising `uiStart` pattern), terrain place (low thud). Unlock audio on the splash skip gesture exactly as UoN does. Mute and volume in Options.
6. `data-motion` attribute mirror + reduced-motion rules for every new animation.
7. Update `<title>`, theme-color `#0b0c10`, `<meta name="author" content="Hall of the Gods, Inc.">`, og tags as in UoN `index.html`.
8. Tests: vitest for `shouldShowSplash`/`splashTimings`; a palette test mirroring `inPalette` for any new sprite module.

## 5. Top 10 changes ranked by visual impact
1. **Hall of the Gods splash** (gold omega, 400/1600/500 ms, scanlines, any-key skip, `?nosplash`). Instant studio identity.
2. **Global look reset**: ink `#0b0c10` background, Silkscreen font, whole-number pixel unit, flat panels with notched frames; removes glass, blur, rounded-3xl and the Cinzel/Outfit/Lora CDN fonts.
3. **Pixel piece sprites** (six piece types x four players, ink outline, ramp shading, integer scaling).
4. **Board and terrain tiles** redrawn as pixel tiles in UoN ramps (hue-shifted checker, grass/teal/concrete/sand terrain, `ink` grid lines, notched board frame).
5. **Main menu** rebuilt as the `>` word menu under a pixel logo lockup; drop the six coloured `RouteCard`s.
6. **Pixel Trenchess logo/title treatment** with live board in the background under a dark wash.
7. **CRT scanline + vignette + dithered check vignette** over splash, title and board edge.
8. **Button, input, slider, meter, blood-pool scrollbar** kit (hover/primary/chosen states with amber focus) plus hover/click blips.
9. **Victory/Defeat screen** rebuilt as a stepped-fade stat sheet with amber blink and primary/plain action pair.
10. **Sound design** (synth UI + move/capture/check/mate cues) and `steps()` motion on banners and move flashes.

## 6. Worth paying a human pixel artist
- **Pixel Trenchess logo lockup** (UoN's is a hand-cut 276x94 sprite with damage and a sky). Brief: "TRENCHESS" in chamfered block capitals, two-tone (red / blue split like today's brand), a trench line and a chess piece silhouette hidden in the letters, 64-colour UoN palette, ink outline, 3 frames of idle shine.
- **The 6 piece sprites x 4 colourways + 2-frame idle**. Brief: 24x24 each, top-down-ish three-quarter, readable at 2x on a 12x12 board, strong silhouettes so rook/knight/bishop can be told apart at a glance.
- **Four terrain tile sets with a 2-frame animation** (water ripple, desert shimmer). Brief: 16x16 tileable, no seam on repeats.
- Optional: a pixel/chiptune music loop. Trenchess has no music; UoN has per-level MP3s.

## 7. Open items
- Splash logo pixel size and alpha not verified; check the WebP before use.
- Copyright wording (2026 vs 2006-2026) needs the Commander's call.
- No code, assets, dependencies or git state were changed in this task.
