import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i}from"./fogFragment-DddV-x4-.js";import{s as a}from"./imageProcessingFunctions-C5BKlD0g.js";var o=t({gaussianSplattingFragmentDeclaration:()=>l}),s,c,l,u=e((()=>{n(),a(),i(),s=`gaussianSplattingFragmentDeclaration`,c=`vec4 gaussianColor(vec4 inColor)
{float A=-dot(vPosition,vPosition);if (A<-4.0) discard;float B=exp(A)*inColor.a;
#include<logDepthFragment>
vec3 color=inColor.rgb;
#ifdef FOG
#include<fogFragment>
#endif
return vec4(color,B);}
`,r.IncludesShadersStore[s]||(r.IncludesShadersStore[s]=c),l={name:s,shader:c}}));export{o as n,u as r,l as t};