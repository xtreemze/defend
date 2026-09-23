import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({circleOfConfusionPixelShaderWGSL:()=>s}),a,o,s,c=e((()=>{n(),a=`circleOfConfusionPixelShader`,o=`varying vUV: vec2f;var depthSamplerSampler: sampler;var depthSampler: texture_2d<f32>;
#ifndef COC_DEPTH_NOT_NORMALIZED
uniform cameraMinMaxZ: vec2f;
#endif
uniform focusDistance: f32;uniform cocPrecalculation: f32;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var depth: f32=textureSample(depthSampler,depthSamplerSampler,input.vUV).r;
#define CUSTOM_COC_DEPTH
#ifdef COC_DEPTH_NOT_NORMALIZED
let pixelDistance=depth*1000.0;
#else
let pixelDistance: f32=(uniforms.cameraMinMaxZ.x+uniforms.cameraMinMaxZ.y*depth)*1000.0; 
#endif
#define CUSTOM_COC_PIXELDISTANCE
var coc: f32=abs(uniforms.cocPrecalculation*((uniforms.focusDistance-pixelDistance)/pixelDistance));coc=clamp(coc,0.0,1.0);fragmentOutputs.color= vec4f(coc,coc,coc,1.0);}
`,r.ShadersStoreWGSL[a]||(r.ShadersStoreWGSL[a]=o),s={name:a,shader:o}}));export{i as n,c as r,s as t};