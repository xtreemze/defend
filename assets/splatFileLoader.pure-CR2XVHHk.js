import{Jt as e,an as t}from"./engineRegistration.pure-CPEpUP4b.js";import{c as n,n as r,o as i,s as a,t as o}from"./math.vector.pure-BAbqkt6K.js";import{a as s,n as c}from"./math.color.pure-jwlNow8J.js";import{n as l,t as u}from"./logger-7Rt2cEsq.js";import{a as d,r as f}from"./tools.pure-DAKX4exm.js";import{r as p}from"./buffer.pure-CtkrCo9r.js";import{n as m,t as h}from"./math.plane-mxQYSpzw.js";import{n as g,t as _}from"./math.frustum-CZQY5uBK.js";import{A as v,D as y,F as b,T as x,a as S,g as C,k as w,t as T}from"./mesh.pure-CFr3xoE_.js";import{c as E,s as D}from"./material.pure-VcSaoKvg.js";import{a as O,n as ee}from"./assetContainer-H4AISMA0.js";import{n as k,t as A}from"./rawTexture-BF7hDZNs.js";import{a as te,i as ne,r as re,t as ie}from"./gaussianSplattingMesh-CwF_xIAf.js";import{d as j,i as ae,l as oe,s as M,t as N,u as P,v as F}from"./gaussianSplattingMesh.pure-icV5vLFD.js";import{f as se,s as ce}from"./sceneLoader-CvKN7Rsb.js";import{n as le,t as I}from"./constants-DIn45f0W.js";import{c as ue,i as de,l as fe,r as pe,t as me}from"./gaussianSplattingMeshBase-Bqt4OB_S.js";import{t as L}from"./tools-DQhtxqxI.js";import{t as he}from"./buffer-U8aL4z3F.js";import{t as ge}from"./camera-YDpMJtAn.js";import{t as _e}from"./mesh-zg-HXjoa.js";import{t as R}from"./math.color-C6rcxhDK.js";import{t as z}from"./math.vector-yVigugQV.js";import{r as B}from"./quickCreateToolsService-C-GqDTqc-Bth1YUPw.js";n(),s(),l(),m(),g(),v(),E(),y(),S(),se(),ae(),L(),he(),ge(),te(),ie(),R(),z(),oe(),j(),k(),le(),d();var V=.28209479177387814;async function H(e,t,n){return await new Promise((r,i)=>{let a=n.createCanvasImage();if(!a)throw Error(`Failed to create ImageBitmap`);a.onload=()=>{try{let e=n.createCanvas(a.width,a.height);if(!e)throw Error(`Failed to create canvas`);let t=e.getContext(`2d`);if(!t)throw Error(`Failed to get 2D context`);t.drawImage(a,0,0);let i=t.getImageData(0,0,e.width,e.height);r({bits:new Uint8Array(i.data.buffer),width:i.width,height:i.height})}catch(e){i(`Error loading image ${a.src} with exception: ${e}`)}},a.onerror=e=>{i(`Error loading image ${a.src} with exception: ${e}`)},a.crossOrigin=`anonymous`;let o;if(typeof e==`string`){if(!t)throw Error(`filename is required when using a URL`);a.src=e+t}else{let t=new Blob([e],{type:`image/webp`});o=URL.createObjectURL(t),a.src=o}})}async function ve(e,t,n){let r=e.count?e.count:e.means.shape[0],i=new ArrayBuffer(32*r),a=new Float32Array(i),o=new Float32Array(i),s=new Uint8ClampedArray(i),c=new Uint8ClampedArray(i),l=e=>Math.sign(e)*(Math.exp(Math.abs(e))-1),u=t[0].bits,d=t[1].bits;if(!Array.isArray(e.means.mins)||!Array.isArray(e.means.maxs))throw Error(`Missing arrays in SOG data.`);for(let t=0;t<r;t++){let n=t*4;for(let r=0;r<3;r++){let i=e.means.mins[r],o=e.means.maxs[r],s=d[n+r],c=u[n+r],f=s<<8|c,p=P.Lerp(i,o,f/65535);a[t*8+r]=l(p)}}let f=t[2].bits;if(e.version===2){if(!e.scales.codebook)throw Error(`Missing codebook in SOG version 2 scales data.`);for(let t=0;t<r;t++){let n=t*4;for(let r=0;r<3;r++){let i=e.scales.codebook[f[n+r]],a=Math.exp(i);o[t*8+3+r]=a}}}else{if(!Array.isArray(e.scales.mins)||!Array.isArray(e.scales.maxs))throw Error(`Missing arrays in SOG scales data.`);for(let t=0;t<r;t++){let n=t*4;for(let r=0;r<3;r++){let i=f[n+r],a=P.Lerp(e.scales.mins[r],e.scales.maxs[r],i/255),s=Math.exp(a);o[t*8+3+r]=s}}}let p=t[4].bits;if(e.version===2){if(!e.sh0.codebook)throw Error(`Missing codebook in SOG version 2 sh0 data.`);for(let t=0;t<r;t++){let n=t*4;for(let r=0;r<3;r++){let i=.5+e.sh0.codebook[p[n+r]]*V;s[t*32+24+r]=Math.max(0,Math.min(255,Math.round(255*i)))}s[t*32+24+3]=p[n+3]}}else{if(!Array.isArray(e.sh0.mins)||!Array.isArray(e.sh0.maxs))throw Error(`Missing arrays in SOG sh0 data.`);for(let t=0;t<r;t++){let n=t*4;for(let r=0;r<4;r++){let i=e.sh0.mins[r],a=e.sh0.maxs[r],o=p[n+r],c=P.Lerp(i,a,o/255),l;l=r<3?.5+c*V:1/(1+Math.exp(-c)),s[t*32+24+r]=Math.max(0,Math.min(255,Math.round(255*l)))}}}let m=e=>(e/255-.5)*2/Math.SQRT2,h=t[3].bits;for(let e=0;e<r;e++){let t=h[e*4+0],n=h[e*4+1],r=h[e*4+2],i=h[e*4+3],a=m(t),o=m(n),s=m(r),l=i-252,u=a*a+o*o+s*s,d=Math.sqrt(Math.max(0,1-u)),f;switch(l){case 0:f=[d,a,o,s];break;case 1:f=[a,d,o,s];break;case 2:f=[a,o,d,s];break;case 3:f=[a,o,s,d];break;default:throw Error(`Invalid quaternion mode`)}c[e*32+28+0]=f[0]*127.5+127.5,c[e*32+28+1]=f[1]*127.5+127.5,c[e*32+28+2]=f[2]*127.5+127.5,c[e*32+28+3]=f[3]*127.5+127.5}if(e.shN){let a=e.shN.bands?(e.shN.bands+1)**2-1:e.shN.shape[1]/3,o=e.shN.bands!==void 0&&e.shN.bands!==null?e.shN.bands:Math.round(Math.sqrt(a+1)-1),s=t[5].bits,c=t[6].bits,l=t[5].width,u=a*3,d=Math.ceil(u/16),f=n.getEngine().getCaps().maxTextureSize,p=Math.ceil(r/f),m=M(d,p*f*4*4);if(e.version===2){if(!e.shN.codebook)throw Error(`Missing codebook in SOG version 2 shN data.`);for(let t=0;t<r;t++){let n=c[t*4+0]+(c[t*4+1]<<8),r=n%64*a,i=Math.floor(n/64);for(let n=0;n<a;n++)for(let a=0;a<3;a++){let o=n*3+a,c=m[Math.floor(o/16)],u=o%16,d=t*16,f=e.shN.codebook[s[(r+n)*4+a+i*l*4]]*127.5+127.5;c[u+d]=Math.max(0,Math.min(255,f))}}}else for(let t=0;t<r;t++){let n=c[t*4+0]+(c[t*4+1]<<8),r=n%64*a,i=Math.floor(n/64),o=e.shN.mins,u=e.shN.maxs;for(let e=0;e<3;e++)for(let n=0;n<a/3;n++){let a=n*3+e,c=m[Math.floor(a/16)],d=a%16,f=t*16,p=P.Lerp(o,u,s[(r+n)*4+e+i*l*4]/255)*127.5+127.5;c[d+f]=Math.max(0,Math.min(255,p))}}return await new Promise(e=>{e({mode:0,data:i,hasVertexColors:!1,sh:m,shDegree:o})})}return await new Promise(e=>{e({mode:0,data:i,hasVertexColors:!1})})}async function ye(e,t,n){let r,i;if(e instanceof Map){i=e;let t=i.get(`meta.json`);if(!t)throw Error(`meta.json not found in files Map`);r=JSON.parse(new TextDecoder().decode(t))}else r=e;let a=[...r.means.files,...r.scales.files,...r.quats.files,...r.sh0.files];r.shN&&a.push(...r.shN.files);let o=await Promise.all(a.map(async e=>i&&i.has(e)?await H(i.get(e),e,n.getEngine()):await H(t,e,n.getEngine())));return await ve(r,o,n)}function be(e,t,n,r){let i=new A(t,n,r,I.TEXTUREFORMAT_RGBA,e,!1,!1,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURETYPE_UNSIGNED_BYTE);return i.wrapU=I.TEXTURE_CLAMP_ADDRESSMODE,i.wrapV=I.TEXTURE_CLAMP_ADDRESSMODE,i}function U(e,t){return be(e,t.bits,t.width,t.height)}async function W(e,t,n){let r=n.getEngine();if(typeof createImageBitmap==`function`)try{let i=t.toLowerCase().endsWith(`.png`)?`image/png`:`image/webp`,a;if(typeof e==`string`){let n=await f.LoadFileAsync(e+t,!0);a=new Blob([n],{type:i})}else a=new Blob([e],{type:i});let o=await createImageBitmap(a,{premultiplyAlpha:`none`,colorSpaceConversion:`none`});try{let e=new A(null,o.width,o.height,I.TEXTUREFORMAT_RGBA,n,!1,!1,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURETYPE_UNSIGNED_BYTE);e.wrapU=I.TEXTURE_CLAMP_ADDRESSMODE,e.wrapV=I.TEXTURE_CLAMP_ADDRESSMODE;let t=e.getInternalTexture();return t&&r.updateDynamicTexture(t,o,!1,!1),e}finally{o.close()}}catch{}return U(n,await H(e,t,r))}function xe(e,t,n,r){let i=e=>Math.sign(e)*(Math.exp(Math.abs(e))-1);if(!Array.isArray(e.means.mins)||!Array.isArray(e.means.maxs))throw Error(`Missing arrays in SOG data.`);let a=new Float32Array(r*4);for(let o=0;o<r;o++){let r=o*4;for(let s=0;s<3;s++){let c=n[r+s]<<8|t[r+s],l=P.Lerp(e.means.mins[s],e.means.maxs[s],c/65535);a[o*4+s]=i(l)}a[o*4+3]=1}return a}async function G(e,t,n,r=!0,i,a){let o,s;if(e instanceof Map){s=e;let t=s.get(`meta.json`);if(!t)throw Error(`meta.json not found in files Map`);o=JSON.parse(new TextDecoder().decode(t))}else o=e;let c=async e=>s&&s.has(e)?await H(s.get(e),e,n.getEngine()):i?await H(new Uint8Array(await i.loadFileAsync(t+e,a)),e,n.getEngine()):await H(t,e,n.getEngine()),l=async e=>s&&s.has(e)?await W(s.get(e),e,n):i?await W(new Uint8Array(await i.loadFileAsync(t+e,a)),e,n):await W(t,e,n),u=[...o.scales.files,...o.quats.files,...o.sh0.files,...o.shN?.files??[]],d,f,p,m,h=null,g;if(r){let[e,t]=await Promise.all([Promise.all(o.means.files.map(c)),Promise.all(u.map(l))]);h=[e[0],e[1]],g=t,d=U(n,e[0]),f=U(n,e[1]),p=e[0].width,m=e[0].height}else{let[e,t]=await Promise.all([Promise.all(o.means.files.map(l)),Promise.all(u.map(l))]);g=t,d=e[0],f=e[1];let n=d.getSize();p=n.width,m=n.height}let _=o.count??o.means.shape[0],v=p*m;if(v<_)throw Error(`SOG texture contains ${v} texels, but metadata references ${_} splats.`);let y=g[0],b=g[1],x=g[2],S,C,w=0,T=0;o.shN&&g.length>=5&&(S=g[3],C=g[4],w=o.shN.bands?(o.shN.bands+1)**2-1:o.shN.shape[1]/3,T=o.shN.bands??Math.round(Math.sqrt(w+1)-1));let E;if(o.version===2){let e=new Float32Array(768);o.scales.codebook&&e.set(o.scales.codebook.slice(0,256),0),o.sh0.codebook&&e.set(o.sh0.codebook.slice(0,256),256),o.shN?.codebook&&e.set(o.shN.codebook.slice(0,256),512),E=new A(e,768,1,I.TEXTUREFORMAT_R,n,!1,!1,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURETYPE_FLOAT),E.wrapU=I.TEXTURE_CLAMP_ADDRESSMODE,E.wrapV=I.TEXTURE_CLAMP_ADDRESSMODE}let D=o.means.mins,O=o.means.maxs,ee={version:o.version===2?2:1,splatCount:_,shDegree:T,meansTextureL:d,meansTextureU:f,scalesTexture:y,quatsTexture:b,sh0Texture:x,shCentroidsTexture:S,shLabelsTexture:C,codebookTexture:E,meansMin:[D[0],D[1],D[2]],meansMax:[O[0],O[1],O[2]],scalesMin:Array.isArray(o.scales.mins)?[o.scales.mins[0],o.scales.mins[1],o.scales.mins[2]]:void 0,scalesMax:Array.isArray(o.scales.maxs)?[o.scales.maxs[0],o.scales.maxs[1],o.scales.maxs[2]]:void 0,sh0Min:Array.isArray(o.sh0.mins)?[o.sh0.mins[0],o.sh0.mins[1],o.sh0.mins[2],o.sh0.mins[3]]:void 0,sh0Max:Array.isArray(o.sh0.maxs)?[o.sh0.maxs[0],o.sh0.maxs[1],o.sh0.maxs[2],o.sh0.maxs[3]]:void 0,shnMin:typeof o.shN?.mins==`number`?o.shN.mins:void 0,shnMax:typeof o.shN?.maxs==`number`?o.shN.maxs:void 0,shCoeffCount:w,positions:h?xe(o,h[0].bits,h[1].bits,_):new Float32Array};return{mode:0,data:new ArrayBuffer(0),hasVertexColors:!1,shDegree:T,sogTextures:ee}}ne(),re(),_e();var K=`precision highp float;
attribute vec3 position;
void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
}
`,Se=`precision highp float;
precision highp int;

uniform sampler2D sogMeansLTex;
uniform sampler2D sogMeansUTex;
uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogSh0Tex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogMeansMin;
uniform vec3 sogMeansMax;
uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform vec4 sogSh0Min;
uniform vec4 sogSh0Max;
uniform int uVersion;
uniform int uOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[4];

mat3 transposeM(mat3 m) {
    return mat3(m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]);
}

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 mL = texelFetch(sogMeansLTex, src, 0).xyz;
    vec3 mU = texelFetch(sogMeansUTex, src, 0).xyz;
    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);
    vec4 c0 = texelFetch(sogSh0Tex, src, 0);

    // Position: q16 = (u<<8)|l normalized; n = lerp(min,max,q16); pos = sign(n)*(exp(|n|)-1)
    vec3 q16 = (mU * 256.0 + mL) * (255.0 / 65535.0);
    vec3 nPos = mix(sogMeansMin, sogMeansMax, q16);
    vec3 center = sign(nPos) * (exp(abs(nPos)) - vec3(1.0));

    // Scale (v1: lerp+exp ; v2: codebook lookup)
    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    // Quaternion (largest-omitted, mode in alpha as 252 + omitted-index)
    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    mat3 S2 = mat3(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    mat3 Sigma = R * S2 * transposeM(R);

    // Color (sh0)
    const float SH_C0 = 0.28209479177387814;
    vec3 colRgb;
    float colA;
    if (uVersion == 2) {
        vec3 c3;
        c3.x = texelFetch(sogCodebookTex, ivec2(256 + int(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = texelFetch(sogCodebookTex, ivec2(256 + int(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = texelFetch(sogCodebookTex, ivec2(256 + int(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        vec4 cLerp = mix(sogSh0Min, sogSh0Max, c0);
        colRgb = vec3(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    glFragData[0] = vec4(center, 1.0);
    glFragData[1] = vec4(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    glFragData[2] = vec4(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    glFragData[3] = vec4(colRgb, colA);
}
`,q=`
attribute position : vec3<f32>;
@vertex
fn main(input : VertexInputs) -> FragmentInputs {
    vertexOutputs.position = vec4<f32>(input.position.xy, 0.0, 1.0);
}
`,Ce=`
var sogMeansLTexSampler : sampler;
var sogMeansLTex : texture_2d<f32>;
var sogMeansUTexSampler : sampler;
var sogMeansUTex : texture_2d<f32>;
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogSh0TexSampler : sampler;
var sogSh0Tex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogMeansMin : vec3<f32>;
uniform sogMeansMax : vec3<f32>;
uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform sogSh0Min : vec4<f32>;
uniform sogSh0Max : vec4<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let mL : vec3<f32> = textureLoad(sogMeansLTex, src, 0).xyz;
    let mU : vec3<f32> = textureLoad(sogMeansUTex, src, 0).xyz;
    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);
    let c0 : vec4<f32> = textureLoad(sogSh0Tex, src, 0);

    let q16 : vec3<f32> = (mU * 256.0 + mL) * (255.0 / 65535.0);
    let nPos : vec3<f32> = mix(uniforms.sogMeansMin, uniforms.sogMeansMax, q16);
    let center : vec3<f32> = sign(nPos) * (exp(abs(nPos)) - vec3<f32>(1.0));

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );
    let S2 : mat3x3<f32> = mat3x3<f32>(
        4.0 * splatScale.x * splatScale.x, 0.0, 0.0,
        0.0, 4.0 * splatScale.y * splatScale.y, 0.0,
        0.0, 0.0, 4.0 * splatScale.z * splatScale.z
    );
    let Sigma : mat3x3<f32> = R * S2 * transpose(R);

    let SH_C0 : f32 = 0.28209479177387814;
    var colRgb : vec3<f32>;
    var colA : f32;
    if (uniforms.uVersion == 2) {
        var c3 : vec3<f32>;
        c3.x = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.x * 255.0 + 0.5), 0), 0).r;
        c3.y = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.y * 255.0 + 0.5), 0), 0).r;
        c3.z = textureLoad(sogCodebookTex, vec2<i32>(256 + i32(c0.z * 255.0 + 0.5), 0), 0).r;
        colRgb = vec3<f32>(0.5) + c3 * SH_C0;
        colA = c0.w;
    } else {
        let cLerp : vec4<f32> = mix(uniforms.sogSh0Min, uniforms.sogSh0Max, c0);
        colRgb = vec3<f32>(0.5) + cLerp.xyz * SH_C0;
        colA = 1.0 / (1.0 + exp(-cLerp.w));
    }

    fragmentOutputs.fragData0 = vec4<f32>(center, 1.0);
    fragmentOutputs.fragData1 = vec4<f32>(Sigma[0][0], Sigma[0][1], Sigma[0][2], Sigma[1][1]);
    fragmentOutputs.fragData2 = vec4<f32>(Sigma[1][2], Sigma[2][2], 0.0, 0.0);
    fragmentOutputs.fragData3 = vec4<f32>(colRgb, colA);
}
`,we=`gsSogRotDecodeToWorkBuffer`,Te=`precision highp float;
precision highp int;

uniform sampler2D sogScalesTex;
uniform sampler2D sogQuatsTex;
uniform sampler2D sogCodebookTex;

uniform vec3 sogScalesMin;
uniform vec3 sogScalesMax;
uniform int uVersion;
uniform int uOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int k = global - uOffset;
    ivec2 src = ivec2(k - (k / uSrcWidth) * uSrcWidth, k / uSrcWidth);

    vec3 sRaw = texelFetch(sogScalesTex, src, 0).xyz;
    vec4 qRaw = texelFetch(sogQuatsTex, src, 0);

    vec3 splatScale;
    if (uVersion == 2) {
        vec3 sIdx = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.x), 0), 0).r);
        splatScale.y = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.y), 0), 0).r);
        splatScale.z = exp(texelFetch(sogCodebookTex, ivec2(int(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(sogScalesMin, sogScalesMax, sRaw));
    }

    const float invSqrt2 = 0.70710678118;
    vec3 qabc = (qRaw.xyz - vec3(0.5)) * 2.0 * invSqrt2;
    int qMode = int(qRaw.w * 255.0 + 0.5) - 252;
    float qd = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    vec4 quat;
    if (qMode == 0) {
        quat = vec4(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4(qabc.x, qabc.y, qabc.z, qd);
    }

    float qw = quat.x, qx = quat.y, qy = quat.z, qz = quat.w;
    mat3 R = mat3(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    glFragData[0] = vec4(R[0], R[1].x);
    glFragData[1] = vec4(R[1].y, R[1].z, R[2].x, R[2].y);
    glFragData[2] = vec4(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,Ee=`
