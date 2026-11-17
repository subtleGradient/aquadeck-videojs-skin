# AQUADECK / Pearlware 01
Private Y2K aqua skin prototype, distinct from the Liquid Glass theme. Not submitted to any contest.

## Run and build
`npm ci` then `npm run build`. Static output in `dist/`. `@videojs/html` 10.4.0 provides the real player state and play/mute custom elements. Custom chapter and range interactions use Video.js store seeking. Other controls use the associated native video/fullscreen APIs.

## Optics
Same-origin original SDR motion video is sampled into decorative canvases on the buttons and bezel. WebGL path uses a video texture, coordinate distortion, chromatic offset, mirrored reflection and a highlight term. It is image-based lens distortion, not physically accurate ray tracing. If WebGL is unavailable, Canvas 2D draws warped mirrored scanlines for simpler cylindrical lens optics. If sampling fails, static pearl surfaces remain. No HTML-in-canvas dependency or HDR claim. Real interactive HTML is always retained.

Effects off by default with prefers-reduced-motion, user toggle available, no video autoplay. Render loop caps decorative sampling at 20fps and suspends on hidden documents; paused video redraws only when dirty. All DOM control hit targets ≥44px at tested narrow width. Every control uses native keyboard handling, visible focus, pressed feedback; selected and disabled states included. Captions describe motion, not spoken dialogue.

## Verified in cloud Chromium
- Vite production build passes.
- CSS viewport 400×715: no horizontal overflow; transport controls ≥44×44.
- CSS viewport 944×606: no horizontal overflow, desktop layout reviewed.
- Real play/pause, keyboard Space, previous/next & chapter jumps.
- Seek/volume keyboard arrows, mute/unmute, descriptive-caption toggle, loop toggle.
- Native fullscreen enter/exit and focus-visible outlines.
- Effects-off/static surface and Canvas 2D optics fallback visually verified.

## Not yet device verified
WebGL is unavailable in the cloud QA browser; its shader path is implemented but not GPU/device tested. Safari/iOS native fullscreen, native PiP, HDR and HTML-in-canvas are not claimed. The floating/page-synchronized educational mode is a separate existing prototype, not included in this skin study. Reduced-motion default is implemented and needs real-device preference testing. Final private hosted deployment is verified by Sites; authenticated production interaction is not covered by local preview QA.

Original motion film source/rights notes are included in `public/assets/VIDEO-README.md`.

## Revision 02 — organic compound transport
- Asymmetric SVG pearl chassis with shared canvas clip path; compound playback disc (play/pause + stop) and chapter rocker (previous + next) overhang the bottom edge.
- Each segment remains an independent named, keyboard-focusable action. Held Enter/Space gets the same concave feedback as pointer press. No synthetic double activation.
- Timeline arrows step 5 seconds; Page Up/Down 10 seconds; Home/End seek to boundaries. Native volume arrows/Home/End remain intact.
- Player chrome/control text is unselectable. Intro, notes and useful explanatory prose remain selectable.
- Live optics are masked in the canvas bitmap before compositing, using each control's actual computed corner radii. The bezel uses the same path as the SVG chassis and has a soft falloff. CSS clipping is a second layer, not the only protection.
- Native range hit areas are 44px high. Fullscreen denial/unavailability and media-load errors appear in a visible, selectable aria-live notice above the transport, rather than only inside collapsed technical notes.

## Revision 03 — seated controls
The chassis now extends 48px below the normal transport layout. The rocker, volume well, captions and fullscreen controls remain seated over the pearl body; only the playback disc gets a modest downward offset and proud lower-edge overhang. The transport row itself is no longer translated out of the housing. Same treatment applies across desktop and narrow mobile layouts; fullscreen removes the disc offset.

### Keyboard, bezel and switch follow-up
Native controls explicitly declare tabindex=0 (disabled controls -1). A Tab fallback is scoped only to the player and adjacent chapter/toggle controls; it follows visible DOM order, skips disabled/hidden controls, respects modifiers/editable fields, and never wraps at boundaries. Outside this scope the browser retains its native traversal. True forward/reverse Tab was tested in Chromium, not Safari. WebKit may otherwise skip native controls under platform preferences even with explicit tabindex.

