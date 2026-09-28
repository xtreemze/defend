import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({boundingBoxRendererPixelShaderWGSL:()=>s}),a,o,s,c=e((()=>{n(),a=`boundingBoxRendererPixelShader`,o=`uniform color: vec4f;
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
fragmentOutputs.color=uniforms.color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStoreWGSL[a]||(r.ShadersStoreWGSL[a]=o),s={name:a,shader:o}}));export{i as n,c as r,s as t};