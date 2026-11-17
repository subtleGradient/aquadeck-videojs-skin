# AquaDeck

**An imaginary 2001 appliance. A real Video.js player.**

Pearl plastic, translucent blue controls, and a caption switch you want to click. AquaDeck brings the exuberance of Y2K media-player skins to Video.js v10, with a little XP-inspired desktop to call home.

**[Play the demo](https://subtlegradient.github.io/aquadeck-videojs-skin/)** · [Use the skin](packages/aquadeck-skin/README.md) · [Report a bug](https://github.com/subtleGradient/aquadeck-videojs-skin/issues)

## From illustration to interface

The first versions looked like pictures of a device. The goal was to make something that felt like a device: a thick shell, seated buttons, a recessed screen, and controls with travel.

Recreating the rendering in CSS kept losing that character. So the artwork became the interface. A transparent chassis and separate button sprites carry the look; real HTML buttons and sliders sit precisely over them. Video.js supplies the player underneath. Press play and the object comes alive.

The desktop is just the showcase. The reusable skin does not bring the wallpaper, taskbar, or faux windows into your site.

## Try it locally

Use **Node.js 22** and npm.

```sh
git clone https://github.com/subtleGradient/aquadeck-videojs-skin.git
cd aquadeck-videojs-skin
npm ci
npx vite
```

Open the URL Vite prints. To build the static site:

```sh
npm run build
```

Output goes to `dist/`. [GitHub Pages](.github/workflows/pages.yml) installs dependencies, runs the package tests, builds from source, and deploys on pushes to `main`. `BASE_PATH` sets the deployment subpath.

## Put the skin on your site

The experimental **0.1.0** package lives in [`packages/aquadeck-skin`](packages/aquadeck-skin). It is not published to npm yet.

From another project, install your local checkout:

```sh
npm install @videojs/html@10.4.0 /path/to/aquadeck-videojs-skin/packages/aquadeck-skin
```

Then mount it in a browser entry, using a bundler such as Vite:

```js
import { mountAquaDeck } from '@aquadeck/videojs-skin';
import '@aquadeck/videojs-skin/style.css';

const skin = await mountAquaDeck(document.querySelector('#player'), {
  src: '/video.mp4',
  poster: '/poster.jpg',
});

// When removing the player:
// skin.dispose();
```

Provide an empty `<div id="player"></div>` in your page. The [package guide](packages/aquadeck-skin/README.md) covers captions, chapters, framework integration, asset paths, and cleanup.

## Looks old. Behaves like the web.

- Play/pause, seek, time, volume/mute, captions, chapters, and fullscreen.
- Native controls with keyboard operation and visible focus. **CC up = on; down = off.**
- The same skin stays interactive on small screens. No duplicate mobile toolbar; touch targets scale with the artwork.
- Optional video reflections, with reduced-motion handling and a static fallback. The demo has WebGL and Canvas 2D paths; the reusable package uses Canvas 2D. These are decorative effects, not physically accurate optics.

## Check and change it

```sh
npm test --prefix packages/aquadeck-skin
npm run check --prefix packages/aquadeck-skin
npm run build
```

[`src/`](src) contains the showcase; [`public/art/`](public/art) holds its sprites and coordinate map. The reusable implementation, assets, and tests are under [`packages/aquadeck-skin/`](packages/aquadeck-skin).

Chromium checks cover playback and key interaction states. Safari/iOS, assistive-technology combinations, and hardware WebGL still need real-device testing. Automated tests check contracts, not every rendered pixel. For visual bugs, include a screenshot, browser, screen size, and the control's state.

## Credits and license

MIT for the project's code and supplied artwork, to the extent rights exist. See the [license](LICENSE) and [artwork/dependency notices](packages/aquadeck-skin/NOTICE.md). Video.js is a separate Apache-2.0 dependency.

The chassis artwork was generated with OpenAI image generation and adapted into interactive sprites. The desktop artwork and [procedural demo film](public/assets/VIDEO-README.md) were made for this project. AquaDeck is independent of Microsoft, Apple, and Video.js.
