import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8'),js=readFileSync(new URL('../src/main.js',import.meta.url),'utf8'),css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
test('uses Video.js 10 HTML player and media controls',()=>{assert.match(js,/@videojs\/html\/video\/player/);assert.match(html,/<video-player/);assert.match(html,/<media-play-button/);assert.match(html,/<media-mute-button/)});
test('essential controls exist exactly once',()=>{for(const id of ['play','seek','time','mute','volume','fullscreen'])assert.equal(html.split(`id="${id}"`).length-1,1)});
test('no renderer APIs, autoplay or duplicated mobile toolbar',()=>{assert.doesNotMatch(js,/getContext|requestAnimationFrame|WebGLRenderingContext/);assert.doesNotMatch(html,/<canvas|autoplay[=> ]/);assert.match(css,/prefers-reduced-motion/)});
test('accessible range, visible focus, error recovery, reserved layout',()=>{assert.match(html,/aria-label="Video position"/);assert.match(css,/:focus-visible/);assert.match(js,/\['playing','canplay'\]/);assert.match(css,/aspect-ratio:1086\/1448/)});

test('preserves error and buffering states across time/volume updates',()=>{assert.match(js,/video.error\?'LOAD ERROR'/);assert.match(js,/buffering&&!video.paused\?'BUFFERING'/);assert.match(js,/'durationchange'/);assert.match(css,/input:disabled/)});
