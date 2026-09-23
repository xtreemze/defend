import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,c as a,i as o,n as s,r as c,s as l,t as u,u as d}from"./bakedVertexAnimation-CzoNlnSs.js";import{a as f,c as p,d as m,i as h,n as g,s as _,t as v,u as y}from"./morphTargetsVertexGlobalDeclaration-CWqQn8Kb.js";import{n as b,t as x}from"./instancesDeclaration-wmdSHGgS.js";import{n as S,t as C}from"./instancesVertex-Dd3Zi5LO.js";var w=t({pickingVertexShader:()=>O}),T,E,D,O,k=e((()=>{n(),d(),o(),v(),_(),x(),h(),y(),C(),l(),s(),T=`pickingVertexShader`,E=`attribute vec3 position;
#if defined(INSTANCES)
attribute float instanceMeshID;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
#if defined(INSTANCES)
flat varying float vMeshID;
#endif
void main(void) {vec3 positionUpdated=position;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);gl_Position=viewProjection*worldPos;
#if defined(INSTANCES)
vMeshID=instanceMeshID;
#endif
}
`,r.ShadersStore[T]||(r.ShadersStore[T]=E),D=[a,c,g,p,b,f,m,S,i,u];for(let e of D)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);O={name:T,shader:E}}));export{O as n,w as r,k as t};