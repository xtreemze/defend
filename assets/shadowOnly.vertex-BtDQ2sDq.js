import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{n as r,t as i}from"./bakedVertexAnimationDeclaration-CDQs61LG.js";import{n as a,t as o}from"./bakedVertexAnimation-CR15jBnU.js";import{n as s,t as c}from"./instancesDeclaration-CgXh0JO7.js";import{n as l,t as u}from"./instancesVertex-C56VJhRE.js";import{n as d,t as f}from"./sceneUboDeclaration-BucOHbCW.js";import{r as p,t as m}from"./bonesDeclaration-eL-UWn6d.js";import{r as h,t as g}from"./bonesVertex-BiF-eB3j.js";import{i as _,o as v,r as y,t as b}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{a as x,i as S,n as C,t as w}from"./shadowsVertex-BzdmE8lZ.js";import{n as T,t as E}from"./logDepthDeclaration-xoumPMwY.js";import{n as D,t as O}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as k,t as A}from"./fogVertex-HgX-n4Ue.js";import{n as j,t as M}from"./logDepthVertex-Bse0Ofhz.js";import{n as N,t as P}from"./lightVxFragmentDeclaration-DVqBCuLn.js";var F,I,L,R;e((()=>{t(),p(),r(),c(),f(),y(),E(),D(),P(),S(),u(),h(),a(),v(),M(),k(),w(),F=`shadowOnlyVertexShader`,I=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
#include<sceneUboDeclaration>
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightVxFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=scene.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef NORMAL
vertexOutputs.vNormalW=normalize(( finalWorld* vec4f(vertexInputs.normal,0.0)).xyz);
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[F]||(n.ShadersStoreWGSL[F]=I),L=[m,i,s,d,b,T,O,N,x,l,g,o,_,j,A,C];for(let e of L)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);R={name:F,shader:I}}))();export{R as shadowOnlyVertexShaderWGSL};