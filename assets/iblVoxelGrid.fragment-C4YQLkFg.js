import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./iblVoxelOpacityAtomicMax-C-lFMNwY.js";var o=t({iblVoxelGridPixelShaderWGSL:()=>u}),s,c,l,u,d=e((()=>{n(),i(),s=`iblVoxelGridPixelShader`,c=`var voxel_storage: texture_storage_3d<r8unorm,write>;
#ifdef IBL_VOXEL_OPACITY_BUFFER
var<storage,read_write> voxelOpacityBuffer: array<atomic<u32>>;
#include<iblVoxelOpacityAtomicMax>
#endif
varying vNormalizedPosition: vec3f;flat varying f_swizzle: i32;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {var size: vec3<u32>=textureDimensions(voxel_storage);var normPos: vec3f=input.vNormalizedPosition.xyz;switch (input.f_swizzle) {case 0: {normPos=normPos.zxy;break;}
case 1: {normPos=normPos.yzx;break;}
default: {normPos=normPos.xyz;break;}}
let coord: vec3<u32>=min(
vec3<u32>(u32(normPos.x*f32(size.x)),u32(normPos.y*f32(size.y)),u32(normPos.z*f32(size.z))),
size-vec3<u32>(1u));
#ifdef IBL_VOXEL_OPACITY_BUFFER
let vidx: u32=coord.x+coord.y*size.x+coord.z*size.x*size.y;voxelOpacityAtomicMax(vidx,255u);
#else
textureStore(voxel_storage,vec3<i32>(coord),vec4f(1.0,1.0,1.0,1.0));
#endif
fragmentOutputs.color=vec4<f32>(vec3<f32>(normPos),1.);}
`,r.ShadersStoreWGSL[s]||(r.ShadersStoreWGSL[s]=c),l=[a];for(let e of l)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);u={name:s,shader:c}}));export{o as n,d as r,u as t};