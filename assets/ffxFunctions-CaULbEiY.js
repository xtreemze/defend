import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a,o=e((()=>{t(),r=`ffxFunctions`,i=`fn AMax3F1(x: f32,y: f32,z: f32)->f32 {return max(x,max(y,z));}
fn AMax3F3(x: vec3f,y: vec3f,z: vec3f)->vec3f {return max(x,max(y,z));}
fn AMin3F1(x: f32,y: f32,z: f32)->f32 {return min(x,min(y,z));}
fn AMin3F3(x: vec3f,y: vec3f,z: vec3f)->vec3f {return min(x,min(y,z));}
fn APrxLoRcpF1(a: f32)->f32 {return bitcast<f32>(u32(0x7ef07ebb)-bitcast<u32>(a));}
fn APrxMedRcpF1(a: f32)->f32 {let b=bitcast<f32>(u32(0x7ef19fff)-bitcast<u32>(a));return b*(-b*a+f32(2.0));}
fn APrxLoRsqF1(a: f32)->f32 {return bitcast<f32>(u32(0x5f347d74)-(bitcast<u32>(a)>>1));}
`,n.IncludesShadersStoreWGSL[r]||(n.IncludesShadersStoreWGSL[r]=i),a={name:r,shader:i}}));export{o as n,a as t};