import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i}from"./fogFragment-A7zB_yUn.js";import{t as a}from"./logDepthFragment-BQfCxjhi.js";var o=t({gaussianSplattingFragmentDeclarationWGSL:()=>l}),s,c,l,u=e((()=>{n(),a(),i(),s=`gaussianSplattingFragmentDeclaration`,c=`fn gaussianColor(inColor: vec4f,inPosition: vec2f)->vec4f
{var A : f32=-dot(inPosition,inPosition);if (A>-4.0)
{var B: f32=exp(A)*inColor.a;
#include<logDepthFragment>
var color: vec3f=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4f(color,B);} else {return vec4f(0.0);}}
`,r.IncludesShadersStoreWGSL[s]||(r.IncludesShadersStoreWGSL[s]=c),l={name:s,shader:c}}));export{o as n,u as r,l as t};