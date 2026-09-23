import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,c as a,i as o,n as s,r as c,s as l,t as u,u as d}from"./bakedVertexAnimation-CzoNlnSs.js";import{a as f,i as p,n as m,r as h,s as g,t as _}from"./fogVertex-BCnUNCTI.js";import{r as v,t as y}from"./clipPlaneVertexDeclaration-DT4GmWBy.js";import{n as b,t as x}from"./instancesDeclaration-wmdSHGgS.js";import{n as S,t as C}from"./instancesVertex-Dd3Zi5LO.js";import{n as w,t as T}from"./vertexColorMixing-BPFrZgsz.js";var E=t({colorVertexShader:()=>A}),D,O,k,A,j=e((()=>{n(),d(),o(),v(),p(),x(),C(),l(),s(),g(),m(),T(),D=`colorVertexShader`,O=`attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#ifdef FOG
uniform mat4 view;
#endif
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef MULTIVIEW
uniform mat4 viewProjectionR;
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
varying vec4 vColor;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
#ifdef VERTEXCOLOR
vec4 colorUpdated=color;
#endif
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(position,1.0);
#ifdef MULTIVIEW
if (gl_ViewID_OVR==0u) {gl_Position=viewProjection*worldPos;} else {gl_Position=viewProjectionR*worldPos;}
#else
gl_Position=viewProjection*worldPos;
#endif
#include<clipPlaneVertex>
#include<fogVertex>
#include<vertexColorMixing>
#define CUSTOM_VERTEX_MAIN_END
}`,r.ShadersStore[D]||(r.ShadersStore[D]=O),k=[a,c,y,h,b,S,i,u,f,_,w];for(let e of k)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);A={name:D,shader:O}}));export{E as n,j as r,A as t};