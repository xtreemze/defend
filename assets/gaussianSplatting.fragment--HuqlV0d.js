import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{a as r,c as i,n as a,o,r as s,t as c}from"./fogFragment-DddV-x4-.js";import{r as l,t as u}from"./clipPlaneFragmentDeclaration-BeW0wzU5.js";import{c as d,s as f}from"./imageProcessingFunctions-C5BKlD0g.js";import{r as p,t as m}from"./gaussianSplattingFragmentDeclaration-bC_SJClx.js";import{n as h,t as g}from"./logDepthDeclaration-DEg-fR3E.js";import{n as _,t as v}from"./packingFunctions-Dcmyk7BJ.js";var y,b,x,S;e((()=>{t(),l(),g(),r(),v(),f(),a(),p(),i(),y=`gaussianSplattingPixelShader`,b=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef GPUPICKER_DEPTH
layout(location=0) out highp vec4 glFragData[2];
#endif
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
varying vec4 vColor;varying vec2 vPosition;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
void main () {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec4 finalColor=gaussianColor(vColor);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef GPUPICKER_DEPTH
glFragData[0]=finalColor;
#ifdef GPUPICKER_PACK_DEPTH
glFragData[1]=pack(gl_FragCoord.z);
#else
glFragData[1]=vec4(gl_FragCoord.z,0.0,0.0,1.0);
#endif
#else
gl_FragColor=finalColor;
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`,n.ShadersStore[y]||(n.ShadersStore[y]=b),x=[u,h,s,_,d,c,m,o];for(let e of x)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);S={name:y,shader:b}}))();export{S as gaussianSplattingPixelShader};