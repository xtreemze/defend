import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{r,t as i}from"./helperFunctions-CklT_CQT.js";import{n as a,t as o}from"./sceneUboDeclaration-BucOHbCW.js";import{i as s,o as c,r as l,t as u}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as d,n as f,r as p,t as m}from"./fogFragment-A7zB_yUn.js";import{n as h,t as g}from"./logDepthFragment-BQfCxjhi.js";import{n as _,t as v}from"./lightFragment-Co9EmatE.js";import{n as y,o as b,s as x,t as S}from"./shadowsFragmentFunctions-B1-uvnta.js";import{n as C,t as w}from"./lightsFragmentFunctions-YkWMvqWB.js";import{n as T,t as E}from"./logDepthDeclaration-xoumPMwY.js";var D,O,k,A;e((()=>{t(),o(),r(),b(),w(),S(),l(),E(),d(),c(),v(),g(),f(),D=`shadowOnlyPixelShader`,O=`#include<sceneUboDeclaration>
uniform alpha: f32;uniform shadowColor: vec3f;varying vPositionW: vec3f;
#ifdef NORMAL
varying vNormalW: vec3f;
#endif
#include<helperFunctions>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying vViewDepth: f32;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
var viewDirectionW: vec3f=normalize(scene.vEyePosition.xyz-fragmentInputs.vPositionW);
#ifdef NORMAL
var normalW: vec3f=normalize(fragmentInputs.vNormalW);
#else
var normalW: vec3f= vec3f(1.0,1.0,1.0);
#endif
var diffuseBase: vec3f= vec3f(0.,0.,0.);var info: lightingInfo;var shadow: f32=1.;var glossiness: f32=0.;var aggShadow: f32=0.;var numLights: f32=0.;
#include<lightFragment>[0..1]
var color: vec4f= vec4f(uniforms.shadowColor,(1.0-clamp(shadow,0.,1.))*uniforms.alpha);
#include<logDepthFragment>
#include<fogFragment>
fragmentOutputs.color=color;
#define CUSTOM_FRAGMENT_MAIN_END
}
`,n.ShadersStoreWGSL[D]||(n.ShadersStoreWGSL[D]=O),k=[a,i,x,C,y,u,T,p,s,_,h,m];for(let e of k)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);A={name:D,shader:O}}))();export{A as shadowOnlyPixelShaderWGSL};