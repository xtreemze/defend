import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./bakedVertexAnimationDeclaration-CDQs61LG.js";import{n as o,t as s}from"./bakedVertexAnimation-CR15jBnU.js";import{n as c,t as l}from"./instancesDeclaration-CgXh0JO7.js";import{n as u,t as d}from"./instancesVertex-C56VJhRE.js";import{r as f,t as p}from"./bonesDeclaration-eL-UWn6d.js";import{r as m,t as h}from"./bonesVertex-BiF-eB3j.js";import{a as g,i as _,n as v,t as y}from"./morphTargetsVertexGlobal-CMlR4FjL.js";import{a as b,i as x,n as S,t as C}from"./morphTargetsVertexGlobalDeclaration-9vq-CGk4.js";var w=t({pickingVertexShaderWGSL:()=>O}),T,E,D,O,k=e((()=>{n(),f(),i(),C(),x(),l(),y(),_(),d(),m(),o(),T=`pickingVertexShader`,E=`attribute position: vec3f;
#if defined(INSTANCES)
attribute instanceMeshID: f32;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(INSTANCES)
flat varying vMeshID: f32;
#endif
@vertex
fn main(input : VertexInputs)->FragmentInputs {var positionUpdated: vec3f=vertexInputs.position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld*vec4f(positionUpdated,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#if defined(INSTANCES)
vertexOutputs.vMeshID=vertexInputs.instanceMeshID;
#endif
}
`,r.ShadersStoreWGSL[T]||(r.ShadersStoreWGSL[T]=E),D=[p,a,S,b,c,v,g,u,h,s];for(let e of D)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);O={name:T,shader:E}}));export{O as n,w as r,k as t};