import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({logDepthDeclaration:()=>s}),a,o,s,c=e((()=>{n(),a=`logDepthDeclaration`,o=`#ifdef LOGARITHMICDEPTH
uniform float logarithmicDepthConstant;varying float vFragmentDepth;
#endif
`,r.IncludesShadersStore[a]||(r.IncludesShadersStore[a]=o),s={name:a,shader:o}}));export{s as n,i as r,c as t};