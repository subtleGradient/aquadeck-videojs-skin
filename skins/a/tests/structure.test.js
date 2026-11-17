import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const js=readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/style.css',import.meta.url),'utf8');
test('Video.js v10 and essential semantic controls',()=>{assert.match(js,/@videojs\/html\/video\/player/);for(const id of ['play','seek','time','mute','volume','cc','full'])assert.ok(html.includes(`id="${id}"`));assert.match(html,/<video-player/);assert.match(html,/playsinline/)});
test('local assets and license ship',()=>{for(const path of ['public/chassis.png','public/aqua-motion.mp4','public/captions.vtt','public/poster.jpg','LICENSE','NOTICE.md'])assert.ok(existsSync(new URL('../'+path,import.meta.url)),path)});
test('no shader runtime or duplicate mobile controls; focus and motion policies present',()=>{assert.doesNotMatch(js,/getContext\(|WebGLRenderingContext/);assert.match(css,/:focus-visible/);assert.match(css,/prefers-reduced-motion/);assert.equal((html.match(/id="play"/g)||[]).length,1);assert.match(html,/viewport-fit=cover/)});

test('transport uses native buttons and SVG instead of platform glyphs',()=>{for(const id of ['play','mute'])assert.match(html,new RegExp(`<button type="button" id="${id}"`));assert.doesNotMatch(html,/[▶Ⅱ■⛶◖]/);assert.match(html,/class="play-icon" viewBox/)});
