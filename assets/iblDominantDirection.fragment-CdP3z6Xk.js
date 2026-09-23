import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{r as i,t as a}from"./helperFunctions-CklT_CQT.js";import{n as o,t as s}from"./pbrBRDFFunctions-CWPBPXSx.js";import{i as c,n as l,r as u,t as d}from"./hdrFilteringFunctions-D32dZ0XS.js";var f=t({iblDominantDirectionPixelShaderWGSL:()=>g}),p,m,h,g,_=e((()=>{n(),i(),c(),s(),l(),p=`iblDominantDirectionPixelShader`,m=`#include<helperFunctions>
#include<importanceSampling>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var lightDir: vec3f=vec3f(0.0,0.0,0.0);for(var i: u32=0u; i<NUM_SAMPLES; i++)
{var Xi: vec2f=hammersley(i,NUM_SAMPLES);var T: vec2f;T.x=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(Xi.x,0.0),0.0).x;T.y=textureSampleLevel(icdfSampler,icdfSamplerSampler,vec2(T.x,Xi.y),0.0).y;var Ls: vec3f=uv_to_normal(vec2f(1.0-fract(T.x+0.25),T.y));lightDir+=Ls;}
lightDir/=vec3f(f32(NUM_SAMPLES));fragmentOutputs.color=vec4f(lightDir,1.0);}`,r.ShadersStoreWGSL[p]||(r.ShadersStoreWGSL[p]=m),h=[a,u,o,d];for(let e of h)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);g={name:p,shader:m}}));export{f as n,_ as r,g as t};