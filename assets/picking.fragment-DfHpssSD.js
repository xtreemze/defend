import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./packingFunctions-CRCQ_-qK.js";var o=t({pickingPixelShaderWGSL:()=>u}),s,c,l,u,d=e((()=>{n(),a(),s=`pickingPixelShader`,c=`#if defined(INSTANCES)
flat varying vMeshID: f32;
#else
uniform meshID: f32;
#endif
#ifdef GPUPICKER_PACK_DEPTH
#include<packingFunctions>
#endif
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var id: i32;
#if defined(INSTANCES)
id=i32(input.vMeshID);
#else
id=i32(uniforms.meshID);
#endif
var color=vec3f(
f32((id>>16) & 0xFF),
f32((id>>8) & 0xFF),
f32(id & 0xFF),
)/255.0;
#ifdef GPUPICKER_DEPTH
fragmentOutputs.fragData0=vec4f(color,1.0);
#ifdef GPUPICKER_PACK_DEPTH
fragmentOutputs.fragData1=pack(fragmentInputs.position.z);
#else
fragmentOutputs.fragData1=vec4f(fragmentInputs.position.z,0.0,0.0,1.0);
#endif
#else
fragmentOutputs.color=vec4f(color,1.0);
#endif
}
`,r.ShadersStoreWGSL[s]||(r.ShadersStoreWGSL[s]=c),l=[i];for(let e of l)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);u={name:s,shader:c}}));export{u as n,o as r,d as t};