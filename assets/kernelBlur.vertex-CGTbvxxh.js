import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./kernelBlurVaryingDeclaration-DrlSXsrz.js";var o,s,c,l=e((()=>{n(),o=`kernelBlurVertex`,s=`sampleCoord{X}=sampleCenter+delta*KERNEL_OFFSET{X};`,r.IncludesShadersStore[o]||(r.IncludesShadersStore[o]=s),c={name:o,shader:s}})),u=t({kernelBlurVertexShader:()=>m}),d,f,p,m,h=e((()=>{n(),a(),l(),d=`kernelBlurVertexShader`,f=`attribute vec2 position;uniform vec2 delta;varying vec2 sampleCenter;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
const vec2 madd=vec2(0.5,0.5);
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
sampleCenter=(position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
gl_Position=vec4(position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStore[d]||(r.ShadersStore[d]=f),p=[i,c];for(let e of p)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);m={name:d,shader:f}}));export{m as n,u as r,h as t};