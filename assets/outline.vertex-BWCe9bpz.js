import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,c as a,i as o,n as s,r as c,s as l,t as u,u as d}from"./bakedVertexAnimation-CzoNlnSs.js";import{a as f,s as p}from"./fogVertex-BCnUNCTI.js";import{r as m,t as h}from"./clipPlaneVertexDeclaration-DT4GmWBy.js";import{n as g,t as _}from"./logDepthDeclaration-DEg-fR3E.js";import{a as v,c as y,d as b,i as x,n as S,s as C,t as w,u as T}from"./morphTargetsVertexGlobalDeclaration-CWqQn8Kb.js";import{n as E,t as D}from"./instancesDeclaration-wmdSHGgS.js";import{n as O,t as k}from"./instancesVertex-Dd3Zi5LO.js";import{n as A,t as j}from"./logDepthVertex-B5lLzgZb.js";var M=t({outlineVertexShader:()=>I}),N,P,F,I,L=e((()=>{n(),d(),o(),w(),C(),m(),D(),_(),x(),T(),k(),l(),s(),p(),j(),N=`outlineVertexShader`,P=`attribute vec3 position;attribute vec3 normal;
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
uniform float offset;
#include<instancesDeclaration>
uniform mat4 viewProjection;
#ifdef ALPHATEST
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<logDepthDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;vec3 normalUpdated=normal;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
vec3 offsetPosition=positionUpdated+(normalUpdated*offset);
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(offsetPosition,1.0);gl_Position=viewProjection*worldPos;
#ifdef ALPHATEST
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
}
`,r.ShadersStore[N]||(r.ShadersStore[N]=P),F=[a,c,S,y,h,E,g,v,b,O,i,u,f,A];for(let e of F)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);I={name:N,shader:P}}));export{I as n,M as r,L as t};