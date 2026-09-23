import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as s,n as c,r as l,t as u}from"./fogFragment-A7zB_yUn.js";import{n as d,t as f}from"./logDepthFragment-BQfCxjhi.js";import{r as p,t as m}from"./helperFunctions-CklT_CQT.js";import{i as h,o as g,r as _,t as v}from"./imageProcessingFunctions-C1qXJQoS.js";import{n as y,t as b}from"./logDepthDeclaration-xoumPMwY.js";var x,S,C,w;e((()=>{t(),a(),g(),b(),p(),_(),s(),i(),f(),c(),x=`gpuRenderParticlesPixelShader`,S=`var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;varying vUV: vec2f;varying vColor: vec4f;
#include<clipPlaneFragmentDeclaration>
#include<imageProcessingDeclaration>
#include<logDepthDeclaration>
#include<helperFunctions>
#include<imageProcessingFunctions>
#include<fogFragmentDeclaration>
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#include<clipPlaneFragment>
let textureColor: vec4f=textureSample(diffuseSampler,diffuseSamplerSampler,input.vUV);var baseColor: vec4f=textureColor*input.vColor;
#ifdef BLENDMULTIPLYMODE
let alpha: f32=input.vColor.a*textureColor.a;baseColor=vec4f(baseColor.rgb*alpha+vec3f(1.0)*(1.0-alpha),baseColor.a);
#endif
#include<logDepthFragment>
#include<fogFragment>(color,baseColor)
#ifdef IMAGEPROCESSINGPOSTPROCESS
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);
#else
#ifdef IMAGEPROCESSING
baseColor=vec4f(toLinearSpaceVec3(baseColor.rgb),baseColor.a);baseColor=applyImageProcessing(baseColor);
#endif
#endif
fragmentOutputs.color=baseColor;}
`,n.ShadersStoreWGSL[x]||(n.ShadersStoreWGSL[x]=S),C=[o,h,y,m,v,l,r,d,u];for(let e of C)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);w={name:x,shader:S}}))();export{w as gpuRenderParticlesPixelShaderWGSL};