import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as s,n as c,r as l,t as u}from"./fogFragment-A7zB_yUn.js";import{n as d,t as f}from"./logDepthFragment-BQfCxjhi.js";import{r as p,t as m}from"./helperFunctions-CklT_CQT.js";import{n as h,t as g}from"./lightFragment-Co9EmatE.js";import{n as _,o as v,s as y,t as b}from"./shadowsFragmentFunctions-B1-uvnta.js";import{n as x,t as S}from"./lightsFragmentFunctions-YkWMvqWB.js";import{n as C,t as w}from"./logDepthDeclaration-xoumPMwY.js";import{n as T,t as E}from"./sceneUboDeclaration-BucOHbCW.js";var D,O,k,A;e((()=>{t(),E(),p(),v(),S(),b(),a(),w(),s(),i(),g(),f(),c(),D=`shadowOnlyPixelShader`,O=`#include<sceneUboDeclaration>
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
`,n.ShadersStoreWGSL[D]||(n.ShadersStoreWGSL[D]=O),k=[T,m,y,x,_,o,C,l,r,h,d,u];for(let e of k)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);A={name:D,shader:O}}))();export{A as shadowOnlyPixelShaderWGSL};