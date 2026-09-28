import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./bakedVertexAnimationDeclaration-CDQs61LG.js";import{n as o,t as s}from"./bakedVertexAnimation-CR15jBnU.js";import{n as c,t as l}from"./instancesDeclaration-CgXh0JO7.js";import{n as u,t as d}from"./instancesVertex-C56VJhRE.js";import{r as f,t as p}from"./bonesDeclaration-eL-UWn6d.js";import{r as m,t as h}from"./bonesVertex-BiF-eB3j.js";import{i as g,o as _,r as v,t as y}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{a as b,i as x,n as S,t as C}from"./morphTargetsVertexGlobal-CMlR4FjL.js";import{a as w,i as T,n as E,t as D}from"./morphTargetsVertexGlobalDeclaration-9vq-CGk4.js";var O=t({depthVertexShaderWGSL:()=>M}),k,A,j,M,N=e((()=>{n(),f(),i(),D(),T(),v(),l(),C(),x(),d(),m(),o(),_(),k=`depthVertexShader`,A=`attribute position: vec3f;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;uniform depthValues: vec2f;
#if defined(ALPHATEST) || defined(NEED_UV)
varying vUV: vec2f;uniform diffuseMatrix: mat4x4f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#endif
#ifdef STORE_CAMERASPACE_Z
uniform view: mat4x4f;varying vViewPos: vec4f;
#endif
varying vDepthMetric: f32;
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#ifdef UV1
var uvUpdated: vec2f=vertexInputs.uv;
#endif
#ifdef UV2
var uv2Updated: vec2f=vertexInputs.uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(positionUpdated,1.0);
#include<clipPlaneVertex>
vertexOutputs.position=uniforms.viewProjection*worldPos;
#ifdef STORE_CAMERASPACE_Z
vertexOutputs.vViewPos=uniforms.view*worldPos;
#else
#ifdef USE_REVERSE_DEPTHBUFFER
vertexOutputs.vDepthMetric=((-vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#else
vertexOutputs.vDepthMetric=((vertexOutputs.position.z+uniforms.depthValues.x)/(uniforms.depthValues.y));
#endif
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uvUpdated,1.0,0.0)).xy;
#endif
#ifdef UV2
vertexOutputs.vUV= (uniforms.diffuseMatrix* vec4f(uv2Updated,1.0,0.0)).xy;
#endif
#endif
}
`,r.ShadersStoreWGSL[k]||(r.ShadersStoreWGSL[k]=A),j=[p,a,E,w,y,c,S,b,u,h,s,g];for(let e of j)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);M={name:k,shader:A}}));export{O as n,N as r,M as t};