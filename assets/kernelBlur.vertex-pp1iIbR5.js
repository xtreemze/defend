import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./kernelBlurVaryingDeclaration-BF5Wbd6z.js";var o,s,c,l=e((()=>{n(),o=`kernelBlurVertex`,s=`vertexOutputs.sampleCoord{X}=vertexOutputs.sampleCenter+uniforms.delta*KERNEL_OFFSET{X};`,r.IncludesShadersStoreWGSL[o]||(r.IncludesShadersStoreWGSL[o]=s),c={name:o,shader:s}})),u=t({kernelBlurVertexShaderWGSL:()=>m}),d,f,p,m,h=e((()=>{n(),a(),l(),d=`kernelBlurVertexShader`,f=`attribute position: vec2f;uniform delta: vec2f;varying sampleCenter: vec2f;
#include<kernelBlurVaryingDeclaration>[0..varyingCount]
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {const madd: vec2f= vec2f(0.5,0.5);
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.sampleCenter=(vertexInputs.position*madd+madd);
#include<kernelBlurVertex>[0..varyingCount]
vertexOutputs.position= vec4f(vertexInputs.position,0.0,1.0);
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStoreWGSL[d]||(r.ShadersStoreWGSL[d]=f),p=[i,c];for(let e of p)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);m={name:d,shader:f}}));export{m as n,u as r,h as t};