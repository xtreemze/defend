import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./bakedVertexAnimationDeclaration-CDQs61LG.js";import{n as o,t as s}from"./bakedVertexAnimation-CR15jBnU.js";import{n as c,t as l}from"./instancesDeclaration-CgXh0JO7.js";import{n as u,t as d}from"./instancesVertex-C56VJhRE.js";import{r as f,t as p}from"./bonesDeclaration-eL-UWn6d.js";import{r as m,t as h}from"./bonesVertex-BiF-eB3j.js";import{i as g,o as _,r as v,t as y}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{n as b,t as x}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as S,t as C}from"./fogVertex-HgX-n4Ue.js";import{n as w,t as T}from"./vertexColorMixing-D1xGglgB.js";var E=t({colorVertexShaderWGSL:()=>A}),D,O,k,A,j=e((()=>{n(),f(),i(),v(),b(),l(),d(),m(),o(),_(),S(),T(),D=`colorVertexShader`,O=`attribute position: vec3f;
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
}`,r.ShadersStoreWGSL[D]||(r.ShadersStoreWGSL[D]=O),k=[p,a,y,x,c,u,h,s,g,C,w];for(let e of k)r.IncludesShadersStoreWGSL[e.name]||(r.IncludesShadersStoreWGSL[e.name]=e.shader);A={name:D,shader:O}}));export{E as n,j as r,A as t};