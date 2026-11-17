// Decorative optics only. Never replaces or intercepts accessible HTML controls.
export function createOptics(video,surfaces,onMode){
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'), backing=document.createElement('canvas');
 backing.width=400;backing.height=200;
 let gl=null,program=null,texture=null,mode='canvas',enabled=!reduce.matches,frame=0,last=0,dirty=true;

 const outputs=surfaces.map(canvas=>({canvas,ctx:canvas.getContext('2d')}));
 try{
 gl=backing.getContext('webgl',{alpha:true,premultipliedAlpha:false,preserveDrawingBuffer:true,powerPreference:'low-power'});
 if(!gl)throw Error('WebGL unavailable');
 const compile=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('Shader compilation: '+gl.getShaderInfoLog(s));return s};
 program=gl.createProgram();gl.attachShader(program,compile(gl.VERTEX_SHADER,'attribute vec2 p; varying vec2 uv; void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}'));
 gl.attachShader(program,compile(gl.FRAGMENT_SHADER,`precision mediump float;
 varying vec2 uv;uniform sampler2D film;uniform float shift;uniform float bezel;
 void main(){
  vec2 q=uv*2.-1.;float r=clamp(dot(q,q)*.52,0.,1.);float z=sqrt(max(.01,1.-r));
  vec2 normal=q*(.08+.17*(1.-z));
  vec2 pos=vec2(.12+uv.x*.76,.20+(1.-uv.y)*.57)+normal;
  pos.x+=shift*.12;pos=clamp(pos,vec2(.02),vec2(.98));
  float ab=.007*(r+.2);vec3 color=vec3(texture2D(film,pos+normal*ab*9.).r,texture2D(film,pos).g,texture2D(film,pos-normal*ab*9.).b);
  // Reflected strip and refracted image share the current video texture.
  vec3 reflected=texture2D(film,vec2(pos.x,1.-pos.y)).rgb;
  color=mix(color,reflected,.24+.35*r);
  float rim=pow(r,3.)*.24;float shine=pow(max(0.,1.-length((q-vec2(-.35,.6))*vec2(.8,2.))),6.);
  color+=vec3(.40,.75,.86)*rim+shine*.35;
  gl_FragColor=vec4(color,1.);
 }`));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Shader linking');
 gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
 texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.uniform1i(gl.getUniformLocation(program,'film'),0);mode='webgl';
 backing.addEventListener('webglcontextlost',e=>{e.preventDefault();mode='canvas';dirty=true;status()});
 }catch(error){console.warn('AQUADECK optics fallback:',error.message);gl=null;mode='canvas'}
 function status(){onMode(!enabled?'STATIC PEARL':mode==='webgl'?'WEBGL · LIVE REFRACTION':'CANVAS · LENS OPTICS')}
 function draw(){if(!enabled||video.readyState<2||document.hidden)return;
  try{
   if(mode==='webgl'){gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,video);}
   outputs.forEach(({canvas,ctx},i)=>{if(!ctx)return;const wide=canvas.classList.contains('bezel-reflection');const bounds=canvas.getBoundingClientRect();const w=wide?500:160,h=Math.max(1,Math.round(w*bounds.height/Math.max(1,bounds.width)));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}ctx.clearRect(0,0,w,h);ctx.save();if(wide){const path=document.querySelector('[data-chassis-clip]').getAttribute('d');ctx.scale(w/bounds.width,h/bounds.height);ctx.clip(new Path2D(path));ctx.scale(bounds.width/w,bounds.height/h)}else{const parent=canvas.parentElement,style=getComputedStyle(parent);const corners=['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].map(key=>{const parts=style[key].split(' '),x=parseFloat(parts[0])||0,y=parseFloat(parts[1]||parts[0])||0;return {x:x*w/Math.max(1,bounds.width),y:y*h/Math.max(1,bounds.height)}});ctx.beginPath();ctx.roundRect(0,0,w,h,corners);ctx.clip()}
    if(mode==='webgl'){gl.viewport(0,0,400,200);gl.uniform1f(gl.getUniformLocation(program,'shift'),i/outputs.length-.5);gl.drawArrays(gl.TRIANGLES,0,6);ctx.drawImage(backing,0,0,w,h)}
    else{
     // Scanline lens: a cylindrical displacement of actual video pixels, plus vertical reflection.
     // No GPU or experimental APIs needed. Lower-resolution decorative surfaces only.
     const sw=video.videoWidth,sh=video.videoHeight;
     for(let y=0;y<h;y+=4){const q=(y/h-.5)*2,bend=q*q*.15,sy=(.15+(1-y/h)*.68)*sh;const sourceWidth=sw*(.78-bend);const sx=(sw-sourceWidth)/2+Math.sin(q*2)*sw*.035;ctx.drawImage(video,sx,Math.min(sh-5,sy),sourceWidth,Math.max(1,sh/h*4),0,y,w,4.5)}
    }
    ctx.restore();
   });dirty=false;
  }catch{if(mode==='webgl'){mode='canvas';status()}else{enabled=false;status();api.onChange?.()}}
 }
 function tick(t){if(enabled&&!document.hidden&&(dirty||!video.paused)&&t-last>50){last=t;draw()}frame=requestAnimationFrame(tick)}
 function start(){cancelAnimationFrame(frame);if(!document.hidden&&enabled)frame=requestAnimationFrame(tick)}
 ['loadeddata','seeked','play','pause'].forEach(e=>video.addEventListener(e,()=>{dirty=true;draw();start()}));
 document.addEventListener('visibilitychange',()=>{dirty=true;start()});
 const api={get enabled(){return enabled},get mode(){return mode},onChange:null,setEnabled(on){enabled=on;dirty=true;status();if(!on)cancelAnimationFrame(frame);else{draw();start()}},dispose(){cancelAnimationFrame(frame)}};
 window.addEventListener('aqua-layout',()=>{dirty=true;draw();start()});
 reduce.addEventListener('change',()=>{api.setEnabled(!reduce.matches);api.onChange?.()});status();start();return api;
}
