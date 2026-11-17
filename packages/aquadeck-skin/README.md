# AquaDeck skin for Video.js 10

An independent, image-backed Y2K player skin built on `@videojs/html` **10.4.0**. This is a browser ESM package, not a Video.js 8 plugin or an official Video.js skin. It is a reusable component, separate from the demonstration website. Version 0.1.0 is experimental; it is not published to npm.

## Install from the repository or tarball

```sh
npm install @videojs/html@^10.4.0 ./aquadeck-videojs-skin-0.1.0.tgz
```

Use a browser bundler with asset URL support, such as Vite. Import the stylesheet once:

```js
import { mountAquaDeck } from '@aquadeck/videojs-skin';
import '@aquadeck/videojs-skin/style.css';

const skin = await mountAquaDeck(document.querySelector('#player'), {
  src: '/lesson.mp4',
  poster: '/lesson.jpg',
  chapters: [
    { title: 'Introduction', startTime: 0 },
    { title: 'Examples', startTime: 30 },
  ],
  captions: [{ src: '/lesson-en.vtt', language: 'en', label: 'English' }],
});

// Real Video.js player/store and HTMLVideoElement are exposed.
await skin.play();
skin.seek(30);
skin.setReflections(false);
// When unmounting: removes this mount, media source, listeners and animation loop.
skin.dispose();
```

Every mount owns its state, controls, listeners and DOM subtree. Multiple players can coexist; there are no document-global IDs or page-style resets. Existing host children are untouched. Only the returned root is removed by `dispose()`.

For bundlers that do not process `new URL('./assets/file.png', import.meta.url)`, copy this package's `assets/` directory to your public folder and pass `assetBase: '/aquadeck-assets/'`. The trailing slash is important. Do not move or rename individual asset files.

### React

Mount only on the client. Avoid server-side evaluation of browser custom elements.

```jsx
useEffect(() => {
  let cancelled = false;
  let skin;
  import('@aquadeck/videojs-skin').then(async ({ mountAquaDeck }) => {
    const created = await mountAquaDeck(ref.current, { src });
    if (cancelled) created.dispose();
    else skin = created;
  });
  return () => { cancelled = true; skin?.dispose(); };
}, [src]);
```

Include `import '@aquadeck/videojs-skin/style.css'` in your client stylesheet entry. The same mount/dispose contract works in Vue's mounted/unmounted hooks and Svelte's `onMount` cleanup.

## API

`mountAquaDeck(host, options)` returns a Promise of `{ root, player, video, play, pause, seek, setReflections, dispose }`.

| Option | Meaning |
| --- | --- |
| `src` | Required media URL. Basic file playback uses the Video.js HTML media provider. |
| `poster` | Optional poster URL. |
| `label` | Accessible player-region name. Use distinct names for multiple players. |
| `chapters` | Ordered automatically by finite, nonnegative `startTime`; used by previous/next. |
| `captions` | WebVTT URLs with optional `language` and `label`. Toggle selects the first caption track. |
| `assetBase` | Optional public directory URL for supplied raster assets. |
| `crossOrigin` | `anonymous` (default) or `use-credentials`. Configure your server accordingly. |
| `reflections` | Set `false` to start with decorative video sampling disabled. |

The package does not supply HLS/DASH adapters, content hosting, a transcript editor, analytics, DRM, HDR, or HTML-in-canvas. Those are outside this skin's scope. Advanced media providers should be integrated separately; file-based MP4 is the initial example.

## Visual and accessibility contract

- Desktop: native semantic buttons/ranges align over the artwork. Their opacity is zero, but keyboard focus, hover, active/pressed and disabled states have visible counterparts on separate sprites.
- All mount widths: the same proportional skin stays interactive, with native controls aligned to the artwork. No duplicate mobile dock. Small mounts scale their targets with the skin, so a 44px target minimum is not claimed.
- Captions: **up = ON, down = OFF**, with visible text and `role="switch"`/`aria-checked` state. If no captions are supplied, this control is disabled.
- Native Tab/Shift+Tab, Enter/Space and range keyboard behavior remain available. Timeline arrows seek five seconds, Page Up/Down ten seconds, Home/End go to bounds. A scoped Tab traversal fallback handles native-button skipping preferences without wrapping at either boundary; everything outside this instance remains browser-native. No global shortcuts are overridden. Safari remains unverified.
- The screen remains a real video element. Canvas 2D video reflections are optional decorative overlays, alpha-masked to caps. They are **not** a physical refraction simulation, WebGL, HDR or experimental HTML-in-canvas.
- Reduced motion disables reflections initially and when the preference changes. An explicit user toggle can enable them again.
- Source video must be same-origin or CORS-enabled for reliable canvas use. Browser fullscreen/autoplay/volume policies still apply; denied fullscreen and media errors produce a visible status.

## Assets and states

`assets/coordinates.json` documents the 1449×1086 source coordinate plane. Chassis is a clean plate; independent caps and thumbs prevent ghosted resting controls when their state changes. Play/mute glyphs are dynamic. Pressed variants plus local displacement suggest travel while the fixed cavity remains still. Artwork is responsive raster resampling, not a promise of device-independent pixel perfection.

The assets originated as OpenAI image-generated artwork directed for this project, then programmatically sliced, cleaned and color-corrected. There is no claim that the generated product is manufactured or mechanically validated. See `NOTICE.md`.

## Local checks and example

From this directory:

```sh
npm run check
npm test
npm pack --dry-run
npm pack
```

`examples/index.html` is a two-instance Vite entry (media references point to the demo project's `/assets/`). Include it in your Vite input, or run Vite from the parent project and open `/packages/aquadeck-skin/examples/index.html`. One instance has captions/chapters; one intentionally does not, and has a dispose/recreate button.

Node tests verify package/asset contracts, not rendered browser behavior. Real-device Safari/iOS, assistive-technology combinations and all device-pixel ratios require testing. Fullscreen and volume behavior differ on mobile platforms. This package is a starting release, not a blanket claim that all browsers and states are verified.

## Verification for 0.1.0

Chromium review covered desktop and a 333 CSS-pixel compact layout: actual hover, pointer-held/pressed, keyboard focus, disabled and toggle states for playback, chapter, mute, timeline, volume, captions, fullscreen, loop and reflections controls. Pressed sprite URLs and cap travel were checked during real held input; disabled controls retain their resting material. The review also exercised true Tab/Shift+Tab, keyboard activation and seeking, captions up=ON/down=OFF, two-instance isolation, disposal/recreation, and fullscreen entry/exit. Compact buttons measured at least 48px high in the checked layout, with no horizontal overflow.

Six Node tests cover exports/assets/scoping/caption semantics/disabled-state CSS guards and the zero-volume unmute handler. Unmute restores full volume when the slider is at zero; otherwise it preserves the selected volume. These do not replace browser review. Safari/iOS, assistive-technology combinations, arbitrary host CSS and all device pixel ratios remain unverified. The package provides Canvas 2D reflections only.

## License

MIT for this package's code and supplied project artwork, to the extent rights exist. Video.js is a separately installed Apache-2.0 peer dependency. No third-party media is bundled in the package. No endorsement by Video.js or Apple is implied.
