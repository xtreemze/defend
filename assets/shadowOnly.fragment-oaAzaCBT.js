import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{a as r,c as i,n as a,o,r as s,t as c}from"./fogFragment-DddV-x4-.js";import{r as l,t as u}from"./clipPlaneFragmentDeclaration-BeW0wzU5.js";import{c as d,s as f}from"./imageProcessingFunctions-C5BKlD0g.js";import{i as p,n as m,o as h,t as g}from"./logDepthDeclaration-DEg-fR3E.js";import{n as _,t as v}from"./lightFragment-_152tcho.js";import{a as y,i as b,n as x,t as S}from"./lightUboDeclaration-C5wTJIy-.js";import{n as C,t as w}from"./shadowsFragmentFunctions-Bc-DtcDh.js";import{n as T,t as E}from"./lightsFragmentFunctions-Bjb3DX7y.js";import{n as D,t as O}from"./sceneUboDeclaration-DY0whaDI.js";import{d as k,f as A}from"./openpbrTransmissionLayerData-BIop0oFs.js";import{n as j,t as M}from"./imageProcessingCompatibility-CBHq_lTp.js";var N,P,F,I;e((()=>{t(),k(),O(),h(),b(),S(),E(),w(),l(),g(),r(),i(),v(),f(),a(),j(),N=`shadowOnlyPixelShader`,P=`precision highp float;
#include<__decl__sceneFragment>
uniform float alpha;uniform vec3 shadowColor;varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#include<helperFunctions>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<lightsFragmentFunctions>
#include<shadowsFragmentFunctions>
#include<clipPlaneFragmentDeclaration>
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
vec3 viewDirectionW=normalize(vEyePosition.xyz-vPositionW);
#ifdef NORMAL
vec3 normalW=normalize(vNormalW);
#else
vec3 normalW=vec3(1.0,1.0,1.0);
#endif
vec3 diffuseBase=vec3(0.,0.,0.);lightingInfo info;float shadow=1.;float glossiness=0.;float aggShadow=0.;float numLights=0.;
#include<lightFragment>[0..1]
vec4 color=vec4(shadowColor,(1.0-clamp(shadow,0.,1.))*alpha);
#include<logDepthFragment>
#include<fogFragment>
gl_FragColor=color;
#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`,n.ShadersStore[N]||(n.ShadersStore[N]=P),F=[A,D,p,y,x,T,C,u,m,s,o,_,d,c,M];for(let e of F)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);I={name:N,shader:P}}))();export{I as shadowOnlyPixelShader};