import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{a as r,i,n as a,r as o,s,t as c}from"./fogVertex-BCnUNCTI.js";import{r as l,t as u}from"./clipPlaneVertexDeclaration-DT4GmWBy.js";import{n as d,t as f}from"./logDepthDeclaration-DEg-fR3E.js";import{n as p,t as m}from"./logDepthVertex-B5lLzgZb.js";var h,g,_,v;e((()=>{t(),f(),l(),i(),s(),m(),a(),h=`skyVertexShader`,g=`precision highp float;attribute vec3 position;
#ifdef VERTEXCOLOR
attribute vec4 color;
#endif
uniform mat4 world;uniform mat4 view;uniform mat4 viewProjection;
#ifdef POINTSIZE
uniform float pointSize;
#endif
varying vec3 vPositionW;
#ifdef VERTEXCOLOR
varying vec4 vColor;
#endif
#include<logDepthDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
#define CUSTOM_VERTEX_MAIN_BEGIN
gl_Position=viewProjection*world*vec4(position,1.0);vec4 worldPos=world*vec4(position,1.0);vPositionW=vec3(worldPos);
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#ifdef VERTEXCOLOR
vColor=color;
#endif
#if defined(POINTSIZE) && !defined(WEBGPU)
gl_PointSize=pointSize;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStore[h]||(n.ShadersStore[h]=g),_=[d,u,o,r,p,c];for(let e of _)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);v={name:h,shader:g}}))();export{v as skyVertexShader};