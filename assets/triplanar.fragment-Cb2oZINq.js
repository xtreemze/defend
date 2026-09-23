import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as s,n as c,r as l,t as u}from"./fogFragment-A7zB_yUn.js";import{n as d,t as f}from"./logDepthFragment-BQfCxjhi.js";import{r as p,t as m}from"./helperFunctions-CklT_CQT.js";import{n as h,t as g}from"./lightFragment-Co9EmatE.js";import{n as _,o as v,s as y,t as b}from"./shadowsFragmentFunctions-B1-uvnta.js";import{n as x,t as S}from"./lightsFragmentFunctions-YkWMvqWB.js";import{n as C,t as w}from"./logDepthDeclaration-xoumPMwY.js";import{n as T,t as E}from"./depthPrePass-CI4Wrsnz.js";import{n as D,t as O}from"./imageProcessingCompatibility-D-xt4V5m.js";var k,A,j,M;e((()=>{t(),p(),v(),w(),S(),b(),a(),s(),i(),T(),g(),f(),c(),D(),k=`triplanarPixelShader`,A=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;
#ifdef SPECULARTERM
uniform vSpecularColor: vec4f;
#endif
varying vPositionW: vec3f;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#ifdef DIFFUSEX
varying vTextureUVX: vec2f;var diffuseSamplerXSampler: sampler;var diffuseSamplerX: texture_2d<f32>;
#ifdef BUMPX
var normalSamplerXSampler: sampler;var normalSamplerX: texture_2d<f32>;
#endif
#endif
#ifdef DIFFUSEY
varying vTextureUVY: vec2f;var diffuseSamplerYSampler: sampler;var diffuseSamplerY: texture_2d<f32>;
#ifdef BUMPY
var normalSamplerYSampler: sampler;var normalSamplerY: texture_2d<f32>;
#endif
#endif
#ifdef DIFFUSEZ
varying vTextureUVZ: vec2f;var diffuseSamplerZSampler: sampler;var diffuseSamplerZ: texture_2d<f32>;
#ifdef BUMPZ
var normalSamplerZSampler: sampler;var normalSamplerZ: texture_2d<f32>;
#endif
#endif
#ifdef NORMAL
varying tangentSpace0: vec3f;varying tangentSpace1: vec3f;varying tangentSpace2: vec3f;
#endif
#include<logDepthDeclaration>
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(0.,0.,0.,1.);var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef NORMAL
var normalW: vec3f=fragmentInputs.tangentSpace2;
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
var baseNormal: vec4f= vec4f(0.0,0.0,0.0,1.0);normalW=normalW*normalW;
#ifdef DIFFUSEX
baseColor=baseColor+textureSample(diffuseSamplerX,diffuseSamplerXSampler,fragmentInputs.vTextureUVX)*normalW.x;
#ifdef BUMPX
baseNormal=baseNormal+textureSample(normalSamplerX,normalSamplerXSampler,fragmentInputs.vTextureUVX)*normalW.x;
#endif
#endif
#ifdef DIFFUSEY
baseColor=baseColor+textureSample(diffuseSamplerY,diffuseSamplerYSampler,fragmentInputs.vTextureUVY)*normalW.y;
#ifdef BUMPY
baseNormal=baseNormal+textureSample(normalSamplerY,normalSamplerYSampler,fragmentInputs.vTextureUVY)*normalW.y;
#endif
#endif
#ifdef DIFFUSEZ
baseColor=baseColor+textureSample(diffuseSamplerZ,diffuseSamplerZSampler,fragmentInputs.vTextureUVZ)*normalW.z;
#ifdef BUMPZ
baseNormal=baseNormal+textureSample(normalSamplerZ,normalSamplerZSampler,fragmentInputs.vTextureUVZ)*normalW.z;
#endif
#endif
#ifdef NORMAL
var tangentSpace: mat3x3f=mat3x3f(fragmentInputs.tangentSpace0,fragmentInputs.tangentSpace1,fragmentInputs.tangentSpace2);normalW=normalize((2.0*baseNormal.xyz-1.0)*tangentSpace);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef SPECULARTERM
var glossiness: f32=uniforms.vSpecularColor.a;var specularBase: vec3f= vec3f(0.,0.,0.);var specularColor: vec3f=uniforms.vSpecularColor.rgb;
#else
var glossiness: f32=0.;
#endif
#include<lightFragment>[0..maxSimultaneousLights]
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
#ifdef SPECULARTERM
var finalSpecular: vec3f=specularBase*specularColor;
#else
var finalSpecular: vec3f= vec3f(0.0);
#endif
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor,vec3f(0.0),vec3f(1.0))*baseColor.rgb;var color: vec4f= vec4f(finalDiffuse+finalSpecular,alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`,n.ShadersStoreWGSL[k]||(n.ShadersStoreWGSL[k]=A),j=[m,y,C,x,_,o,l,r,E,h,d,u,O];for(let e of j)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);M={name:k,shader:A}}))();export{M as triplanarPixelShaderWGSL};