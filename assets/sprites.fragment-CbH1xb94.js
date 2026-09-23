import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,n as a,r as o,t as s}from"./fogFragment-DddV-x4-.js";import{c,s as l}from"./imageProcessingFunctions-C5BKlD0g.js";import{n as u,t as d}from"./logDepthDeclaration-DEg-fR3E.js";import{n as f,t as p}from"./imageProcessingCompatibility-CBHq_lTp.js";var m=t({spritesPixelShader:()=>v}),h,g,_,v,y=e((()=>{n(),i(),d(),l(),a(),f(),h=`spritesPixelShader`,g=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform bool alphaTest;varying vec4 vColor;varying vec2 vUV;uniform sampler2D diffuseSampler;
#include<fogFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
#ifdef PIXEL_PERFECT
vec2 uvPixelPerfect(vec2 uv) {vec2 res=vec2(textureSize(diffuseSampler,0));uv=uv*res;vec2 seam=floor(uv+0.5);uv=seam+clamp((uv-seam)/fwidth(uv),-0.5,0.5);return uv/res;}
#endif
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#ifdef PIXEL_PERFECT
vec2 uv=uvPixelPerfect(vUV);
#else
vec2 uv=vUV;
#endif
vec4 color=texture2D(diffuseSampler,uv);float fAlphaTest=float(alphaTest);if (fAlphaTest != 0.)
{if (color.a<0.95)
discard;}
color*=vColor;
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[h]||(r.ShadersStore[h]=g),_=[o,u,c,s,p];for(let e of _)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);v={name:h,shader:g}}));export{v as n,m as r,y as t};