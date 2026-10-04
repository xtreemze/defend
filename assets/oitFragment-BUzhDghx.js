import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a,o=e((()=>{t(),r=`prePassDeclaration`,i=`#ifdef PREPASS
#ifdef PREPASS_LOCAL_POSITION
varying vPosition : vec3f;
#endif
#ifdef PREPASS_DEPTH
varying vViewPos: vec3f;
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
varying vNormViewDepth: f32;
#endif
#if defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)
varying vCurrentPosition: vec4f;varying vPreviousPosition: vec4f;
#endif
#endif
`,n.IncludesShadersStoreWGSL[r]||(n.IncludesShadersStoreWGSL[r]=i),a={name:r,shader:i}})),s,c,l,u=e((()=>{t(),s=`oitDeclaration`,c=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#define MAX_DEPTH 99999.0
var oitDepthSamplerSampler: sampler;var oitDepthSampler: texture_2d<f32>;var oitFrontColorSamplerSampler: sampler;var oitFrontColorSampler: texture_2d<f32>;
#endif
`,n.IncludesShadersStoreWGSL[s]||(n.IncludesShadersStoreWGSL[s]=c),l={name:s,shader:c}})),d,f,p,m=e((()=>{t(),d=`textureRepetitionFunctions`,f=`#if TEXTURE_REPETITION_MODE>0
fn _texRepHash4(p: vec2f)->vec4f {return fract(sin(vec4f(
1.0+dot(p,vec2f(37.0,17.0)),
2.0+dot(p,vec2f(11.0,47.0)),
3.0+dot(p,vec2f(41.0,29.0)),
4.0+dot(p,vec2f(23.0,31.0))
))*103.0);}
#endif
#if TEXTURE_REPETITION_MODE==1
fn _texRepSample(tex: texture_2d<f32>,samp: sampler,uv: vec2f)->vec4f {var k: f32=textureSample(tex,samp,0.005*uv).x;var index: f32=k*8.0;var f: f32=fract(index);var i: f32=floor(index+0.5);var ib: f32=floor(index);f=min(f,1.0-f)*2.0;var offa: vec2f=sin(vec2f(3.0,7.0)*i);var offb: vec2f=sin(vec2f(3.0,7.0)*ib);var dx: vec2f=dpdx(uv);var dy: vec2f=dpdy(uv);var cola: vec4f=textureSampleGrad(tex,samp,uv+0.3*offa,dx,dy);var colb: vec4f=textureSampleGrad(tex,samp,uv+0.3*offb,dx,dy);var colSum: f32=cola.x+cola.y+cola.z-colb.x-colb.y-colb.z;return mix(cola,colb,vec4f(smoothstep(0.2,0.8,f-0.1*colSum)));}
#elif TEXTURE_REPETITION_MODE==2
fn _texRepHexHash(p: vec2f)->vec2f {var r: vec2f=mat2x2f(127.1,269.5,311.7,183.3)*p;return fract(sin(r)*43758.5453);}
struct _TexRepTriGrid {w1: f32,
w2: f32,
w3: f32,
vertex1: vec2i,
vertex2: vec2i,
vertex3: vec2i,};fn _texRepTriangleGrid(st_in: vec2f)->_TexRepTriGrid {var st: vec2f=st_in*2.0*sqrt(3.0);var gridToSkewedGrid: mat2x2f=mat2x2f(1.0,0.0,-0.57735027,1.15470054);var skewedCoord: vec2f=gridToSkewedGrid*st;var baseId: vec2i=vec2i(floor(skewedCoord));var temp: vec3f=vec3f(fract(skewedCoord),0.0);temp.z=1.0-temp.x-temp.y;var s: f32=step(0.0,-temp.z);var s2: f32=2.0*s-1.0;var result: _TexRepTriGrid;result.w1=-temp.z*s2;result.w2=s-temp.y*s2;result.w3=s-temp.x*s2;result.vertex1=baseId+vec2i(i32(s),i32(s));result.vertex2=baseId+vec2i(i32(s),i32(1.0-s));result.vertex3=baseId+vec2i(i32(1.0-s),i32(s));return result;}
fn _texRepMakeCenST(Vertex: vec2i)->vec2f {var invSkewMat: mat2x2f=mat2x2f(1.0,0.0,0.5,1.0/1.15470054);return (invSkewMat*vec2f(Vertex))/(2.0*sqrt(3.0));}
fn _texRepLoadRot2x2(idx: vec2i,rotStr: f32)->mat2x2f {var angle: f32=f32(abs(idx.x*idx.y)+abs(idx.x+idx.y))+3.14159265358979;angle=angle % (2.0*3.14159265358979);if (angle<0.0) { angle+=2.0*3.14159265358979; }
if (angle>3.14159265358979) { angle-=3.14159265358979; }
angle*=rotStr;var cs: f32=cos(angle);var si: f32=sin(angle);return mat2x2f(cs,si,-si,cs);}
fn _texRepGain3(x: vec3f,r: f32)->vec3f {var k: f32=log(1.0-r)/log(0.5);var s: vec3f=2.0*step(vec3f(0.5),x);var m: vec3f=2.0*(1.0-s);var res: vec3f=0.5*s+0.25*m*pow(max(vec3f(0.0),s+x*m),vec3f(k));return res/(res.x+res.y+res.z);}
fn _texRepSample(tex: texture_2d<f32>,samp: sampler,uv: vec2f)->vec4f {var rotStrength: f32=uniforms.vTextureRepetitionHexTilingParams.x;var fallOffContrast: f32=uniforms.vTextureRepetitionHexTilingParams.y;var expVal: f32=uniforms.vTextureRepetitionHexTilingParams.z;var r: f32=uniforms.vTextureRepetitionHexTilingParams.w;var dSTdx: vec2f=dpdx(uv);var dSTdy: vec2f=dpdy(uv);var grid: _TexRepTriGrid=_texRepTriangleGrid(uv);var rot1: mat2x2f=_texRepLoadRot2x2(grid.vertex1,rotStrength);var rot2: mat2x2f=_texRepLoadRot2x2(grid.vertex2,rotStrength);var rot3: mat2x2f=_texRepLoadRot2x2(grid.vertex3,rotStrength);var cen1: vec2f=_texRepMakeCenST(grid.vertex1);var cen2: vec2f=_texRepMakeCenST(grid.vertex2);var cen3: vec2f=_texRepMakeCenST(grid.vertex3);var st1: vec2f=(uv-cen1)*rot1+cen1+_texRepHexHash(vec2f(grid.vertex1));var st2: vec2f=(uv-cen2)*rot2+cen2+_texRepHexHash(vec2f(grid.vertex2));var st3: vec2f=(uv-cen3)*rot3+cen3+_texRepHexHash(vec2f(grid.vertex3));var c1: vec4f=textureSampleGrad(tex,samp,st1,dSTdx*rot1,dSTdy*rot1);var c2: vec4f=textureSampleGrad(tex,samp,st2,dSTdx*rot2,dSTdy*rot2);var c3: vec4f=textureSampleGrad(tex,samp,st3,dSTdx*rot3,dSTdy*rot3);var Lw: vec3f=vec3f(0.299,0.587,0.114);var Dw: vec3f=vec3f(dot(c1.rgb,Lw),dot(c2.rgb,Lw),dot(c3.rgb,Lw));Dw=mix(vec3f(1.0),Dw,fallOffContrast);var W: vec3f=Dw*pow(vec3f(grid.w1,grid.w2,grid.w3),vec3f(expVal));W=W/(W.x+W.y+W.z);if (r != 0.5) {W=_texRepGain3(W,r);}
return W.x*c1+W.y*c2+W.z*c3;}
#elif TEXTURE_REPETITION_MODE==3
fn _texRepSample(tex: texture_2d<f32>,samp: sampler,uv: vec2f)->vec4f {var iuv: vec2f=floor(uv);var fuv: vec2f=fract(uv);var ofa: vec4f=_texRepHash4(iuv+vec2f(0.0,0.0));var ofb: vec4f=_texRepHash4(iuv+vec2f(1.0,0.0));var ofc: vec4f=_texRepHash4(iuv+vec2f(0.0,1.0));var ofd: vec4f=_texRepHash4(iuv+vec2f(1.0,1.0));var dx: vec2f=dpdx(uv);var dy: vec2f=dpdy(uv);ofa=vec4f(ofa.xy,sign(ofa.zw-0.5));ofb=vec4f(ofb.xy,sign(ofb.zw-0.5));ofc=vec4f(ofc.xy,sign(ofc.zw-0.5));ofd=vec4f(ofd.xy,sign(ofd.zw-0.5));var uva: vec2f=uv*ofa.zw+ofa.xy; var ddxa: vec2f=dx*ofa.zw; var ddya: vec2f=dy*ofa.zw;var uvb: vec2f=uv*ofb.zw+ofb.xy; var ddxb: vec2f=dx*ofb.zw; var ddyb: vec2f=dy*ofb.zw;var uvc: vec2f=uv*ofc.zw+ofc.xy; var ddxc: vec2f=dx*ofc.zw; var ddyc: vec2f=dy*ofc.zw;var uvd: vec2f=uv*ofd.zw+ofd.xy; var ddxd: vec2f=dx*ofd.zw; var ddyd: vec2f=dy*ofd.zw;var b: vec2f=smoothstep(vec2f(0.25),vec2f(0.75),fuv);return mix(
mix(textureSampleGrad(tex,samp,uva,ddxa,ddya),textureSampleGrad(tex,samp,uvb,ddxb,ddyb),b.x),
mix(textureSampleGrad(tex,samp,uvc,ddxc,ddyc),textureSampleGrad(tex,samp,uvd,ddxd,ddyd),b.x),
b.y
);}
#elif TEXTURE_REPETITION_MODE==4
fn _texRepSample(tex: texture_2d<f32>,samp: sampler,uv: vec2f)->vec4f {var p: vec2f=floor(uv);var f: vec2f=fract(uv);var dx: vec2f=dpdx(uv);var dy: vec2f=dpdy(uv);var va: vec4f=vec4f(0.0);var wt: f32=0.0;var w2: f32=0.0;for (var j: i32=-1; j<=1; j++) {for (var i: i32=-1; i<=1; i++) {var g: vec2f=vec2f(f32(i),f32(j));var o: vec4f=_texRepHash4(p+g);var r: vec2f=g-f+o.xy;var d: f32=dot(r,r);var w: f32=exp(-5.0*d);var c: vec4f=textureSampleGrad(tex,samp,uv+o.zw,dx,dy);va+=w*c;wt+=w;w2+=w*w;}}
var mean: f32=0.3;var res: vec4f=mean+(va-wt*mean)/sqrt(w2);return mix(va/wt,res,0.4);}
#endif
#if TEXTURE_REPETITION_MODE>0
fn TEXRD(t: texture_2d<f32>,ts: sampler,uv: vec2f)->vec4f {return _texRepSample(t,ts,uv);}
#else
fn TEXRD(t: texture_2d<f32>,ts: sampler,uv: vec2f)->vec4f {return textureSample(t,ts,uv);}
#endif
#define TEXRD_DEFINED
`,n.IncludesShadersStoreWGSL[d]||(n.IncludesShadersStoreWGSL[d]=f),p={name:d,shader:f}})),h,g,_,v=e((()=>{t(),h=`oitFragment`,g=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
var fragDepth: f32=fragmentInputs.position.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
var halfFloat: u32=pack2x16float( vec2f(fragDepth));var full: vec2f=unpack2x16float(halfFloat);fragDepth=full.x;
#endif
var fragCoord: vec2i=vec2i(fragmentInputs.position.xy);var lastDepth: vec2f=textureLoad(oitDepthSampler,fragCoord,0).rg;var lastFrontColor: vec4f=textureLoad(oitFrontColorSampler,fragCoord,0);fragmentOutputs.depth=vec2f(-MAX_DEPTH);fragmentOutputs.frontColor=lastFrontColor;fragmentOutputs.backColor= vec4f(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
var furthestDepth: f32=-lastDepth.x;var nearestDepth: f32=lastDepth.y;
#else
var nearestDepth: f32=-lastDepth.x;var furthestDepth: f32=lastDepth.y;
#endif
var alphaMultiplier: f32=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return fragmentOutputs;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
fragmentOutputs.depth=vec2f(-fragDepth,fragDepth);return fragmentOutputs;}
#endif
`,n.IncludesShadersStoreWGSL[h]||(n.IncludesShadersStoreWGSL[h]=g),_={name:h,shader:g}}));export{u as a,a as c,p as i,_ as n,l as o,m as r,o as s,v as t};