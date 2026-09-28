import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./mrtFragmentDeclaration-CRtS1y09.js";var o=t({iblVoxelGridPixelShader:()=>u}),s,c,l,u,d=e((()=>{n(),a(),s=`iblVoxelGridPixelShader`,c=`#extension GL_EXT_draw_buffers : require
precision highp float;varying vec3 vNormalizedPosition;
#include<mrtFragmentDeclaration>[MAX_DRAW_BUFFERS]
uniform float nearPlane;uniform float farPlane;uniform float stepSize;void main(void) {vec3 normPos=vNormalizedPosition.xyz;if (normPos.z<nearPlane || normPos.z>farPlane) {discard;}
glFragData[0]=normPos.z<nearPlane+stepSize ? vec4(1.0) : vec4(0.0);
#if MAX_DRAW_BUFFERS>1
glFragData[1]=normPos.z>=nearPlane+stepSize && normPos.z<nearPlane+2.0*stepSize ? vec4(1.0) : vec4(0.0);glFragData[2]=normPos.z>=nearPlane+2.0*stepSize && normPos.z<nearPlane+3.0*stepSize ? vec4(1.0) : vec4(0.0);glFragData[3]=normPos.z>=nearPlane+3.0*stepSize && normPos.z<nearPlane+4.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>4
glFragData[4]=normPos.z>=nearPlane+4.0*stepSize && normPos.z<nearPlane+5.0*stepSize ? vec4(1.0) : vec4(0.0);glFragData[5]=normPos.z>=nearPlane+5.0*stepSize && normPos.z<nearPlane+6.0*stepSize ? vec4(1.0) : vec4(0.0);glFragData[6]=normPos.z>=nearPlane+6.0*stepSize && normPos.z<nearPlane+7.0*stepSize ? vec4(1.0) : vec4(0.0);glFragData[7]=normPos.z>=nearPlane+7.0*stepSize && normPos.z<nearPlane+8.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>8
glFragData[8]=normPos.z>=nearPlane+8.0*stepSize && normPos.z<nearPlane+9.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>9
glFragData[9]=normPos.z>=nearPlane+9.0*stepSize && normPos.z<nearPlane+10.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>10
glFragData[10]=normPos.z>=nearPlane+10.0*stepSize && normPos.z<nearPlane+11.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>11
glFragData[11]=normPos.z>=nearPlane+11.0*stepSize && normPos.z<nearPlane+12.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>12
glFragData[12]=normPos.z>=nearPlane+12.0*stepSize && normPos.z<nearPlane+13.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>13
glFragData[13]=normPos.z>=nearPlane+13.0*stepSize && normPos.z<nearPlane+14.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>14
glFragData[14]=normPos.z>=nearPlane+14.0*stepSize && normPos.z<nearPlane+15.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
#if MAX_DRAW_BUFFERS>15
glFragData[15]=normPos.z>=nearPlane+15.0*stepSize && normPos.z<nearPlane+16.0*stepSize ? vec4(1.0) : vec4(0.0);
#endif
}`,r.ShadersStore[s]||(r.ShadersStore[s]=c),l=[i];for(let e of l)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);u={name:s,shader:c}}));export{o as n,d as r,u as t};