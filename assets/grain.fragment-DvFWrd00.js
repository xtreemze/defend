import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{i,o as a}from"./logDepthDeclaration-DEg-fR3E.js";var o=t({grainPixelShader:()=>u}),s,c,l,u,d=e((()=>{n(),a(),s=`grainPixelShader`,c=`#include<helperFunctions>
uniform sampler2D textureSampler; 
uniform float intensity;uniform float animatedSeed;varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
{gl_FragColor=texture2D(textureSampler,vUV);vec2 seed=vUV*(animatedSeed);float grain=dither(seed,intensity);float lum=getLuminance(gl_FragColor.rgb);float grainAmount=(cos(-PI+(lum*PI*2.))+1.)/2.;gl_FragColor.rgb+=grain*grainAmount;gl_FragColor.rgb=max(gl_FragColor.rgb,0.0);}`,r.ShadersStore[s]||(r.ShadersStore[s]=c),l=[i];for(let e of l)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);u={name:s,shader:c}}));export{o as n,d as r,u as t};