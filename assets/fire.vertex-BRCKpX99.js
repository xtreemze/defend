import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{a as r,c as i,i as a,n as o,r as s,s as c,t as l,u}from"./bakedVertexAnimation-CzoNlnSs.js";import{a as d,i as f,n as p,r as m,s as h,t as g}from"./fogVertex-BCnUNCTI.js";import{r as _,t as v}from"./clipPlaneVertexDeclaration-DT4GmWBy.js";import{n as y,t as b}from"./logDepthDeclaration-DEg-fR3E.js";import{n as x,t as S}from"./instancesDeclaration-wmdSHGgS.js";import{n as C,t as w}from"./instancesVertex-Dd3Zi5LO.js";import{n as T,t as E}from"./logDepthVertex-B5lLzgZb.js";import{n as D,t as O}from"./vertexColorMixing-BPFrZgsz.js";var k,A,j,M;e((()=>{t(),u(),a(),S(),_(),b(),f(),w(),c(),o(),h(),E(),p(),O(),k=`fireVertexShader`,A=`precision highp float;attribute vec3 position;
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
varying vec2 vDiffuseUV;
#endif
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<clipPlaneVertexDeclaration>
#include<logDepthDeclaration>
#include<fogVertexDeclaration>
uniform float time;uniform float speed;
#ifdef DIFFUSE
varying vec2 vDistortionCoords1;varying vec2 vDistortionCoords2;varying vec2 vDistortionCoords3;
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
vec4 worldPos=finalWorld*vec4(position,1.0);gl_Position=viewProjection*worldPos;vPositionW=vec3(worldPos);
#ifdef DIFFUSE
vDiffuseUV=uv;vDiffuseUV.y-=0.2;
#endif
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#include<vertexColorMixing>
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#ifdef DIFFUSE
vec3 layerSpeed=vec3(-0.2,-0.52,-0.1)*speed;vDistortionCoords1.x=uv.x;vDistortionCoords1.y=uv.y+layerSpeed.x*time/1000.0;vDistortionCoords2.x=uv.x;vDistortionCoords2.y=uv.y+layerSpeed.y*time/1000.0;vDistortionCoords3.x=uv.x;vDistortionCoords3.y=uv.y+layerSpeed.z*time/1000.0;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStore[k]||(n.ShadersStore[k]=A),j=[i,s,x,v,y,m,C,r,l,d,T,g,D];for(let e of j)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);M={name:k,shader:A}}))();export{M as fireVertexShader};