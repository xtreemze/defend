import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,n as a,r as o,t as s}from"./bakedVertexAnimationDeclaration-BdTqsGYI.js";import{a as c,n as l,r as u,t as d}from"./bakedVertexAnimation-AyKP8k-z.js";import{i as f,o as p,r as m,t as h}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{n as g,t as _}from"./instancesDeclaration-CgXh0JO7.js";import{n as v,t as y}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as b,t as x}from"./instancesVertex-C56VJhRE.js";import{n as S,t as C}from"./fogVertex-HgX-n4Ue.js";import{n as w,t as T}from"./vertexColorMixing-D1xGglgB.js";var E=t({colorVertexShaderWGSL:()=>A}),D,O,k,A,j=e((()=>{n(),i(),a(),m(),v(),_(),x(),c(),l(),p(),S(),T(),D=`colorVertexShader`,O=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform view: mat4x4f;
#endif
#include<instancesDeclaration>
uniform viewProjection: mat4x4f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStoreWGSL[D]||(r.ShadersStoreWGSL[D]=O),k=[o,s,h,y,g,b,u,d,f,C,w];for(let e of k)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);A={name:D,shader:O}}));export{E as n,j as r,A as t};