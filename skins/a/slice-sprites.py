"""Slice owner-requested generated state artwork; no painted or CSS-derived states."""
from PIL import Image
from pathlib import Path
p=Path(__file__).parent/'public/buttons'
xs=[165,438,710,982,1255]
states=['normal','hover','pressed','focus','disabled']
rows={'play':128,'pause':306,'stop':485,'mute':664,'cc':842,'fullscreen':1018}
im=Image.open(p/'states.png')
for name,y in rows.items():
 for x,state in zip(xs,states):im.crop((x-137,y-89,x+137,y+89)).save(p/f'{name}-{state}.png')
im=Image.open(p/'additional.png')
for name,y,hh in [('sound',174,132),('cc-on',428,132),('thumb',698,145),('track',959,90)]:
 for x,state in zip(xs,states):im.crop((x-137,y-hh,x+137,y+hh)).save(p/f'{name}-{state}.png')
print('50 state sprite PNGs sliced')
