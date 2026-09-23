import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a,o=e((()=>{t(),r=`decalFragmentDeclaration`,i=`#ifdef DECAL
uniform vec4 vDecalInfos;
#endif
`,n.IncludesShadersStore[r]||(n.IncludesShadersStore[r]=i),a={name:r,shader:i}})),s,c,l,u=e((()=>{t(),s=`prePassDeclaration`,c=`#ifdef PREPASS
#extension GL_EXT_draw_buffers : require
layout(location=0) out highp vec4 glFragData[{X}];highp vec4 gl_FragColor;
#ifdef PREPASS_LOCAL_POSITION
varying highp vec3 vPosition;
#endif
#ifdef PREPASS_DEPTH
varying highp vec3 vViewPos;
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
varying highp float vNormViewDepth;
#endif
#if defined(PREPASS_VELOCITY) || defined(PREPASS_VELOCITY_LINEAR)
varying highp vec4 vCurrentPosition;varying highp vec4 vPreviousPosition;
#endif
#endif
`,n.IncludesShadersStore[s]||(n.IncludesShadersStore[s]=c),l={name:s,shader:c}})),d,f,p,m=e((()=>{t(),d=`oitDeclaration`,f=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#extension GL_EXT_draw_buffers : require
layout(location=0) out vec2 depth; 
layout(location=1) out vec4 frontColor;layout(location=2) out vec4 backColor;
#define MAX_DEPTH 99999.0
highp vec4 gl_FragColor;uniform sampler2D oitDepthSampler;uniform sampler2D oitFrontColorSampler;
#endif
`,n.IncludesShadersStore[d]||(n.IncludesShadersStore[d]=f),p={name:d,shader:f}})),h,g,_,v=e((()=>{t(),h=`textureRepetitionFunctions`,g=`#if TEXTURE_REPETITION_MODE>0
vec4 _texRepHash4(vec2 p) {return fract(sin(vec4(
1.0+dot(p,vec2(37.0,17.0)),
2.0+dot(p,vec2(11.0,47.0)),
3.0+dot(p,vec2(41.0,29.0)),
4.0+dot(p,vec2(23.0,31.0))
))*103.0);}
#endif
#if TEXTURE_REPETITION_MODE==1
vec4 _texRepSample(sampler2D samp,vec2 uv) {float k=texture2D(samp,0.005*uv).x;float index=k*8.0;float f=fract(index);float i=floor(index+0.5);float ib=floor(index);f=min(f,1.0-f)*2.0;vec2 offa=sin(vec2(3.0,7.0)*i);vec2 offb=sin(vec2(3.0,7.0)*ib);vec2 dx=dFdx(uv);vec2 dy=dFdy(uv);vec4 cola=textureGrad(samp,uv+0.3*offa,dx,dy);vec4 colb=textureGrad(samp,uv+0.3*offb,dx,dy);float colSum=cola.x+cola.y+cola.z-colb.x-colb.y-colb.z;return mix(cola,colb,smoothstep(0.2,0.8,f-0.1*colSum));}
#elif TEXTURE_REPETITION_MODE==2
#ifndef TEXTURE_REPETITION_M_PI
#define TEXTURE_REPETITION_M_PI 3.14159265358979
#endif
vec2 _texRepHexHash(vec2 p) {vec2 r=mat2(127.1,269.5,311.7,183.3)*p;return fract(sin(r)*43758.5453);}
void _texRepTriangleGrid(
out float w1,out float w2,out float w3,
out ivec2 vertex1,out ivec2 vertex2,out ivec2 vertex3,
vec2 st
) {st*=2.0*sqrt(3.0);mat2 gridToSkewedGrid=mat2(1.0,0.0,-0.57735027,1.15470054);vec2 skewedCoord=gridToSkewedGrid*st;ivec2 baseId=ivec2(floor(skewedCoord));vec3 temp=vec3(fract(skewedCoord),0.0);temp.z=1.0-temp.x-temp.y;float s=step(0.0,-temp.z);float s2=2.0*s-1.0;w1=-temp.z*s2;w2=s-temp.y*s2;w3=s-temp.x*s2;vertex1=baseId+ivec2(int(s),int(s));vertex2=baseId+ivec2(int(s),int(1.0-s));vertex3=baseId+ivec2(int(1.0-s),int(s));}
vec2 _texRepMakeCenST(ivec2 Vertex) {mat2 invSkewMat=mat2(1.0,0.0,0.5,1.0/1.15470054);return (invSkewMat*vec2(Vertex))/(2.0*sqrt(3.0));}
mat2 _texRepLoadRot2x2(ivec2 idx,float rotStr) {float angle=float(abs(idx.x*idx.y)+abs(idx.x+idx.y))+TEXTURE_REPETITION_M_PI;angle=mod(angle,2.0*TEXTURE_REPETITION_M_PI);if (angle<0.0) angle+=2.0*TEXTURE_REPETITION_M_PI;if (angle>TEXTURE_REPETITION_M_PI) angle-=TEXTURE_REPETITION_M_PI;angle*=rotStr;float cs=cos(angle);float si=sin(angle);return mat2(cs,si,-si,cs);}
vec3 _texRepGain3(vec3 x,float r) {float k=log(1.0-r)/log(0.5);vec3 s=2.0*step(0.5,x);vec3 m=2.0*(1.0-s);vec3 res=0.5*s+0.25*m*pow(max(vec3(0.0),s+x*m),vec3(k));return res/(res.x+res.y+res.z);}
vec4 _texRepSample(sampler2D samp,vec2 uv) {float rotStrength=vTextureRepetitionHexTilingParams.x;float fallOffContrast=vTextureRepetitionHexTilingParams.y;float expVal=vTextureRepetitionHexTilingParams.z;float r=vTextureRepetitionHexTilingParams.w;vec2 dSTdx=dFdx(uv);vec2 dSTdy=dFdy(uv);float w1,w2,w3;ivec2 vertex1,vertex2,vertex3;_texRepTriangleGrid(w1,w2,w3,vertex1,vertex2,vertex3,uv);mat2 rot1=_texRepLoadRot2x2(vertex1,rotStrength);mat2 rot2=_texRepLoadRot2x2(vertex2,rotStrength);mat2 rot3=_texRepLoadRot2x2(vertex3,rotStrength);vec2 cen1=_texRepMakeCenST(vertex1);vec2 cen2=_texRepMakeCenST(vertex2);vec2 cen3=_texRepMakeCenST(vertex3);vec2 st1=(uv-cen1)*rot1+cen1+_texRepHexHash(vec2(vertex1));vec2 st2=(uv-cen2)*rot2+cen2+_texRepHexHash(vec2(vertex2));vec2 st3=(uv-cen3)*rot3+cen3+_texRepHexHash(vec2(vertex3));vec4 c1=textureGrad(samp,st1,dSTdx*rot1,dSTdy*rot1);vec4 c2=textureGrad(samp,st2,dSTdx*rot2,dSTdy*rot2);vec4 c3=textureGrad(samp,st3,dSTdx*rot3,dSTdy*rot3);vec3 Lw=vec3(0.299,0.587,0.114);vec3 Dw=vec3(dot(c1.rgb,Lw),dot(c2.rgb,Lw),dot(c3.rgb,Lw));Dw=mix(vec3(1.0),Dw,fallOffContrast);vec3 W=Dw*pow(vec3(w1,w2,w3),vec3(expVal));W/=(W.x+W.y+W.z);if (r != 0.5) {W=_texRepGain3(W,r);}
return W.x*c1+W.y*c2+W.z*c3;}
#elif TEXTURE_REPETITION_MODE==3
vec4 _texRepSample(sampler2D samp,vec2 uv) {vec2 iuv=floor(uv);vec2 fuv=fract(uv);vec4 ofa=_texRepHash4(iuv+vec2(0.0,0.0));vec4 ofb=_texRepHash4(iuv+vec2(1.0,0.0));vec4 ofc=_texRepHash4(iuv+vec2(0.0,1.0));vec4 ofd=_texRepHash4(iuv+vec2(1.0,1.0));vec2 dx=dFdx(uv);vec2 dy=dFdy(uv);ofa.zw=sign(ofa.zw-0.5);ofb.zw=sign(ofb.zw-0.5);ofc.zw=sign(ofc.zw-0.5);ofd.zw=sign(ofd.zw-0.5);vec2 uva=uv*ofa.zw+ofa.xy; vec2 ddxa=dx*ofa.zw; vec2 ddya=dy*ofa.zw;vec2 uvb=uv*ofb.zw+ofb.xy; vec2 ddxb=dx*ofb.zw; vec2 ddyb=dy*ofb.zw;vec2 uvc=uv*ofc.zw+ofc.xy; vec2 ddxc=dx*ofc.zw; vec2 ddyc=dy*ofc.zw;vec2 uvd=uv*ofd.zw+ofd.xy; vec2 ddxd=dx*ofd.zw; vec2 ddyd=dy*ofd.zw;vec2 b=smoothstep(0.25,0.75,fuv);return mix(
mix(textureGrad(samp,uva,ddxa,ddya),textureGrad(samp,uvb,ddxb,ddyb),b.x),
mix(textureGrad(samp,uvc,ddxc,ddyc),textureGrad(samp,uvd,ddxd,ddyd),b.x),
b.y
);}
#elif TEXTURE_REPETITION_MODE==4
vec4 _texRepSample(sampler2D samp,vec2 uv) {vec2 p=floor(uv);vec2 f=fract(uv);vec2 dx=dFdx(uv);vec2 dy=dFdy(uv);vec4 va=vec4(0.0);float wt=0.0;float w2=0.0;for (int j=-1; j<=1; j++) {for (int i=-1; i<=1; i++) {vec2 g=vec2(float(i),float(j));vec4 o=_texRepHash4(p+g);vec2 r=g-f+o.xy;float d=dot(r,r);float w=exp(-5.0*d);vec4 c=textureGrad(samp,uv+o.zw,dx,dy);va+=w*c;wt+=w;w2+=w*w;}}
float mean=0.3;vec4 res=mean+(va-wt*mean)/sqrt(w2);return mix(va/wt,res,0.4);}
#endif
#if TEXTURE_REPETITION_MODE>0
#define TEXRD(s,uv) _texRepSample(s,uv)
#else
#define TEXRD(s,uv) texture2D(s,uv)
#endif
#define TEXRD_DEFINED
`,n.IncludesShadersStore[h]||(n.IncludesShadersStore[h]=g),_={name:h,shader:g}})),y,b,x,S=e((()=>{t(),y=`oitFragment`,b=`#ifdef ORDER_INDEPENDENT_TRANSPARENCY
float fragDepth=gl_FragCoord.z; 
#ifdef ORDER_INDEPENDENT_TRANSPARENCY_16BITS
uint halfFloat=packHalf2x16(vec2(fragDepth));vec2 full=unpackHalf2x16(halfFloat);fragDepth=full.x;
#endif
ivec2 fragCoord=ivec2(gl_FragCoord.xy);vec2 lastDepth=texelFetch(oitDepthSampler,fragCoord,0).rg;vec4 lastFrontColor=texelFetch(oitFrontColorSampler,fragCoord,0);depth.rg=vec2(-MAX_DEPTH);frontColor=lastFrontColor;backColor=vec4(0.0);
#ifdef USE_REVERSE_DEPTHBUFFER
float furthestDepth=-lastDepth.x;float nearestDepth=lastDepth.y;
#else
float nearestDepth=-lastDepth.x;float furthestDepth=lastDepth.y;
#endif
float alphaMultiplier=1.0-lastFrontColor.a;
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth>nearestDepth || fragDepth<furthestDepth) {
#else
if (fragDepth<nearestDepth || fragDepth>furthestDepth) {
#endif
return;}
#ifdef USE_REVERSE_DEPTHBUFFER
if (fragDepth<nearestDepth && fragDepth>furthestDepth) {
#else
if (fragDepth>nearestDepth && fragDepth<furthestDepth) {
#endif
depth.rg=vec2(-fragDepth,fragDepth);return;}
#endif
`,n.IncludesShadersStore[y]||(n.IncludesShadersStore[y]=b),x={name:y,shader:b}}));export{m as a,l as c,_ as i,a as l,x as n,p as o,v as r,u as s,S as t,o as u};