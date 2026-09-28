import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{n as r,t as i}from"./iblVoxelOpacityAtomicMax-C-lFMNwY.js";var a,o,s,c;e((()=>{t(),r(),a=`gaussianSplattingVoxelPixelShader`,o=`var voxel_storage: texture_storage_3d<r8unorm,write>;var<storage,read_write> voxelOpacityBuffer: array<atomic<u32>>;
#include<iblVoxelOpacityAtomicMax>
varying vNormalizedPosition: vec3f;varying vNormalizedCenterPosition: vec3f;varying vAlpha: f32;varying vPatchPosition: vec2f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {let normPos: vec3f=input.vNormalizedPosition;let size: vec3<u32>=textureDimensions(voxel_storage);let stepSize: f32=1.0/f32(size.x);let diff: vec3f=abs(input.vNormalizedCenterPosition-normPos);let distToCenter: f32=max(max(diff.x,diff.y),diff.z);let gaussian: f32=exp(-dot(input.vPatchPosition,input.vPatchPosition));let shadowingOpacity: f32=clamp(
select(gaussian,1.0,distToCenter<stepSize)*input.vAlpha,
0.0,1.0
);if (shadowingOpacity<=0.0) {discard;}
let coord: vec3<u32>=min(
vec3<u32>(u32(normPos.x*f32(size.x)),u32(normPos.y*f32(size.y)),u32(normPos.z*f32(size.z))),
size-vec3<u32>(1u));let vidx: u32=coord.x+coord.y*size.x+coord.z*size.x*size.y;voxelOpacityAtomicMax(vidx,u32(shadowingOpacity*255.0+0.5));fragmentOutputs.color=vec4f(0.0,0.0,0.0,0.0);}
`,n.ShadersStoreWGSL[a]||(n.ShadersStoreWGSL[a]=o),s=[i];for(let e of s)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);c={name:a,shader:o}}))();export{c as gaussianSplattingVoxelPixelShaderWGSL};