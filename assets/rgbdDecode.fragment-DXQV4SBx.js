import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i,t as a}from"./helperFunctions-CklT_CQT.js";var o=t({rgbdDecodePixelShaderWGSL:()=>u}),s,c,l,u,d=e((()=>{n(),i(),s=`rgbdDecodePixelShader`,c=`varying vUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;
#include<helperFunctions>
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(fromRGBD(textureSample(textureSampler,textureSamplerSampler,input.vUV)),1.0);}`,r.ShadersStoreWGSL[s]||(r.ShadersStoreWGSL[s]=c),l=[a];for(let e of l)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);u={name:s,shader:c}}));export{u as n,o as r,d as t};