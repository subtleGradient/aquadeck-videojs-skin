# BIOPOD

An ultraviolet biomechanical skin for **Video.js v10**. Silver ribs coil around a violet viewport; amethyst transport controls sit in a polished, organic shell. A media player from a future imagined in 2001.

The artwork is a transparent frame, not a screenshot of a player. Video runs in its cut-out aperture, and every control is a real HTML button or slider. No WebGL, canvas render loop, or duplicate mobile toolbar.

## Play

```sh
npm ci
npm run dev
npm run build
```

`dist/` is a self-contained static site. Relative asset URLs support GitHub Pages subdirectories. To specify a deployment base: `npm run build -- --base=/your-project/skins/c/`.

## Controls

Play/pause, stop and rewind, ±10-second seeking, timeline, elapsed/total time, volume, mute, fullscreen, captions and looping. Tab reaches the controls. Space/Enter activates buttons; arrow keys adjust sliders; Home/End seek to either end. The cyan keyboard ring stays visible against chrome. Reduced-motion disables decorative transitions.

The same control surfaces remain in place on narrow screens with larger transparent hit areas. Safari fullscreen uses the native video fallback when element fullscreen is unavailable. The page reserves the full shell dimensions before script startup and includes safe-area-aware edge-to-edge layout.

## Source map

- `src/main.js`: Video.js v10 player integration and control synchronization
- `src/style.css`: responsive skin and host page
- `public/assets/pod.png`: transparent chassis with empty control sockets
- `public/assets/aqua-motion.mp4`: 24-second original AQUADECK motion study
- `tests/smoke.cjs`: browser behavior checks; requires Playwright and Chromium

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md). Video.js remains subject to its own license. Generated shell and original demo media are included as source assets.
