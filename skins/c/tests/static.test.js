import {readFileSync} from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8'),js=readFileSync('src/main.js','utf8'),css=readFileSync('src/style.css','utf8');
test('genuine v10 integration',()=>{assert.match(js,/@videojs\/html\/video\/player/);assert.match(js,/player\.store\.play/);assert.equal(JSON.parse(readFileSync('package.json')).dependencies['@videojs/html'],'10.4.0')});
test('essential accessible controls',()=>{for(const id of ['play','seek','time','volume','mute','fullscreen'])assert.ok(html.includes(`id="${id}"`));assert.match(html,/aria-live="off"/);assert.match(css,/:focus-visible/);assert.match(css,/prefers-reduced-motion/)});
test('alpha PNG and no graphics renderer',()=>{const p=readFileSync('public/assets/pod.png');assert.equal(p[25],6);assert.doesNotMatch(js,/getContext|WebGL|requestAnimationFrame/)});
test('deploy-safe paths and reserved dimensions',()=>{assert.match(html,/width="1086" height="1448"/);assert.match(html,/viewport-fit=cover/);assert.doesNotMatch(html,/(?:src|href)="\/assets/)});
