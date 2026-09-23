import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{c as i,o as a}from"./fogFragment-DddV-x4-.js";import{r as o,t as s}from"./clipPlaneFragmentDeclaration-BeW0wzU5.js";import{c,s as l}from"./imageProcessingFunctions-C5BKlD0g.js";import{n as u,t as d}from"./logDepthDeclaration-DEg-fR3E.js";var f=t({outlinePixelShader:()=>g}),p,m,h,g,_=e((()=>{n(),o(),d(),i(),l(),p=`outlinePixelShader`,m=`#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
uniform vec4 color;
#ifdef ALPHATEST
varying vec2 vUV;uniform sampler2D diffuseSampler;
#endif
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
discard;
#endif
#include<logDepthFragment>
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[p]||(r.ShadersStore[p]=m),h=[s,u,a,c];for(let e of h)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);g={name:p,shader:m}}));export{g as n,f as r,_ as t};