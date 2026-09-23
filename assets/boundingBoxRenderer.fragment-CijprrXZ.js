import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";import{n as i,t as a}from"./boundingBoxRendererUboDeclaration-6qDNVX58.js";var o,s,c,l=e((()=>{n(),o=`boundingBoxRendererFragmentDeclaration`,s=`uniform vec4 color;
`,r.IncludesShadersStore[o]||(r.IncludesShadersStore[o]=s),c={name:o,shader:s}})),u=t({boundingBoxRendererPixelShader:()=>m}),d,f,p,m,h=e((()=>{n(),l(),i(),d=`boundingBoxRendererPixelShader`,f=`#include<__decl__boundingBoxRendererFragment>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
gl_FragColor=color;
#define CUSTOM_FRAGMENT_MAIN_END
}`,r.ShadersStore[d]||(r.ShadersStore[d]=f),p=[c,a];for(let e of p)r.IncludesShadersStore[e.name]||(r.IncludesShadersStore[e.name]=e.shader);m={name:d,shader:f}}));export{u as n,h as r,m as t};