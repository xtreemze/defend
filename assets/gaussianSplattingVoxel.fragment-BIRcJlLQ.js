import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a;e((()=>{t(),r=`gaussianSplattingVoxelPixelShader`,i=`precision highp float;layout(location=0) out highp float glFragData[MAX_DRAW_BUFFERS];varying vec3 vNormalizedPosition;varying vec3 vNormalizedCenterPosition;varying float vAlpha;varying vec2 vPatchPosition;uniform float nearPlane;uniform float farPlane;uniform float stepSize;float max3(vec3 v) { return max(max(v.x,v.y),v.z); }
void main(void) {vec3 normPos=vNormalizedPosition.xyz;if (normPos.z<nearPlane || normPos.z>farPlane) {discard;}
float distToCenter=max3(abs(vNormalizedCenterPosition-normPos));float shadowingOpacity=clamp((distToCenter<stepSize ? 1.0 : exp(-dot(vPatchPosition,vPatchPosition)))*vAlpha,0.0,1.0);if (shadowingOpacity<=0.0) {discard;}
glFragData[0]=normPos.z<nearPlane+stepSize ? shadowingOpacity : 0.0;glFragData[1]=normPos.z>=nearPlane+stepSize && normPos.z<nearPlane+2.0*stepSize ? shadowingOpacity : 0.0;glFragData[2]=normPos.z>=nearPlane+2.0*stepSize && normPos.z<nearPlane+3.0*stepSize ? shadowingOpacity : 0.0;glFragData[3]=normPos.z>=nearPlane+3.0*stepSize && normPos.z<nearPlane+4.0*stepSize ? shadowingOpacity : 0.0;
#if MAX_DRAW_BUFFERS>4
glFragData[4]=normPos.z>=nearPlane+4.0*stepSize && normPos.z<nearPlane+5.0*stepSize ? shadowingOpacity : 0.0;glFragData[5]=normPos.z>=nearPlane+5.0*stepSize && normPos.z<nearPlane+6.0*stepSize ? shadowingOpacity : 0.0;
#if MAX_DRAW_BUFFERS>6
glFragData[6]=normPos.z>=nearPlane+6.0*stepSize && normPos.z<nearPlane+7.0*stepSize ? shadowingOpacity : 0.0;glFragData[7]=normPos.z>=nearPlane+7.0*stepSize && normPos.z<nearPlane+8.0*stepSize ? shadowingOpacity : 0.0;
#endif
#endif
}`,n.ShadersStore[r]||(n.ShadersStore[r]=i),a={name:r,shader:i}}))();export{a as gaussianSplattingVoxelPixelShader};