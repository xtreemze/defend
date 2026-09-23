import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{r as s,t as c}from"./gaussianSplatting-Cq57nHDl.js";import{r as l,t as u}from"./helperFunctions-CklT_CQT.js";import{n as d,t as f}from"./logDepthDeclaration-xoumPMwY.js";import{n as p,t as m}from"./sceneUboDeclaration-BucOHbCW.js";import{n as h,t as g}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as _,t as v}from"./fogVertex-HgX-n4Ue.js";import{n as y,t as b}from"./logDepthVertex-Bse0Ofhz.js";import{n as x,t as S}from"./meshUboDeclaration-DDlgBu5O.js";var C,w,T,E;e((()=>{t(),m(),S(),l(),a(),h(),f(),s(),i(),_(),b(),C=`gaussianSplattingVertexShader`,w=`#include<sceneUboDeclaration>
#include<meshUboDeclaration>
#include<helperFunctions>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#include<logDepthDeclaration>
attribute splatIndex0: vec4f;attribute splatIndex1: vec4f;attribute splatIndex2: vec4f;attribute splatIndex3: vec4f;attribute position: vec3f;uniform invViewport: vec2f;uniform dataTextureSize: vec2f;uniform focal: vec2f;uniform kernelSize: f32;uniform minPixelSize: f32;uniform eyePosition: vec3f;uniform alpha: f32;
#if IS_COMPOUND
uniform partWorld: array<mat4x4<f32>,MAX_PART_COUNT>;uniform partVisibility: array<f32,MAX_PART_COUNT>;
#endif
var covariancesATexture: texture_2d<f32>;var covariancesBTexture: texture_2d<f32>;var centersTexture: texture_2d<f32>;var colorsTexture: texture_2d<f32>;
#ifdef USE_SOG
var sogQuatsTexture: texture_2d<f32>;uniform sogMeansMin: vec3f;uniform sogMeansMax: vec3f;
#ifdef USE_SOG_V2
var sogCodebookTexture: texture_2d<f32>;
#else
uniform sogScalesMin: vec3f;uniform sogScalesMax: vec3f;uniform sogSh0Min: vec4f;uniform sogSh0Max: vec4f;uniform sogShnMin: f32;uniform sogShnMax: f32;
#endif
#if SH_DEGREE>0
var sogShNCentroidsTexture: texture_2d<f32>;var sogShNLabelsTexture: texture_2d<f32>;uniform sogShCoeffCount: f32;
#endif
#endif
#if SH_DEGREE>0 && !defined(USE_SOG)
var shTexture0: texture_2d<u32>;
#endif
#if SH_DEGREE>1 && !defined(USE_SOG)
var shTexture1: texture_2d<u32>;
#endif
#if SH_DEGREE>2 && !defined(USE_SOG)
var shTexture2: texture_2d<u32>;
#endif
#if SH_DEGREE>3 && !defined(USE_SOG)
var shTexture3: texture_2d<u32>;var shTexture4: texture_2d<u32>;
#endif
#if IS_COMPOUND
var partIndicesTexture: texture_2d<f32>;
#endif
varying vColor: vec4f;varying vPosition: vec2f;
#define CUSTOM_VERTEX_DEFINITIONS
#include<gaussianSplatting>
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
let splatIndex: f32=getSplatIndex(i32(vertexInputs.position.z+0.5),vertexInputs.splatIndex0,vertexInputs.splatIndex1,vertexInputs.splatIndex2,vertexInputs.splatIndex3);var splat: Splat=readSplat(splatIndex,uniforms.dataTextureSize);var covA: vec3f=splat.covA.xyz;var covB: vec3f=vec3f(splat.covA.w,splat.covB.xy);
#if IS_COMPOUND
let splatWorld: mat4x4f=getPartWorld(splat.partIndex);
#else
let splatWorld: mat4x4f=mesh.world;
#endif
let worldPos: vec4f=splatWorld*vec4f(splat.center.xyz,1.0);vertexOutputs.vPosition=vertexInputs.position.xy;
#if SH_DEGREE>0
let worldRot: mat3x3f= mat3x3f(splatWorld[0].xyz,splatWorld[1].xyz,splatWorld[2].xyz);let normWorldRot: mat3x3f=inverseMat3(worldRot);var eyeToSplatLocalSpace: vec3f=normalize(normWorldRot*(worldPos.xyz-uniforms.eyePosition.xyz));
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
{let _row3=textureLoad(dbgPartData,vec2i(i32(splat.partIndex),3),0);
#if SH_DEGREE>3
let _so4=textureLoad(dbgPartData,vec2i(i32(splat.partIndex),4),0).x;
#else
let _so4: f32=1.0;
#endif
vertexOutputs.vColor=vec4f(_row3.x*splat.color.xyz+computeSHWeighted(splat,eyeToSplatLocalSpace,_row3.y,_row3.z,_row3.w,_so4),splat.color.w*uniforms.alpha);}
#elif defined(GS_DBG_ENABLED) && GS_DBG_SH_DC==0
vertexOutputs.vColor=vec4f(computeSH(splat,eyeToSplatLocalSpace),splat.color.w*uniforms.alpha);
#else
vertexOutputs.vColor=vec4f(splat.color.xyz+computeSH(splat,eyeToSplatLocalSpace),splat.color.w*uniforms.alpha);
#endif
#else
#if defined(GS_DBG_ENABLED) && IS_COMPOUND
{let _shDc=textureLoad(dbgPartData,vec2i(i32(splat.partIndex),3),0).x;vertexOutputs.vColor=vec4f(_shDc*splat.color.xyz,splat.color.w*uniforms.alpha);}
#elif defined(GS_DBG_ENABLED) && GS_DBG_SH_DC==0
vertexOutputs.vColor=vec4f(0.0,0.0,0.0,splat.color.w*uniforms.alpha);
#else
vertexOutputs.vColor=vec4f(splat.color.xyz,splat.color.w*uniforms.alpha);
#endif
#endif
#if IS_COMPOUND
vertexOutputs.vColor.w*=uniforms.partVisibility[splat.partIndex];
#endif
var scale: vec2f=vec2f(1.,1.);
#define CUSTOM_VERTEX_UPDATE
vertexOutputs.position=gaussianSplatting(vertexInputs.position.xy,worldPos.xyz,scale,covA,covB,splatWorld,scene.view,scene.projection,uniforms.focal,uniforms.invViewport,uniforms.kernelSize,uniforms.minPixelSize);
#include<clipPlaneVertex>
#include<fogVertex>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[C]||(n.ShadersStoreWGSL[C]=w),T=[p,x,u,o,g,d,c,r,v,y];for(let e of T)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);E={name:C,shader:w}}))();export{E as gaussianSplattingVertexShaderWGSL};