import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{r,t as i}from"./helperFunctions-CklT_CQT.js";import{i as a,o,r as s,t as c}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as l,n as u,r as d,t as f}from"./fogFragment-A7zB_yUn.js";import{n as p,t as m}from"./logDepthFragment-BQfCxjhi.js";import{i as h,o as g,r as _,t as v}from"./imageProcessingFunctions-C1qXJQoS.js";import{n as y,t as b}from"./logDepthDeclaration-xoumPMwY.js";var x,S,C,w;e((()=>{t(),s(),g(),b(),r(),_(),l(),o(),m(),u(),x=`gpuRenderParticlesPixelShader`,S=`var diffuseSamplerSampler: sampler;var diffuseSampler: texture_2d<f32>;varying vUV: vec2f;varying vColor: vec4f;
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
`,n.ShadersStoreWGSL[x]||(n.ShadersStoreWGSL[x]=S),C=[c,h,y,i,v,d,a,p,f];for(let e of C)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);w={name:x,shader:S}}))();export{w as gpuRenderParticlesPixelShaderWGSL};