import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a;e((()=>{t(),r=`textureProcessorPixelShader`,i=`#ifdef OPERAND_A_TEXTURE
uniform sampler2D textureA;
#endif
#ifdef OPERAND_B_TEXTURE
uniform sampler2D textureB;
#endif
#if defined(OP_LERP) && defined(LERP_T_TEXTURE)
uniform sampler2D textureT;
#endif
#ifdef OPERAND_A_MATRIX
uniform mat4 textureAMatrix;
#endif
#ifdef OPERAND_B_MATRIX
uniform mat4 textureBMatrix;
#endif
#if defined(OP_LERP) && defined(LERP_T_MATRIX)
uniform mat4 textureTMatrix;
#endif
#if !defined(OPERAND_A_TEXTURE) || defined(OPERAND_A_FACTOR)
uniform vec4 factorA;
#endif
#if !defined(OPERAND_B_TEXTURE) || defined(OPERAND_B_FACTOR)
uniform vec4 factorB;
#endif
#if defined(OP_LERP) && (!defined(LERP_T_TEXTURE) || defined(LERP_T_FACTOR))
uniform vec4 factorT;
#endif
varying vec2 vUV;void main() {vec2 uv=vUV;
#ifdef OPERAND_A_TEXTURE
#ifdef OPERAND_A_MATRIX
vec4 a=texture2D(textureA,(textureAMatrix*vec4(uv,0.0,1.0)).xy);
#else
vec4 a=texture2D(textureA,uv);
#endif
#ifdef OPERAND_A_SRGB
a.rgb=mix(a.rgb/12.92,pow((a.rgb+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),a.rgb));
#endif
#ifdef OPERAND_A_CHANNEL_R
a=vec4(a.rrr,a.a);
#elif defined(OPERAND_A_CHANNEL_G)
a=vec4(a.ggg,a.a);
#elif defined(OPERAND_A_CHANNEL_B)
a=vec4(a.bbb,a.a);
#elif defined(OPERAND_A_CHANNEL_A)
a=a.aaaa;
#endif
#ifdef OPERAND_A_FACTOR
a*=factorA;
#endif
#else
vec4 a=factorA;
#endif
#ifdef OPERAND_B_TEXTURE
#ifdef OPERAND_B_MATRIX
vec4 b=texture2D(textureB,(textureBMatrix*vec4(uv,0.0,1.0)).xy);
#else
vec4 b=texture2D(textureB,uv);
#endif
#ifdef OPERAND_B_SRGB
b.rgb=mix(b.rgb/12.92,pow((b.rgb+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),b.rgb));
#endif
#ifdef OPERAND_B_CHANNEL_R
b=vec4(b.rrr,b.a);
#elif defined(OPERAND_B_CHANNEL_G)
b=vec4(b.ggg,b.a);
#elif defined(OPERAND_B_CHANNEL_B)
b=vec4(b.bbb,b.a);
#elif defined(OPERAND_B_CHANNEL_A)
b=b.aaaa;
#endif
#ifdef OPERAND_B_FACTOR
b*=factorB;
#endif
#else
vec4 b=factorB;
#endif
#ifdef OP_CHANNEL_MAX
float _cmax=max(max(a.r,a.g),a.b);
#ifdef CHANNEL_MAX_INCLUDE_ALPHA
_cmax=max(_cmax,a.a);vec4 result=vec4(_cmax,_cmax,_cmax,_cmax);
#else
vec4 result=vec4(_cmax,_cmax,_cmax,a.a);
#endif
#elif defined(OP_INVERT)
float _ir=a.r; float _ig=a.g; float _ib=a.b; float _ia=a.a;
#ifdef INVERT_R
_ir=1.0-_ir;
#endif
#ifdef INVERT_G
_ig=1.0-_ig;
#endif
#ifdef INVERT_B
_ib=1.0-_ib;
#endif
#ifdef INVERT_A
_ia=1.0-_ia;
#endif
vec4 result=vec4(_ir,_ig,_ib,_ia);
#elif defined(OP_LERP)
#ifdef LERP_T_TEXTURE
#ifdef LERP_T_MATRIX
vec4 t=texture2D(textureT,(textureTMatrix*vec4(uv,0.0,1.0)).xy);
#else
vec4 t=texture2D(textureT,uv);
#endif
#ifdef LERP_T_SRGB
t.rgb=mix(t.rgb/12.92,pow((t.rgb+0.055)/1.055,vec3(2.4)),step(vec3(0.04045),t.rgb));
#endif
#ifdef LERP_T_CHANNEL_R
t=vec4(t.rrr,t.a);
#elif defined(LERP_T_CHANNEL_G)
t=vec4(t.ggg,t.a);
#elif defined(LERP_T_CHANNEL_B)
t=vec4(t.bbb,t.a);
#elif defined(LERP_T_CHANNEL_A)
t=t.aaaa;
#endif
#ifdef LERP_T_FACTOR
t*=factorT;
#endif
#else
vec4 t=factorT;
#endif
vec4 result=mix(a,b,t);
#elif defined(OP_MAX)
vec4 result=max(a,b);
#else
vec4 result=a*b;
#endif
#ifdef OUTPUT_MASK_R_ZERO
result.r=0.0;
#endif
#ifdef OUTPUT_MASK_G_ZERO
result.g=0.0;
#endif
#ifdef OUTPUT_MASK_B_ZERO
result.b=0.0;
#endif
#ifdef OUTPUT_MASK_A_ONE
result.a=1.0;
#endif
#ifdef OUTPUT_SRGB
result.rgb=mix(result.rgb*12.92,pow(result.rgb,vec3(1.0/2.4))*1.055-0.055,step(vec3(0.0031308),result.rgb));
#endif
gl_FragColor=result;}
`,n.ShadersStore[r]||(n.ShadersStore[r]=i),a={name:r,shader:i}}))();export{a as textureProcessorPixelShader};