var sogScalesTexSampler : sampler;
var sogScalesTex : texture_2d<f32>;
var sogQuatsTexSampler : sampler;
var sogQuatsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogScalesMin : vec3<f32>;
uniform sogScalesMax : vec3<f32>;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let k : i32 = global - uniforms.uOffset;
    let src : vec2<i32> = vec2<i32>(k - (k / uniforms.uSrcWidth) * uniforms.uSrcWidth, k / uniforms.uSrcWidth);

    let sRaw : vec3<f32> = textureLoad(sogScalesTex, src, 0).xyz;
    let qRaw : vec4<f32> = textureLoad(sogQuatsTex, src, 0);

    var splatScale : vec3<f32>;
    if (uniforms.uVersion == 2) {
        let sIdx : vec3<f32> = floor(sRaw * 255.0 + 0.5);
        splatScale.x = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.x), 0), 0).r);
        splatScale.y = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.y), 0), 0).r);
        splatScale.z = exp(textureLoad(sogCodebookTex, vec2<i32>(i32(sIdx.z), 0), 0).r);
    } else {
        splatScale = exp(mix(uniforms.sogScalesMin, uniforms.sogScalesMax, sRaw));
    }

    let invSqrt2 : f32 = 0.70710678118;
    let qabc : vec3<f32> = (qRaw.xyz - vec3<f32>(0.5)) * 2.0 * invSqrt2;
    let qMode : i32 = i32(qRaw.w * 255.0 + 0.5) - 252;
    let qd : f32 = sqrt(max(0.0, 1.0 - dot(qabc, qabc)));
    var quat : vec4<f32>;
    if (qMode == 0) {
        quat = vec4<f32>(qd, qabc.x, qabc.y, qabc.z);
    } else if (qMode == 1) {
        quat = vec4<f32>(qabc.x, qd, qabc.y, qabc.z);
    } else if (qMode == 2) {
        quat = vec4<f32>(qabc.x, qabc.y, qd, qabc.z);
    } else {
        quat = vec4<f32>(qabc.x, qabc.y, qabc.z, qd);
    }

    let qw : f32 = quat.x;
    let qx : f32 = quat.y;
    let qy : f32 = quat.z;
    let qz : f32 = quat.w;
    let R : mat3x3<f32> = mat3x3<f32>(
        1.0 - 2.0 * (qy * qy + qz * qz), 2.0 * (qx * qy + qw * qz), 2.0 * (qx * qz - qw * qy),
        2.0 * (qx * qy - qw * qz), 1.0 - 2.0 * (qx * qx + qz * qz), 2.0 * (qy * qz + qw * qx),
        2.0 * (qx * qz + qw * qy), 2.0 * (qy * qz - qw * qx), 1.0 - 2.0 * (qx * qx + qy * qy)
    );

    fragmentOutputs.fragData0 = vec4<f32>(R[0], R[1].x);
    fragmentOutputs.fragData1 = vec4<f32>(R[1].y, R[1].z, R[2].x, R[2].y);
    fragmentOutputs.fragData2 = vec4<f32>(R[2].z, 2.0 * splatScale.x, 2.0 * splatScale.y, 2.0 * splatScale.z);
}
`,De=`gsSogShDecodeToWorkBuffer`,Oe=`precision highp float;
precision highp int;

