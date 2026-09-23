const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/textureMerger.fragment-Dv4Mhp89.js","assets/rolldown-runtime-B0Z9INg1.js","assets/shaderStore-DBiNfWDC.js","assets/textureMerger.fragment-TrNL1-XO.js","assets/greasedLine.vertex-Nl6PtxLC.js","assets/sceneUboDeclaration-BucOHbCW.js","assets/instancesDeclaration-CgXh0JO7.js","assets/instancesVertex-C56VJhRE.js","assets/meshUboDeclaration-DDlgBu5O.js","assets/greasedLine.fragment-Bll41gv5.js","assets/greasedLine.vertex-Def_a7Tx.js","assets/instancesDeclaration-wmdSHGgS.js","assets/instancesVertex-Dd3Zi5LO.js","assets/greasedLine.fragment-BXSz7HUE.js"])))=>i.map(i=>d[i]);
import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{Ft as t,G as n,It as r,U as i,_ as a,an as o,at as s,g as c,nn as l,nt as u,ot as d,rn as f,tt as p,un as ee}from"./engineRegistration.pure-CPEpUP4b.js";import{a as m,c as h,i as g,o as _}from"./math.vector.pure-BAbqkt6K.js";import{n as te,t as ne}from"./performanceConfigurator-DQUdBSUa.js";import{i as re,r as ie}from"./typeStore-Cabm4lgz.js";import{a as v,t as y}from"./math.color.pure-jwlNow8J.js";import{n as b,t as ae}from"./logger-7Rt2cEsq.js";import{J as oe,q as se}from"./tools.pure-DAKX4exm.js";import{_ as ce,g as le,v as x,y as ue}from"./thinEngine.pure-DkoXIIOW.js";import{a as de,i as fe,r as pe,t as S}from"./internalTexture-DIA8YYqG.js";import{l as C,r as me,t as he}from"./buffer.pure-CtkrCo9r.js";import{c as ge,i as _e}from"./math.path-C4weFQQl.js";import{D as ve,T as w,a as ye,t as be}from"./mesh.pure-CFr3xoE_.js";import{n as T,t as E}from"./preload-helper-ClNS6Nl5.js";import{n as D,t as O}from"./rawTexture-BF7hDZNs.js";import{c as xe,f as Se,l as k,u as A}from"./transformNode-CBVvqnTN.js";import{a as j,s as M}from"./dumpTools.pure-BJdOhn4_.js";import{r as Ce,t as we}from"./proceduralTexture.pure-CwxrSCTc.js";var N,P,F=e((()=>{b(),d(),pe(),ue(),te(),a(),ce(),N=class{constructor(){this.renderWidth=512,this.renderHeight=256,this.textureSize=512,this.deterministicLockstep=!1,this.lockstepMaxSteps=4}},P=class extends s{isDeterministicLockStep(){return this._options.deterministicLockstep}getLockstepMaxSteps(){return this._options.lockstepMaxSteps}getHardwareScalingLevel(){return 1}get supportsUniformBuffers(){return!!this._options?.enableMultiview||this.webGLVersion>1&&!this.disableUniformBuffers}constructor(e=new N){super(null),e.deterministicLockstep===void 0&&(e.deterministicLockstep=!1),e.timeStep!==void 0&&(this._timeStep=e.timeStep),e.lockstepMaxSteps===void 0&&(e.lockstepMaxSteps=4),this._options=e,ne.SetMatrixPrecision(!!e.useHighPrecisionMatrix),this._caps={maxTexturesImageUnits:16,maxVertexTextureImageUnits:16,maxCombinedTexturesImageUnits:32,maxTextureSize:512,maxCubemapTextureSize:512,maxDrawBuffers:0,maxRenderTextureSize:512,maxVertexAttribs:16,maxVaryingVectors:16,maxFragmentUniformVectors:16,maxVertexUniformVectors:16,shaderFloatPrecision:10,standardDerivatives:!1,astc:null,pvrtc:null,etc1:null,etc2:null,bptc:null,maxAnisotropy:0,uintIndices:!1,fragmentDepthSupported:!1,highPrecisionShaderSupported:!0,colorBufferFloat:!1,blendFloat:!1,supportFloatTexturesResolve:!1,rg11b10ufColorRenderable:!1,textureFloat:!1,textureFloatLinearFiltering:!1,textureFloatRender:!1,textureHalfFloat:!1,textureHalfFloatLinearFiltering:!1,textureHalfFloatRender:!1,textureLOD:!1,texelFetch:!1,drawBuffersExtension:!1,depthTextureExtension:!1,vertexArrayObject:!1,instancedArrays:!1,supportOcclusionQuery:!1,canUseTimestampForTimerQuery:!1,maxMSAASamples:1,blendMinMax:!1,canUseGLInstanceID:!1,canUseGLVertexID:!1,supportComputeShaders:!1,supportSRGBBuffers:!1,supportTransformFeedbacks:!1,textureMaxLevel:!1,texture2DArrayMaxLayerCount:128,disableMorphTargetTexture:!1,textureNorm16:!1,blendParametersPerTarget:!1,dualSourceBlending:!1,supportReadWriteStorageTextures:!1},e.enableMultiview&&(this._caps.multiview={framebufferTextureMultiviewOVR:()=>{}}),this._features={forceBitmapOverHTMLImageElement:!1,supportRenderAndCopyToLodForFloatTextures:!1,supportDepthStencilTexture:!1,supportShadowSamplers:!1,uniformBufferHardCheckMatrix:!1,allowTexturePrefiltering:!1,trackUbosInFrame:!1,checkUbosContentBeforeUpload:!1,supportCSM:!1,basisNeedsPOT:!1,support3DTextures:!1,needTypeSuffixInShaderConstants:!1,supportMSAA:!1,supportSSAO2:!1,supportIBLShadows:!1,supportExtendedTextureFormats:!1,supportSwitchCaseInShader:!1,supportSyncTextureRead:!1,needsInvertingBitmap:!1,useUBOBindingCache:!1,needShaderCodeInlining:!1,needToAlwaysBindUniformBuffers:!1,supportRenderPasses:!0,supportSpriteInstancing:!1,forceVertexBufferStrideAndOffsetMultiple4Bytes:!1,_checkNonFloatVertexBuffersDontRecreatePipelineContext:!1},e.renderingCanvas&&(this._renderingCanvas=e.renderingCanvas),ae.Log(`Babylon.js v${s.Version} - Null engine`);let t=typeof self<`u`?self:typeof global<`u`?global:window;typeof URL>`u`&&(t.URL={createObjectURL:function(){},revokeObjectURL:function(){}}),typeof Blob>`u`&&(t.Blob=function(){})}createVertexBuffer(e){let t=new x;return t.references=1,t}createIndexBuffer(e){let t=new x;return t.references=1,t}clear(e,t,n,r=!1){}getRenderWidth(e=!1){return!e&&this._currentRenderTarget?this._currentRenderTarget.width:this._options.renderWidth}getRenderHeight(e=!1){return!e&&this._currentRenderTarget?this._currentRenderTarget.height:this._options.renderHeight}setViewport(e,t,n){this._cachedViewport=e}createUniformBuffer(e){let t=new x;return t.references=1,t.capacity=e instanceof Array?e.length*Float32Array.BYTES_PER_ELEMENT:e.byteLength,t}createDynamicUniformBuffer(e){return this.createUniformBuffer(e)}updateUniformBuffer(e,t,n,r){}bindUniformBufferBase(e,t,n){}bindUniformBlock(e,t,n){}createShaderProgram(e,t,n,r,i){return{__SPECTOR_rebuildProgram:null}}getUniforms(e,t){return[]}getAttributes(e,t){return[]}bindSamplers(e){this._currentEffect=null}enableEffect(e){e=e!==null&&le(e)?e.effect:e,this._currentEffect=e,e&&(e.onBind&&e.onBind(e),e._onBindObservable&&e._onBindObservable.notifyObservers(e))}setStateCullFaceType(e,t){}setState(e,t=0,n,r=!1,i,a,o=0){}setIntArray(e,t){return!0}setIntArray2(e,t){return!0}setIntArray3(e,t){return!0}setIntArray4(e,t){return!0}setFloatArray(e,t){return!0}setFloatArray2(e,t){return!0}setFloatArray3(e,t){return!0}setFloatArray4(e,t){return!0}setArray(e,t){return!0}setArray2(e,t){return!0}setArray3(e,t){return!0}setArray4(e,t){return!0}setMatrices(e,t){return!0}setMatrix3x3(e,t){return!0}setMatrix2x2(e,t){return!0}setFloat(e,t){return!0}setFloat2(e,t,n){return!0}setFloat3(e,t,n,r){return!0}setBool(e,t){return!0}setFloat4(e,t,n,r,i){return!0}setAlphaMode(e,t=!1,n=0){this._alphaMode[n]!==e&&(this.alphaState.setAlphaBlend(e!==0,0),t||this.setDepthWrite(e===0),this._alphaMode[n]=e)}bindBuffers(e,t,n){}wipeCaches(e){this.preventCacheWipeBetweenFrames||(this.resetTextureCache(),this._currentEffect=null,e&&(this._currentProgram=null,this._stencilStateComposer.reset(),this.depthCullingState.reset(),this.alphaState.reset()),this._cachedVertexBuffers=null,this._cachedIndexBuffer=null,this._cachedEffectForVertexBuffers=null)}draw(e,t,n,r){}drawElementsType(e,t,n,r){}drawArraysType(e,t,n,r){}_createTexture(){return{}}_releaseTexture(e){}createTexture(e,t,n,r,i=3,a=null,o=null,s=null,c=null,l=null,u=null,d){let f=new S(this,1);return f.url=String(e),f.generateMipMaps=!t,f.samplingMode=i,f.invertY=n,f.baseWidth=this._options.textureSize,f.baseHeight=this._options.textureSize,f.width=this._options.textureSize,f.height=this._options.textureSize,l&&(f.format=l),s&&(f._buffer=s),f.isReady=!0,a&&setTimeout(()=>{a(f)}),this._internalTexturesCache.push(f),f}_createHardwareRenderTargetWrapper(e,t,n){let r=new c(e,t,n,this);return this._renderTargetWrapperCache.push(r),r}createRenderTargetTexture(e,t){let n=this._createHardwareRenderTargetWrapper(!1,!1,e),r={};t!==void 0&&typeof t==`object`?(r.generateMipMaps=t.generateMipMaps,r.generateDepthBuffer=t.generateDepthBuffer===void 0||t.generateDepthBuffer,r.generateStencilBuffer=r.generateDepthBuffer&&t.generateStencilBuffer,r.type=t.type===void 0?0:t.type,r.samplingMode=t.samplingMode===void 0?3:t.samplingMode):(r.generateMipMaps=t,r.generateDepthBuffer=!0,r.generateStencilBuffer=!1,r.type=0,r.samplingMode=3);let i=new S(this,5);n.setTexture(i);let a=e.width||e,o=e.height||e;return n._generateDepthBuffer=r.generateDepthBuffer,n._generateStencilBuffer=!!r.generateStencilBuffer,i.baseWidth=a,i.baseHeight=o,i.width=a,i.height=o,i.isReady=!0,i.samples=1,i.generateMipMaps=!!r.generateMipMaps,i.samplingMode=r.samplingMode,i.type=r.type,this._internalTexturesCache.push(i),n}createMultiviewRenderTargetTexture(e,t){if(!this.getCaps().multiview)throw Error(`Multiview is not supported`);let n=this._createHardwareRenderTargetWrapper(!1,!1,{width:e,height:t}),r=new S(this,5,!0);return r.baseWidth=e,r.baseHeight=t,r.width=e,r.height=t,r.isMultiview=!0,r.isReady=!0,r.format=5,r.samples=1,n.setTextures(r),n}bindMultiviewFramebuffer(e){this.bindFramebuffer(e,void 0,void 0,void 0,!0)}createRenderTargetCubeTexture(e,t){let n=this._createHardwareRenderTargetWrapper(!1,!0,e),r={generateMipMaps:!0,generateDepthBuffer:!0,generateStencilBuffer:!1,type:0,samplingMode:3,format:5,...t};r.generateStencilBuffer=r.generateDepthBuffer&&r.generateStencilBuffer,(r.type===1&&!this._caps.textureFloatLinearFiltering||r.type===2&&!this._caps.textureHalfFloatLinearFiltering)&&(r.samplingMode=1),n._generateDepthBuffer=r.generateDepthBuffer,n._generateStencilBuffer=!!r.generateStencilBuffer;let i=new S(this,5);return i.baseWidth=e,i.baseHeight=e,i.width=e,i.height=e,i.isReady=!0,i.isCube=!0,i.samples=1,i.generateMipMaps=!!r.generateMipMaps,i.samplingMode=r.samplingMode,i.type=r.type,this._internalTexturesCache.push(i),n}updateTextureSamplingMode(e,t){t.samplingMode=e}createRawTexture(e,t,n,r,i,a,o,s=null,c=0,l=0,u=!1){let d=new S(this,3);return d.baseWidth=t,d.baseHeight=n,d.width=t,d.height=n,d.format=r,d.generateMipMaps=i,d.samplingMode=o,d.invertY=a,d._compression=s,d.type=c,d._useSRGBBuffer=u,this._doNotHandleContextLost||(d._bufferView=e),d}updateRawTexture(e,t,n,r,i=null,a=0,o=!1){e&&(e._bufferView=t,e.format=n,e.invertY=r,e._compression=i,e.type=a,e._useSRGBBuffer=o)}bindFramebuffer(e,t,n,r,i){this._currentRenderTarget&&this.unBindFramebuffer(this._currentRenderTarget),this._currentRenderTarget=e,this._currentFramebuffer=null,this._cachedViewport&&!i&&this.setViewport(this._cachedViewport,n,r)}unBindFramebuffer(e,t=!1,n){this._currentRenderTarget=null,n&&n(),this._currentFramebuffer=null}createDynamicVertexBuffer(e){let t=new x;return t.references=1,t.capacity=1,t}updateDynamicTexture(e,t,n,r=!1,i){}areAllEffectsReady(){return!0}getError(){return 0}_getUnpackAlignement(){return 1}_unpackFlipY(e){}updateDynamicIndexBuffer(e,t,n=0){}updateDynamicVertexBuffer(e,t,n,r){}_bindTextureDirectly(e,t){return this._boundTexturesCache[this._activeChannel]!==t&&(this._boundTexturesCache[this._activeChannel]=t,!0)}_bindTexture(e,t){e<0||this._bindTextureDirectly(0,t)}_deleteBuffer(e){}releaseEffects(){}displayLoadingUI(){}hideLoadingUI(){}set loadingUIText(e){}flushFramebuffer(){}_uploadCompressedDataToTextureDirectly(e,t,n,r,i,a=0,o=0){}_uploadDataToTextureDirectly(e,t,n=0,r=0){}_uploadArrayBufferViewToTexture(e,t,n=0,r=0){}_uploadImageToTexture(e,t,n=0,r=0){}}}));function Te(e,t,n,r,i){return(1-e)*(1-e)*(1-e)*t+3*(1-e)*(1-e)*e*n+3*(1-e)*e*e*r+e*e*e*i}function Ee(e,t=new m(0,1),n=new m(0,.1),r=new m(0,.1),i=new m(1300,.1)){return Te((e/i.x)**.333333,t.y,n.y,r.y,i.y)}var De=e((()=>{h()}));function I(e){return`texture`in e}function L(e){return`value`in e}function Oe(e,t){t.uOffset=e.uOffset,t.vOffset=e.vOffset,t.uScale=e.uScale,t.vScale=e.vScale,t.uAng=e.uAng,t.vAng=e.vAng,t.wAng=e.wAng,t.uRotationCenter=e.uRotationCenter,t.vRotationCenter=e.vRotationCenter}async function ke(e,t,n){let r=[t.red,t.green,t.blue,t.alpha],i=[],a=[];for(let e=0;e<4;e++){let t=r[e];if(t){if(I(t)){if(t.sourceChannel<0||t.sourceChannel>3)throw Error(`Source channel must be between 0 and 3 (R, G, B, A)`);let n=i.indexOf(t.texture);n===-1&&(n=i.length,i.push(t.texture)),a[e]=n}else if(L(t)){if(t.value<0||t.value>1)throw Error(`Constant value must be between 0.0 and 1.0`);a[e]=-1}else throw Error(`Invalid channel input configuration`)}else a[e]=-1}let o=t.outputSize;if(!o&&i.length>0){let e=0;for(let t of i){let n=t.getSize(),r=Math.max(n.width,n.height);r>e&&(e=r,o=n.width===n.height?e:n)}}o||=512;let s=[],c=new Set;for(let e=0;e<4;e++){let t=r[e],n=[`RED`,`GREEN`,`BLUE`,`ALPHA`][e];if(t&&I(t)){s.push(`${n}_FROM_TEXTURE`);let t=a[e];c.add(t)}}c.forEach(e=>{s.push(`USE_TEXTURE${e}`)});let l={type:2,format:5,samplingMode:1,generateDepthBuffer:!1,generateMipMaps:!1,shaderLanguage:+!!n.getEngine().isWebGPU,extraInitializationsAsync:async()=>{n.getEngine().isWebGPU?await Promise.all([E(()=>import(`./textureMerger.fragment-Dv4Mhp89.js`),__vite__mapDeps([0,1,2]))]):await Promise.all([E(()=>import(`./textureMerger.fragment-TrNL1-XO.js`),__vite__mapDeps([3,1,2]))])},skipSceneRegistration:!0},u=new we(e,o,R,n,l);u.refreshRate=-1,u.defines=s.length>0?`#define `+s.join(`
#define `)+`
`:``;for(let e=0;e<i.length;e++)Oe(i[e],u),u.setTexture(`inputTexture${e}`,i[e]);for(let e=0;e<4;e++){let t=r[e],n=[`red`,`green`,`blue`,`alpha`][e];if(t&&I(t)){let r=a[e];u.setInt(`${n}TextureIndex`,r),u.setInt(`${n}SourceChannel`,t.sourceChannel)}else{let r;r=t&&L(t)?t.value:+(e===3),u.setFloat(`${n}ConstantValue`,r)}}return await new Promise((e,t)=>{u.executeWhenReady(()=>{try{u.render(),e(u)}catch(e){t(e instanceof Error?e:Error(String(e)))}})})}function Ae(e,t){return{texture:e,sourceChannel:t}}function je(e){return{value:e}}function Me(e,t,n,r){return{red:e,green:t,blue:n,alpha:r}}var R,Ne=e((()=>{Ce(),T(),R=`textureMerger`})),z,B=e((()=>{v(),z=class{},z.DEFAULT_COLOR=y.White(),z.DEFAULT_WIDTH_ATTENUATED=1,z.DEFAULT_WIDTH=.1})),V,H=e((()=>{ge(),C(),h(),r(),D(),d(),B(),V=class e{static ConvertPoints(e,t){if(e.length&&Array.isArray(e)&&typeof e[0]==`number`)return[e];if(e.length&&Array.isArray(e[0])&&typeof e[0][0]==`number`)return e;if(e.length&&!Array.isArray(e[0])&&e[0]instanceof _){let t=[];for(let n=0;n<e.length;n++){let r=e[n];t.push(r.x,r.y,r.z)}return[t]}if(e.length>0&&Array.isArray(e[0])&&e[0].length>0&&e[0][0]instanceof _){let t=[],n=e;for(let e of n)t.push(e.flatMap(e=>[e.x,e.y,e.z]));return t}if(e instanceof Float32Array){if(t?.floatArrayStride){let n=[],r=t.floatArrayStride*3;for(let t=0;t<e.length;t+=r){let i=Array(r);for(let n=0;n<r;n++)i[n]=e[t+n];n.push(i)}return n}return[Array.from(e)]}if(e.length&&e[0]instanceof Float32Array){let t=[];for(let n of e)t.push(Array.from(n));return t}return[]}static OmitZeroLengthPredicate(e,t,n){let r=[];return t.subtract(e).lengthSquared()>0&&r.push([e,t]),n.subtract(t).lengthSquared()>0&&r.push([t,n]),e.subtract(n).lengthSquared()>0&&r.push([n,e]),r.length===0?null:r}static OmitDuplicatesPredicate(t,n,r,i){let a=[];return e._SearchInPoints(t,n,i)||a.push([t,n]),e._SearchInPoints(n,r,i)||a.push([n,r]),e._SearchInPoints(r,t,i)||a.push([r,t]),a.length===0?null:a}static _SearchInPoints(e,t,n){for(let r of n)for(let n=0;n<r.length;n++)if(r[n]?.equals(e)&&(r[n+1]?.equals(t)||r[n-1]?.equals(t)))return!0;return!1}static MeshesToLines(e,t){let n=[];for(let r=0;r<e.length;r++){let i=e[r],a=i.getVerticesData(me.PositionKind),o=i.getIndices();if(a&&o)for(let e=0,s=0;e<o.length;e++){let c=o[s++]*3,l=o[s++]*3,u=o[s++]*3,d=new _(a[c],a[c+1],a[c+2]),f=new _(a[l],a[l+1],a[l+2]),p=new _(a[u],a[u+1],a[u+2]);if(t){let s=t(d,f,p,n,e,c,i,r,a,o);if(s)for(let e of s)n.push(e)}else n.push([d,f],[f,p],[p,d])}}return n}static ToVector3Array(e){if(Array.isArray(e[0])){let t=[],n=e;for(let e of n){let n=[];for(let t=0;t<e.length;t+=3)n.push(new _(e[t],e[t+1],e[t+2]));t.push(n)}return t}let t=e,n=[];for(let e=0;e<t.length;e+=3)n.push(new _(t[e],t[e+1],t[e+2]));return n}static ToNumberArray(e){return e.flatMap(e=>[e.x,e.y,e.z])}static GetPointsCountInfo(e){let t=Array(e.length),n=0;for(let r=e.length;r--;)t[r]=e[r].length/3,n+=t[r];return{total:n,counts:t}}static GetLineLength(t){if(t.length===0)return 0;let n;n=typeof t[0]==`number`?e.ToVector3Array(t):t;let r=g.Vector3[0],i=0;for(let e=0;e<n.length-1;e++){let t=n[e],a=n[e+1];i+=a.subtractToRef(t,r).length()}return i}static GetLineLengthArray(e,t){let n=t?new Float32Array(t,0,e.length/3):new Float32Array(e.length/3),r=0;for(let t=0,i=e.length/3-1;t<i;t++){let i=e[t*3+0],a=e[t*3+1],o=e[t*3+2];i-=e[t*3+3],a-=e[t*3+4],o-=e[t*3+5];let s=Math.sqrt(i*i+a*a+o*o);r+=s,n[t+1]=r}return n}static SegmentizeSegmentByCount(e,t,n){let r=[],i=t.subtract(e),a=g.Vector3[0];a.setAll(n);let o=g.Vector3[1];i.divideToRef(a,o);let s=e.clone();r.push(s);for(let e=0;e<n;e++)s=s.clone(),r.push(s.addInPlace(o));return r}static SegmentizeLineBySegmentLength(t,n){let r=t[0]instanceof _?e.GetLineSegments(t):typeof t[0]==`number`?e.GetLineSegments(e.ToVector3Array(t)):t,i=[];for(let t of r)if(t.length>n){let r=e.SegmentizeSegmentByCount(t.point1,t.point2,Math.ceil(t.length/n));for(let e of r)i.push(e)}else i.push(t.point1),i.push(t.point2);return i}static SegmentizeLineBySegmentCount(t,n){let r=typeof t[0]==`number`?e.ToVector3Array(t):t,i=e.GetLineLength(r)/n;return e.SegmentizeLineBySegmentLength(r,i)}static GetLineSegments(e){let t=[];for(let n=0;n<e.length-1;n++){let r=e[n],i=e[n+1],a=i.subtract(r).length();t.push({point1:r,point2:i,length:a})}return t}static GetMinMaxSegmentLength(t){let n=e.GetLineSegments(t).sort(e=>e.length);return{min:n[0].length,max:n[n.length-1].length}}static GetPositionOnLineByVisibility(e,t,n,r=!1){let i=t*n,a=0,o=0,s=e.length;for(let t=0;t<s;t++){if(i<=a+e[t].length){o=t;break}a+=e[t].length}let c=(i-a)/e[o].length;return e[o].point2.subtractToRef(e[o].point1,g.Vector3[0]),g.Vector3[0].scaleToRef(c,g.Vector3[1]),r||g.Vector3[1].addInPlace(e[o].point1),g.Vector3[1].clone()}static GetCircleLinePoints(e,t,n=0,r=e,i=Math.PI*2/t){let a=[];for(let o=0;o<=t;o++)a.push(new _(Math.cos(o*i)*e,Math.sin(o*i)*r,n));return a}static GetBezierLinePoints(e,t,n,r){return _e.CreateQuadraticBezier(e,t,n,r).getPoints().flatMap(e=>[e.x,e.y,e.z])}static GetArrowCap(e,t,n,r,i,a=0,o=0){return{points:[e.clone(),e.add(t.multiplyByFloats(n,n,n))],widths:[r,i,a,o]}}static GetPointsFromText(e,n,r,i,a=0,o=!0){let s=[],c=t(e,n,r,i);for(let e of c){for(let t of e.paths){let e=[],n=t.getPoints();for(let t of n)e.push(t.x,t.y,a);s.push(e)}if(o)for(let t of e.holes){let e=[],n=t.getPoints();for(let t of n)e.push(t.x,t.y,a);s.push(e)}}return s}static Color3toRGBAUint8(e){let t=new Uint8Array(e.length*4);for(let n=0,r=0;n<e.length;n++)t[r++]=e[n].r*255,t[r++]=e[n].g*255,t[r++]=e[n].b*255,t[r++]=255;return t}static CreateColorsTexture(t,n,r,i){let a=i.getEngine().getCaps().maxTextureSize??1,o=n.length>a?a:n.length,c=Math.ceil(n.length/a);c>1&&(n=[...n,...Array(o*c-n.length).fill(n[0])]);let l=e.Color3toRGBAUint8(n),u=new O(l,o,c,s.TEXTUREFORMAT_RGBA,i,!1,!0,r);return u.name=t,u}static PrepareEmptyColorsTexture(e){return z.EmptyColorsTexture||(z.EmptyColorsTexture=new O(new Uint8Array(4),1,1,s.TEXTUREFORMAT_RGBA,e,!1,!1,O.NEAREST_NEAREST),z.EmptyColorsTexture.name=`grlEmptyColorsTexture`,z.EmptyColorsTexture.onDisposeObservable.addOnce(()=>{z.EmptyColorsTexture=null})),z.EmptyColorsTexture}static DisposeEmptyColorsTexture(){z.EmptyColorsTexture?.dispose(),z.EmptyColorsTexture=null}static BooleanToNumber(e){return+!!e}}}));function Pe(e,t){if(e===`vertex`){let e={CUSTOM_VERTEX_DEFINITIONS:`
                attribute float grl_widths;
                #ifdef GREASED_LINE_USE_OFFSETS
                    attribute vec3 grl_offsets;
                #endif
                attribute float grl_colorPointers;
                varying float grlCounters;
                varying float grlColorPointer;

                #ifdef GREASED_LINE_CAMERA_FACING
                    attribute vec4 grl_previousAndSide;
                    attribute vec4 grl_nextAndCounters;

                    vec2 grlFix( vec4 i, float aspect ) {
                        vec2 res = i.xy / i.w;
                        res.x *= aspect;
                        return res;
                    }
                #else
                    attribute vec3 grl_slopes;
                    attribute float grl_counters;
                #endif
                `,CUSTOM_VERTEX_UPDATE_POSITION:`
                #ifdef GREASED_LINE_USE_OFFSETS
                    vec3 grlPositionOffset = grl_offsets;
                #else
                    vec3 grlPositionOffset = vec3(0.);
                #endif

                #ifdef GREASED_LINE_CAMERA_FACING
                    positionUpdated += grlPositionOffset;
                #else
                    positionUpdated = (positionUpdated + grlPositionOffset) + (grl_slopes * grl_widths);
                #endif
                `,CUSTOM_VERTEX_MAIN_END:`
                grlColorPointer = grl_colorPointers;

                #ifdef GREASED_LINE_CAMERA_FACING

                    float grlAspect = grl_aspect_resolution_lineWidth.x;
                    float grlBaseWidth = grl_aspect_resolution_lineWidth.w;

                    vec3 grlPrevious = grl_previousAndSide.xyz;
                    float grlSide = grl_previousAndSide.w;

                    vec3 grlNext = grl_nextAndCounters.xyz;
                    grlCounters = grl_nextAndCounters.w;
                    float grlWidth = grlBaseWidth * grl_widths;
                    
                    vec3 worldDir = normalize(grlNext - grlPrevious);
                    vec3 nearPosition = positionUpdated + (worldDir * 0.01);
                    mat4 grlMatrix = viewProjection * finalWorld;
                    vec4 grlFinalPosition = grlMatrix * vec4(positionUpdated , 1.0);
                    vec4 screenNearPos = grlMatrix * vec4(nearPosition, 1.0);
                    vec2 grlLinePosition = grlFix(grlFinalPosition, grlAspect);
                    vec2 grlLineNearPosition = grlFix(screenNearPos, grlAspect);
                    vec2 grlDir = normalize(grlLineNearPosition - grlLinePosition);

                    vec4 grlNormal = vec4(-grlDir.y, grlDir.x, 0., 1.);

                    #ifdef GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM
                        grlNormal.xy *= -.5 * grlWidth;
                    #else
                        grlNormal.xy *= .5 * grlWidth;
                    #endif

                    grlNormal *= grl_projection;

                    #ifdef GREASED_LINE_SIZE_ATTENUATION
                        grlNormal.xy *= grlFinalPosition.w;
                        grlNormal.xy /= (vec4(grl_aspect_resolution_lineWidth.yz, 0., 1.) * grl_projection).xy;
                    #endif

                    grlFinalPosition.xy += grlNormal.xy * grlSide;
                    gl_Position = grlFinalPosition;

                    vPositionW = vec3(grlFinalPosition);
                #else
                    grlCounters = grl_counters;
                #endif
                `};return t&&(e[`!gl_Position\\=viewProjection\\*worldPos;`]=`//`),e}return e===`fragment`?{CUSTOM_FRAGMENT_DEFINITIONS:`
                    #ifdef PBR
                         #define grlFinalColor finalColor
                    #else
                         #define grlFinalColor color
                    #endif

                    varying float grlCounters;
                    varying float grlColorPointer;
                    uniform sampler2D grl_colors;
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
                    float grlColorMode = grl_colorMode_visibility_colorsWidth_useColors.x;
                    float grlVisibility = grl_colorMode_visibility_colorsWidth_useColors.y;
                    float grlColorsWidth = grl_colorMode_visibility_colorsWidth_useColors.z;
                    float grlUseColors = grl_colorMode_visibility_colorsWidth_useColors.w;

                    float grlUseDash = grl_dashOptions.x;
                    float grlDashArray = grl_dashOptions.y;
                    float grlDashOffset = grl_dashOptions.z;
                    float grlDashRatio = grl_dashOptions.w;

                    grlFinalColor.a *= step(grlCounters, grlVisibility);
                    if(grlFinalColor.a == 0.) discard;

                    if(grlUseDash == 1.){
                        grlFinalColor.a *= ceil(mod(grlCounters + grlDashOffset, grlDashArray) - (grlDashArray * grlDashRatio));
                        if (grlFinalColor.a == 0.) discard;
                    }

                    #ifdef GREASED_LINE_HAS_COLOR
                        if (grlColorMode == 0.) {
                            grlFinalColor.rgb = grl_singleColor;
                        } else if (grlColorMode == 1.) {
                            grlFinalColor.rgb += grl_singleColor;
                        } else if (grlColorMode == 2.) {
                            grlFinalColor.rgb *= grl_singleColor;
                        }
                    #else
                        if (grlUseColors == 1.) {
                            #ifdef GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE
                                vec4 grlColor = texture2D(grl_colors, vec2(grlCounters, 0.), 0.);
                            #else
                                vec2 lookup = vec2(fract(grlColorPointer / grl_textureSize.x), 1.0 - floor(grlColorPointer / grl_textureSize.x) / max(grl_textureSize.y - 1.0, 1.0));
                                vec4 grlColor = texture2D(grl_colors, lookup, 0.0);
                            #endif
                            if (grlColorMode == 0.) {
                                grlFinalColor = grlColor;
                            } else if (grlColorMode == 1.) {
                                grlFinalColor += grlColor;
                            } else if (grlColorMode == 2.) {
                                grlFinalColor *= grlColor;
                            }
                        }
                    #endif
                `}:null}var Fe=e((()=>{}));function Ie(e,t){if(e===`vertex`){let e={CUSTOM_VERTEX_DEFINITIONS:`
                attribute grl_widths: f32;
                attribute grl_colorPointers: f32;
                varying grlCounters: f32;
                varying grlColorPointer: f32;

                #ifdef GREASED_LINE_USE_OFFSETS
                    attribute grl_offsets: vec3f;   
                #endif

                #ifdef GREASED_LINE_CAMERA_FACING
                    attribute grl_previousAndSide : vec4f;
                    attribute grl_nextAndCounters : vec4f;

                    fn grlFix(i: vec4f, aspect: f32) -> vec2f {
                        var res = i.xy / i.w;
                        res.x *= aspect;
                        return res;
                    }
                #else
                    attribute grl_slopes: f32;
                    attribute grl_counters: f32;
                #endif


                `,CUSTOM_VERTEX_UPDATE_POSITION:`
                #ifdef GREASED_LINE_USE_OFFSETS
                    var grlPositionOffset: vec3f = input.grl_offsets;
                #else
                    var grlPositionOffset = vec3f(0.);
                #endif

                #ifdef GREASED_LINE_CAMERA_FACING
                    positionUpdated += grlPositionOffset;
                #else
                    positionUpdated = (positionUpdated + grlPositionOffset) + (input.grl_slopes * input.grl_widths);
                #endif
                `,CUSTOM_VERTEX_MAIN_END:`
                vertexOutputs.grlColorPointer = input.grl_colorPointers;

                #ifdef GREASED_LINE_CAMERA_FACING

                    let grlAspect: f32 = uniforms.grl_aspect_resolution_lineWidth.x;
                    let grlBaseWidth: f32 = uniforms.grl_aspect_resolution_lineWidth.w;

                    let grlPrevious: vec3f = input.grl_previousAndSide.xyz;
                    let grlSide: f32 = input.grl_previousAndSide.w;

                    let grlNext: vec3f = input.grl_nextAndCounters.xyz;
                    vertexOutputs.grlCounters = input.grl_nextAndCounters.w;

                    let grlWidth: f32 = grlBaseWidth * input.grl_widths;

                    let worldDir: vec3f = normalize(grlNext - grlPrevious);
                    let nearPosition: vec3f = positionUpdated + (worldDir * 0.01);
                    let grlMatrix: mat4x4f = uniforms.viewProjection * finalWorld;
                    let grlFinalPosition: vec4f = grlMatrix * vec4f(positionUpdated, 1.0); 
                    let screenNearPos: vec4f = grlMatrix * vec4(nearPosition, 1.0);
                    let grlLinePosition: vec2f = grlFix(grlFinalPosition, grlAspect);
                    let grlLineNearPosition: vec2f = grlFix(screenNearPos, grlAspect);
                    let grlDir: vec2f = normalize(grlLineNearPosition - grlLinePosition);

                    var grlNormal: vec4f = vec4f(-grlDir.y, grlDir.x, 0.0, 1.0);

                    let grlHalfWidth: f32 = 0.5 * grlWidth;
                    #if defined(GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM)
                        grlNormal.x *= -grlHalfWidth;
                        grlNormal.y *= -grlHalfWidth;
                    #else
                        grlNormal.x *= grlHalfWidth;
                        grlNormal.y *= grlHalfWidth;
                    #endif

                    grlNormal *= uniforms.grl_projection;

                    #if defined(GREASED_LINE_SIZE_ATTENUATION)
                        grlNormal.x *= grlFinalPosition.w;
                        grlNormal.y *= grlFinalPosition.w;

                        let pr = vec4f(uniforms.grl_aspect_resolution_lineWidth.yz, 0.0, 1.0) * uniforms.grl_projection;
                        grlNormal.x /= pr.x;
                        grlNormal.y /= pr.y;
                    #endif

                    vertexOutputs.position = vec4f(grlFinalPosition.xy + grlNormal.xy * grlSide, grlFinalPosition.z, grlFinalPosition.w);
                    vertexOutputs.vPositionW = vertexOutputs.position.xyz;
                
                #else
                    vertexOutputs.grlCounters = input.grl_counters;
                #endif
                `};return t&&(e[`!vertexOutputs\\.position\\s=\\sscene\\.viewProjection\\s\\*\\sworldPos;`]=`//`),e}return e===`fragment`?{CUSTOM_FRAGMENT_DEFINITIONS:`
                    #ifdef PBR
                         #define grlFinalColor finalColor
                    #else
                         #define grlFinalColor color
                    #endif

                    varying grlCounters: f32;
                    varying grlColorPointer: 32;

                    var grl_colors: texture_2d<f32>;
                    var grl_colorsSampler: sampler;
                `,CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR:`
                    let grlColorMode: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.x;
                    let grlVisibility: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.y;
                    let grlColorsWidth: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.z;
                    let grlUseColors: f32 = uniforms.grl_colorMode_visibility_colorsWidth_useColors.w;

                    let grlUseDash: f32 = uniforms.grl_dashOptions.x;
                    let grlDashArray: f32 = uniforms.grl_dashOptions.y;
                    let grlDashOffset: f32 = uniforms.grl_dashOptions.z;
                    let grlDashRatio: f32 = uniforms.grl_dashOptions.w;

                    grlFinalColor.a *= step(fragmentInputs.grlCounters, grlVisibility);
                    if (grlFinalColor.a == 0.0) {
                        discard;
                    }

                    if (grlUseDash == 1.0) {
                        let dashPosition = (fragmentInputs.grlCounters + grlDashOffset) % grlDashArray;
                        grlFinalColor.a *= ceil(dashPosition - (grlDashArray * grlDashRatio));

                        if (grlFinalColor.a == 0.0) {
                            discard;
                        }
                    }

                    #ifdef GREASED_LINE_HAS_COLOR
                        if (grlColorMode == 0.) {
                            grlFinalColor = vec4f(uniforms.grl_singleColor, grlFinalColor.a);
                        } else if (grlColorMode == 1.) {
                            grlFinalColor += vec4f(uniforms.grl_singleColor, grlFinalColor.a);
                        } else if (grlColorMode == 2.) {
                            grlFinalColor *= vec4f(uniforms.grl_singleColor, grlFinalColor.a);
                        }
                    #else
                        if (grlUseColors == 1.) {
                            #ifdef GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE
                                let grlColor: vec4f = textureSample(grl_colors, grl_colorsSampler, vec2f(fragmentInputs.grlCounters, 0.));
                            #else
                                let lookup: vec2f = vec2(fract(fragmentInputs.grlColorPointer / uniforms.grl_textureSize.x), 1.0 - floor(fragmentInputs.grlColorPointer / uniforms.grl_textureSize.x) / max(uniforms.grl_textureSize.y - 1.0, 1.0));
                                let grlColor: vec4f = textureSample(grl_colors, grl_colorsSampler, lookup);
                            #endif
                            if (grlColorMode == 0.) {
                                grlFinalColor = grlColor;
                            } else if (grlColorMode == 1.) {
                                grlFinalColor += grlColor;
                            } else if (grlColorMode == 2.) {
                                grlFinalColor *= grlColor;
                            }
                        }
                    #endif


                `}:null}var Le=e((()=>{}));function Re(){G||(G=!0,ie(`BABYLON.${W.GREASED_LINE_MATERIAL_NAME}`,W))}var U,W,G,K=e((()=>{D(),n(),h(),u(),B(),H(),Fe(),Le(),re(),U=class extends p{constructor(){super(...arguments),this.GREASED_LINE_HAS_COLOR=!1,this.GREASED_LINE_SIZE_ATTENUATION=!1,this.GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE=!1,this.GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM=!1,this.GREASED_LINE_CAMERA_FACING=!0,this.GREASED_LINE_USE_OFFSETS=!1}},W=class e extends i{isCompatible(e){return!0}constructor(t,n,r){r||={color:z.DEFAULT_COLOR};let i=new U;i.GREASED_LINE_HAS_COLOR=!!r.color&&!r.useColors,i.GREASED_LINE_SIZE_ATTENUATION=r.sizeAttenuation??!1,i.GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE=r.colorDistributionType===1,i.GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM=(n??t.getScene()).useRightHandedSystem,i.GREASED_LINE_CAMERA_FACING=r.cameraFacing??!0,super(t,e.GREASED_LINE_MATERIAL_NAME,200,i,!0,!0),this.colorsTexture=null,this._forceGLSL=!1,this._forceGLSL=r?.forceGLSL||e.ForceGLSL,this._scene=n??t.getScene(),this._engine=this._scene.getEngine(),this._cameraFacing=r.cameraFacing??!0,this.visibility=r.visibility??1,this.useDash=r.useDash??!1,this.dashRatio=r.dashRatio??.5,this.dashOffset=r.dashOffset??0,this.width=r.width?r.width:r.sizeAttenuation?z.DEFAULT_WIDTH_ATTENUATED:z.DEFAULT_WIDTH,this._sizeAttenuation=r.sizeAttenuation??!1,this.colorMode=r.colorMode??0,this._color=r.color??null,this.useColors=r.useColors??!1,this._colorsDistributionType=r.colorDistributionType??0,this.colorsSampling=r.colorsSampling??O.NEAREST_NEAREST,this._colors=r.colors??null,this.dashCount=r.dashCount??1,this.resolution=r.resolution??new m(this._engine.getRenderWidth(),this._engine.getRenderHeight()),r.colorsTexture?this.colorsTexture=r.colorsTexture:this._colors?this.colorsTexture=V.CreateColorsTexture(`${t.name}-colors-texture`,this._colors,this.colorsSampling,this._scene):(this._color=this._color??z.DEFAULT_COLOR,V.PrepareEmptyColorsTexture(this._scene)),this._engine.onDisposeObservable.add(()=>{V.DisposeEmptyColorsTexture()})}getAttributes(e){e.push(`grl_offsets`),e.push(`grl_widths`),e.push(`grl_colorPointers`),e.push(`grl_counters`),this._cameraFacing?(e.push(`grl_previousAndSide`),e.push(`grl_nextAndCounters`)):e.push(`grl_slopes`)}getSamplers(e){e.push(`grl_colors`)}getActiveTextures(e){this.colorsTexture&&e.push(this.colorsTexture)}getUniforms(e=0){let t=[{name:`grl_singleColor`,size:3,type:`vec3`},{name:`grl_textureSize`,size:2,type:`vec2`},{name:`grl_dashOptions`,size:4,type:`vec4`},{name:`grl_colorMode_visibility_colorsWidth_useColors`,size:4,type:`vec4`}];return this._cameraFacing&&t.push({name:`grl_projection`,size:16,type:`mat4`},{name:`grl_aspect_resolution_lineWidth`,size:4,type:`vec4`}),e===1&&t.push({name:`viewProjection`,size:16,type:`mat4`}),{ubo:t,vertex:this._cameraFacing&&this._isGLSL(e)?`
                    uniform vec4 grl_aspect_resolution_lineWidth;
                    uniform mat4 grl_projection;
    `:``,fragment:this._isGLSL(e)?`
                    uniform vec4 grl_dashOptions;
                    uniform vec2 grl_textureSize;
                    uniform vec4 grl_colorMode_visibility_colorsWidth_useColors;
                    uniform vec3 grl_singleColor;
    `:``}}get isEnabled(){return!0}bindForSubMesh(e){if(this._cameraFacing){e.updateMatrix(`grl_projection`,this._scene.getProjectionMatrix()),this._isGLSL(this._material.shaderLanguage)||e.updateMatrix(`viewProjection`,this._scene.getTransformMatrix());let t=g.Vector4[0];t.x=this._aspect,t.y=this._resolution.x,t.z=this._resolution.y,t.w=this.width,e.updateVector4(`grl_aspect_resolution_lineWidth`,t)}let t=g.Vector4[0];t.x=V.BooleanToNumber(this.useDash),t.y=this._dashArray,t.z=this.dashOffset,t.w=this.dashRatio,e.updateVector4(`grl_dashOptions`,t);let n=g.Vector4[1];n.x=this.colorMode,n.y=this.visibility,n.z=this.colorsTexture?this.colorsTexture.getSize().width:0,n.w=V.BooleanToNumber(this.useColors),e.updateVector4(`grl_colorMode_visibility_colorsWidth_useColors`,n),this._color&&e.updateColor3(`grl_singleColor`,this._color);let r=this.colorsTexture??z.EmptyColorsTexture;e.setTexture(`grl_colors`,r),e.updateFloat2(`grl_textureSize`,r?.getSize().width??1,r?.getSize().height??1)}prepareDefines(e,t,n){e.GREASED_LINE_HAS_COLOR=!!this.color&&!this.useColors,e.GREASED_LINE_SIZE_ATTENUATION=this._sizeAttenuation,e.GREASED_LINE_COLOR_DISTRIBUTION_TYPE_LINE=this._colorsDistributionType===1,e.GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM=t.useRightHandedSystem,e.GREASED_LINE_CAMERA_FACING=this._cameraFacing,e.GREASED_LINE_USE_OFFSETS=!!n.offsets}getClassName(){return e.GREASED_LINE_MATERIAL_NAME}getCustomCode(e,t=0){return this._isGLSL(t)?Pe(e,this._cameraFacing):Ie(e,this._cameraFacing)}dispose(){this.colorsTexture?.dispose(),super.dispose()}get colors(){return this._colors}set colors(e){this.setColors(e)}setColors(e,t=!1,n=!1){let r=this._colors?.length??0;if(this._colors=e,e===null||e.length===0){this.colorsTexture?.dispose();return}if(!t||n){if(this.colorsTexture&&r===e.length&&!n){let t=V.Color3toRGBAUint8(e);this.colorsTexture.update(t)}else this.colorsTexture?.dispose(),this.colorsTexture=V.CreateColorsTexture(`${this._material.name}-colors-texture`,e,this.colorsSampling,this._scene)}}updateLazy(){this._colors&&this.setColors(this._colors,!1,!0)}get dashCount(){return this._dashCount}set dashCount(e){this._dashCount=e,this._dashArray=1/e}get sizeAttenuation(){return this._sizeAttenuation}set sizeAttenuation(e){this._sizeAttenuation=e,this.markAllDefinesAsDirty()}get color(){return this._color}set color(e){this.setColor(e)}setColor(e,t=!1){this._color===null&&e!==null||this._color!==null&&e===null?(this._color=e,t||this.markAllDefinesAsDirty()):this._color=e}get colorsDistributionType(){return this._colorsDistributionType}set colorsDistributionType(e){this._colorsDistributionType=e,this.markAllDefinesAsDirty()}get resolution(){return this._resolution}set resolution(e){this._aspect=e.x/e.y,this._resolution=e}serialize(){let e=super.serialize(),t={colorDistributionType:this._colorsDistributionType,colorsSampling:this.colorsSampling,colorMode:this.colorMode,dashCount:this._dashCount,dashOffset:this.dashOffset,dashRatio:this.dashRatio,resolution:this._resolution,sizeAttenuation:this._sizeAttenuation,useColors:this.useColors,useDash:this.useDash,visibility:this.visibility,width:this.width};return this._colors&&(t.colors=this._colors),this._color&&(t.color=this._color),e.greasedLineMaterialOptions=t,e}parse(e,t,n){super.parse(e,t,n);let r=e.greasedLineMaterialOptions;this.colorsTexture?.dispose(),r.color&&this.setColor(r.color,!0),r.colorDistributionType&&(this.colorsDistributionType=r.colorDistributionType),r.colors&&(this.colors=r.colors),r.colorsSampling&&(this.colorsSampling=r.colorsSampling),r.colorMode&&(this.colorMode=r.colorMode),r.useColors&&(this.useColors=r.useColors),r.visibility&&(this.visibility=r.visibility),r.useDash&&(this.useDash=r.useDash),r.dashCount&&(this.dashCount=r.dashCount),r.dashRatio&&(this.dashRatio=r.dashRatio),r.dashOffset&&(this.dashOffset=r.dashOffset),r.width&&(this.width=r.width),r.sizeAttenuation&&(this.sizeAttenuation=r.sizeAttenuation),r.resolution&&(this.resolution=r.resolution),this.colors?this.colorsTexture=V.CreateColorsTexture(`${this._material.name}-colors-texture`,this.colors,this.colorsSampling,t):V.PrepareEmptyColorsTexture(t),this.markAllDefinesAsDirty()}copyTo(e){let t=e;t.colorsTexture?.dispose(),this._colors&&(t.colorsTexture=V.CreateColorsTexture(`${t._material.name}-colors-texture`,this._colors,t.colorsSampling,this._scene)),t.setColor(this.color,!0),t.colorsDistributionType=this.colorsDistributionType,t.colorsSampling=this.colorsSampling,t.colorMode=this.colorMode,t.useColors=this.useColors,t.visibility=this.visibility,t.useDash=this.useDash,t.dashCount=this.dashCount,t.dashRatio=this.dashRatio,t.dashOffset=this.dashOffset,t.width=this.width,t.sizeAttenuation=this.sizeAttenuation,t.resolution=this.resolution,t.markAllDefinesAsDirty()}_isGLSL(e){return e===0||this._forceGLSL}},W.GREASED_LINE_MATERIAL_NAME=`GreasedLinePluginMaterial`,W.ForceGLSL=!1,G=!1})),q,J,Y=e((()=>{D(),ee(),v(),h(),de(),H(),B(),T(),q=`GREASED_LINE_USE_OFFSETS`,J=class e extends o{constructor(t,n,r){let i=n.getEngine(),a=i.isWebGPU&&!(r.forceGLSL||e.ForceGLSL),o=[`COLOR_DISTRIBUTION_TYPE_LINE 1.`,`COLOR_DISTRIBUTION_TYPE_SEGMENT 0.`,`COLOR_MODE_SET 0.`,`COLOR_MODE_ADD 1.`,`COLOR_MODE_MULTIPLY 2.`];n.useRightHandedSystem&&o.push(`GREASED_LINE_RIGHT_HANDED_COORDINATE_SYSTEM`);let s=[`position`,`grl_widths`,`grl_offsets`,`grl_colorPointers`];r.cameraFacing?(o.push(`GREASED_LINE_CAMERA_FACING`),s.push(`grl_previousAndSide`,`grl_nextAndCounters`)):(s.push(`grl_slopes`),s.push(`grl_counters`));let c=[`grlColorsWidth`,`grlUseColors`,`grlWidth`,`grlColor`,`grl_colorModeAndColorDistributionType`,`grlResolution`,`grlAspect`,`grlAizeAttenuation`,`grlDashArray`,`grlDashOffset`,`grlDashRatio`,`grlUseDash`,`grlVisibility`,`grlColors`];if(a||c.push(`world`,`viewProjection`,`view`,`projection`),super(t,n,{vertex:`greasedLine`,fragment:`greasedLine`},{uniformBuffers:a?[`Scene`,`Mesh`]:void 0,attributes:s,uniforms:c,samplers:a?[]:[`grlColors`],defines:o,extraInitializationsAsync:async()=>{a?await Promise.all([E(()=>import(`./greasedLine.vertex-Nl6PtxLC.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([4,1,2,5,6,7,8])),E(()=>import(`./greasedLine.fragment-Bll41gv5.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([9,1,2]))]):await Promise.all([E(()=>import(`./greasedLine.vertex-Def_a7Tx.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([10,1,2,11,12])),E(()=>import(`./greasedLine.fragment-BXSz7HUE.js`).then(e=>(e.r(),e.n)),__vite__mapDeps([13,1,2]))])},shaderLanguage:+!!a}),this._color=y.White(),this._colorsDistributionType=0,this._colorsTexture=null,r||={color:z.DEFAULT_COLOR},this.visibility=r.visibility??1,this.useDash=r.useDash??!1,this.dashRatio=r.dashRatio??.5,this.dashOffset=r.dashOffset??0,this.dashCount=r.dashCount??1,this.width=r.width?r.width:r.sizeAttenuation&&r.cameraFacing?z.DEFAULT_WIDTH_ATTENUATED:z.DEFAULT_WIDTH,this.sizeAttenuation=r.sizeAttenuation??!1,this.color=r.color??y.White(),this.useColors=r.useColors??!1,this.colorsDistributionType=r.colorDistributionType??0,this.colorsSampling=r.colorsSampling??O.NEAREST_NEAREST,this.colorMode=r.colorMode??0,this._colors=r.colors??null,this._cameraFacing=r.cameraFacing??!0,this.resolution=r.resolution??new m(i.getRenderWidth(),i.getRenderHeight()),r.colorsTexture?this.colorsTexture=r.colorsTexture:this._colors?this.colorsTexture=V.CreateColorsTexture(`${this.name}-colors-texture`,this._colors,this.colorsSampling,n):(this._color=this._color??z.DEFAULT_COLOR,this.colorsTexture=V.PrepareEmptyColorsTexture(n)),a){let e=new fe;e.setParameters(),e.samplingMode=this.colorsSampling,this.setTextureSampler(`grlColorsSampler`,e)}i.onDisposeObservable.add(()=>{V.DisposeEmptyColorsTexture()})}dispose(){this._colorsTexture&&this._colorsTexture!==z.EmptyColorsTexture&&this._colorsTexture.dispose(),super.dispose()}_setColorModeAndColorDistributionType(){this.setVector2(`grl_colorModeAndColorDistributionType`,new m(this._colorMode,this._colorsDistributionType))}updateLazy(){this._colors&&this.setColors(this._colors,!1,!0)}get colors(){return this._colors}set colors(e){this.setColors(e)}setColors(e,t=!1,n=!1){let r=this._colors?.length??0;if(this._colors=e,e===null||e.length===0){this._colorsTexture&&this._colorsTexture!==z.EmptyColorsTexture&&this._colorsTexture.dispose();let e=this.getScene();e&&(this.colorsTexture=V.PrepareEmptyColorsTexture(e));return}if(!t||n){if(this._colorsTexture&&r===e.length&&!n){let t=V.Color3toRGBAUint8(e);this._colorsTexture.update(t)}else this._colorsTexture&&this._colorsTexture!==z.EmptyColorsTexture&&this._colorsTexture.dispose(),this.colorsTexture=V.CreateColorsTexture(`${this.name}-colors-texture`,e,this.colorsSampling,this.getScene())}}get colorsTexture(){return this._colorsTexture??null}set colorsTexture(e){this._colorsTexture=e,this.setFloat(`grlColorsWidth`,this._colorsTexture.getSize().width),this.setTexture(`grlColors`,this._colorsTexture)}get width(){return this._width}set width(e){this._width=e,this.setFloat(`grlWidth`,e)}get useColors(){return this._useColors}set useColors(e){this._useColors=e,this.setFloat(`grlUseColors`,V.BooleanToNumber(e))}get colorsSampling(){return this._colorsSampling}set colorsSampling(e){this._colorsSampling=e}get visibility(){return this._visibility}set visibility(e){this._visibility=e,this.setFloat(`grlVisibility`,e)}get useDash(){return this._useDash}set useDash(e){this._useDash=e,this.setFloat(`grlUseDash`,V.BooleanToNumber(e))}get dashOffset(){return this._dashOffset}set dashOffset(e){this._dashOffset=e,this.setFloat(`grlDashOffset`,e)}get dashRatio(){return this._dashRatio}set dashRatio(e){this._dashRatio=e,this.setFloat(`grlDashRatio`,e)}get dashCount(){return this._dashCount}set dashCount(e){this._dashCount=e,this._dashArray=1/e,this.setFloat(`grlDashArray`,this._dashArray)}get sizeAttenuation(){return this._sizeAttenuation}set sizeAttenuation(e){this._sizeAttenuation=e,this.setFloat(`grlSizeAttenuation`,V.BooleanToNumber(e))}get color(){return this._color}set color(e){this.setColor(e)}setColor(e){e??=z.DEFAULT_COLOR,this._color=e,this.setColor3(`grlColor`,e)}get colorsDistributionType(){return this._colorsDistributionType}set colorsDistributionType(e){this._colorsDistributionType=e,this._setColorModeAndColorDistributionType()}get colorMode(){return this._colorMode}set colorMode(e){this._colorMode=e,this._setColorModeAndColorDistributionType()}get resolution(){return this._resolution}set resolution(e){this._resolution=e,this.setVector2(`grlResolution`,e),this.setFloat(`grlAspect`,e.x/e.y)}serialize(){let e=super.serialize(),t={colorDistributionType:this._colorsDistributionType,colorsSampling:this._colorsSampling,colorMode:this._colorMode,color:this._color,dashCount:this._dashCount,dashOffset:this._dashOffset,dashRatio:this._dashRatio,resolution:this._resolution,sizeAttenuation:this._sizeAttenuation,useColors:this._useColors,useDash:this._useDash,visibility:this._visibility,width:this._width,cameraFacing:this._cameraFacing};return this._colors&&(t.colors=this._colors),e.greasedLineMaterialOptions=t,e}parse(e,t,n){let r=e.greasedLineMaterialOptions;this._colorsTexture?.dispose(),r.color&&(this.color=r.color),r.colorDistributionType&&(this.colorsDistributionType=r.colorDistributionType),r.colorsSampling&&(this.colorsSampling=r.colorsSampling),r.colorMode&&(this.colorMode=r.colorMode),r.useColors&&(this.useColors=r.useColors),r.visibility&&(this.visibility=r.visibility),r.useDash&&(this.useDash=r.useDash),r.dashCount&&(this.dashCount=r.dashCount),r.dashRatio&&(this.dashRatio=r.dashRatio),r.dashOffset&&(this.dashOffset=r.dashOffset),r.width&&(this.width=r.width),r.sizeAttenuation&&(this.sizeAttenuation=r.sizeAttenuation),r.resolution&&(this.resolution=r.resolution),this.colorsTexture=r.colors?V.CreateColorsTexture(`${this.name}-colors-texture`,r.colors,this.colorsSampling,this.getScene()):V.PrepareEmptyColorsTexture(t),this._cameraFacing=r.cameraFacing??!0,this.setDefine(`GREASED_LINE_CAMERA_FACING`,this._cameraFacing)}},J.ForceGLSL=!1})),X,Z,Q,$,ze=e((()=>{K(),ye(),C(),ve(),oe(),Y(),H(),(function(e){e[e.POINTS_MODE_POINTS=0]=`POINTS_MODE_POINTS`,e[e.POINTS_MODE_PATHS=1]=`POINTS_MODE_PATHS`})(X||={}),(function(e){e[e.FACES_MODE_SINGLE_SIDED=0]=`FACES_MODE_SINGLE_SIDED`,e[e.FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING=1]=`FACES_MODE_SINGLE_SIDED_NO_BACKFACE_CULLING`,e[e.FACES_MODE_DOUBLE_SIDED=2]=`FACES_MODE_DOUBLE_SIDED`})(Z||={}),(function(e){e[e.AUTO_DIRECTIONS_FROM_FIRST_SEGMENT=0]=`AUTO_DIRECTIONS_FROM_FIRST_SEGMENT`,e[e.AUTO_DIRECTIONS_FROM_ALL_SEGMENTS=1]=`AUTO_DIRECTIONS_FROM_ALL_SEGMENTS`,e[e.AUTO_DIRECTIONS_ENHANCED=2]=`AUTO_DIRECTIONS_ENHANCED`,e[e.AUTO_DIRECTIONS_FACE_TO=3]=`AUTO_DIRECTIONS_FACE_TO`,e[e.AUTO_DIRECTIONS_NONE=99]=`AUTO_DIRECTIONS_NONE`})(Q||={}),$=class extends be{constructor(e,t,n){super(e,t,null,null,!1,!1),this.name=e,this._options=n,this._lazy=!1,this._updatable=!1,this._engine=t.getEngine(),this._lazy=n.lazy??!1,this._updatable=n.updatable??!1,this._vertexPositions=[],this._indices=[],this._uvs=[],this._points=[],this._colorPointers=n.colorPointers??[],this._widths=n.widths??Array(n.points.length).fill(1)}getClassName(){return`GreasedLineMesh`}_updateWidthsWithValue(e){let t=0;for(let e of this._points)t+=e.length;let n=t/3*2-this._widths.length;for(let t=0;t<n;t++)this._widths.push(e)}updateLazy(){this._setPoints(this._points),this._options.colorPointers||this._updateColorPointers(),this._createVertexBuffers(this._options.ribbonOptions?.smoothShading),!this.doNotSyncBoundingInfo&&this.refreshBoundingInfo(),this.greasedLineMaterial?.updateLazy()}addPoints(e,t){for(let t of e)this._points.push(t);this._lazy||this.setPoints(this._points,t)}dispose(e,t=!1){super.dispose(e,t)}isLazy(){return this._lazy}get uvs(){return this._uvs}set uvs(e){this._uvs=e instanceof Float32Array?e:new Float32Array(e),this._createVertexBuffers()}get offsets(){return this._offsets}set offsets(e){this.material instanceof J&&this.material.setDefine(q,e?.length>0),this._offsets=e,this._offsetsBuffer?this._offsetsBuffer.update(e):this._createOffsetsBuffer(e)}get widths(){return this._widths}set widths(e){this._widths=e,this._lazy||this._widthsBuffer&&this._widthsBuffer.update(e)}get colorPointers(){return this._colorPointers}set colorPointers(e){this._colorPointers=e,this._lazy||this._colorPointersBuffer&&this._colorPointersBuffer.update(e)}get greasedLineMaterial(){if(this.material&&this.material instanceof J)return this.material;let e=this.material?.pluginManager?.getPlugin(W.GREASED_LINE_MATERIAL_NAME);if(e)return e}get points(){let e=[];return se.DeepCopy(this._points,e),e}setPoints(e,t){this._points=V.ConvertPoints(e,t?.pointsOptions??this._options.pointsOptions),this._updateWidths(),t?.colorPointers||this._updateColorPointers(),this._setPoints(this._points,t)}_initGreasedLine(){this._vertexPositions=[],this._indices=[],this._uvs=[]}_createLineOptions(){return{points:this._points,colorPointers:this._colorPointers,lazy:this._lazy,updatable:this._updatable,uvs:this._uvs,widths:this._widths,ribbonOptions:this._options.ribbonOptions}}serialize(e){super.serialize(e),e.type=this.getClassName(),e.lineOptions=this._createLineOptions()}_createVertexBuffers(e=!1){let t=new w;return t.positions=this._vertexPositions,t.indices=this._indices,t.uvs=this._uvs,e&&(t.normals=[],w.ComputeNormals(this._vertexPositions,this._indices,t.normals)),t.applyToMesh(this,this._options.updatable),t}_createOffsetsBuffer(e){let t=this._scene.getEngine(),n=new he(t,e,this._updatable,3);this.setVerticesBuffer(n.createVertexBuffer(`grl_offsets`,0,3)),this._offsetsBuffer=n}}})),Be=e((()=>{F(),xe(),A(),k(),Se()})),Ve=e((()=>{f(),f(),l()})),He=e((()=>{M(),M(),j()}));export{ke as C,P as D,De as E,N as O,Ae as S,Ee as T,H as _,Q as a,je as b,ze as c,Y as d,W as f,V as g,K as h,$ as i,F as k,J as l,Re as m,Ve as n,Z as o,U as p,Be as r,X as s,He as t,q as u,z as v,Ne as w,Me as x,B as y};