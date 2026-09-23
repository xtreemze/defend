import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{i,o as a}from"./logDepthDeclaration-DEg-fR3E.js";var o=t({rgbdEncodePixelShader:()=>u}),s,c,l,u,d=e((()=>{n(),a(),s=`rgbdEncodePixelShader`,c=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`,r.ShadersStore[s]||(r.ShadersStore[s]=c),l=[i];for(let e of l)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);u={name:s,shader:c}}));export{u as n,o as r,d as t};