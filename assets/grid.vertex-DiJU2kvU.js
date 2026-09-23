import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{n as s,t as c}from"./logDepthDeclaration-xoumPMwY.js";import{n as l,t as u}from"./sceneUboDeclaration-BucOHbCW.js";import{n as d,t as f}from"./instancesDeclaration-CgXh0JO7.js";import{n as p,t as m}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as h,t as g}from"./instancesVertex-C56VJhRE.js";import{n as _,t as v}from"./fogVertex-HgX-n4Ue.js";import{n as y,t as b}from"./logDepthVertex-Bse0Ofhz.js";var x,S,C,w;e((()=>{t(),f(),u(),c(),p(),a(),g(),_(),i(),b(),x=`gridVertexShader`,S=`attribute position: vec3f;attribute normal: vec3f;
#ifdef UV1
attribute uv: vec2f;
#endif
#ifdef UV2
attribute uv2: vec2f;
#endif
#include<instancesDeclaration>
#include<sceneUboDeclaration>
varying vPosition: vec3f;varying vNormal: vec3f;
#if defined(HORIZON_FADE) || defined(BELOW_LINE_COLOR) || defined(ORIGIN_MARKER)
varying vWorldPos: vec3f;
#endif
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#ifdef OPACITY
varying vOpacityUV: vec2f;uniform opacityMatrix: mat4x4f;uniform vOpacityInfos: vec2f;
#endif
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);
#include<fogVertex>
var cameraSpacePosition: vec4f=scene.view*worldPos;vertexOutputs.position=scene.projection*cameraSpacePosition;
#ifdef OPACITY
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
if (uniforms.vOpacityInfos.x==0.)
{vertexOutputs.vOpacityUV=(uniforms.opacityMatrix* vec4f(uv,1.0,0.0)).xy;}
else
{vertexOutputs.vOpacityUV=(uniforms.opacityMatrix* vec4f(uv2,1.0,0.0)).xy;}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
vertexOutputs.vPosition=vertexInputs.position;vertexOutputs.vNormal=vertexInputs.normal;
#if defined(HORIZON_FADE) || defined(BELOW_LINE_COLOR) || defined(ORIGIN_MARKER)
vertexOutputs.vWorldPos=worldPos.xyz;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[x]||(n.ShadersStoreWGSL[x]=S),C=[d,l,s,m,o,h,v,r,y];for(let e of C)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);w={name:x,shader:S}}))();export{w as gridVertexShaderWGSL};