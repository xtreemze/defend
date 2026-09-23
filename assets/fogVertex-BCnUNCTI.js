import{n as e,r as t}from"./rolldown-runtime-B0Z9INg1.js";import{n,t as r}from"./shaderStore-DBiNfWDC.js";var i=t({clipPlaneVertex:()=>s}),a,o,s,c=e((()=>{n(),a=`clipPlaneVertex`,o=`#ifdef CLIPPLANE
fClipDistance=dot(worldPos,vClipPlane);
#endif
#ifdef CLIPPLANE2
fClipDistance2=dot(worldPos,vClipPlane2);
#endif
#ifdef CLIPPLANE3
fClipDistance3=dot(worldPos,vClipPlane3);
#endif
#ifdef CLIPPLANE4
fClipDistance4=dot(worldPos,vClipPlane4);
#endif
#ifdef CLIPPLANE5
fClipDistance5=dot(worldPos,vClipPlane5);
#endif
#ifdef CLIPPLANE6
fClipDistance6=dot(worldPos,vClipPlane6);
#endif
`,r.IncludesShadersStore[a]||(r.IncludesShadersStore[a]=o),s={name:a,shader:o}})),l,u,d,f=e((()=>{n(),l=`fogVertexDeclaration`,u=`#ifdef FOG
varying vec3 vFogDistance;
#endif
`,r.IncludesShadersStore[l]||(r.IncludesShadersStore[l]=u),d={name:l,shader:u}})),p,m,h,g=e((()=>{n(),p=`fogVertex`,m=`#ifdef FOG
vFogDistance=(view*worldPos).xyz;
#endif
`,r.IncludesShadersStore[p]||(r.IncludesShadersStore[p]=m),h={name:p,shader:m}}));export{s as a,f as i,g as n,i as o,d as r,c as s,h as t};