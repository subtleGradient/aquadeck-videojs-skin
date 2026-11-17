# NEBULA POP

A candy-orange alien gadget for Video.js v10. Acid-lime controls sit inside translucent molded plastic: an imaginary pocket of 2001, with real HTML underneath.

## Run

```sh
npm ci
npm run dev
npm run build
npm test
```

Set `BASE_PATH=/aquadeck-videojs-skin/skins/b/ npm run build` for GitHub Pages, or use the default relative base. Publish `dist/`. Actual source is included, not a ZIP.

## The skin

- Video.js HTML 10.4.0 owns the player, play/pause, mute and seek store.
- One set of native controls at every size: timeline, play/pause, stop, mute, volume, fullscreen, captions and loop.
- Transparent PNG chassis, including a transparent screen aperture. No WebGL, canvas, fake desktop window controls or continuous effects.
- Visible keyboard focus and 44px minimum hit targets. Arrow keys seek five seconds; Home/End jump to either end. Escape exits fullscreen.
- No autoplay; no decorative animation. Reduced-motion preference disables transitions.
- Fixed image dimensions and reserved aspect ratio prevent artwork-driven layout shift. Safe-area padding belongs to page content, not the body background.

Fullscreen may use native video UI on iPhone. Mobile OS volume restrictions can require hardware buttons. Use the original in-skin controls on small screens; there is no duplicate mobile toolbar.

## Reuse

`index.html` contains the player markup. `src/main.js` binds controls and state. `src/style.css` positions controls against the 1086 × 1448 chassis. The video aperture is x=19.5%, y=25.5%, width=60%, height=32%; footage is contained without cropping. Replace the video, poster and caption track together. The optional demo text is outside the player.

## Checks

`npm test` checks source invariants; `npm run build` validates the dependency graph. Alpha-channel checks confirm zero-alpha corner and central aperture pixels. Real browser keyboard, playback, mobile and fullscreen validation must additionally be performed; static tests do not prove those behaviors.

## License & credits

Apache License 2.0. The chassis is AI-generated original artwork based on the owner's B concept direction, not a third-party appliance graphic. Video.js retains its upstream license. Demo film, poster and descriptive captions are the owner's original AquaDeck abstract motion study, reused here. See `NOTICE.md` and `public/assets/VIDEO-README.md`.
