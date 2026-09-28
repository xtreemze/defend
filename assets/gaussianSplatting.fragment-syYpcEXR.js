import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as s,n as c,r as l,t as u}from"./fogFragment-A7zB_yUn.js";import{n as d,t as f}from"./logDepthFragment-BQfCxjhi.js";import{r as p,t as m}from"./gaussianSplattingFragmentDeclaration-HDR34cF9.js";import{n as h,t as g}from"./logDepthDeclaration-xoumPMwY.js";import{n as _,t as v}from"./packingFunctions-CRCQ_-qK.js";var y,b,x,S;e((()=>{t(),a(),g(),s(),v(),f(),c(),p(),i(),y=`gaussianSplattingPixelShader`,b=`#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
varying vColor: vec4f;varying vPosition: vec2f;
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<gaussianSplattingFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var finalColor: vec4f=gaussianColor(input.vColor,input.vPosition);
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef GPUPICKER_DEPTH
fragmentOutputs.fragData0=finalColor;
#ifdef GPUPICKER_PACK_DEPTH
fragmentOutputs.fragData1=pack(fragmentInputs.position.z);
#else
fragmentOutputs.fragData1=vec4f(fragmentInputs.position.z,0.0,0.0,1.0);
#endif
#else
fragmentOutputs.color=finalColor;
#endif
#define CUSTOM_FRAGMENT_MAIN_END
}
`,n.ShadersStoreWGSL[y]||(n.ShadersStoreWGSL[y]=b),x=[o,h,l,_,d,u,m,r];for(let e of x)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);S={name:y,shader:b}}))();export{S as gaussianSplattingPixelShaderWGSL};