uniform sampler2D sogShLabelsTex;
uniform sampler2D sogShCentroidsTex;
uniform sampler2D sogCodebookTex;
uniform float sogShnMin;
uniform float sogShnMax;
uniform int uVersion;
uniform int uOffset;
uniform int uCount;
uniform int uDestWidth;
uniform int uSrcWidth;
uniform int uCoeffs;
uniform int uShTextureIndex;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int global = p.y * uDestWidth + p.x;
    if (global < uOffset || global >= uOffset + uCount) {
        discard;
    }
    int kLocal = global - uOffset;

    // 16-bit label for this source splat (LSB in r, MSB in g), indexed over the labels texture's own width.
    ivec2 lsz = textureSize(sogShLabelsTex, 0);
    ivec2 lsrc = ivec2(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    vec4 labelRaw = texelFetch(sogShLabelsTex, lsrc, 0);
    int n = int(labelRaw.r * 255.0 + 0.5) + int(labelRaw.g * 255.0 + 0.5) * 256;
    int u = (n - (n / 64) * 64) * uCoeffs;
    int v = n / 64;

    uint packed0 = 0u;
    uint packed1 = 0u;
    uint packed2 = 0u;
    uint packed3 = 0u;

    for (int b = 0; b < 16; b++) {
        int s = uShTextureIndex * 16 + b; // flat SH scalar index
        int kc = s / 3;                    // higher-order coefficient (0-based)
        int j = s - kc * 3;                // channel (0=r,1=g,2=b)
        float byteVal = 128.0;             // neutral (decompose(128) ~= 0)
        if (kc < uCoeffs) {
            vec4 centroidRaw = texelFetch(sogShCentroidsTex, ivec2(u + kc, v), 0);
            float ch = (j == 0) ? centroidRaw.r : ((j == 1) ? centroidRaw.g : centroidRaw.b);
            float coeff;
            if (uVersion == 2) {
                int cidx = int(ch * 255.0 + 0.5);
                coeff = texelFetch(sogCodebookTex, ivec2(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(sogShnMin, sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        uint bv = uint(byteVal + 0.5);
        int comp = b / 4;
        uint contrib = bv << uint((b - comp * 4) * 8);
        if (comp == 0) { packed0 |= contrib; }
        else if (comp == 1) { packed1 |= contrib; }
        else if (comp == 2) { packed2 |= contrib; }
        else { packed3 |= contrib; }
    }
    outSh = uvec4(packed0, packed1, packed2, packed3);
}
`,ke=`
var sogShLabelsTexSampler : sampler;
var sogShLabelsTex : texture_2d<f32>;
var sogShCentroidsTexSampler : sampler;
var sogShCentroidsTex : texture_2d<f32>;
var sogCodebookTexSampler : sampler;
var sogCodebookTex : texture_2d<f32>;

uniform sogShnMin : f32;
uniform sogShnMax : f32;
uniform uVersion : i32;
uniform uOffset : i32;
uniform uCount : i32;
uniform uDestWidth : i32;
uniform uSrcWidth : i32;
uniform uCoeffs : i32;
uniform uShTextureIndex : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    let global : i32 = p.y * uniforms.uDestWidth + p.x;
    if (global < uniforms.uOffset || global >= uniforms.uOffset + uniforms.uCount) {
        discard;
    }
    let kLocal : i32 = global - uniforms.uOffset;

    let lsz : vec2<i32> = vec2<i32>(textureDimensions(sogShLabelsTex, 0));
    let lsrc : vec2<i32> = vec2<i32>(kLocal - (kLocal / lsz.x) * lsz.x, kLocal / lsz.x);
    let labelRaw : vec4<f32> = textureLoad(sogShLabelsTex, lsrc, 0);
    let n : i32 = i32(labelRaw.r * 255.0 + 0.5) + i32(labelRaw.g * 255.0 + 0.5) * 256;
    let u : i32 = (n - (n / 64) * 64) * uniforms.uCoeffs;
    let v : i32 = n / 64;

    var packed : array<u32, 4> = array<u32, 4>(0u, 0u, 0u, 0u);

    for (var b : i32 = 0; b < 16; b = b + 1) {
        let s : i32 = uniforms.uShTextureIndex * 16 + b;
        let kc : i32 = s / 3;
        let j : i32 = s - kc * 3;
        var byteVal : f32 = 128.0;
        if (kc < uniforms.uCoeffs) {
            let centroidRaw : vec4<f32> = textureLoad(sogShCentroidsTex, vec2<i32>(u + kc, v), 0);
            var ch : f32 = centroidRaw.b;
            if (j == 0) { ch = centroidRaw.r; } else if (j == 1) { ch = centroidRaw.g; }
            var coeff : f32;
            if (uniforms.uVersion == 2) {
                let cidx : i32 = i32(ch * 255.0 + 0.5);
                coeff = textureLoad(sogCodebookTex, vec2<i32>(512 + cidx, 0), 0).r;
            } else {
                coeff = mix(uniforms.sogShnMin, uniforms.sogShnMax, ch);
            }
            byteVal = clamp(coeff * 127.5 + 127.5, 0.0, 255.0);
        }
        let bv : u32 = u32(byteVal + 0.5);
        let comp : i32 = b / 4;
        packed[comp] = packed[comp] | (bv << u32((b - comp * 4) * 8));
    }
    fragmentOutputs.fragData0 = vec4<u32>(packed[0], packed[1], packed[2], packed[3]);
}
`,Ae=`gsWorkBufferRelayout`,je=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform sampler2D uSrc3;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged):
//   uSrcBaseOffset — added to the map's (region-local) source index so pass 1 reads the correct GLOBAL atlas texel.
//   uDstBaseRow    — subtracted from the atlas destination row so pass 2's identity copy reads the region-local temp.
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[4];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
    glFragData[3] = texelFetch(uSrc3, s, 0);
}
`,Me=`gsWorkBufferShCopy`,Ne=`precision highp float;
precision highp int;
precision highp usampler2D;

uniform sampler2D uMapTex;
uniform usampler2D uSrcSh;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out uvec4 outSh;

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    outSh = texelFetch(uSrcSh, s, 0);
}
`,Pe=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
// Integer source sampled via textureLoad only — NO paired sampler (a sampler on a Uint texture fails WebGPU
// validation: "None of the supported sample types (Uint)"). Mirrors the draw shader's shTexture0 declaration.
var uSrcSh : texture_2d<u32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    // Wrap in an explicit vec4<u32> so the WGSL processor emits an integer fragData location (its detection keys
    // off a literal vec4<u32>/vec4u in the assignment; a bare textureLoad(...) would default to vec4<f32>).
    fragmentOutputs.fragData0 = vec4<u32>(textureLoad(uSrcSh, s, 0));
}
`,Fe=`gsWorkBufferRotCopy`,Ie=`precision highp float;
precision highp int;

uniform sampler2D uMapTex;
uniform sampler2D uSrc0;
uniform sampler2D uSrc1;
uniform sampler2D uSrc2;
uniform int uDstWidth;
uniform int uSrcWidth;
uniform int uUseMap;
uniform int uSrcBaseOffset;
uniform int uDstBaseRow;

layout(location = 0) out vec4 glFragData[3];

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    int srcIdx;
    if (uUseMap == 1) {
        float m = texelFetch(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uSrcBaseOffset + int(m + 0.5);
    } else {
        srcIdx = (p.y - uDstBaseRow) * uDstWidth + p.x;
    }
    ivec2 s = ivec2(srcIdx - (srcIdx / uSrcWidth) * uSrcWidth, srcIdx / uSrcWidth);
    glFragData[0] = texelFetch(uSrc0, s, 0);
    glFragData[1] = texelFetch(uSrc1, s, 0);
    glFragData[2] = texelFetch(uSrc2, s, 0);
}
`,Le=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
}
`,Re=`
var uMapTexSampler : sampler;
var uMapTex : texture_2d<f32>;
var uSrc0Sampler : sampler;
var uSrc0 : texture_2d<f32>;
var uSrc1Sampler : sampler;
var uSrc1 : texture_2d<f32>;
var uSrc2Sampler : sampler;
var uSrc2 : texture_2d<f32>;
var uSrc3Sampler : sampler;
var uSrc3 : texture_2d<f32>;

uniform uDstWidth : i32;
uniform uSrcWidth : i32;
uniform uUseMap : i32;
// Region-scoped relayout (hosted compound atlas), both default 0 (standalone square path unchanged).
uniform uSrcBaseOffset : i32;
uniform uDstBaseRow : i32;

@fragment
fn main(input : FragmentInputs) -> FragmentOutputs {
    let p : vec2<i32> = vec2<i32>(i32(fragmentInputs.position.x), i32(fragmentInputs.position.y));
    var srcIdx : i32;
    if (uniforms.uUseMap == 1) {
        let m : f32 = textureLoad(uMapTex, p, 0).r;
        if (m < 0.0) {
            discard;
        }
        srcIdx = uniforms.uSrcBaseOffset + i32(m + 0.5);
    } else {
        srcIdx = (p.y - uniforms.uDstBaseRow) * uniforms.uDstWidth + p.x;
    }
    let s : vec2<i32> = vec2<i32>(srcIdx - (srcIdx / uniforms.uSrcWidth) * uniforms.uSrcWidth, srcIdx / uniforms.uSrcWidth);
    fragmentOutputs.fragData0 = textureLoad(uSrc0, s, 0);
    fragmentOutputs.fragData1 = textureLoad(uSrc1, s, 0);
    fragmentOutputs.fragData2 = textureLoad(uSrc2, s, 0);
    fragmentOutputs.fragData3 = textureLoad(uSrc3, s, 0);
}
`;le(),k();var ze=class{get supportsAsyncCentersReadback(){let e=this._scene.getEngine();if(e.isWebGPU)return!0;let t=e;return!!t._gl&&typeof t._readPixelsAsync==`function`&&(t.webGLVersion??0)>=2}get textureSize(){return this._textureSize}get textures(){return this._mrt.textures}get shTextures(){return this._shMrts.map(e=>e.textures[0])}get rotationTextures(){return this._rotMrt?this._rotMrt.textures:[]}constructor(e,t,n,r,i){if(this._copyMaterial=null,this._relayoutMapData=null,this._relayoutMapTexture=null,this._backupMrt=null,this._disposed=!1,this._readFbo=null,this._shMrts=[],this._ownsShMrts=!1,this._shMaterial=null,this._shCopyMaterial=null,this._backupShMrts=null,this._rotMrt=null,this._ownsRotMrt=!1,this._rotMaterial=null,this._rotCopyMaterial=null,this._backupRotMrt=null,this._scene=e,this._shaderLanguage=+!!e.getEngine().isWebGPU,this._capacity=Math.max(1,t),n?(this._mrt=n.mrt,this._textureSize=n.width,this._baseOffset=n.baseOffset,this._ownsMrt=!1):(this._textureSize=Math.max(1,Math.ceil(Math.sqrt(Math.max(1,t)))),this._baseOffset=0,this._ownsMrt=!0,this._mrt=this._createMrt(`gsWorkBuffer`,!0)),r&&r.textureCount>0){if(r.externalMrts)this._shMrts=r.externalMrts.slice(0,r.textureCount),this._ownsShMrts=!1;else{for(let e=0;e<r.textureCount;e++)this._shMrts.push(this._createShMrt(`gsWorkBufferSh${e}`,!0));this._ownsShMrts=!0}this._shMaterial=this._createShMaterial()}i&&(i.externalMrt?(this._rotMrt=i.externalMrt,this._ownsRotMrt=!1):(this._rotMrt=this._createRotMrt(`gsWorkBufferRot`,!0),this._ownsRotMrt=!0),this._rotMaterial=this._createRotMaterial()),this._material=this._createMaterial(),this._quad=this._createQuad(),this._quad.material=this._material,this._ownsMrt||this.isRelayoutReady()}rebindAtlas(e){this._ownsMrt||(this._mrt=e)}rebindShAtlas(e){!this._ownsShMrts&&e&&this._shMrts.length&&(this._shMrts=e.slice(0,this._shMrts.length))}rebindRotAtlas(e){!this._ownsRotMrt&&e&&this._rotMrt&&(this._rotMrt=e)}setBaseOffset(e){this._ownsMrt||(this._baseOffset=e)}get canBackup(){return this._disposed||this._ownsMrt?!1:this.isRelayoutReady()}backupRegion(){if(this._disposed||this._ownsMrt)return;if(!this.isRelayoutReady()){u.Warn(`GaussianSplattingWorkBuffer: backup skipped because the copy shaders are not ready; streamed region data may be lost on the atlas rebuild.`);return}let e=this._textureSize,t=Math.max(1,Math.floor(this._capacity/e)),n=Math.floor(this._baseOffset/e);if(this._backupMrt||=this._createMrt(`gsAtlasBackup`,!1,e,t),this._renderRelayoutPass(this._backupMrt,this._mrt.textures,this._mrt.textures[0],0,e,e,0,-n),this._shMrts.length&&this._shCopyMaterial){this._backupShMrts||=this._shMrts.map((n,r)=>this._createShMrt(`gsShAtlasBackup${r}`,!1,e,t));for(let t=0;t<this._shMrts.length;t++)this._renderShCopyPass(this._backupShMrts[t],this._shMrts[t].textures[0],this._mrt.textures[0],0,e,e,0,-n)}this._rotMrt&&this._rotCopyMaterial&&(this._backupRotMrt||=this._createRotMrt(`gsRotAtlasBackup`,!1,e,t),this._renderRotCopyPass(this._backupRotMrt,this._rotMrt.textures,this._mrt.textures[0],0,e,e,0,-n)),this._quad.material=this._material}restoreRegion(){if(this._disposed||this._ownsMrt||!this._backupMrt||!this._copyMaterial)return;let e=this._textureSize,t=Math.max(1,Math.floor(this._capacity/e)),n=Math.floor(this._baseOffset/e),r=this._scene.getEngine();r.enableScissor(0,n,e,t);try{if(this._renderRelayoutPass(this._mrt,this._backupMrt.textures,this._backupMrt.textures[0],0,e,e,0,n),this._backupShMrts&&this._shMrts.length&&this._shCopyMaterial)for(let t=0;t<this._shMrts.length&&t<this._backupShMrts.length;t++)this._renderShCopyPass(this._shMrts[t],this._backupShMrts[t].textures[0],this._mrt.textures[0],0,e,e,0,n);this._backupRotMrt&&this._rotMrt&&this._rotCopyMaterial&&this._renderRotCopyPass(this._rotMrt,this._backupRotMrt.textures,this._mrt.textures[0],0,e,e,0,n)}finally{r.disableScissor(),this._quad.material=this._material}if(this._backupMrt.dispose(),this._backupMrt=null,this._backupShMrts){for(let e of this._backupShMrts)e.dispose();this._backupShMrts=null}this._backupRotMrt?.dispose(),this._backupRotMrt=null}_createMrt(e,t,n=this._textureSize,r=this._textureSize){let i=this._scene.getEngine()._caps.textureHalfFloatRender?I.TEXTURETYPE_HALF_FLOAT:I.TEXTURETYPE_FLOAT,a=new F(e,{width:n,height:r},4,this._scene,{types:[I.TEXTURETYPE_FLOAT,i,i,I.TEXTURETYPE_UNSIGNED_BYTE],samplingModes:[I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURE_NEAREST_SAMPLINGMODE],formats:[I.TEXTUREFORMAT_RGBA,I.TEXTUREFORMAT_RGBA,I.TEXTUREFORMAT_RGBA,I.TEXTUREFORMAT_RGBA],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${e}Centers`,`${e}CovA`,`${e}CovB`,`${e}Colors`]);return a.clearColor=new c(0,0,0,0),a.renderList=[],t&&a.onClearObservable.add(()=>{}),a}_createShMrt(e,t,n=this._textureSize,r=this._textureSize){let i=new F(e,{width:n,height:r},1,this._scene,{types:[I.TEXTURETYPE_UNSIGNED_INTEGER],formats:[I.TEXTUREFORMAT_RGBA_INTEGER],samplingModes:[I.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[e]);return i.clearColor=new c(0,0,0,0),i.renderList=[],t&&i.onClearObservable.add(()=>{}),i}_createRotMrt(e,t,n=this._textureSize,r=this._textureSize){let i=this._scene.getEngine()._caps.textureHalfFloatRender?I.TEXTURETYPE_HALF_FLOAT:I.TEXTURETYPE_FLOAT,a=new F(e,{width:n,height:r},3,this._scene,{types:[i,i,i],formats:[I.TEXTUREFORMAT_RGBA,I.TEXTUREFORMAT_RGBA,I.TEXTUREFORMAT_RGBA],samplingModes:[I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURE_NEAREST_SAMPLINGMODE],generateDepthBuffer:!1,generateDepthTexture:!1,generateMipMaps:!1},[`${e}A`,`${e}B`,`${e}Scale`]);return a.clearColor=new c(0,0,0,0),a.renderList=[],t&&a.onClearObservable.add(()=>{}),a}async decodeAsync(e,t){if(this._disposed)return;this._applyPack(e);let n=this._shMaterial!==null&&this._shMrts.length>0;n&&this._applyShPack(e);let r=this._rotMaterial!==null&&this._rotMrt!==null;r&&this._applyRotPack(e),await new Promise(i=>{let a=()=>{if(this._disposed){i();return}if(!this._material.isReady(this._quad)||n&&!this._shMaterial.isReady(this._quad)||r&&!this._rotMaterial.isReady(this._quad)){this._scene.onBeforeRenderObservable.addOnce(a);return}let o=this._textureSize,s=this._baseOffset+t;this._material.setInt(`uOffset`,s),n&&this._shMaterial.setInt(`uOffset`,s),r&&this._rotMaterial.setInt(`uOffset`,s);let c=Math.floor(s/o),l=Math.max(1,Math.ceil((s+e.splatCount)/o)-c),u=this._scene.getEngine();u.enableScissor(0,c,o,l);try{if(this._quad.material=this._material,this._mrt.renderList=[this._quad],this._mrt.render(),n){for(let e=0;e<this._shMrts.length;e++)this._shMaterial.setInt(`uShTextureIndex`,e),this._quad.material=this._shMaterial,this._shMrts[e].renderList=[this._quad],this._shMrts[e].render();this._quad.material=this._material}r&&(this._quad.material=this._rotMaterial,this._rotMrt.renderList=[this._quad],this._rotMrt.render(),this._quad.material=this._material)}finally{u.disableScissor()}i()};this._scene.onBeforeRenderObservable.addOnce(a)})}isRelayoutReady(){if(this._disposed)return!1;this._copyMaterial||=this._createCopyMaterial(),this._shMrts.length&&!this._shCopyMaterial&&(this._shCopyMaterial=this._createShCopyMaterial()),this._rotMrt&&!this._rotCopyMaterial&&(this._rotCopyMaterial=this._createRotCopyMaterial()),this._bindCopyMaterialsToAtlas();let e=this._shMrts.length===0||this._shCopyMaterial!==null&&this._shCopyMaterial.isReady(this._quad),t=!this._rotMrt||this._rotCopyMaterial!==null&&this._rotCopyMaterial.isReady(this._quad);return this._copyMaterial.isReady(this._quad)&&e&&t}_bindCopyMaterialsToAtlas(){let e=this._mrt.textures;if(this._copyMaterial&&(this._copyMaterial.setTexture(`uMapTex`,e[0]),this._copyMaterial.setTexture(`uSrc0`,e[0]),this._copyMaterial.setTexture(`uSrc1`,e[1]),this._copyMaterial.setTexture(`uSrc2`,e[2]),this._copyMaterial.setTexture(`uSrc3`,e[3])),this._shCopyMaterial&&this._shMrts.length&&(this._shCopyMaterial.setTexture(`uMapTex`,e[0]),this._shCopyMaterial.setTexture(`uSrcSh`,this._shMrts[0].textures[0])),this._rotCopyMaterial&&this._rotMrt){let t=this._rotMrt.textures;this._rotCopyMaterial.setTexture(`uMapTex`,e[0]),this._rotCopyMaterial.setTexture(`uSrc0`,t[0]),this._rotCopyMaterial.setTexture(`uSrc1`,t[1]),this._rotCopyMaterial.setTexture(`uSrc2`,t[2])}}relayoutSync(e){if(this._disposed||!this._copyMaterial)return;let t=this._textureSize,n=t,r=this._ownsMrt?t:Math.max(1,Math.floor(this._capacity/t));this._relayoutMapData||=new Float32Array(n*r);let i=this._relayoutMapData;i.fill(-1),i.set(e.subarray(0,Math.min(e.length,i.length))),this._relayoutMapTexture?this._relayoutMapTexture.update(i):this._relayoutMapTexture=new A(i,n,r,I.TEXTUREFORMAT_R,this._scene,!1,!1,I.TEXTURE_NEAREST_SAMPLINGMODE,I.TEXTURETYPE_FLOAT);let a=this._relayoutMapTexture;if(this._ownsMrt){let e=this._createMrt(`gsRelayoutTemp`,!1);try{this._renderRelayoutPass(e,this._mrt.textures,a,1),this._renderRelayoutPass(this._mrt,e.textures,a,0)}finally{e.dispose()}if(this._shMrts.length&&this._shCopyMaterial)for(let e=0;e<this._shMrts.length;e++){let t=this._createShMrt(`gsShRelayoutTemp`,!1);try{this._renderShCopyPass(t,this._shMrts[e].textures[0],a,1),this._renderShCopyPass(this._shMrts[e],t.textures[0],a,0)}finally{t.dispose()}}if(this._rotMrt&&this._rotCopyMaterial){let e=this._createRotMrt(`gsRotRelayoutTemp`,!1);try{this._renderRotCopyPass(e,this._rotMrt.textures,a,1),this._renderRotCopyPass(this._rotMrt,e.textures,a,0)}finally{e.dispose()}}this._quad.material=this._material;return}let o=Math.floor(this._baseOffset/t),s=r,c=this._scene.getEngine(),l=this._createMrt(`gsRelayoutTemp`,!1,t,s),u=this._shMrts.length&&this._shCopyMaterial?this._shMrts.map((e,n)=>this._createShMrt(`gsShRelayoutTemp${n}`,!1,t,s)):[],d=this._rotMrt&&this._rotCopyMaterial?this._createRotMrt(`gsRotRelayoutTemp`,!1,t,s):null;try{this._renderRelayoutPass(l,this._mrt.textures,a,1,t,t,this._baseOffset,0);for(let e=0;e<u.length;e++)this._renderShCopyPass(u[e],this._shMrts[e].textures[0],a,1,t,t,this._baseOffset,0);d&&this._renderRotCopyPass(d,this._rotMrt.textures,a,1,t,t,this._baseOffset,0),c.enableScissor(0,o,t,s);try{this._renderRelayoutPass(this._mrt,l.textures,a,0,t,t,0,o);for(let e=0;e<u.length;e++)this._renderShCopyPass(this._shMrts[e],u[e].textures[0],a,0,t,t,0,o);d&&this._renderRotCopyPass(this._rotMrt,d.textures,a,0,t,t,0,o)}finally{c.disableScissor()}}finally{l.dispose();for(let e of u)e.dispose();d?.dispose(),this._quad.material=this._material}}_renderRelayoutPass(e,t,n,r,i=this._textureSize,a=this._textureSize,o=0,s=0){let c=this._copyMaterial;c.setTexture(`uMapTex`,n),c.setTexture(`uSrc0`,t[0]),c.setTexture(`uSrc1`,t[1]),c.setTexture(`uSrc2`,t[2]),c.setTexture(`uSrc3`,t[3]),c.setInt(`uDstWidth`,i),c.setInt(`uSrcWidth`,a),c.setInt(`uUseMap`,r),c.setInt(`uSrcBaseOffset`,o),c.setInt(`uDstBaseRow`,s),this._quad.material=c,e.renderList=[this._quad],e.render()}_createCopyMaterial(){let e=this._shaderLanguage===1,n=new t(Ae,this._scene,{vertexSource:e?q:K,fragmentSource:e?Re:je},{attributes:[`position`],uniforms:[`uDstWidth`,`uSrcWidth`,`uUseMap`,`uSrcBaseOffset`,`uDstBaseRow`],samplers:[`uMapTex`,`uSrc0`,`uSrc1`,`uSrc2`,`uSrc3`],shaderLanguage:this._shaderLanguage});return n.backFaceCulling=!1,n.disableDepthWrite=!0,n}_renderShCopyPass(e,t,n,r,i=this._textureSize,a=this._textureSize,o=0,s=0){let c=this._shCopyMaterial;c.setTexture(`uMapTex`,n),c.setTexture(`uSrcSh`,t),c.setInt(`uDstWidth`,i),c.setInt(`uSrcWidth`,a),c.setInt(`uUseMap`,r),c.setInt(`uSrcBaseOffset`,o),c.setInt(`uDstBaseRow`,s),this._quad.material=c,e.renderList=[this._quad],e.render()}_createShCopyMaterial(){let e=this._shaderLanguage===1,n=new t(Me,this._scene,{vertexSource:e?q:K,fragmentSource:e?Pe:Ne},{attributes:[`position`],uniforms:[`uDstWidth`,`uSrcWidth`,`uUseMap`,`uSrcBaseOffset`,`uDstBaseRow`],samplers:[`uMapTex`,`uSrcSh`],shaderLanguage:this._shaderLanguage});return n.backFaceCulling=!1,n.disableDepthWrite=!0,n}_renderRotCopyPass(e,t,n,r,i=this._textureSize,a=this._textureSize,o=0,s=0){let c=this._rotCopyMaterial;c.setTexture(`uMapTex`,n),c.setTexture(`uSrc0`,t[0]),c.setTexture(`uSrc1`,t[1]),c.setTexture(`uSrc2`,t[2]),c.setInt(`uDstWidth`,i),c.setInt(`uSrcWidth`,a),c.setInt(`uUseMap`,r),c.setInt(`uSrcBaseOffset`,o),c.setInt(`uDstBaseRow`,s),this._quad.material=c,e.renderList=[this._quad],e.render()}_createRotCopyMaterial(){let e=this._shaderLanguage===1,n=new t(Fe,this._scene,{vertexSource:e?q:K,fragmentSource:e?Le:Ie},{attributes:[`position`],uniforms:[`uDstWidth`,`uSrcWidth`,`uUseMap`,`uSrcBaseOffset`,`uDstBaseRow`],samplers:[`uMapTex`,`uSrc0`,`uSrc1`,`uSrc2`],shaderLanguage:this._shaderLanguage});return n.backFaceCulling=!1,n.disableDepthWrite=!0,n}async readCentersRangeAsync(e,t){if(this._disposed||t<=0||!this.supportsAsyncCentersReadback)return null;let n=this._textureSize,r=this._baseOffset+e,i=Math.floor(r/n),a=Math.ceil((r+t)/n)-i,o=(r-i*n)*4,s=o+t*4,c=this._mrt.textures[0],l=this._scene.getEngine();if(l.isWebGPU){let e=await c.readPixels(0,0,null,!0,!0,0,i,n,a);if(this._disposed||!e)return null;let t=e instanceof Float32Array?e:new Float32Array(e.buffer,e.byteOffset,e.byteLength/4);return t.length>=s?t.subarray(o,s):null}let u=l,d=u._gl,f=c.getInternalTexture()?._hardwareTexture?.underlyingResource;if(!f)return null;let p=new Float32Array(n*a*4);this._readFbo||=d.createFramebuffer();let m=u._currentFramebuffer;d.bindFramebuffer(d.FRAMEBUFFER,this._readFbo),d.framebufferTexture2D(d.FRAMEBUFFER,d.COLOR_ATTACHMENT0,d.TEXTURE_2D,f,0),d.readBuffer(d.COLOR_ATTACHMENT0);let h=u._readPixelsAsync(0,i,n,a,d.RGBA,d.FLOAT,p);return d.bindFramebuffer(d.FRAMEBUFFER,m),m||d.readBuffer(d.BACK),!h||(await h,this._disposed||p.length<s)?null:p.subarray(o,s)}dispose(){if(this._disposed=!0,this._readFbo&&=(this._scene.getEngine()._gl?.deleteFramebuffer(this._readFbo),null),this._quad.dispose(),this._material.dispose(!0,!1),this._shMaterial?.dispose(!0,!1),this._rotMaterial?.dispose(!0,!1),this._copyMaterial?.dispose(!0,!1),this._shCopyMaterial?.dispose(!0,!1),this._rotCopyMaterial?.dispose(!0,!1),this._relayoutMapTexture?.dispose(),this._backupMrt?.dispose(),this._backupMrt=null,this._backupShMrts){for(let e of this._backupShMrts)e.dispose();this._backupShMrts=null}if(this._backupRotMrt?.dispose(),this._backupRotMrt=null,this._ownsMrt&&this._mrt.dispose(),this._ownsShMrts)for(let e of this._shMrts)e.dispose();this._shMrts=[],this._ownsRotMrt&&this._rotMrt?.dispose(),this._rotMrt=null}_createQuad(){let e=new T(`gsWorkBufferQuad`,this._scene),t=new x;return t.positions=[-1,-1,0,3,-1,0,-1,3,0],t.indices=[0,1,2],t.applyToMesh(e),this._scene.removeMesh(e),e}_createMaterial(){let e=this._shaderLanguage===1,n=new t(`gsSogDecode`,this._scene,{vertexSource:e?q:K,fragmentSource:e?Ce:Se},{attributes:[`position`],uniforms:[`sogMeansMin`,`sogMeansMax`,`sogScalesMin`,`sogScalesMax`,`sogSh0Min`,`sogSh0Max`,`uVersion`,`uOffset`,`uCount`,`uDestWidth`,`uSrcWidth`],samplers:[`sogMeansLTex`,`sogMeansUTex`,`sogScalesTex`,`sogQuatsTex`,`sogSh0Tex`,`sogCodebookTex`],shaderLanguage:this._shaderLanguage});return n.backFaceCulling=!1,n.disableDepthWrite=!0,n}_applyPack(e){let t=this._material,n=e.meansTextureL.getSize().width;t.setTexture(`sogMeansLTex`,e.meansTextureL),t.setTexture(`sogMeansUTex`,e.meansTextureU),t.setTexture(`sogScalesTex`,e.scalesTexture),t.setTexture(`sogQuatsTex`,e.quatsTexture),t.setTexture(`sogSh0Tex`,e.sh0Texture),t.setTexture(`sogCodebookTex`,e.codebookTexture??e.sh0Texture),t.setVector3(`sogMeansMin`,new i(e.meansMin[0],e.meansMin[1],e.meansMin[2])),t.setVector3(`sogMeansMax`,new i(e.meansMax[0],e.meansMax[1],e.meansMax[2]));let r=e.scalesMin??[0,0,0],o=e.scalesMax??[0,0,0];t.setVector3(`sogScalesMin`,new i(r[0],r[1],r[2])),t.setVector3(`sogScalesMax`,new i(o[0],o[1],o[2]));let s=e.sh0Min??[0,0,0,0],c=e.sh0Max??[0,0,0,0];t.setVector4(`sogSh0Min`,new a(s[0],s[1],s[2],s[3])),t.setVector4(`sogSh0Max`,new a(c[0],c[1],c[2],c[3])),t.setInt(`uVersion`,e.version),t.setInt(`uCount`,e.splatCount),t.setInt(`uDestWidth`,this._textureSize),t.setInt(`uSrcWidth`,n)}_createShMaterial(){let e=this._shaderLanguage===1,n=new t(De,this._scene,{vertexSource:e?q:K,fragmentSource:e?ke:Oe},{attributes:[`position`],uniforms:[`sogShnMin`,`sogShnMax`,`uVersion`,`uOffset`,`uCount`,`uDestWidth`,`uSrcWidth`,`uCoeffs`,`uShTextureIndex`],samplers:[`sogShLabelsTex`,`sogShCentroidsTex`,`sogCodebookTex`],shaderLanguage:this._shaderLanguage});return n.backFaceCulling=!1,n.disableDepthWrite=!0,n}_applyShPack(e){let t=this._shMaterial,n=!!e.shLabelsTexture&&!!e.shCentroidsTexture,r=e.shLabelsTexture??e.sh0Texture,i=e.shCentroidsTexture??e.sh0Texture;t.setTexture(`sogShLabelsTex`,r),t.setTexture(`sogShCentroidsTex`,i),t.setTexture(`sogCodebookTex`,e.codebookTexture??r),t.setFloat(`sogShnMin`,e.shnMin??0),t.setFloat(`sogShnMax`,e.shnMax??0),t.setInt(`uVersion`,e.version),t.setInt(`uCount`,e.splatCount),t.setInt(`uDestWidth`,this._textureSize),t.setInt(`uSrcWidth`,r.getSize().width),t.setInt(`uCoeffs`,n?e.shCoeffCount:0)}_createRotMaterial(){let e=this._shaderLanguage===1,n=new t(we,this._scene,{vertexSource:e?q:K,fragmentSource:e?Ee:Te},{attributes:[`position`],uniforms:[`sogScalesMin`,`sogScalesMax`,`uVersion`,`uOffset`,`uCount`,`uDestWidth`,`uSrcWidth`],samplers:[`sogScalesTex`,`sogQuatsTex`,`sogCodebookTex`],shaderLanguage:this._shaderLanguage});return n.backFaceCulling=!1,n.disableDepthWrite=!0,n}_applyRotPack(e){let t=this._rotMaterial,n=e.scalesTexture.getSize().width;t.setTexture(`sogScalesTex`,e.scalesTexture),t.setTexture(`sogQuatsTex`,e.quatsTexture),t.setTexture(`sogCodebookTex`,e.codebookTexture??e.scalesTexture);let r=e.scalesMin??[0,0,0],a=e.scalesMax??[0,0,0];t.setVector3(`sogScalesMin`,new i(r[0],r[1],r[2])),t.setVector3(`sogScalesMax`,new i(a[0],a[1],a[2])),t.setInt(`uVersion`,e.version),t.setInt(`uCount`,e.splatCount),t.setInt(`uDestWidth`,this._textureSize),t.setInt(`uSrcWidth`,n)}},Be=class{constructor(e){this._activeCount=0,this._queue=[],this._pending=new Map,this._groups=new Map,this._disposed=!1,this.maxConcurrent=Math.max(1,e?.maxConcurrent??2),this.maxRetries=Math.max(0,e?.maxRetries??2)}get isIdle(){return this._pending.size===0}async loadFileAsync(e,t){if(this._disposed)throw Error(`GaussianSplattingDownloadManager has been disposed.`);let n=this._pending.get(e);if(n)return await n.promise;let r={url:e,groupId:t,settled:!1,cancelled:!1,started:!1,slotReleased:!1};if(r.promise=new Promise((e,t)=>{r.resolve=e,r.reject=t}),this._pending.set(e,r),t!==void 0){let n=this._groups.get(t);n||(n=new Set,this._groups.set(t,n)),n.add(e)}return this._queue.push(r),this._pump(),await r.promise}cancel(e){let t=this._pending.get(e);t&&this._abort(t,Error(`GaussianSplattingDownloadManager: download cancelled (${e}).`))}cancelGroup(e){let t=this._groups.get(e);if(t){for(let e of Array.from(t))this.cancel(e);this._groups.delete(e)}}dispose(){if(!this._disposed){this._disposed=!0,this._queue.length=0;for(let e of Array.from(this._pending.values()))this._abort(e,Error(`GaussianSplattingDownloadManager has been disposed.`))}}_abort(e,t){if(e.settled)return;e.cancelled=!0;let n=this._queue.indexOf(e);n!==-1&&this._queue.splice(n,1),e.request?.abort(),e.cancelAttempt?.(t),this._settle(e,()=>e.reject(t)),e.started&&this._releaseSlot(e)}_settle(e,t){if(!e.settled){if(e.settled=!0,this._pending.delete(e.url),e.groupId!==void 0){let t=this._groups.get(e.groupId);t&&(t.delete(e.url),t.size===0&&this._groups.delete(e.groupId))}t()}}_releaseSlot(e){e.slotReleased||(e.slotReleased=!0,this._activeCount--,this._pump())}_pump(){for(;!this._disposed&&this._activeCount<this.maxConcurrent&&this._queue.length>0;){let e=this._queue.shift();e.settled||(e.started=!0,this._activeCount++,this._runTaskAsync(e).finally(()=>{this._releaseSlot(e)}))}}async _runTaskAsync(e){let t;for(let n=0;n<=this.maxRetries;n++){if(this._disposed||e.cancelled)return;try{let t=await this._downloadAttemptAsync(e);this._settle(e,()=>e.resolve(t));return}catch(n){if(e.cancelAttempt=void 0,this._disposed||e.cancelled)return;t=n}}this._settle(e,()=>e.reject(t))}async _downloadAttemptAsync(e){return await new Promise((t,n)=>{e.cancelAttempt=n,e.request=f.LoadFile(e.url,e=>t(e),void 0,void 0,!0,(t,r)=>n(r instanceof Error?r:Error(`GaussianSplattingDownloadManager: failed to load ${e.url}.`)))})}},Ve=class{constructor(){this._offset=0,this._size=0,this._free=!0,this._prev=null,this._next=null,this._prevFree=null,this._nextFree=null,this._bucket=-1}get offset(){return this._offset}get size(){return this._size}},He=class{constructor(e=0,t=1.1){if(this._headAll=null,this._tailAll=null,this._freeBucketHeads=[],this._pool=[],this._capacity=0,this._usedSize=0,this._freeSize=0,this._freeRegionCount=0,this._growMultiplier=t,e>0){this._capacity=e,this._freeSize=e;let t=this._obtain(0,e,!0);this._headAll=t,this._tailAll=t,this._addToBucket(t)}}get capacity(){return this._capacity}get usedSize(){return this._usedSize}get freeSize(){return this._freeSize}get fragmentation(){return this._freeSize>0?1-1/this._freeRegionCount:0}allocate(e){if(e<=0)return null;let t=this._findFreeBlock(e);if(!t)return null;if(this._usedSize+=e,this._freeSize-=e,t._size===e)return t._free=!1,this._removeFromBucket(t),t;let n=this._obtain(t._offset,e,!1);return t._offset+=e,t._size-=e,this._rebucket(t),this._insertAfterInMainList(n,t._prev),n}free(e){if(!e||e._free)return;e._free=!0,this._usedSize-=e._size,this._freeSize+=e._size;let t=e._prev,n=e._next,r=t&&t._free,i=n&&n._free;r&&i?(t._size+=e._size+n._size,this._removeFromMainList(e),this._removeFromMainList(n),this._removeFromBucket(n),this._release(e),this._release(n),this._rebucket(t)):r?(t._size+=e._size,this._removeFromMainList(e),this._release(e),this._rebucket(t)):i?(e._size+=n._size,this._removeFromMainList(n),this._removeFromBucket(n),this._release(n),this._addToBucket(e)):this._addToBucket(e)}grow(e){if(e<=this._capacity)return;let t=e-this._capacity;if(this._capacity=e,this._freeSize+=t,this._tailAll&&this._tailAll._free)this._tailAll._size+=t,this._rebucket(this._tailAll);else{let e=this._obtain(this._capacity-t,t,!0);this._insertAfterInMainList(e,this._tailAll),this._addToBucket(e)}}defrag(e=0,t=new Set){return t.clear(),this._freeRegionCount===0||(e===0?this._defragFull(t):this._defragIncremental(e,t)),t}updateAllocation(e,t){for(let t=0;t<e.length;t++)this.free(e[t]);for(let e=0;e<t.length;e++){let n=t[e],r=this.allocate(n);if(r)t[e]=r;else{let r=n;for(let n=e+1;n<t.length;n++)r+=t[n];let i=this._usedSize+r,a=Math.ceil(i*this._growMultiplier);a>this._capacity&&this.grow(a),this.defrag(0);for(let n=e;n<t.length;n++)t[n]=this.allocate(t[n]);return!0}}return!1}_bucketFor(e){return 31-Math.clz32(e)}_addToBucket(e){let t=this._bucketFor(e._size);for(e._bucket=t;t>=this._freeBucketHeads.length;)this._freeBucketHeads.push(null);e._prevFree=null,e._nextFree=this._freeBucketHeads[t],this._freeBucketHeads[t]&&(this._freeBucketHeads[t]._prevFree=e),this._freeBucketHeads[t]=e,this._freeRegionCount++}_removeFromBucket(e){let t=e._bucket;e._prevFree?e._prevFree._nextFree=e._nextFree:this._freeBucketHeads[t]=e._nextFree,e._nextFree&&(e._nextFree._prevFree=e._prevFree),e._prevFree=null,e._nextFree=null,e._bucket=-1,this._freeRegionCount--}_rebucket(e){this._bucketFor(e._size)!==e._bucket&&(this._removeFromBucket(e),this._addToBucket(e))}_obtain(e,t,n){let r=this._pool.length>0?this._pool.pop():new Ve;return r._offset=e,r._size=t,r._free=n,r._prev=null,r._next=null,r._prevFree=null,r._nextFree=null,r._bucket=-1,r}_release(e){e._prev=null,e._next=null,e._prevFree=null,e._nextFree=null,e._bucket=-1,this._pool.push(e)}_insertAfterInMainList(e,t){t===null?(e._prev=null,e._next=this._headAll,this._headAll&&(this._headAll._prev=e),this._headAll=e,this._tailAll||=e):(e._prev=t,e._next=t._next,t._next&&(t._next._prev=e),t._next=e,this._tailAll===t&&(this._tailAll=e))}_removeFromMainList(e){e._prev?e._prev._next=e._next:this._headAll=e._next,e._next?e._next._prev=e._prev:this._tailAll=e._prev,e._prev=null,e._next=null}_findFreeBlock(e){let t=this._bucketFor(e),n=this._freeBucketHeads.length;if(t<n){let n=null,r=this._freeBucketHeads[t];for(;r&&!(r._size>=e&&(!n||r._size<n._size)&&(n=r,r._size===e));)r=r._nextFree;if(n)return n}for(let e=t+1;e<n;e++)if(this._freeBucketHeads[e])return this._freeBucketHeads[e];return null}_defragFull(e){for(let e=0;e<this._freeBucketHeads.length;e++){let t=this._freeBucketHeads[e];for(;t;){let e=t._nextFree;this._removeFromMainList(t),t._prevFree=null,t._nextFree=null,t._bucket=-1,this._pool.push(t),t=e}this._freeBucketHeads[e]=null}this._freeRegionCount=0;let t=0,n=this._headAll;for(;n;)n._offset!==t&&(n._offset=t,e.add(n)),t+=n._size,n=n._next;let r=this._capacity-t;if(r>0){let e=this._obtain(t,r,!0);this._insertAfterInMainList(e,this._tailAll),this._addToBucket(e)}}_defragIncremental(e,t){let n=Math.ceil(e/2),r=e-n;for(let e=0;e<n;e++){let e=this._tailAll;for(;e&&e._free;)e=e._prev;if(!e)break;let n=this._findFreeBlock(e._size);if(!n||n._offset>=e._offset)break;this._moveBlock(e,n),t.add(e)}let i=this._headAll;for(let e=0;e<r&&i;){let n=i._next;if(i._free&&n&&!n._free){let r=n,a=i;r._offset=a._offset,a._offset=r._offset+r._size;let o=a._prev,s=r._next;if(r._prev=o,r._next=a,a._prev=r,a._next=s,o?o._next=r:this._headAll=r,s?s._prev=a:this._tailAll=a,a._next&&a._next._free){let e=a._next;a._size+=e._size,this._removeFromMainList(e),this._removeFromBucket(e),this._release(e),this._rebucket(a)}t.add(r),e++,i=a._next}else i=n}}_moveBlock(e,t){let n=e._size,r=t._offset,i=e._prev;this._removeFromMainList(e);let a=this._obtain(e._offset,n,!0);if(this._insertAfterInMainList(a,i),this._addToBucket(a),a._next&&a._next._free){let e=a._next;a._size+=e._size,this._removeFromMainList(e),this._removeFromBucket(e),this._release(e),this._rebucket(a)}if(a._prev&&a._prev._free){let e=a._prev;e._size+=a._size,this._removeFromMainList(a),this._removeFromBucket(a),this._release(a),this._rebucket(e)}if(e._offset=r,t._size===n){let n=t._prev;this._removeFromMainList(t),this._removeFromBucket(t),this._release(t),this._insertAfterInMainList(e,n)}else t._offset+=n,t._size-=n,this._rebucket(t),this._insertAfterInMainList(e,t._prev)}},Ue=class{constructor(e,t,n){this._blocks=new Map,this._cooldown=new Map,this._pinned=new Set,this._allocator=new He(e),this._cooldownFrames=Math.max(0,t),this._onEvict=n}get capacity(){return this._allocator.capacity}get residentCount(){return this._blocks.size}get freeSize(){return this._allocator.freeSize}has(e){return this._blocks.has(e)}offset(e){return this._blocks.get(e)?.offset}allocate(e,t){let n=this._blocks.get(e);if(n)return n.offset;let r=this._allocator.allocate(t);return!r&&(this._evictAllCooled(),r=this._allocator.allocate(t),!r)?null:(this._blocks.set(e,r),r.offset)}pin(e,t){let n=this.allocate(e,t);return n!==null&&this._pinned.add(e),n}free(e){if(this._pinned.has(e))return;let t=this._blocks.get(e);t&&(this._allocator.free(t),this._blocks.delete(e),this._cooldown.delete(e))}compact(){let e=new Map;for(let[t,n]of Array.from(this._blocks))e.set(t,n.offset);this._allocator.defrag(0);let t=[];for(let[n,r]of Array.from(this._blocks)){let i=e.get(n);i!==r.offset&&t.push({file:n,oldOffset:i,newOffset:r.offset,count:r.size})}return t}getResidentBlocks(){let e=[];for(let[t,n]of Array.from(this._blocks))e.push({file:t,offset:n.offset,count:n.size});return e}scheduleEviction(e){!this._pinned.has(e)&&this._blocks.has(e)&&this._cooldown.set(e,this._cooldownFrames)}cancelEviction(e){this._cooldown.delete(e)}tick(){if(this._cooldown.size===0)return[];let e=[];for(let[t,n]of Array.from(this._cooldown))n<=1?e.push(t):this._cooldown.set(t,n-1);for(let t of e)this._evict(t);return e}dispose(){this._blocks.clear(),this._cooldown.clear(),this._pinned.clear()}_evictAllCooled(){let e=Array.from(this._cooldown.keys());for(let t of e)this._evict(t)}_evict(e){let t=this._blocks.get(e);t&&(this._allocator.free(t),this._blocks.delete(e)),this._cooldown.delete(e),this._onEvict(e)}};l(),L(),z(),R();var We=Math.tan(22.5*Math.PI/180),Ge=-2,Ke=-1,qe=84,J=new o,Je=new i,Ye=new i,Xe=new i,Ze=new i(0,0,1),Qe=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],$e=Qe.length*2,Y=[new c(1,.2,.2,1),new c(1,.6,.1,1),new c(1,1,.2,1),new c(.3,1,.3,1),new c(.2,1,1,1),new c(.4,.5,1,1),new c(.9,.4,1,1),new c(1,1,1,1)],et=class t extends N{static IsLODMetadata(e){if(typeof e!=`object`||!e)return!1;let t=e;return typeof t.lodLevels==`number`&&Array.isArray(t.filenames)&&typeof t.tree==`object`&&t.tree!==null}constructor(e,t,n,r,a={}){super(e,null,r,!1),this._leafNodes=[],this._lodBaseDistance=5,this._lodMultiplier=3,this._lodBehindPenalty=1,this._lodRangeMin=0,this._maxDecodesPerFrame=1,this._lodCooldownFrames=10,this._lodUpdateInterval=4,this._lodUpdateDistance=.5,this._maxDetailLod=0,this._lodPixelThreshold=1,this._hostBudgetAllocation=null,this._frustumCulling=!0,this._frustumPlanes=[new h(0,0,0,0),new h(0,0,0,0),new h(0,0,0,0),new h(0,0,0,0),new h(0,0,0,0),new h(0,0,0,0)],this._cullViewProj=new o,this._frustumScratch=[],this._workBuffer=null,this._streamShDegree=0,this._shTextureCount=0,this._needsRotationScale=!1,this._useGpuPositionReadback=!1,this._readbackCandidate=!1,this._readbackProbed=!1,this._residency=null,this._fileCounts=new Map,this._fileMeta=new Map,this._decodedFiles=new Set,this._loadingFiles=new Set,this._decodeQueue=[],this._fileRefs=new Map,this._cancelledDecodes=new Set,this._evictionEnabled=!1,this._residentBudget=0,this._maxResidentSplats=0,this._memoryBudgetMb=0,this._evictionCooldownFrames=100,this._decodeGate=Promise.resolve(),this._relayoutOldOffsets=new Map,this._relayoutSrcIndex=null,this._environmentRange=null,this._environmentFiles=null,this._lodObserver=null,this._baseLayerReady=!1,this._framesSinceLodUpdate=0,this._lastLodCamPositions=[],this._lastLodSignature=``,this._forceLodUpdate=!1,this._boundsMin=new i(Number.MAX_VALUE,Number.MAX_VALUE,Number.MAX_VALUE),this._boundsMax=new i(-Number.MAX_VALUE,-Number.MAX_VALUE,-Number.MAX_VALUE),this._debugDisplay=!1,this._debugLodSource=`optimal`,this._debugMesh=null,this._debugObserver=null,this._debugColorData=null,this._debugSignature=0,this._disposed=!1,this._hostCompound=null,this._host=null,this._positionBase=0,this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._partReleasedByHost=!1,this._positionSnapshot=null,this._partReadyPromise=null,this._partReadyResolve=null,this._partReadyReject=null,this._partReadySettled=!1,this._metadata=t,this._rootUrl=n,this._streamOptions=a,this._hostCompound=a.hostCompound??null,this._decodeSh=a.decodeSh??!0,this._needsRotationScale=a.needsRotationScale??!1;let s=Math.max(0,t.lodLevels-1);if(this._lodRangeMax=s,a.lodBaseDistance!==void 0&&(this._lodBaseDistance=Math.max(.1,a.lodBaseDistance)),a.lodMultiplier!==void 0&&(this._lodMultiplier=Math.max(1.2,a.lodMultiplier)),a.lodBehindPenalty!==void 0&&(this._lodBehindPenalty=Math.max(1,a.lodBehindPenalty)),a.lodRangeMin!==void 0&&(this._lodRangeMin=Math.max(0,Math.min(a.lodRangeMin,s))),a.lodRangeMax!==void 0&&(this._lodRangeMax=Math.max(this._lodRangeMin,Math.min(a.lodRangeMax,s))),a.maxDecodesPerFrame!==void 0&&(this._maxDecodesPerFrame=Math.max(1,a.maxDecodesPerFrame)),a.lodCooldownFrames!==void 0&&(this._lodCooldownFrames=Math.max(0,a.lodCooldownFrames)),a.lodUpdateInterval!==void 0&&(this._lodUpdateInterval=Math.max(1,a.lodUpdateInterval)),a.lodUpdateDistance!==void 0&&(this._lodUpdateDistance=Math.max(0,a.lodUpdateDistance)),a.maxDetailLod!==void 0&&(this._maxDetailLod=Math.max(0,Math.floor(a.maxDetailLod))),this._splatBudget=this._resolveSplatBudget(a.splatBudget),a.frustumCulling!==void 0&&(this._frustumCulling=a.frustumCulling),a.debugLodSource&&(this._debugLodSource=a.debugLodSource),a.evictionCooldownFrames!==void 0&&(this._evictionCooldownFrames=Math.max(0,Math.floor(a.evictionCooldownFrames))),a.maxResidentSplats!==void 0&&a.maxResidentSplats>0&&(this._maxResidentSplats=Math.floor(a.maxResidentSplats)),a.memoryBudgetMb!==void 0&&a.memoryBudgetMb>0&&(this._memoryBudgetMb=a.memoryBudgetMb),this._downloadManager=new Be({maxConcurrent:a.maxConcurrentDownloads,maxRetries:a.maxDownloadRetries}),!this._hostCompound)this.scaling.y*=-1,this.rotation.x=-Math.PI/2;else{this.setEnabled(!1),this.isPickable=!1,this.doNotSerialize=!0,this._partReadyPromise=new Promise((e,t)=>{this._partReadyResolve=e,this._partReadyReject=t}),this._partReadyPromise.catch(()=>{});let e=this._hostCompound.onDisposeObservable.add(()=>{this._disposed||(this._partReleasedByHost=!0,this.dispose())});this._hostUnsubDispose=()=>this._hostCompound.onDisposeObservable.remove(e)}this._collectLodEntries(t.tree),a.debugDisplay&&(this.debugDisplay=!0),this._streamAllAsync().then(()=>{let e=this._partReadySettled;this._rejectPartReady(`GaussianSplattingStream: stream produced no splats.`),!e&&this._hostCompound&&!this._disposed&&this._disposeAndReclaim()},e=>{u.Error(`GaussianSplattingStream: streaming failed: `+(e?.message??e)),this._rejectPartReady(`GaussianSplattingStream: streaming failed: `+(e?.message??e)),this._hostCompound&&!this._disposed&&this._disposeAndReclaim()})}getClassName(){return`GaussianSplattingStream`}isReady(e=!1){return this._hostCompound?!0:super.isReady(e)}get streamingPartProxy(){return this._host?.proxy??null}async whenPartReadyAsync(){await(this._partReadyPromise??Promise.resolve())}_resolvePartReady(){this._partReadySettled||(this._partReadySettled=!0,this._partReadyResolve?.())}_rejectPartReady(e){this._partReadySettled||(this._partReadySettled=!0,this._partReadyReject?.(Error(e)))}async whenSettledAsync(e=3){if(this._disposed)return;this._forceLodUpdate=!0;let t=Math.max(1,e),n=this._scene,r=0,i=()=>this._isLoadingIdle()&&this._sinkIsDepthSortSettled?++r>=t:(r=0,!1);if(n.getEngine().activeRenderLoops.length>0){await new Promise(e=>{let t=null;t=n.onAfterRenderObservable.add(()=>{(this._disposed||i())&&(t&&=(n.onAfterRenderObservable.remove(t),null),e())})});return}let a=n.getEngine(),o=globalThis.requestAnimationFrame;for(;!this._disposed;){if(a.beginFrame(),n.render(),a.endFrame(),i())return;await new Promise(e=>{typeof o==`function`?o(()=>e()):setTimeout(e,16)})}}_isLoadingIdle(){return this._baseLayerReady&&this._decodeQueue.length===0&&this._loadingFiles.size===0&&this._downloadManager.isIdle}get maxDetailLod(){return this._maxDetailLod}set maxDetailLod(e){let t=Math.max(0,Math.floor(e));this._maxDetailLod!==t&&(this._maxDetailLod=t,this._forceLodUpdate=!0)}get splatBudget(){return this._splatBudget}set splatBudget(e){let t=e>0?Math.floor(e):0;t!==this._splatBudget&&(this._splatBudget=t,this._forceLodUpdate=!0)}get effectiveSplatBudget(){return this._effectiveSplatBudget()}_resolveSplatBudget(e){return e===void 0?0:e===`auto`?this._computeDefaultSplatBudget():e>0?Math.floor(e):0}_computeDefaultSplatBudget(){return this._scene.getEngine().hostInformation?.isMobile?typeof navigator<`u`&&navigator.userAgent&&/iPad|iPhone|iPod/.test(navigator.userAgent)?15e5:1e6:25e5}_effectiveSplatBudget(){if(this._hostBudgetAllocation!==null){let e=Math.max(1,this._hostBudgetAllocation);return this._residentBudget>0?Math.min(e,this._residentBudget):e}return this._splatBudget<=0?0:this._residentBudget>0?Math.min(this._splatBudget,this._residentBudget):this._splatBudget}_splatBudgetEnabled(){return this._effectiveSplatBudget()>0}getBudgetDemand(){if(!this._baseLayerReady)return 0;let e=this._environmentSplatCount();for(let t of this._leafNodes){let n=t.optimalLod??t.baseLod;e+=this._countAtLevel(t,this._cappedLevelForNode(t,n))}return e}setBudgetAllocation(e){if(e===null){this._hostBudgetAllocation!==null&&(this._hostBudgetAllocation=null,this._forceLodUpdate=!0);return}let t=this._hostBudgetAllocation;this._hostBudgetAllocation=e,(t===null||e!==t)&&(this._forceLodUpdate=!0)}get maxLodLevel(){return Math.max(0,this._metadata.lodLevels-1)}get frustumCulling(){return this._frustumCulling}set frustumCulling(e){this._frustumCulling!==e&&(this._frustumCulling=e,this._forceLodUpdate=!0)}get debugDisplay(){return this._debugDisplay}set debugDisplay(e){this._debugDisplay!==e&&(this._debugDisplay=e,e?this._refreshDebugDisplay():this._clearDebugDisplay())}get debugLodSource(){return this._debugLodSource}set debugLodSource(e){this._debugLodSource!==e&&(this._debugLodSource=e,this._debugDisplay&&this._refreshDebugDisplay())}dispose(e){this._disposed||(this._disposed=!0,this._rejectPartReady(`GaussianSplattingStream: disposed before the part was ready.`),this._unsubBeforeRebuild?.(),this._unsubAfterRebuild?.(),this._unsubBeforeRebuild=null,this._unsubAfterRebuild=null,this._hostUnsubRemove?.(),this._hostUnsubDispose?.(),this._hostUnsubRemove=null,this._hostUnsubDispose=null,this._hostCompound&&!this._hostCompound.isDisposed()&&this._hostCompound.unregisterLodBudgetParticipant(this),this._host&&this._hostCompound&&!this._partReleasedByHost&&!this._hostCompound.isDisposed()&&this._hostCompound.removePart(this._host.partIndex),this._host=null,this._lodObserver&&=(this._scene.onBeforeRenderObservable.remove(this._lodObserver),null),this._clearDebugDisplay(),this._downloadManager.dispose(),this._residency?.dispose(),this._residency=null,this._workBuffer?.dispose(),this._workBuffer=null,super.dispose(e))}_disposeAndReclaim(){let e=this._hostCompound,t=!!this._host&&!this._partReleasedByHost;this.dispose(),t&&e&&!e.isDisposed()&&e.compactAtlas()}_getEffectiveWorldMatrix(e){return this._host?this._host.proxy.computeWorldMatrix(e):this.computeWorldMatrix(e)}_getActiveLodCameras(){return(this._scene.activeCameras?.length?this._scene.activeCameras:this._scene.activeCamera?[this._scene.activeCamera]:[]).filter(e=>!!e)}evaluateOptimalLods(e=null){let t=e?[e]:this._getActiveLodCameras();if(t.length===0||this._leafNodes.length===0)return;let n=Math.max(0,this._metadata.lodLevels-1),r=this._lodBaseDistance,a=this._lodMultiplier,o=this._lodBehindPenalty,s=this._lodRangeMin,c=this._lodRangeMax,l=this._splatBudgetEnabled(),u=this._scene.getEngine().getRenderHeight()||1,d=this._scene.getEngine();this._getEffectiveWorldMatrix(!1).invertToRef(J);let f=t.map(e=>{let t=d.getAspectRatio(e)||1,n=Math.tan(e.fov*.5);e.fovMode===C.FOVMODE_HORIZONTAL_FIXED&&(n/=t);let r=n*t,a=Math.min(n,r)/We,s=u*(e.viewport?e.viewport.height:1),c=i.TransformCoordinatesToRef(e.globalPosition,J,Je),l={px:c.x,py:c.y,pz:c.z,fwx:0,fwy:0,fwz:0,fovScale:a,tanHalfV:n,pixelHeight:s};if(o>1){e.getDirectionToRef(Ze,Xe);let t=i.TransformNormalToRef(Xe,J,Ye);t.normalize(),l.fwx=t.x,l.fwy=t.y,l.fwz=t.z}return l});for(let e of this._leafNodes){let t=e.bound.min,i=e.bound.max,u=(t[0]+i[0])*.5,d=(t[1]+i[1])*.5,p=(t[2]+i[2])*.5,m=i[0]-t[0],h=i[1]-t[1],g=i[2]-t[2],_=.5*Math.sqrt(m*m+h*h+g*g),v=1/0,y=0;for(let e of f){let s=e.px<t[0]?t[0]:e.px>i[0]?i[0]:e.px,c=e.py<t[1]?t[1]:e.py>i[1]?i[1]:e.py,f=e.pz<t[2]?t[2]:e.pz>i[2]?i[2]:e.pz,m=s-e.px,h=c-e.py,g=f-e.pz,b=Math.sqrt(m*m+h*h+g*g),x=b;if(o>1&&b>.01){let t=(e.fwx*m+e.fwy*h+e.fwz*g)/b;t<0&&(x=b*(1+-t*(o-1)))}let S=x*e.fovScale,C;if(n===0||S<r)C=0;else for(C=n;C>1&&S<r*a**(C-1);)C--;if(C<v&&(v=C),l){let t=u-e.px,n=d-e.py,r=p-e.pz,i=Math.sqrt(t*t+n*n+r*r),a=_*e.pixelHeight/(Math.max(i,1e-4)*e.tanHalfV);a>y&&(y=a)}}v<s?v=s:v>c&&(v=c),this._frustumCulling&&e.inFrustum===!1&&(v=c),e.optimalLod=v,l&&(e.pixelSize=y)}}_displayedLodLevel(e){return this._debugLodSource===`optimal`?e.optimalLod??e.activeLod??0:e.activeLod??0}_refreshDebugDisplay(){this._debugLodSource===`optimal`&&this.evaluateOptimalLods(),this._buildDebugMesh();let e=this._debugDisplay;e&&!this._debugObserver?this._debugObserver=this._scene.onBeforeRenderObservable.add(()=>this._onDebugFrame()):!e&&this._debugObserver&&(this._scene.onBeforeRenderObservable.remove(this._debugObserver),this._debugObserver=null)}_onDebugFrame(){this._debugLodSource===`optimal`&&this.evaluateOptimalLods(),this._computeDebugSignature()!==this._debugSignature&&this._updateDebugColors()}_buildDebugMesh(){this._debugMesh&&=(this._debugMesh.dispose(),null),this._debugColorData=null;let t=[],n=[];for(let e of this._leafNodes){let r=Y[this._displayedLodLevel(e)%Y.length],a=e.bound.min,o=e.bound.max,s=[new i(a[0],a[1],a[2]),new i(o[0],a[1],a[2]),new i(o[0],o[1],a[2]),new i(a[0],o[1],a[2]),new i(a[0],a[1],o[2]),new i(o[0],a[1],o[2]),new i(o[0],o[1],o[2]),new i(a[0],o[1],o[2])];for(let e of Qe)t.push([s[e[0]],s[e[1]]]),n.push([r,r])}if(this._debugSignature=this._computeDebugSignature(),t.length===0)return;let r=e(this.name+`_lodDebug`,{lines:t,colors:n,updatable:!0,useVertexAlpha:!1},this._scene);r.parent=this,r.isPickable=!1,r.doNotSerialize=!0,r.reservedDataStore={hidden:!0},this._debugMesh=r,this._debugColorData=new Float32Array(this._leafNodes.length*$e*4)}_updateDebugColors(){if(!this._debugMesh||!this._debugColorData)return;let e=this._debugColorData,t=0;for(let n of this._leafNodes){let r=Y[this._displayedLodLevel(n)%Y.length];for(let n=0;n<$e;n++)e[t++]=r.r,e[t++]=r.g,e[t++]=r.b,e[t++]=r.a}this._debugMesh.updateVerticesData(p.ColorKind,e),this._debugSignature=this._computeDebugSignature()}_computeDebugSignature(){let e=0;for(let t of this._leafNodes)e=e*31+this._displayedLodLevel(t)|0;return e}_clearDebugDisplay(){this._debugObserver&&=(this._scene.onBeforeRenderObservable.remove(this._debugObserver),null),this._debugMesh&&=(this._debugMesh.dispose(),null),this._debugColorData=null,this._debugSignature=0}_collectLodEntries(e){if(e.children){for(let t of e.children)this._collectLodEntries(t);return}if(!e.lods)return;let t=e.bound?.min,n=e.bound?.max;if(!t||!n||t.length<3||n.length<3||!t.every(e=>Number.isFinite(e))||!n.every(e=>Number.isFinite(e)))return;let r=n[0]-t[0],a=n[1]-t[1],o=n[2]-t[2],s=Math.sqrt(r*r+a*a+o*o);if(!Number.isFinite(s)||s<=0)return;let c=Math.floor(Number(this._metadata.lodLevels)),l=Number.isFinite(c)&&c>0?c-1:0,u=[];for(let t of Object.keys(e.lods)){let n=Number(t),r=e.lods[t],i=r?Math.floor(Number(r.count)):NaN;Number.isInteger(n)&&String(n)===t&&n>=0&&n<=l&&r&&Number.isFinite(i)&&i>0&&(r.count=i,u.push(n))}if(u.length===0)return;u.sort((e,t)=>e-t);let d=[],f=1/0;for(let t of u){let n=e.lods[String(t)].count;n<=f&&(d.push(t),f=n)}e.availableLevels=d,e.baseLod=d[d.length-1],e.activeLod=void 0,e.lodCooldown=0,e.inFrustum=!0,e.cullBounds=new D(i.FromArray(t),i.FromArray(n)),this._leafNodes.push(e)}async _streamAllAsync(){let e=this._collectAllFileIds(),t=await this._gatherCountsAsync(e);if(this._disposed)return;this._resolveResidentBudget();let n=1;t>0&&(n+=t);for(let t of e){let e=this._fileCounts.get(t);e!==void 0&&e>0&&(n+=e)}if(n<=1)return;this._evictionEnabled=this._residentBudget>0&&this._residentBudget<n;let a=this._evictionEnabled?Math.max(this._residentBudget,1):n;if(this._residency=new Ue(a,this._evictionCooldownFrames,e=>this._onFileEvicted(e)),this._residency.pin(Ge,1),t>0){let e=this._residency.pin(Ke,t);e===null?(u.Warn(`GaussianSplattingStream: environment does not fit the memory budget; skipping it.`),this._environmentFiles=null):this._environmentRange={offset:e,count:t}}if(this._hostCompound){let e=o.Compose(new i(1,-1,1),r.RotationYawPitchRoll(0,-Math.PI/2,0),i.ZeroReadOnly),t=this._hostCompound.reserveStreamingPart(a,e,this.name+`_part`,this._shTextureCount,this._streamShDegree,this._needsRotationScale);this._host=t,this._positionBase=t.base,this._hostCompound.registerLodBudgetParticipant(this);let n=this._hostCompound,s=n.onPartRemovedObservable.add(e=>{!this._disposed&&this._host&&e===this._host.partIndex&&(this._partReleasedByHost=!0,this.dispose())});this._hostUnsubRemove=()=>n.onPartRemovedObservable.remove(s);let c=this._shTextureCount>0&&t.shMrtAtlas?{textureCount:this._shTextureCount,externalMrts:t.shMrtAtlas}:void 0,l=this._needsRotationScale&&t.rotMrtAtlas?{externalMrt:t.rotMrtAtlas}:void 0;this._workBuffer=new ze(this._scene,t.capacity,{mrt:t.mrtAtlas,width:t.atlasWidth,baseOffset:t.base},c,l),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback,this._splatPositions=t.splatPositions,this._vertexCount=a;let u=this._workBuffer;this._unsubBeforeRebuild=t.onBeforeAtlasRebuild(()=>{u.backupRegion(),this._positionSnapshot=this._splatPositions?this._splatPositions.slice(this._positionBase*4,(this._positionBase+this._vertexCount)*4):null}),this._unsubAfterRebuild=t.onAfterAtlasRebuild(()=>{t.mrtAtlas&&u.rebindAtlas(t.mrtAtlas),u.rebindShAtlas(t.shMrtAtlas),u.rebindRotAtlas(t.rotMrtAtlas),this._positionBase=t.base,u.setBaseOffset(t.base),u.restoreRegion(),this._splatPositions=t.splatPositions,this._positionSnapshot&&this._splatPositions&&(this._splatPositions.set(this._positionSnapshot,this._positionBase*4),this._positionSnapshot=null)}),t.setActiveRanges([])}else{let e=this._shTextureCount>0?{textureCount:this._shTextureCount}:void 0,t=this._needsRotationScale?{}:void 0;this._workBuffer=new ze(this._scene,a,void 0,e,t),this._readbackCandidate=this._workBuffer.supportsAsyncCentersReadback;let n=new Float32Array(a*4),r=this._workBuffer.textures,i=e?this._workBuffer.shTextures:void 0,o=t?this._workBuffer.rotationTextures:void 0;this._setExternalWorkBuffer(r[0],r[1],r[2],r[3],n,a,i,this._streamShDegree,o),this.setSplatIndexRanges([]),this.setEnabled(!0)}if(this._host&&this._workBuffer&&(await this._waitForCanBackupAsync(this._workBuffer),this._disposed))return;this._environmentRange&&this._environmentFiles&&await this._decodeEnvironmentAsync(),this._environmentFiles=null;let s=new Set;for(let e of this._leafNodes){let t=e.lods[String(e.baseLod)];t&&this._fileCounts.has(t.file)&&s.add(t.file)}for(let e of Array.from(s)){if(this._disposed)return;await this._decodeFileAsync(e)}this._disposed||(this._baseLayerReady=!0,this._lodObserver||=this._scene.onBeforeRenderObservable.add(()=>this._onLodFrame()),this._resolvePartReady())}async _waitForCanBackupAsync(e){for(let t=0;t<600&&!this._disposed;t++){if(e.canBackup)return;await new Promise(e=>this._scene.onBeforeRenderObservable.addOnce(()=>e()))}!this._disposed&&!e.canBackup&&u.Warn(`GaussianSplattingStream: backup/restore copy shaders did not compile in time; a grow/compaction before they are ready may drop streamed data.`)}_resolveResidentBudget(){let e=this._maxResidentSplats;if(this._memoryBudgetMb>0){let t=this._scene.getEngine().getCaps().textureHalfFloatRender?24:48,n=qe+this._shTextureCount*16+(this._needsRotationScale?t:0),r=Math.floor(this._memoryBudgetMb*1024*1024/n);e=e>0?Math.min(e,r):r}this._residentBudget=e}_collectAllFileIds(){let e=new Set;for(let t of this._leafNodes)for(let n of t.availableLevels){let r=t.lods[String(n)];r&&e.add(r.file)}return Array.from(e).sort((e,t)=>e-t)}async _gatherCountsAsync(e){let n=0,r=0,i=0,a=e=>{let n=t._GetShInfo(e);n.degree>r&&(r=n.degree),n.coeffs>i&&(i=n.coeffs)};if(this._metadata.environment)try{let e=this._rootUrl+this._metadata.environment,r=await this._downloadManager.loadFileAsync(e),i=await this._unzipAsync(new Uint8Array(r)),o=i.get(`meta.json`);if(o){let e=JSON.parse(new TextDecoder().decode(o));n=t._GetSplatCount(e),a(e),this._environmentFiles=i}}catch(e){u.Warn(`GaussianSplattingStream: failed to load environment: `+(e?.message??e))}await Promise.all(e.map(async e=>{let n=this._metadata.filenames[e];if(!n){u.Warn(`GaussianSplattingStream: missing filename for file index ${e}.`);return}try{let r=this._rootUrl+n,i=r.substring(0,r.lastIndexOf(`/`)+1),a=await this._downloadManager.loadFileAsync(r),o=JSON.parse(new TextDecoder().decode(new Uint8Array(a)));this._fileCounts.set(e,t._GetSplatCount(o)),this._fileMeta.set(e,{sogData:o,subRootUrl:i})}catch(e){u.Warn(`GaussianSplattingStream: failed to load metadata for ${n}: ${e?.message??e}`)}}));for(let{sogData:e}of this._fileMeta.values())a(e);return this._decodeSh&&r>0&&i>0&&(this._streamShDegree=r,this._shTextureCount=Math.ceil(i*3/16)),n}_enqueueDecode(e){this._decodedFiles.has(e)||this._loadingFiles.has(e)||!this._fileMeta.has(e)||this._decodeQueue.indexOf(e)===-1&&this._decodeQueue.push(e)}_pumpDecodeQueue(){let e=0;for(;this._decodeQueue.length>0&&e<this._maxDecodesPerFrame;){let t=this._decodeQueue.shift();this._decodedFiles.has(t)||this._loadingFiles.has(t)||(e++,this._decodeFileAsync(t).catch(e=>{u.Warn(`GaussianSplattingStream: decode failed: `+(e?.message??e))}))}}_applyPositions(e,t,n){this._splatPositions.set(e,(this._positionBase+t)*4),this._updateBounds(e,n),this._sinkPostPositionsRange(t,n)}_sinkSetActiveRanges(e){this._host?this._host.setActiveRanges(e):this.setSplatIndexRanges(e)}_sinkPostPositionsRange(e,t){this._host?this._host.postPositionsRange(e,t):this._postWorkerPositionsRange(e,t)}_sinkNotifyDataChanged(){this._host?this._host.notifyDataChanged():this._notifyWorkerNewData()}get _sinkIsDepthSortSettled(){return this._host?this._host.isDepthSortSettled:this._isDepthSortSettled}async _probeReadbackAsync(e,t,n){if(this._readbackProbed=!0,!this._workBuffer)return;let r=Math.min(t,1024),i=!1;try{let t=await this._workBuffer.readCentersRangeAsync(e,r);if(this._disposed)return;if(t&&t.length>=r*4){i=!0;for(let e=0;e<r&&i;e++)for(let r=0;r<3;r++){let a=t[e*4+r],o=n[e*4+r];if(Math.abs(a-o)>.01*(1+Math.abs(o))){i=!1;break}}}}catch{i=!1}this._useGpuPositionReadback=i,u.Log(i?`GaussianSplattingStream: GPU position readback validated; streamed LOD positions are read back from the GPU.`:`GaussianSplattingStream: GPU position readback unavailable; decoding LOD positions on the CPU.`)}async _applyDecodedPositionsAsync(e,t,n){if(this._useGpuPositionReadback&&this._workBuffer){let e=await this._workBuffer.readCentersRangeAsync(t,n);if(this._disposed)return!1;if(e&&this._splatPositions)return this._applyPositions(e,t,n),!0}let r=e.positions.length>=n*4?e.positions.subarray(0,n*4):null;return!r||!this._splatPositions?!1:(this._applyPositions(r,t,n),!this._readbackProbed&&this._readbackCandidate&&await this._probeReadbackAsync(t,n,r),!0)}async _decodeEnvironmentAsync(){if(!this._environmentRange||!this._environmentFiles||!this._workBuffer)return;let e=this._environmentRange;try{let n=(await G(this._environmentFiles,``,this._scene,!this._useGpuPositionReadback,this._downloadManager)).sogTextures;if(!n)return;try{if(this._disposed||!this._workBuffer||(await this._workBuffer.decodeAsync(n,e.offset),this._disposed)||(await this._applyDecodedPositionsAsync(n,e.offset,e.count),this._disposed))return;this._refreshActiveRanges()}finally{t._DisposePack(n)}}catch(e){u.Warn(`GaussianSplattingStream: failed to decode environment: `+(e?.message??e))}}async _decodeFileAsync(e){if(this._decodedFiles.has(e)||this._loadingFiles.has(e)||!this._residency)return;let n=this._fileMeta.get(e),r=this._fileCounts.get(e);if(!n||r===void 0)return;this._loadingFiles.add(e),this._cancelledDecodes.delete(e);let i=!1;try{let a=(await G(n.sogData,n.subRootUrl,this._scene,!this._useGpuPositionReadback,this._downloadManager,e)).sogTextures;if(!a)return;let o=await this._acquireDecodeGateAsync();try{if(this._disposed||!this._workBuffer||this._cancelledDecodes.has(e))return;let t=this._residency.allocate(e,r);if(t===null&&(t=await this._relayoutAndAllocateAsync(e,r)),t===null){this._cancelledDecodes.has(e)||u.Warn(`GaussianSplattingStream: resident memory budget full; skipping LOD file ${e}.`);return}if(i=!0,this._disposed||!this._workBuffer||this._cancelledDecodes.has(e)||(await this._workBuffer.decodeAsync(a,t),this._disposed||this._cancelledDecodes.has(e))||(await this._applyDecodedPositionsAsync(a,t,r),this._disposed))return;this._decodedFiles.add(e),this._applyDesiredLods()&&this._refreshActiveRanges()}finally{t._DisposePack(a),o()}}catch(t){if(!this._cancelledDecodes.has(e))throw t}finally{i&&!this._decodedFiles.has(e)&&this._residency.free(e),this._loadingFiles.delete(e),this._cancelledDecodes.delete(e)}}async _acquireDecodeGateAsync(){let e=this._decodeGate,t;return this._decodeGate=new Promise(e=>{t=e}),await e,t}async _relayoutAndAllocateAsync(e,t){return!this._residency||!this._workBuffer||this._residency.freeSize<t?null:await new Promise(n=>{let r=()=>{if(this._disposed||!this._residency||!this._workBuffer||this._cancelledDecodes.has(e)){n(null);return}if(!this._workBuffer.isRelayoutReady()){this._scene.onBeforeRenderObservable.addOnce(r);return}this._performRelayout(),n(this._residency.allocate(e,t))};this._scene.onBeforeRenderObservable.addOnce(r)})}_performRelayout(){if(!this._residency||!this._workBuffer||!this._splatPositions)return;let e=this._relayoutOldOffsets;e.clear();for(let t of this._residency.getResidentBlocks())e.set(t.file,t.offset);if(this._residency.compact().length===0)return;let t=this._residency.capacity;(!this._relayoutSrcIndex||this._relayoutSrcIndex.length!==t)&&(this._relayoutSrcIndex=new Float32Array(t));let n=this._relayoutSrcIndex;n.fill(-1);let r=this._residency.getResidentBlocks();for(let t of r){let r=e.get(t.file);for(let e=0;e<t.count;e++)n[t.offset+e]=r+e}this._workBuffer.relayoutSync(n);let i=this._splatPositions,a=this._positionBase;r.sort((e,t)=>e.offset-t.offset);for(let t of r){let n=e.get(t.file);n!==t.offset&&i.copyWithin((a+t.offset)*4,(a+n)*4,(a+n+t.count)*4)}if(this._environmentRange){let e=this._residency.offset(Ke);e!==void 0&&(this._environmentRange.offset=e)}this._sinkNotifyDataChanged(),this._refreshActiveRanges()}_onFileEvicted(e){this._decodedFiles.delete(e)}_cappedLevelForNode(e,t){let n=e.availableLevels,r=this._maxDetailLod,i=-1,a=1/0;for(let e of n){if(e<r)continue;let n=Math.abs(e-t);n<a&&(i=e,a=n)}return i<0?e.baseLod:i}_computeTargetLevels(){let e=this._effectiveSplatBudget();if(e<=0){for(let e of this._leafNodes){let t=e.optimalLod??e.baseLod;e.targetLevel=this._cappedLevelForNode(e,t)}return}let t=Math.max(0,e-this._environmentSplatCount());this._convergePixelThreshold(t);let n=this._lodPixelThreshold;for(let e of this._leafNodes)e.targetLevel=this._budgetedLevel(e,n)}_environmentSplatCount(){let e=this._environmentRange?Math.floor(Number(this._environmentRange.count)):0;return Number.isFinite(e)&&e>0?e:0}_budgetedLevel(e,t){let n=e.optimalLod??e.baseLod,r=e.pixelSize??0,i=0;return r>0&&t>r&&(i=Math.max(0,Math.round(Math.log(t/r)/Math.log(this._lodMultiplier)))),this._cappedLevelForNode(e,n+i)}_countAtLevel(e,t){let n=e.lods[String(t)];return n?n.count:0}_totalSplatsAtThreshold(e){let t=0;for(let n of this._leafNodes)t+=this._countAtLevel(n,this._budgetedLevel(n,e));return t}_convergePixelThreshold(e){if(this._totalSplatsAtThreshold(1)<=e){this._lodPixelThreshold=1;return}let t=1;for(let e of this._leafNodes)e.pixelSize&&e.pixelSize>t&&(t=e.pixelSize);let n=Math.min(32,Math.max(1,this._metadata.lodLevels)),r=t*this._lodMultiplier**+(n+1);if(this._totalSplatsAtThreshold(r)>e){this._lodPixelThreshold=r;return}let i=1,a=r;for(let t=0;t<40&&a-i>.001*a;t++){let t=.5*(i+a);this._totalSplatsAtThreshold(t)<=e?a=t:i=t}this._lodPixelThreshold=a}_residentLevelAtLeast(e,t){for(let n of e.availableLevels)if(n>=t&&this._decodedFiles.has(e.lods[String(n)].file))return n;return null}_applyDesiredLods(){let e=!1;for(let t of this._leafNodes){let n=t.targetLevel??t.baseLod;if(this._splatBudgetEnabled()&&t.activeLod!==void 0&&t.activeLod<n){let r=this._residentLevelAtLeast(t,n);r!==null&&r!==t.activeLod&&(this._switchActiveFile(t,t.lods[String(r)].file),t.activeLod=r,t.lodCooldown=this._lodCooldownFrames,e=!0)}if(t.lodCooldown&&t.lodCooldown>0)continue;let r;if(n!==t.activeLod){let i=t.lods[String(n)];i&&(this._decodedFiles.has(i.file)?(this._switchActiveFile(t,i.file),t.activeLod=n,t.lodCooldown=this._lodCooldownFrames,e=!0):r=i.file)}t.pendingFile!==r&&(t.pendingFile!==void 0&&this._releaseFileRef(t.pendingFile),r!==void 0&&this._acquirePendingFile(r),t.pendingFile=r)}return e}_switchActiveFile(e,t){e.activeFile!==t&&(e.activeFile!==void 0&&this._releaseFileRef(e.activeFile),this._acquireFileRef(t),e.activeFile=t)}_acquireFileRef(e){let t=(this._fileRefs.get(e)??0)+1;this._fileRefs.set(e,t),t===1&&this._residency?.cancelEviction(e)}_acquirePendingFile(e){this._acquireFileRef(e),this._enqueueDecode(e)}_releaseFileRef(e){let t=(this._fileRefs.get(e)??0)-1;if(t>0){this._fileRefs.set(e,t);return}if(this._fileRefs.delete(e),this._decodedFiles.has(e)){this._evictionEnabled&&this._residency?.scheduleEviction(e);return}let n=this._decodeQueue.indexOf(e);n!==-1&&this._decodeQueue.splice(n,1),this._loadingFiles.has(e)&&(this._cancelledDecodes.add(e),this._downloadManager.cancelGroup(e))}_onLodFrame(){if(this._disposed||!this._baseLayerReady)return;let e=!1;for(let t of this._leafNodes)t.lodCooldown&&t.lodCooldown>0&&(t.lodCooldown--,t.lodCooldown===0&&t.targetLevel!==void 0&&t.targetLevel!==t.activeLod&&(e=!0));this._evictionEnabled&&this._residency?.tick(),this._pumpDecodeQueue();let t=this._updateNodeFrustum(),n=this._forceLodUpdate||t||e;if(!n&&++this._framesSinceLodUpdate>=this._lodUpdateInterval){let e=this._getActiveLodCameras(),t=this._lodUpdateDistance;if(e.length!==this._lastLodCamPositions.length||this._computeLodSignature(e)!==this._lastLodSignature)n=!0;else for(let r=0;r<e.length;r++)if(i.DistanceSquared(e[r].globalPosition,this._lastLodCamPositions[r])>=t*t){n=!0;break}}if(n){this._forceLodUpdate=!1,this._framesSinceLodUpdate=0;let e=this._getActiveLodCameras();this._lastLodCamPositions.length=0;for(let t of e)this._lastLodCamPositions.push(t.globalPosition.clone());this._lastLodSignature=this._computeLodSignature(e),this.evaluateOptimalLods(),this._computeTargetLevels(),this._applyDesiredLods()&&this._refreshActiveRanges()}}_computeLodSignature(e){let t=this._scene.getEngine(),n=`${t.getRenderWidth()}x${t.getRenderHeight()}#${this._getEffectiveWorldMatrix(!1).updateFlag}`;for(let t of e){let e=t.viewport;n+=`|${t.uniqueId}:${t.fov}:${t.fovMode}:${e.x},${e.y},${e.width},${e.height}`}return n}_updateNodeFrustum(){let e=this._getActiveLodCameras(),t=!1;if(!this._frustumCulling||e.length===0){for(let e of this._leafNodes)e.inFrustum===!1&&(e.inFrustum=!0,t=!0);return t}let n=this._leafNodes,r=this._frustumScratch,i=this._getEffectiveWorldMatrix(!1);for(let e=0;e<n.length;e++)n[e].cullBounds.update(i),r[e]=!1;for(let t of e){t.getViewMatrix().multiplyToRef(t.getProjectionMatrix(),this._cullViewProj),_.GetPlanesToRef(this._cullViewProj,this._frustumPlanes);for(let e=0;e<n.length;e++)!r[e]&&n[e].cullBounds.isInFrustum(this._frustumPlanes)&&(r[e]=!0)}for(let e=0;e<n.length;e++)r[e]!==n[e].inFrustum&&(n[e].inFrustum=r[e],t=!0);return t}static _GetSplatCount(e){let t=e.count??(Array.isArray(e.means.shape)?e.means.shape[0]:0),n=Math.floor(Number(t));return Number.isFinite(n)&&n>0?n:0}static _GetShInfo(e){if(!e.shN)return{degree:0,coeffs:0};let t=0,n=e.shN.bands;if(typeof n==`number`&&Number.isFinite(n)&&n>0)t=Math.floor(n);else if(Array.isArray(e.shN.shape)&&Number.isFinite(e.shN.shape[1])&&e.shN.shape[1]>0){let n=Math.floor(e.shN.shape[1]/3);t=n>0?Math.round(Math.sqrt(n+1)-1):0}return t>0?(t>4&&(u.Warn(`GaussianSplattingStream: SH degree ${t} exceeds the maximum supported (4); clamping.`),t=4),{degree:t,coeffs:(t+1)**2-1}):{degree:0,coeffs:0}}static _DisposePack(e){e.meansTextureL.dispose(),e.meansTextureU.dispose(),e.scalesTexture.dispose(),e.quatsTexture.dispose(),e.sh0Texture.dispose(),e.shCentroidsTexture?.dispose(),e.shLabelsTexture?.dispose(),e.codebookTexture?.dispose()}_updateBounds(e,t){let n=this._boundsMin,r=this._boundsMax;for(let i=0;i<t;i++){let t=e[i*4+0],a=e[i*4+1],o=e[i*4+2];n.minimizeInPlaceFromFloats(t,a,o),r.maximizeInPlaceFromFloats(t,a,o)}this._host?this._host.expandBounds(n,r):this.setBoundingInfo(new D(n,r))}_refreshActiveRanges(){let e=[];this._environmentRange&&e.push({offset:this._environmentRange.offset,count:this._environmentRange.count});for(let t of this._leafNodes){if(t.activeLod===void 0)continue;let n=t.lods[String(t.activeLod)];if(!n)continue;let r=this._residency?.offset(n.file);r!==void 0&&e.push({offset:r+n.offset,count:n.count})}this._sinkSetActiveRanges(t._CoalesceRanges(e))}static _CoalesceRanges(e){if(e.length<=1)return e;let t=e.slice().sort((e,t)=>e.offset-t.offset),n=[{offset:t[0].offset,count:t[0].count}];for(let e=1;e<t.length;e++){let r=n[n.length-1],i=t[e],a=r.offset+r.count;i.offset<=a?r.count=Math.max(a,i.offset+i.count)-r.offset:n.push({offset:i.offset,count:i.count})}return n}async _unzipAsync(e){let t=this._streamOptions.fflate;t||=(window.fflate===void 0&&await f.LoadScriptAsync(this._streamOptions.deflateURL??`https://unpkg.com/fflate/umd/index.js`),window.fflate);let n=t.unzipSync(e),r=new Map;for(let[e,t]of Object.entries(n))r.set(e,t);return r}};O(),de(),j(),fe(),me();var tt=32768,X=.28209479177387814,Z=null,nt=null;function rt(e,t,n){let r=new Uint8Array(e),i=new Uint32Array(e.slice(0,12)),a=i[2],o=r[12],s=r[13],c=r[14],l=r[15],u=i[1];if(l||i[0]!=1347635022||u<2||u>4)return new Promise(e=>{e({mode:3,data:new ArrayBuffer(0),hasVertexColors:!1})});let d=new ArrayBuffer(32*a),f=1/(1<<s),p=new Int32Array(1),m=new Uint8Array(p.buffer),h=function(e,t){return m[0]=e[t+0],m[1]=e[t+1],m[2]=e[t+2],m[3]=e[t+2]&128?255:0,p[0]*f},g=16,_=new Float32Array(d),v=new Float32Array(d),y=new Uint8ClampedArray(d),b=new Uint8ClampedArray(d);for(let e=0;e<a;e++)_[e*8+0]=h(r,g+0),_[e*8+1]=h(r,g+3),_[e*8+2]=h(r,g+6),g+=9;for(let e=0;e<a;e++){for(let t=0;t<3;t++){let n=(r[g+a+e*3+t]-127.5)/38.25;y[e*32+24+t]=P.Clamp((.5+X*n)*255,0,255)}y[e*32+24+3]=r[g+e]}g+=a*4;for(let e=0;e<a;e++)v[e*8+3+0]=Math.exp(r[g+0]/16-10),v[e*8+3+1]=Math.exp(r[g+1]/16-10),v[e*8+3+2]=Math.exp(r[g+2]/16-10),g+=3;if(u>=3){let e=Math.SQRT1_2;for(let t=0;t<a;t++){let n=[r[g+0],r[g+1],r[g+2],r[g+3]],i=n[0]+(n[1]<<8)+(n[2]<<16)+(n[3]<<24),a=[],o=i>>>30,s=i,c=0;for(let t=3;t>=0;--t)if(t!==o){let n=s&511,r=s>>>9&1;s>>>=10,a[t]=n/511*e,r===1&&(a[t]=-a[t]),c+=a[t]*a[t]}let l=1-c;a[o]=Math.sqrt(Math.max(l,0));let u=[3,0,1,2];for(let e=0;e<4;e++)b[t*32+28+e]=Math.round(127.5+a[u[e]]*127.5);g+=4}}else for(let e=0;e<a;e++){let t=r[g+0],n=r[g+1],i=r[g+2],a=t/127.5-1,o=n/127.5-1,s=i/127.5-1;b[e*32+28+1]=t,b[e*32+28+2]=n,b[e*32+28+3]=i;let c=1-(a*a+o*o+s*s);b[e*32+28+0]=127.5+Math.sqrt(c<0?0:c)*127.5,g+=3}if(o){let e=((o+1)*(o+1)-1)*3,n=Math.ceil(e/16),i=g,s=t.getEngine().getCaps().maxTextureSize,l=Math.ceil(a/s),u=M(n,l*s*4*4);for(let t=0;t<a;t++)for(let n=0;n<e;n++){let e=r[i++],a=u[Math.floor(n/16)],o=n%16,s=t*16;a[o+s]=e}return new Promise(e=>{e({mode:0,data:d,hasVertexColors:!1,sh:u,shDegree:o,trainedWithAntialiasing:!!c})})}return new Promise(e=>{e({mode:0,data:d,hasVertexColors:!1,trainedWithAntialiasing:!!c})})}async function it(e){if(Z&&nt===e)return await Z;let t=ue(`import createSpzModule from '${e}';
         const module = await createSpzModule();
         const returnedValue = module;`);return nt=e,Z=t,await t}function*at(e,t,n=!1){let r=e.numPoints,i=new ArrayBuffer(32*r),a=new Float32Array(i),o=new Uint8Array(i),s=e.positions,c=e.scales,l=e.colors,u=e.alphas,d=e.rotations,f=null,p=e.shDegree,m=null,h=0,g=null,_=null,v=null;if(p>0&&e.sh.length>0){h=((p+1)*(p+1)-1)*3;let n=Math.ceil(h/16),i=t.getEngine().getCaps().maxTextureSize,a=Math.ceil(r/i);f=M(n,a*i*4*4),g=new Int32Array(n),_=new Int32Array(n);for(let e=0;e<n;e++)g[e]=e*16,_[e]=Math.min((e+1)*16,h);v=f,m=e.sh}for(let e=0;e<r;e++){let t=e*8,r=e*32,i=e*3,f=e*4;a[t+0]=s[i+0],a[t+1]=s[i+1],a[t+2]=s[i+2],a[t+3]=Math.exp(c[i+0]),a[t+4]=Math.exp(c[i+1]),a[t+5]=Math.exp(c[i+2]);let p=(.5+X*l[i+0])*255,y=(.5+X*l[i+1])*255,b=(.5+X*l[i+2])*255;o[r+24]=p<=0?0:p>=255?255:p+.5|0,o[r+25]=y<=0?0:y>=255?255:y+.5|0,o[r+26]=b<=0?0:b>=255?255:b+.5|0,o[r+27]=1/(1+Math.exp(-u[e]))*255+.5|0;let x=d[f+3]*127.5+127.5,S=d[f+0]*127.5+127.5,C=d[f+1]*127.5+127.5,w=d[f+2]*127.5+127.5;if(o[r+28]=x<=0?0:x>=255?255:x+.5|0,o[r+29]=S<=0?0:S>=255?255:S+.5|0,o[r+30]=C<=0?0:C>=255?255:C+.5|0,o[r+31]=w<=0?0:w>=255?255:w+.5|0,m&&v&&g&&_){let t=e*h,n=e*16;for(let e=0;e<v.length;e++){let r=v[e],i=g[e],a=_[e];for(let e=i;e<a;e++){let a=m[t+e]*128+128;r[n+e-i]=a<=0?0:a>=255?255:a+.5|0}}}e%tt===0&&n&&(yield)}let y,b;if(e.extensions)for(let t of e.extensions){let e=t;if(e.safeOrbitRadiusMin!==void 0){y=e.safeOrbitRadiusMin,b=[e.safeOrbitElevationMin,e.safeOrbitElevationMax];break}}return{mode:0,data:i,hasVertexColors:!1,sh:f===null?void 0:f,shDegree:p>0?p:void 0,trainedWithAntialiasing:!!e.antialiased,safeOrbitCameraRadiusMin:y,safeOrbitCameraElevationMinMax:b}}async function ot(e,t){return await b(at(e,t,!0),w())}l(),y(),d();var Q=class e{constructor(t={}){this.name=B.name,this._assetContainer=null,this.extensions=B.extensions,this._loadingOptions={...e._DefaultLoadingOptions,...t}}createPlugin(t){return new e(t[B.name])}async importMeshAsync(e,t,n,r,i,a){let o=this._tryCreateLODStream(t,n,r);return o?{meshes:[o],particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}:await this._parseAsync(e,t,n,r).then(e=>({meshes:e,particleSystems:[],skeletons:[],animationGroups:[],transformNodes:[],geometries:[],lights:[],spriteManagers:[]}))}_tryCreateLODStream(e,t,n){if(typeof t!=`string`)return null;let r;try{r=JSON.parse(t)}catch{return null}if(!et.IsLODMetadata(r))return null;let i=e._blockEntityCollection;e._blockEntityCollection=!!this._assetContainer;try{let t=new et(`GaussianSplattingStream`,r,n,e,{deflateURL:this._loadingOptions.deflateURL,fflate:this._loadingOptions.fflate});return t._parentContainer=this._assetContainer,t}finally{e._blockEntityCollection=i}}static _BuildPointCloud(e,t){if(!t.byteLength)return!1;let n=new Uint8Array(t),r=new Float32Array(t),a=n.length/32;return e.addPoints(a,function(e,t){let a=r[8*t+0],o=r[8*t+1],s=r[8*t+2];e.position=new i(a,o,s);let l=n[32*t+24+0]/255,u=n[32*t+24+1]/255,d=n[32*t+24+2]/255;e.color=new c(l,u,d,1)}),!0}static _BuildMesh(e,t){let n=new T(`PLYMesh`,e),r=new Uint8Array(t.data),i=new Float32Array(t.data),a=r.length/32,o=[],s=new x;for(let e=0;e<a;e++){let t=i[8*e+0],n=i[8*e+1],r=i[8*e+2];o.push(t,n,r)}if(t.hasVertexColors){let e=new Float32Array(a*4);for(let t=0;t<a;t++){let n=r[32*t+24+0]/255,i=r[32*t+24+1]/255,a=r[32*t+24+2]/255;e[t*4+0]=n,e[t*4+1]=i,e[t*4+2]=a,e[t*4+3]=1}s.colors=e}return s.positions=o,s.indices=t.faces,s.applyToMesh(n),n}async _unzipWithFFlateAsync(e){let t=this._loadingOptions.fflate;t||=(window.fflate===void 0&&await f.LoadScriptAsync(this._loadingOptions.deflateURL??`https://unpkg.com/fflate/umd/index.js`),window.fflate);let{unzipSync:n}=t,r=n(e),i=new Map;for(let[e,t]of Object.entries(r))i.set(e,t);return i}_parseAsync(t,n,r,a){let o=[],s=t=>{n._blockEntityCollection=!!this._assetContainer;let r=this._loadingOptions.gaussianSplattingMesh??new N(`GaussianSplatting`,null,n,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);r._parentContainer=this._assetContainer,o.push(r),t.sogTextures?r.setSogTextureData(t.sogTextures):r.updateData(t.data,t.sh,{flipY:!1},void 0,t.shDegree),r.scaling.y*=-1,r.computeWorldMatrix(!0),r.safeOrbitCameraLimits=e._ExtractSafeOrbitLimits(t),n._blockEntityCollection=!1},c=n.getEngine(),l=this._loadingOptions.useSogTextures;l&&!c.isWebGPU&&c.version<2&&(u.Warn(`SPLATFileLoader: useSogTextures requires WebGL2 or WebGPU. Falling back to CPU path.`),l=!1);let d=l?G:ye;if(typeof r==`string`){let e=JSON.parse(r);if(e&&e.means&&e.scales&&e.quats&&e.sh0)return new Promise((t,r)=>{d(e,a,n).then(e=>{s(e),t(o)}).catch(e=>{r(Error(`Failed to parse SOG data.`,{cause:e}))})})}let f=r instanceof ArrayBuffer?new Uint8Array(r):r;if(f[0]===80&&f[1]===75)return new Promise((e,t)=>{this._unzipWithFFlateAsync(f).then(r=>{d(r,a,n).then(t=>{s(t),e(o)}).catch(e=>{t(Error(`Failed to parse SOG zip data.`,{cause:e}))})})});let p=t=>{e._ConvertPLYToSplat(r).then(async r=>{switch(n._blockEntityCollection=!!this._assetContainer,r.mode){case 0:{let t=this._loadingOptions.gaussianSplattingMesh??new N(`GaussianSplatting`,null,n,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);switch(t._parentContainer=this._assetContainer,o.push(t),t.updateData(r.data,r.sh,{flipY:!1},void 0,r.shDegree),t.scaling.y*=-1,r.chirality===`RightHanded`&&(t.scaling.y*=-1),r.upAxis){case`X`:t.rotation=new i(0,0,Math.PI/2);break;case`Y`:t.rotation=new i(0,0,Math.PI);break;case`Z`:t.rotation=new i(-Math.PI/2,Math.PI,0)}t.computeWorldMatrix(!0),t.safeOrbitCameraLimits=e._ExtractSafeOrbitLimits(r)}break;case 1:{let t=new pe(`PointCloud`,1,n);e._BuildPointCloud(t,r.data)?await t.buildMeshAsync().then(e=>{o.push(e)}):t.dispose()}break;case 2:if(r.faces)o.push(e._BuildMesh(n,r));else throw Error(`PLY mesh doesn't contain face informations.`);break;default:throw Error(`Unsupported Splat mode`)}n._blockEntityCollection=!1,this.applyAutoCameraLimits(e._ExtractSafeOrbitLimits(r),n),t(o)})},m=f[0]===31&&f[1]===139,h=f[0]===78&&f[1]===71&&f[2]===83&&f[3]===80;if(!m&&!h)return new Promise(e=>{p(e)});let g=(t,r)=>{n._blockEntityCollection=!!this._assetContainer;let i=this._loadingOptions.gaussianSplattingMesh??new N(`GaussianSplatting`,null,n,this._loadingOptions.keepInRam,this._loadingOptions.needsRotationScaleTextures);if(t.trainedWithAntialiasing){let e=i.material;e.kernelSize=.1,e.compensation=!0}i._parentContainer=this._assetContainer,o.push(i),i.updateData(t.data,t.sh,{flipY:!1},void 0,t.shDegree),this._loadingOptions.flipY||(i.scaling.y*=-1,i.computeWorldMatrix(!0)),n._blockEntityCollection=!1;let a=e._ExtractSafeOrbitLimits(t);i.safeOrbitCameraLimits=a,this.applyAutoCameraLimits(a,n),r(o)};if(this._loadingOptions.spzLibraryUrl)return it(this._loadingOptions.spzLibraryUrl).then(e=>ot(e.loadSpzFromBuffer(new Uint8Array(r),{to:e.CoordinateSystem.RUB}),n).then(e=>new Promise(t=>{g(e,t)})));if(h)return Promise.reject(Error(`SPZ V4+ files (NGSP format) are not supported by the native fallback loader. Please provide a valid 'spzLibraryUrl' in the loading options to use the WASM-based SPZ library, or ensure WebAssembly is available in your environment.`));let _=new ReadableStream({start(e){e.enqueue(new Uint8Array(r)),e.close()}}),v=new DecompressionStream(`gzip`),y=_.pipeThrough(v);return new Promise(e=>{new Response(y).arrayBuffer().then(t=>{rt(t,n,this._loadingOptions).then(t=>{g(t,e)})}).catch(()=>{p(e)})})}static _ExtractSafeOrbitLimits(e){return e.safeOrbitCameraRadiusMin===void 0&&e.safeOrbitCameraElevationMinMax===void 0?null:{radiusMin:e.safeOrbitCameraRadiusMin,elevationMinMax:e.safeOrbitCameraElevationMinMax}}applyAutoCameraLimits(e,t){if(!this._loadingOptions.disableAutoCameraLimits&&e&&t.activeCamera?.getClassName()===`ArcRotateCamera`){let n=t.activeCamera;e.elevationMinMax&&(n.lowerBetaLimit=Math.PI*.5-e.elevationMinMax[1],n.upperBetaLimit=Math.PI*.5-e.elevationMinMax[0]),e.radiusMin&&(n.lowerRadiusLimit=e.radiusMin)}}loadAssetContainerAsync(e,t,n){let r=new ee(e);return this._assetContainer=r,this.importMeshAsync(null,e,t,n).then(e=>{for(let t of e.meshes)r.meshes.push(t);return this._assetContainer=null,r}).catch(e=>{throw this._assetContainer=null,e})}loadAsync(e,t,n){return this.importMeshAsync(null,e,t,n).then(()=>{})}static _ConvertPLYToSplat(e){let t=new Uint8Array(e),n=new TextDecoder().decode(t.slice(0,10240)),r=n.indexOf(`end_header
`);if(r<0||!n)return new Promise(t=>{t({mode:0,data:e,rawSplat:!0})});let i=parseInt(/element vertex (\d+)\n/.exec(n)[1]),a=/element face (\d+)\n/.exec(n),o=0;a&&(o=parseInt(a[1]));let s=/element chunk (\d+)\n/.exec(n),c=0;s&&(c=parseInt(s[1]));let l=0,d=0,f={double:8,int:4,uint:4,float:4,short:2,ushort:2,uint16:2,uchar:1,list:0},p={Vertex:0,Chunk:1,SH:2,Float_Tuple:3,Float:4,Uchar:5},m=p.Chunk,h=[],g=[],_=n.slice(0,r).split(`
`),v={};for(let t of _)if(t.startsWith(`property `)){let[,n,r]=t.split(` `);if(m==p.Chunk)g.push({name:r,type:n,offset:d}),d+=f[n];else if(m==p.Vertex)h.push({name:r,type:n,offset:l}),l+=f[n];else if(m==p.SH)h.push({name:r,type:n,offset:l});else if(m==p.Float_Tuple){let t=new DataView(e,d,f.float*2);v.safeOrbitCameraElevationMinMax=[t.getFloat32(0,!0),t.getFloat32(4,!0)]}else if(m==p.Float)v.safeOrbitCameraRadiusMin=new DataView(e,d,f.float).getFloat32(0,!0);else if(m==p.Uchar){let t=new DataView(e,d,f.uchar);r==`up_axis`?v.upAxis=t.getUint8(0)==0?`X`:t.getUint8(0)==1?`Y`:`Z`:r==`chirality`&&(v.chirality=t.getUint8(0)==0?`LeftHanded`:`RightHanded`)}f[n]||u.Warn(`Unsupported property type: ${n}.`)}else if(t.startsWith(`element `)){let[,e]=t.split(` `);e==`chunk`?m=p.Chunk:e==`vertex`?m=p.Vertex:e==`sh`?m=p.SH:e==`safe_orbit_camera_elevation_min_max_radians`?m=p.Float_Tuple:e==`safe_orbit_camera_radius_min`?m=p.Float:(e==`up_axis`||e==`chirality`)&&(m=p.Uchar)}let y=l,b=d;return N.ConvertPLYWithSHToSplatAsync(e).then(async t=>{let n=new DataView(e,r+11),a=b*c+y*i,s=[];if(o)for(let e=0;e<o;e++){let e=n.getUint8(a);if(e==3){a+=1;for(let t=0;t<e;t++){let e=n.getUint32(a+(2-t)*4,!0);s.push(e)}a+=12}}if(c)return await new Promise(e=>{e({mode:0,data:t.buffer,sh:t.sh,shDegree:t.shDegree,faces:s,hasVertexColors:!1,compressed:!0,rawSplat:!1})});let l=0,u=0,d=[`x`,`y`,`z`,`scale_0`,`scale_1`,`scale_2`,`opacity`,`rot_0`,`rot_1`,`rot_2`,`rot_3`],f=[`red`,`green`,`blue`,`f_dc_0`,`f_dc_1`,`f_dc_2`];for(let e=0;e<h.length;e++){let t=h[e];d.includes(t.name)&&l++,f.includes(t.name)&&u++}let p=l==d.length&&u>=3,m=o?2:+!p;return await new Promise(e=>{e({...v,mode:m,data:t.buffer,sh:t.sh,shDegree:t.shDegree,faces:s,hasVertexColors:!!u,compressed:!1,rawSplat:!1})})})}};Q._DefaultLoadingOptions={keepInRam:!1,flipY:!1,needsRotationScaleTextures:!1,spzLibraryUrl:typeof WebAssembly==`object`?`https://unpkg.com/@adobe/spz@0.2.2/dist/spz.js`:void 0};var $=!1;function st(){$||($=!0,ce(new Q))}export{st as RegisterSPLATFileLoader,Q as SPLATFileLoader};