The outer top/side screen rim is now generated from actual aperture bounds (22px desktop, 12px narrow); the lower organic outline still seats the controls. Shell shadows are applied only to the static SVG rather than the whole live control group. Hover adjusts a highlight layer, not shadow geometry/elevation. Captions are a physical switch with moving thumb, visible ON/OFF text, role=switch and aria-checked synchronized with captions; both Space and Enter operate it.

## Pearlware 02 — silhouette-first appliance redesign
Supersedes the earlier outline/layout notes above. The chassis is now an asymmetric sculpted appliance with thick sidewalls, an embedded lower-left transport lobe, a mounted screen and a right-side crescent carrying CC/fullscreen. Individual purpose-built recesses replace the flex-toolbar composition. The Form study toggle removes device gradients, shadows and colored slider treatments so its structure can be judged independently of materials. Default materials are restrained pearl plastic, chrome edges and translucent blue lenses. Whole-body video wash was removed; live video optics remain inside shaped control lenses only.

The independent grayscale critique was incorporated before material polish: screen/crescent clearance, flatter sliders, tighter side controls, stronger primary-play hierarchy and compact mobile elapsed/total time. Chromium checks include a 333 CSS-pixel viewport with no horizontal overflow, every control target at least 44px and positive spacing between volume and fullscreen. Enter successfully opens and closes fullscreen at that narrow viewport. Safari/iOS and hardware WebGL rendering remain unverified; no HDR or HTML-in-canvas rendering is claimed.

## Pearlware 03 — construction study
The current configuration was used as an image-generation reference for a three-quarter construction study. Its dimensions, section details and spring are illustrative hypotheses, not CAD or manufacturing validation. The live interface translates assembly relationships, not a raster mockup: a separate dark rear shell and clamshell seam, recessed screen gasket, deep fixed transport ring, cap/sidewall travel, differentiated rocker recess and volume trough. Existing geometry, control hitboxes and keyboard behavior stay intact. The CC slot remains fixed while its thumb travels. Live optics move with their keycaps. This is still a 2D responsive interface, not a rotatable 3D model.

## Spriteware 04 — actual image-backed skin
Generated orthographic RGBA artwork is now the real chassis, not a CSS recreation. `public/art/coordinates.json` supplies source-pixel dimensions. Separate transparent cap/knob sprites sit over repaired empty cavities and channels; moving CC/seek/volume does not reveal duplicate resting artwork. Play and mute glyphs are real state-dependent SVG. Pressed variants shade the cap and translate it within the fixed retaining part. Video is a real Video.js element in the black screen aperture; decorative video canvases use each sprite's alpha mask. Desktop uses transparent semantic native elements over visible art with explicit focus counterparts.

Below 761 CSS pixels the artwork remains proportional and becomes a labeled player preview, while a compact native control dock below retains at least44px targets. This is intentional rather than overlapping tiny invisible controls. It is not a claim of exact pixel equality across devices, raster resampling, device pixel ratios or browsers. Safari/iOS and hardware WebGL remain real-device verification gaps.

## Distributable skin / captions / neutral grade
The caption latch now uses up=ON and down=OFF in artwork and compact controls. The actual chassis and every resting/pressed sprite share an identical low-chroma neutral-gray color correction; saturated aqua lenses and all alpha/geometry remain intact. The distributable package in `packages/aquadeck-skin` owns scoped per-instance state and teardown, separate from this showcase. Its optional rendering currently uses Canvas 2D reflections; the showcase additionally retains its WebGL distortion path. See package README/NOTICE for integration and limitations.

## Desktop 05 — alternate-2001 preview environment
The showcase now places the unchanged artwork-backed player on an original XP-inspired desktop: blue sky/green hills, desktop shortcuts, blue title bars, playlist/properties/notepad panels, a working Start navigation menu, and a taskbar with the viewer's local clock. The wallpaper and icons are original SVG/CSS, not copied Microsoft assets. On phones, shortcuts become a row and the existing accessible compact player controls remain available. Start closes on link selection, outside click or Escape. This changes the demo environment only, not the distributable skin.
