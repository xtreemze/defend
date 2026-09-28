import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i,t as a}from"./helperFunctions-DuK_NHiY.js";var o=t({rgbdEncodePixelShader:()=>u}),s,c,l,u,d=e((()=>{n(),i(),s=`rgbdEncodePixelShader`,c=`varying vec2 vUV;uniform sampler2D textureSampler;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) 
{gl_FragColor=toRGBD(texture2D(textureSampler,vUV).rgb);}`,r.ShadersStore[s]||(r.ShadersStore[s]=c),l=[a];for(let e of l)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);u={name:s,shader:c}}));export{u as n,o as r,d as t};