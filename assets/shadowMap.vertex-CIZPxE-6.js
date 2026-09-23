import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{a as i,c as a,i as o,n as s,r as c,s as l,t as u,u as ee}from"./bakedVertexAnimation-CzoNlnSs.js";import{a as te,s as d}from"./fogVertex-BCnUNCTI.js";import{r as f,t as ne}from"./clipPlaneVertexDeclaration-DT4GmWBy.js";import{i as p,o as m}from"./logDepthDeclaration-DEg-fR3E.js";import{a as h,c as g,d as _,i as v,n as y,s as re,t as b,u as x}from"./morphTargetsVertexGlobalDeclaration-CWqQn8Kb.js";import{n as S,t as C}from"./sceneUboDeclaration-DY0whaDI.js";import{n as ie,t as ae}from"./instancesVertex-Dd3Zi5LO.js";import{n as oe,t as w}from"./meshUboDeclaration-DmH0C9dB.js";import{n as se,t as T}from"./sceneVertexDeclaration-D9ITZeOZ.js";var E=t({shadowMapVertexMetric:()=>k}),D,O,k,A=e((()=>{n(),D=`shadowMapVertexMetric`,O=`#if SM_USEDISTANCE==1
vPositionWSM=worldPos.xyz;
#endif
#if SM_DEPTHTEXTURE==1
#ifdef IS_NDC_HALF_ZRANGE
#define BIASFACTOR 0.5
#else
#define BIASFACTOR 1.0
#endif
#ifdef USE_REVERSE_DEPTHBUFFER
gl_Position.z-=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;
#else
gl_Position.z+=biasAndScaleSM.x*gl_Position.w*BIASFACTOR;
#endif
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
zSM=gl_Position.z;gl_Position.z=0.0;
#elif SM_USEDISTANCE==0
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetricSM=(-gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#else
vDepthMetricSM=(gl_Position.z+depthValuesSM.x)/depthValuesSM.y+biasAndScaleSM.x;
#endif
#endif
`,r.IncludesShadersStore[D]||(r.IncludesShadersStore[D]=O),k={name:D,shader:O}})),j,M,N,P=e((()=>{n(),j=`meshVertexDeclaration`,M=`uniform mat4 world;uniform float visibility;
`,r.IncludesShadersStore[j]||(r.IncludesShadersStore[j]=M),N={name:j,shader:M}})),F,I,L,R=e((()=>{n(),T(),P(),F=`shadowMapVertexDeclaration`,I=`#include<sceneVertexDeclaration>
#include<meshVertexDeclaration>
`,r.IncludesShadersStore[F]||(r.IncludesShadersStore[F]=I),L={name:F,shader:I}})),z,B,V,H=e((()=>{n(),C(),w(),z=`shadowMapUboDeclaration`,B=`layout(std140,column_major) uniform;
#include<sceneUboDeclaration>
#include<meshUboDeclaration>
`,r.IncludesShadersStore[z]||(r.IncludesShadersStore[z]=B),V={name:z,shader:B}})),U,W,G,K=e((()=>{n(),U=`shadowMapVertexExtraDeclaration`,W=`#if SM_NORMALBIAS==1
uniform vec3 lightDataSM;
#endif
uniform vec3 biasAndScaleSM;uniform vec2 depthValuesSM;varying float vDepthMetricSM;
#if SM_USEDISTANCE==1
varying vec3 vPositionWSM;
#endif
#if defined(SM_DEPTHCLAMP) && SM_DEPTHCLAMP==1
varying float zSM;
#endif
`,r.IncludesShadersStore[U]||(r.IncludesShadersStore[U]=W),G={name:U,shader:W}})),q,J,Y,ce=e((()=>{n(),q=`shadowMapVertexNormalBias`,J=`#if SM_NORMALBIAS==1
#if SM_DIRECTIONINLIGHTDATA==1
vec3 worldLightDirSM=normalize(-lightDataSM.xyz);
#else
vec3 directionToLightSM=lightDataSM.xyz-worldPos.xyz;vec3 worldLightDirSM=normalize(directionToLightSM);
#endif
float ndlSM=dot(vNormalW,worldLightDirSM);float sinNLSM=sqrt(1.0-ndlSM*ndlSM);float normalBiasSM=biasAndScaleSM.y*sinNLSM;worldPos.xyz-=vNormalW*normalBiasSM;
#endif
`,r.IncludesShadersStore[q]||(r.IncludesShadersStore[q]=J),Y={name:q,shader:J}})),le=t({shadowMapVertexShader:()=>$}),X,Z,Q,$,ue=e((()=>{n(),ee(),o(),b(),re(),m(),T(),P(),R(),C(),w(),H(),K(),f(),v(),x(),ae(),l(),s(),ce(),A(),d(),X=`shadowMapVertexShader`,Z=`attribute vec3 position;
#ifdef NORMAL
attribute vec3 normal;
#endif
#include<bonesDeclaration>
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#ifdef INSTANCES
attribute vec4 world0;attribute vec4 world1;attribute vec4 world2;attribute vec4 world3;
#endif
#include<helperFunctions>
#include<__decl__shadowMapVertex>
#ifdef ALPHATEXTURE
varying vec2 vUV;uniform mat4 diffuseMatrix;
#ifdef UV1
attribute vec2 uv;
#endif
#ifdef UV2
attribute vec2 uv2;
#endif
#endif
#include<shadowMapVertexExtraDeclaration>
#include<clipPlaneVertexDeclaration>
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
{vec3 positionUpdated=position;
#ifdef UV1
vec2 uvUpdated=uv;
#endif
#ifdef UV2
vec2 uv2Updated=uv2;
#endif
#ifdef NORMAL
vec3 normalUpdated=normal;
#endif
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
#ifdef NORMAL
mat3 normWorldSM=mat3(finalWorld);
#if defined(INSTANCES) && defined(THIN_INSTANCES)
vec3 vNormalW=normalUpdated/vec3(dot(normWorldSM[0],normWorldSM[0]),dot(normWorldSM[1],normWorldSM[1]),dot(normWorldSM[2],normWorldSM[2]));vNormalW=normalize(normWorldSM*vNormalW);
#else
#ifdef NONUNIFORMSCALING
normWorldSM=transposeMat3(inverseMat3(normWorldSM));
#endif
vec3 vNormalW=normalize(normWorldSM*normalUpdated);
#endif
#endif
#include<shadowMapVertexNormalBias>
gl_Position=viewProjection*worldPos;
#include<shadowMapVertexMetric>
#ifdef ALPHATEXTURE
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#endif
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2Updated,1.0,0.0));
#endif
#endif
#include<clipPlaneVertex>
}`,r.ShadersStore[X]||(r.ShadersStore[X]=Z),Q=[a,c,y,g,p,se,N,L,S,oe,V,G,ne,h,_,ie,i,u,Y,k,te];for(let e of Q)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);$={name:X,shader:Z}}));export{N as a,E as c,P as i,$ as n,A as o,le as r,k as s,ue as t};