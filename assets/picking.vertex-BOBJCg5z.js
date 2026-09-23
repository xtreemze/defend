import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,n as a,r as o,t as s}from"./bakedVertexAnimationDeclaration-BdTqsGYI.js";import{a as c,n as l,r as u,t as d}from"./bakedVertexAnimation-AyKP8k-z.js";import{a as f,i as p,n as m,t as h}from"./morphTargetsVertexGlobal-CMlR4FjL.js";import{a as g,i as _,n as v,t as y}from"./morphTargetsVertexGlobalDeclaration-9vq-CGk4.js";import{n as b,t as x}from"./instancesDeclaration-CgXh0JO7.js";import{n as S,t as C}from"./instancesVertex-C56VJhRE.js";var w=t({pickingVertexShaderWGSL:()=>O}),T,E,D,O,k=e((()=>{n(),i(),a(),y(),_(),x(),h(),p(),C(),c(),l(),T=`pickingVertexShader`,E=`attribute position: vec3f;
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
`,r.ShadersStoreWGSL[T]||(r.ShadersStoreWGSL[T]=E),D=[o,s,v,g,b,m,f,S,u,d];for(let e of D)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);O={name:T,shader:E}}));export{O as n,w as r,k as t};