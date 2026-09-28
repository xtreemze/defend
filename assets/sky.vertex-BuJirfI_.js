import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as r,o as i,r as a,t as o}from"./clipPlaneVertexDeclaration-CJgqBiaU.js";import{n as s,t as c}from"./logDepthDeclaration-xoumPMwY.js";import{n as l,t as u}from"./fogVertexDeclaration-B0s5rYSE.js";import{n as d,t as f}from"./fogVertex-HgX-n4Ue.js";import{n as p,t as m}from"./logDepthVertex-Bse0Ofhz.js";var h,g,_,v;e((()=>{t(),c(),a(),l(),i(),m(),d(),h=`skyVertexShader`,g=`attribute position: vec3f;
#ifdef VERTEXCOLOR
attribute color: vec4f;
#endif
uniform world: mat4x4f;uniform view: mat4x4f;uniform viewProjection: mat4x4f;
#ifdef POINTSIZE
uniform pointSize: f32;
#endif
varying vPositionW: vec3f;
#ifdef VERTEXCOLOR
varying vColor: vec4f;
#endif
#include<logDepthDeclaration>
#include<clipPlaneVertexDeclaration>
#include<fogVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
@vertex
fn main(input : VertexInputs)->FragmentInputs {
#define CUSTOM_VERTEX_MAIN_BEGIN
vertexOutputs.position=uniforms.viewProjection*uniforms.world* vec4f(vertexInputs.position,1.0);var worldPos: vec4f=uniforms.world* vec4f(vertexInputs.position,1.0);vertexOutputs.vPositionW= worldPos.xyz;
#include<clipPlaneVertex>
#include<logDepthVertex>
#include<fogVertex>
#ifdef VERTEXCOLOR
vertexOutputs.vColor=vertexInputs.color;
#endif
#define CUSTOM_VERTEX_MAIN_END
}
`,n.ShadersStoreWGSL[h]||(n.ShadersStoreWGSL[h]=g),_=[s,o,u,r,p,f];for(let e of _)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);v={name:h,shader:g}}))();export{v as skyVertexShaderWGSL};