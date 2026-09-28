import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{n as r,t as i}from"./bakedVertexAnimationDeclaration-CDQs61LG.js";import{n as a,t as o}from"./bakedVertexAnimation-CR15jBnU.js";import{n as s,t as c}from"./instancesDeclaration-CgXh0JO7.js";import{n as l,t as u}from"./instancesVertex-C56VJhRE.js";import{r as d,t as f}from"./bonesDeclaration-eL-UWn6d.js";import{r as p,t as m}from"./bonesVertex-BiF-eB3j.js";import{i as h,o as g,r as _,t as v}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{a as y,i as b,n as x,t as S}from"./shadowsVertex-BzdmE8lZ.js";import{n as C,t as w}from"./logDepthDeclaration-xoumPMwY.js";import{n as T,t as E}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as D,t as O}from"./fogVertex-HgX-n4Ue.js";import{n as k,t as A}from"./logDepthVertex-Bse0Ofhz.js";import{n as j,t as M}from"./vertexColorMixing-D1xGglgB.js";import{n as N,t as P}from"./lightVxFragmentDeclaration-DVqBCuLn.js";var F,I,L,R;e((()=>{t(),d(),r(),c(),_(),w(),T(),P(),b(),u(),p(),a(),g(),D(),S(),M(),A(),F=`mixVertexShader`,I=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef DIFFUSE
varying vTextureUV: vec2f;uniform textureMatrix: mat4x4f;uniform vTextureInfos: vec2f;
#endif
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
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef NORMAL
vertexOutputs.vNormalW=normalize(( finalWorld* vec4f(vertexInputs.normal,0.0)).xyz);
#endif
#ifndef UV1
var uv: vec2f= vec2f(0.,0.);
#else
var uv: vec2f=vertexInputs.uv;
#endif
#ifndef UV2
var uv2: vec2f= vec2f(0.,0.);
#else
var uv2: vec2f=vertexInputs.uv2;
#endif
#ifdef DIFFUSE
if (uniforms.vTextureInfos.x==0.)
{vertexOutputs.vTextureUV=(uniforms.textureMatrix* vec4f(uv,1.0,0.0)).xy;}
else
{vertexOutputs.vTextureUV=(uniforms.textureMatrix* vec4f(uv2,1.0,0.0)).xy;}
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#include<logDepthVertex>
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[F]||(n.ShadersStoreWGSL[F]=I),L=[f,i,s,v,C,E,N,y,l,m,o,h,O,x,j,k];for(let e of L)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);R={name:F,shader:I}}))();export{R as mixVertexShaderWGSL};