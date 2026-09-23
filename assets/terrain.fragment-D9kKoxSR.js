import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as s,n as c,r as l,t as u}from"./fogFragment-A7zB_yUn.js";import{n as d,t as f}from"./logDepthFragment-BQfCxjhi.js";import{r as p,t as m}from"./helperFunctions-CklT_CQT.js";import{n as h,t as g}from"./lightFragment-Co9EmatE.js";import{n as _,o as v,s as y,t as b}from"./shadowsFragmentFunctions-B1-uvnta.js";import{n as x,t as S}from"./lightsFragmentFunctions-YkWMvqWB.js";import{n as C,t as w}from"./logDepthDeclaration-xoumPMwY.js";import{n as T,t as E}from"./depthPrePass-CI4Wrsnz.js";import{n as D,t as O}from"./imageProcessingCompatibility-D-xt4V5m.js";var k,A,j,M;e((()=>{t(),p(),v(),S(),b(),a(),w(),s(),i(),T(),g(),f(),c(),D(),k=`terrainPixelShader`,A=`uniform vEyePosition: vec4f;uniform vDiffuseColor: vec4f;
#ifdef SPECULARTERM
uniform vSpecularColor: vec4f;
#endif
varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vColor: vec4f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#ifdef DIFFUSE
varying vTextureUV: vec2f;var textureSamplerSampler: sampler;var textureSampler: texture_2d<f32>;uniform vTextureInfos: vec2f;var diffuse1SamplerSampler: sampler;var diffuse1Sampler: texture_2d<f32>;var diffuse2SamplerSampler: sampler;var diffuse2Sampler: texture_2d<f32>;var diffuse3SamplerSampler: sampler;var diffuse3Sampler: texture_2d<f32>;uniform diffuse1Infos: vec2f;uniform diffuse2Infos: vec2f;uniform diffuse3Infos: vec2f;
#endif
#ifdef BUMP
var bump1SamplerSampler: sampler;var bump1Sampler: texture_2d<f32>;var bump2SamplerSampler: sampler;var bump2Sampler: texture_2d<f32>;var bump3SamplerSampler: sampler;var bump3Sampler: texture_2d<f32>;
#endif
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#ifdef BUMP
fn cotangent_frame(normal: vec3f,p: vec3f,uv: vec2f)->mat3x3f
{var dp1: vec3f=dpdx(p);var dp2: vec3f=dpdy(p);var duv1: vec2f=dpdx(uv);var duv2: vec2f=dpdy(uv);var dp2perp: vec3f=cross(dp2,normal);var dp1perp: vec3f=cross(normal,dp1);var tangent: vec3f=dp2perp*duv1.x+dp1perp*duv2.x;var binormal: vec3f=dp2perp*duv1.y+dp1perp*duv2.y;var invmax: f32=inverseSqrt(max(dot(tangent,tangent),dot(binormal,binormal)));return mat3x3f(tangent*invmax,binormal*invmax,normal);}
fn perturbNormal(viewDir: vec3f,mixColor: vec3f)->vec3f
{var bump1Color: vec3f=textureSample(bump1Sampler,bump1SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse1Infos).xyz;var bump2Color: vec3f=textureSample(bump2Sampler,bump2SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse2Infos).xyz;var bump3Color: vec3f=textureSample(bump3Sampler,bump3SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse3Infos).xyz;bump1Color=bump1Color.rgb*mixColor.r;bump2Color=mix(bump1Color.rgb,bump2Color.rgb,vec3f(mixColor.g));var map: vec3f=mix(bump2Color.rgb,bump3Color.rgb,vec3f(mixColor.b));map=map*255./127.-128./127.;var TBN: mat3x3f=cotangent_frame(fragmentInputs.vNormalW*uniforms.vTextureInfos.y,-viewDir,fragmentInputs.vTextureUV);return normalize(TBN*map);}
#endif
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(uniforms.vEyePosition.xyz-fragmentInputs.vPositionW);var baseColor: vec4f= vec4f(1.,1.,1.,1.);var diffuseColor: vec3f=uniforms.vDiffuseColor.rgb;
#ifdef SPECULARTERM
var glossiness: f32=uniforms.vSpecularColor.a;var specularColor: vec3f=uniforms.vSpecularColor.rgb;
#else
var glossiness: f32=0.;
#endif
var alpha: f32=uniforms.vDiffuseColor.a;
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
#ifdef DIFFUSE
baseColor=textureSample(textureSampler,textureSamplerSampler,fragmentInputs.vTextureUV);
#if defined(BUMP) && defined(DIFFUSE)
normalW=perturbNormal(viewDirectionW,baseColor.rgb);
#endif
#ifdef ALPHATEST
if (baseColor.a<0.4) {discard;}
#endif
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
baseColor=vec4f(baseColor.rgb*uniforms.vTextureInfos.y,baseColor.a);var diffuse1Color: vec4f=textureSample(diffuse1Sampler,diffuse1SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse1Infos);var diffuse2Color: vec4f=textureSample(diffuse2Sampler,diffuse2SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse2Infos);var diffuse3Color: vec4f=textureSample(diffuse3Sampler,diffuse3SamplerSampler,fragmentInputs.vTextureUV*uniforms.diffuse3Infos);diffuse1Color=vec4f(diffuse1Color.rgb*baseColor.r,diffuse1Color.a);diffuse2Color=vec4f(mix(diffuse1Color.rgb,diffuse2Color.rgb,vec3f(baseColor.g)),diffuse2Color.a);baseColor=vec4f(mix(diffuse2Color.rgb,diffuse3Color.rgb,vec3f(baseColor.b)),baseColor.a);
#endif
#endif
#ifndef DEPTHPREPASS
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
baseColor=vec4f(baseColor.rgb*fragmentInputs.vColor.rgb,baseColor.a);
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var aggShadow: f32=0.;var numLights: f32=0.;
#ifdef SPECULARTERM
var specularBase: vec3f= vec3f(0.,0.,0.);
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
var finalDiffuse: vec3f=clamp(diffuseBase*diffuseColor*baseColor.rgb,vec3f(0.0),vec3f(1.0));var color: vec4f= vec4f(finalDiffuse+finalSpecular,alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`,n.ShadersStoreWGSL[k]||(n.ShadersStoreWGSL[k]=A),j=[m,y,x,_,o,C,l,r,E,h,d,u,O];for(let e of j)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);M={name:k,shader:A}}))();export{M as terrainPixelShaderWGSL};