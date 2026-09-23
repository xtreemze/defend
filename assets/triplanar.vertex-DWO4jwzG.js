import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{a as r,n as i,r as a,t as o}from"./bakedVertexAnimationDeclaration-BdTqsGYI.js";import{a as s,n as c,r as l,t as u}from"./bakedVertexAnimation-AyKP8k-z.js";import{i as d,o as f,r as p,t as m}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{r as h,t as g}from"./helperFunctions-CklT_CQT.js";import{a as _,i as v,n as y,t as b}from"./shadowsVertex-BzdmE8lZ.js";import{n as x,t as S}from"./logDepthDeclaration-xoumPMwY.js";import{n as C,t as w}from"./instancesDeclaration-CgXh0JO7.js";import{n as T,t as E}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as D,t as O}from"./instancesVertex-C56VJhRE.js";import{n as k,t as A}from"./fogVertex-HgX-n4Ue.js";import{n as j,t as M}from"./logDepthVertex-Bse0Ofhz.js";import{n as N,t as P}from"./vertexColorMixing-D1xGglgB.js";import{n as F,t as I}from"./lightVxFragmentDeclaration-DVqBCuLn.js";var L,R,z,B;e((()=>{t(),h(),r(),i(),w(),p(),S(),T(),I(),v(),O(),s(),c(),f(),M(),k(),b(),P(),L=`triplanarVertexShader`,R=`attribute position: vec3f;
#ifdef NORMAL
attribute normal: vec3f;
#endif
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
#include<helperFunctions>
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef DIFFUSEX
varying vTextureUVX: vec2f;
#endif
#ifdef DIFFUSEY
varying vTextureUVY: vec2f;
#endif
#ifdef DIFFUSEZ
varying vTextureUVZ: vec2f;
#endif
uniform tileSize: f32;
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying tangentSpace0: vec3f;varying tangentSpace1: vec3f;varying tangentSpace2: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
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
fn main(input : VertexInputs)->FragmentInputs
{
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
var colorUpdated: vec4f=vertexInputs.color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
var worldPos: vec4f=finalWorld* vec4f(vertexInputs.position,1.0);vertexOutputs.position=uniforms.viewProjection*worldPos;vertexOutputs.vPositionW= worldPos.xyz;
#ifdef DIFFUSEX
vertexOutputs.vTextureUVX=worldPos.zy/uniforms.tileSize;
#endif
#ifdef DIFFUSEY
vertexOutputs.vTextureUVY=worldPos.xz/uniforms.tileSize;
#endif
#ifdef DIFFUSEZ
vertexOutputs.vTextureUVZ=worldPos.xy/uniforms.tileSize;
#endif
#ifdef NORMAL
var xtan: vec3f= vec3f(0,0,1);var xbin: vec3f= vec3f(0,1,0);var ytan: vec3f= vec3f(1,0,0);var ybin: vec3f= vec3f(0,0,1);var ztan: vec3f= vec3f(1,0,0);var zbin: vec3f= vec3f(0,1,0);var normalizedNormal: vec3f=normalize(vertexInputs.normal);normalizedNormal=normalizedNormal*normalizedNormal;var worldBinormal: vec3f=normalize(xbin*normalizedNormal.x+ybin*normalizedNormal.y+zbin*normalizedNormal.z);var worldTangent: vec3f=normalize(xtan*normalizedNormal.x+ytan*normalizedNormal.y+ztan*normalizedNormal.z);var normalWorld: mat3x3f= mat3x3f(finalWorld[0].xyz,finalWorld[1].xyz,finalWorld[2].xyz);
#ifdef NONUNIFORMSCALING
normalWorld=transposeMat3(inverseMat3(normalWorld));
#endif
worldTangent=normalize((normalWorld*worldTangent).xyz);worldBinormal=normalize((normalWorld*worldBinormal).xyz);var worldNormal: vec3f=normalize((normalWorld*normalize(vertexInputs.normal)).xyz);vertexOutputs.tangentSpace0=worldTangent;vertexOutputs.tangentSpace1=worldBinormal;vertexOutputs.tangentSpace2=worldNormal;
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[L]||(n.ShadersStoreWGSL[L]=R),z=[g,a,o,C,m,x,E,F,_,D,l,u,d,j,A,y,N];for(let e of z)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);B={name:L,shader:R}}))();export{B as triplanarVertexShaderWGSL};