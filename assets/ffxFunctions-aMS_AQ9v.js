import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a,o=e((()=>{t(),r=`ffxFunctions`,i=`float AMax3F1(float x,float y,float z) {return max(x,max(y,z));}
vec3 AMax3F3(vec3 x,vec3 y,vec3 z) {return max(x,max(y,z));}
float AMin3F1(float x,float y,float z) {return min(x,min(y,z));}
vec3 AMin3F3(vec3 x,vec3 y,vec3 z) {return min(x,min(y,z));}
float APrxLoRcpF1(float a) {return uintBitsToFloat(0x7ef07ebbu-floatBitsToUint(a));}
float APrxMedRcpF1(float a) {float b=uintBitsToFloat(0x7ef19fffu-floatBitsToUint(a));return b*(-b*a+2.0);}
float APrxLoRsqF1(float a) {return uintBitsToFloat(0x5f347d74u-(floatBitsToUint(a)>>1u));}
`,n.IncludesShadersStore[r]||(n.IncludesShadersStore[r]=i),a={name:r,shader:i}}));export{o as n,a as t};