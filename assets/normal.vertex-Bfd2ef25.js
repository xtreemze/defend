import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{a as r,c as i,i as a,n as o,r as s,s as c,t as l,u}from"./bakedVertexAnimation-CzoNlnSs.js";import{a as d,i as f,n as p,r as m,s as h,t as g}from"./fogVertex-BCnUNCTI.js";import{r as _,t as v}from"./clipPlaneVertexDeclaration-DT4GmWBy.js";import{n as y,t as b}from"./logDepthDeclaration-DEg-fR3E.js";import{a as x,i as S,n as C,t as w}from"./lightUboDeclaration-C5wTJIy-.js";import{n as T,t as E}from"./shadowsVertex-C0uZgBeP.js";import{n as D,t as O}from"./instancesDeclaration-wmdSHGgS.js";import{n as k,t as A}from"./instancesVertex-Dd3Zi5LO.js";import{n as j,t as M}from"./logDepthVertex-B5lLzgZb.js";var N,P,F,I;e((()=>{t(),u(),a(),O(),_(),b(),f(),S(),w(),A(),c(),o(),h(),M(),p(),E(),N=`normalVertexShader`,P=`precision highp float;attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<instancesDeclaration>
uniform mat4 view;uniform mat4 viewProjection;
#ifdef DIFFUSE
varying vec2 vDiffuseUV;uniform mat4 diffuseMatrix;uniform vec2 vDiffuseInfos;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef NORMAL
varying vec3 vNormalW;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
varying float vViewDepth;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef NORMAL
vNormalW=normalize(vec3(finalWorld*vec4(normal,0.0)));
#endif
#ifndef UV1
vec2 uv=vec2(0.,0.);
#endif
#ifndef UV2
vec2 uv2=vec2(0.,0.);
#endif
#ifdef DIFFUSE
if (vDiffuseInfos.x==0.)
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv,1.0,0.0));}
else
{vDiffuseUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));}
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<shadowsVertex>[0..maxSimultaneousLights]
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStore[N]||(n.ShadersStore[N]=P),F=[i,s,D,v,y,m,x,C,k,r,l,d,j,g,T];for(let e of F)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);I={name:N,shader:P}}))();export{I as normalVertexShader};