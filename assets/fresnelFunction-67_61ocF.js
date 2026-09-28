import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({fresnelFunctionWGSL:()=>s}),a,o,s,c=e((()=>{n(),a=`fresnelFunction`,o=`#ifdef FRESNEL
fn computeFresnelTerm(viewDirection: vec3f,worldNormal: vec3f,bias: f32,power: f32)->f32
{let fresnelTerm: f32=pow(bias+abs(dot(viewDirection,worldNormal)),power);return clamp(fresnelTerm,0.,1.);}
#endif
`,r.IncludesShadersStoreWGSL[a]||(r.IncludesShadersStoreWGSL[a]=o),s={name:a,shader:o}}));export{i as n,c as r,s as t};