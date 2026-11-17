# LIQUID ORBIT

A small spacecraft for your next escape. Liquid-chrome fins, electric-aqua glass and an asymmetric silhouette give video a home beyond the rectangle.

Built on **Video.js 10.4**, with real HTML controls: play/pause, stop, timeline, time, mute, volume, captions and fullscreen. No WebGL, canvas effects or autoplay. The artwork has real transparency outside the hull and through the video aperture.

## Run

```sh
npm install
npm run dev
npm run build
```

Publish `dist/` to any static host. Relative URLs work on GitHub Pages; override with `BASE_PATH=/skins/a/ npm run build` when needed.

## Use the skin

The portable skin is `src/style.css` plus the `.ship` markup in `index.html`, `src/main.js` bindings and `public/chassis.png`. Keep the `video-player` wrapper and Video.js imports. Replace the local video, poster and captions with your media. Keep dimensions on the hull to reserve layout before images load.

Keyboard focus is a lime ring. Tab navigates, Space/Enter activates, timeline arrows seek five seconds, Home/End jump to the beginning/end. All original controls remain in place on mobile, with no duplicate toolbar. iPhone volume uses hardware buttons when browser volume control is unavailable. Fullscreen falls back to native iOS video fullscreen. No decorative animation needs suppressing; button transitions respect reduced motion.

## Design statement

LIQUID ORBIT treats the player as a tiny spacecraft rather than a flat toolbar. Liquid chrome bends around a transparent video aperture while aqua controls stay readable and tactile. The expressive shell is decorative; the controls beneath it remain semantic, keyboard-accessible HTML.

## Verification

`npm run build` passes. Alpha checked at the outer corner and aperture center: 0. The local browser test script is included as `test.cjs`; its Chromium launch is blocked by this execution environment's socket restrictions, so a successful build does not claim browser verification. Before publishing, run playback, seek, captions, mute, fullscreen and 320/390px checks in a browser, then test Safari on an actual iPhone.

## License

Apache-2.0. See [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md).

### Generated control sprites

The live skin uses literal artwork from `public/buttons/`, including separate play/pause, mute/sound and captions-on artwork. Each has five rendered states. `src/sprites.css` maps native interaction states onto the matching images without stretching button geometry. The range thumbs are cropped glass-pearl sprites; the volume thumb sits over the shell's original glass well. Run `python slice-sprites.py` to reproduce the crops from the two source sheets. Original native transport logic is unchanged.
