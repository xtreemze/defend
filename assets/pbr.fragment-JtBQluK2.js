import{n as e,r as ee}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{i as te,l as ne,o as re,r as ie,s as ae,t as oe}from"./bumpFragmentMainFunctions-DQK1V7jE.js";import{n as se,t as ce}from"./samplerFragmentDeclaration-EP0koXA0.js";import{a as le,c as ue,n as de,o as fe,r as pe,t as me}from"./fogFragment-DddV-x4-.js";import{r as he,t as ge}from"./clipPlaneFragmentDeclaration-BeW0wzU5.js";import{c as _e,i as ve,o as ye,r as be,s as xe,t as Se}from"./imageProcessingFunctions-C5BKlD0g.js";import{r as Ce,t as we}from"./harmonicsFunctions-DgCylLPg.js";import{i as Te,n as Ee,o as De,t as Oe}from"./logDepthDeclaration-DEg-fR3E.js";import{n as ke,t as Ae}from"./lightFragment-_152tcho.js";import{a as je,i as Me,n as Ne,t as Pe}from"./lightUboDeclaration-C5wTJIy-.js";import{a as Fe,i as Ie,n as Le,t as Re}from"./shadowsFragmentFunctions-Bc-DtcDh.js";import{n as ze,t as Be}from"./clusteredLightingFunctions-Dsz_2Muy.js";import{n as Ve,t as He}from"./reflectionFunction-CYt6SqVq.js";import{n as Ue,t as We}from"./sceneUboDeclaration-DY0whaDI.js";import{a as Ge,c as Ke,i as qe,l as Je,n as Ye,o as Xe,r as Ze,s as Qe,t as $e,u as et}from"./oitFragment-Db3N6RUB.js";import{n as tt,t as nt}from"./meshUboDeclaration-DmH0C9dB.js";import{n as rt,t as it}from"./mainUVVaryingDeclaration-BlaxkZjG.js";import{n as at,t as ot}from"./decalFragment-ClBM55w3.js";import{n as st,t as ct}from"./depthPrePass-CgCyzsEz.js";import{i as lt,n as ut,r as dt,t as ft}from"./pbrIBLFunctions-DbBTfOiP.js";import{n as pt,t as mt}from"./pbrBRDFFunctions-B2sEeQXA.js";import{i as ht,n as gt,r as _t,t as vt}from"./hdrFilteringFunctions-Dr3F2B6G.js";import{_ as yt,a as bt,c as xt,d as St,f as Ct,g as wt,h as Tt,i as Et,l as Dt,m as Ot,n as kt,o as At,p as jt,r as Mt,s as Nt,t as Pt,u as Ft,v as It}from"./pbrDebug-Bgn2KxJW.js";import{n as Lt,t as Rt}from"./pbrUboDeclaration-B3M1Mg0c.js";var r,i,zt,Bt=e((()=>{t(),et(),r=`pbrFragmentDeclaration`,i=`uniform vec4 vEyePosition;uniform vec3 vReflectionColor;uniform vec4 vAlbedoColor;uniform float baseWeight;uniform float baseDiffuseRoughness;uniform vec4 vLightingIntensity;uniform vec4 vReflectivityColor;uniform vec4 vMetallicReflectanceFactors;uniform vec3 vEmissiveColor;uniform float visibility;uniform vec3 vAmbientColor;
#ifdef ALBEDO
uniform vec2 vAlbedoInfos;
#endif
#ifdef BASE_WEIGHT
uniform vec2 vBaseWeightInfos;
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
uniform vec2 vBaseDiffuseRoughnessInfos;
#endif
#ifdef AMBIENT
uniform vec4 vAmbientInfos;
#endif
#ifdef BUMP
uniform vec3 vBumpInfos;uniform vec2 vTangentSpaceParams;
#endif
#ifdef OPACITY
uniform vec2 vOpacityInfos;
#endif
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;
#endif
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;
#endif
#ifdef REFLECTIVITY
uniform vec3 vReflectivityInfos;
#endif
#ifdef MICROSURFACEMAP
uniform vec2 vMicroSurfaceSamplerInfos;
#endif
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(SS_REFRACTION) || defined(PREPASS)
uniform mat4 view;
#endif
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
#ifdef REALTIME_FILTERING
uniform vec2 vReflectionFilteringInfo;
#endif
uniform mat4 reflectionMatrix;uniform vec3 vReflectionMicrosurfaceInfos;
#if defined(USEIRRADIANCEMAP) && defined(USE_IRRADIANCE_DOMINANT_DIRECTION)
uniform vec3 vReflectionDominantDirection;
#endif
#if defined(USE_LOCAL_REFLECTIONMAP_CUBIC) && defined(REFLECTIONMAP_CUBIC)
uniform vec3 vReflectionPosition;uniform vec3 vReflectionSize;
#endif
#endif
#if defined(SS_REFRACTION) && defined(SS_USE_LOCAL_REFRACTIONMAP_CUBIC)
uniform vec3 vRefractionPosition;uniform vec3 vRefractionSize;
#endif
#ifdef CLEARCOAT
uniform vec2 vClearCoatParams;uniform vec4 vClearCoatRefractionParams;
#if defined(CLEARCOAT_TEXTURE) || defined(CLEARCOAT_TEXTURE_ROUGHNESS)
uniform vec4 vClearCoatInfos;
#endif
#ifdef CLEARCOAT_TEXTURE
uniform mat4 clearCoatMatrix;
#endif
#ifdef CLEARCOAT_TEXTURE_ROUGHNESS
uniform mat4 clearCoatRoughnessMatrix;
#endif
#ifdef CLEARCOAT_BUMP
uniform vec2 vClearCoatBumpInfos;uniform vec2 vClearCoatTangentSpaceParams;uniform mat4 clearCoatBumpMatrix;
#endif
#ifdef CLEARCOAT_TINT
uniform vec4 vClearCoatTintParams;uniform float clearCoatColorAtDistance;
#ifdef CLEARCOAT_TINT_TEXTURE
uniform vec2 vClearCoatTintInfos;uniform mat4 clearCoatTintMatrix;
#endif
#endif
#endif
#ifdef IRIDESCENCE
uniform vec4 vIridescenceParams;
#if defined(IRIDESCENCE_TEXTURE) || defined(IRIDESCENCE_THICKNESS_TEXTURE)
uniform vec4 vIridescenceInfos;
#endif
#ifdef IRIDESCENCE_TEXTURE
uniform mat4 iridescenceMatrix;
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
uniform mat4 iridescenceThicknessMatrix;
#endif
#endif
#ifdef ANISOTROPIC
uniform vec3 vAnisotropy;
#ifdef ANISOTROPIC_TEXTURE
uniform vec2 vAnisotropyInfos;uniform mat4 anisotropyMatrix;
#endif
#endif
#ifdef SHEEN
uniform vec4 vSheenColor;
#ifdef SHEEN_ROUGHNESS
uniform float vSheenRoughness;
#endif
#if defined(SHEEN_TEXTURE) || defined(SHEEN_TEXTURE_ROUGHNESS)
uniform vec4 vSheenInfos;
#endif
#ifdef SHEEN_TEXTURE
uniform mat4 sheenMatrix;
#endif
#ifdef SHEEN_TEXTURE_ROUGHNESS
uniform mat4 sheenRoughnessMatrix;
#endif
#endif
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
uniform vec4 vRefractionMicrosurfaceInfos;uniform vec4 vRefractionInfos;uniform mat4 refractionMatrix;
#ifdef REALTIME_FILTERING
uniform vec2 vRefractionFilteringInfo;
#endif
#ifdef SS_DISPERSION
uniform float dispersion;
#endif
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
uniform vec2 vThicknessInfos;uniform mat4 thicknessMatrix;
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
uniform vec2 vRefractionIntensityInfos;uniform mat4 refractionIntensityMatrix;
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
uniform vec2 vTranslucencyIntensityInfos;uniform mat4 translucencyIntensityMatrix;
#endif
uniform vec2 vThicknessParam;uniform vec3 vDiffusionDistance;uniform vec4 vTintColor;uniform vec3 vSubSurfaceIntensity;uniform vec4 vTranslucencyColor;
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
uniform vec2 vTranslucencyColorInfos;uniform mat4 translucencyColorMatrix;
#endif
#endif
#ifdef PREPASS
#ifdef SS_SCATTERING
uniform float scatteringDiffusionProfile;
#endif
#endif
#if DEBUGMODE>0
uniform vec2 vDebugMode;
#endif
#ifdef DETAIL
uniform vec4 vDetailInfos;
#endif
#include<decalFragmentDeclaration>
#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
uniform vec3 vSphericalL00;uniform vec3 vSphericalL1_1;uniform vec3 vSphericalL10;uniform vec3 vSphericalL11;uniform vec3 vSphericalL2_2;uniform vec3 vSphericalL2_1;uniform vec3 vSphericalL20;uniform vec3 vSphericalL21;uniform vec3 vSphericalL22;
#else
uniform vec3 vSphericalX;uniform vec3 vSphericalY;uniform vec3 vSphericalZ;uniform vec3 vSphericalXX_ZZ;uniform vec3 vSphericalYY_ZZ;uniform vec3 vSphericalZZ;uniform vec3 vSphericalXY;uniform vec3 vSphericalYZ;uniform vec3 vSphericalZX;
#endif
#endif
#if TEXTURE_REPETITION_MODE>0
uniform vec4 vTextureRepetitionHexTilingParams;
#endif
#define ADDITIONAL_FRAGMENT_DECLARATION
`,n.IncludesShadersStore[r]||(n.IncludesShadersStore[r]=i),zt={name:r,shader:i}})),a,o,Vt,Ht=e((()=>{t(),a=`samplerFragmentAlternateDeclaration`,o=`#ifdef _DEFINENAME_
#if _DEFINENAME_DIRECTUV==1
#define v_VARYINGNAME_UV vMainUV1
#elif _DEFINENAME_DIRECTUV==2
#define v_VARYINGNAME_UV vMainUV2
#elif _DEFINENAME_DIRECTUV==3
#define v_VARYINGNAME_UV vMainUV3
#elif _DEFINENAME_DIRECTUV==4
#define v_VARYINGNAME_UV vMainUV4
#elif _DEFINENAME_DIRECTUV==5
#define v_VARYINGNAME_UV vMainUV5
#elif _DEFINENAME_DIRECTUV==6
#define v_VARYINGNAME_UV vMainUV6
#else
varying vec2 v_VARYINGNAME_UV;
#endif
#endif
`,n.IncludesShadersStore[a]||(n.IncludesShadersStore[a]=o),Vt={name:a,shader:o}})),s,c,Ut,Wt=e((()=>{t(),ce(),Ht(),dt(),s=`pbrFragmentSamplersDeclaration`,c=`#include<samplerFragmentDeclaration>(_DEFINENAME_,ALBEDO,_VARYINGNAME_,Albedo,_SAMPLERNAME_,albedo)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_SAMPLERNAME_,baseWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_SAMPLERNAME_,baseDiffuseRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT,_VARYINGNAME_,Ambient,_SAMPLERNAME_,ambient)
#include<samplerFragmentDeclaration>(_DEFINENAME_,OPACITY,_VARYINGNAME_,Opacity,_SAMPLERNAME_,opacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSIVE,_VARYINGNAME_,Emissive,_SAMPLERNAME_,emissive)
#include<samplerFragmentDeclaration>(_DEFINENAME_,LIGHTMAP,_VARYINGNAME_,Lightmap,_SAMPLERNAME_,lightmap)
#include<samplerFragmentDeclaration>(_DEFINENAME_,REFLECTIVITY,_VARYINGNAME_,Reflectivity,_SAMPLERNAME_,reflectivity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,MICROSURFACEMAP,_VARYINGNAME_,MicroSurfaceSampler,_SAMPLERNAME_,microSurface)
#include<samplerFragmentDeclaration>(_DEFINENAME_,METALLIC_REFLECTANCE,_VARYINGNAME_,MetallicReflectance,_SAMPLERNAME_,metallicReflectance)
#include<samplerFragmentDeclaration>(_DEFINENAME_,REFLECTANCE,_VARYINGNAME_,Reflectance,_SAMPLERNAME_,reflectance)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#ifdef CLEARCOAT
#include<samplerFragmentDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE,_VARYINGNAME_,ClearCoat,_SAMPLERNAME_,clearCoat)
#include<samplerFragmentAlternateDeclaration>(_DEFINENAME_,CLEARCOAT_TEXTURE_ROUGHNESS,_VARYINGNAME_,ClearCoatRoughness)
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS)
uniform sampler2D clearCoatRoughnessSampler;
#endif
#include<samplerFragmentDeclaration>(_DEFINENAME_,CLEARCOAT_BUMP,_VARYINGNAME_,ClearCoatBump,_SAMPLERNAME_,clearCoatBump)
#include<samplerFragmentDeclaration>(_DEFINENAME_,CLEARCOAT_TINT_TEXTURE,_VARYINGNAME_,ClearCoatTint,_SAMPLERNAME_,clearCoatTint)
#endif
#ifdef IRIDESCENCE
#include<samplerFragmentDeclaration>(_DEFINENAME_,IRIDESCENCE_TEXTURE,_VARYINGNAME_,Iridescence,_SAMPLERNAME_,iridescence)
#include<samplerFragmentDeclaration>(_DEFINENAME_,IRIDESCENCE_THICKNESS_TEXTURE,_VARYINGNAME_,IridescenceThickness,_SAMPLERNAME_,iridescenceThickness)
#endif
#ifdef SHEEN
#include<samplerFragmentDeclaration>(_DEFINENAME_,SHEEN_TEXTURE,_VARYINGNAME_,Sheen,_SAMPLERNAME_,sheen)
#include<samplerFragmentAlternateDeclaration>(_DEFINENAME_,SHEEN_TEXTURE_ROUGHNESS,_VARYINGNAME_,SheenRoughness)
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS)
uniform sampler2D sheenRoughnessSampler;
#endif
#endif
#ifdef ANISOTROPIC
#include<samplerFragmentDeclaration>(_DEFINENAME_,ANISOTROPIC_TEXTURE,_VARYINGNAME_,Anisotropy,_SAMPLERNAME_,anisotropy)
#endif
#include<pbrFragmentReflectionDeclaration>
#ifdef ENVIRONMENTBRDF
uniform sampler2D environmentBrdfSampler;
#endif
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
#ifdef SS_REFRACTIONMAP_3D
#define sampleRefraction(s,c) textureCube(s,c)
uniform samplerCube refractionSampler;
#ifdef LODBASEDMICROSFURACE
#define sampleRefractionLod(s,c,l) textureCubeLodEXT(s,c,l)
#else
uniform samplerCube refractionSamplerLow;uniform samplerCube refractionSamplerHigh;
#endif
#else
#define sampleRefraction(s,c) texture2D(s,c)
uniform sampler2D refractionSampler;
#ifdef LODBASEDMICROSFURACE
#define sampleRefractionLod(s,c,l) texture2DLodEXT(s,c,l)
#else
uniform sampler2D refractionSamplerLow;uniform sampler2D refractionSamplerHigh;
#endif
#endif
#endif
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_THICKNESSANDMASK_TEXTURE,_VARYINGNAME_,Thickness,_SAMPLERNAME_,thickness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_REFRACTIONINTENSITY_TEXTURE,_VARYINGNAME_,RefractionIntensity,_SAMPLERNAME_,refractionIntensity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYINTENSITY_TEXTURE,_VARYINGNAME_,TranslucencyIntensity,_SAMPLERNAME_,translucencyIntensity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SS_TRANSLUCENCYCOLOR_TEXTURE,_VARYINGNAME_,TranslucencyColor,_SAMPLERNAME_,translucencyColor)
#endif
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfSampler;
#endif
`,n.IncludesShadersStore[s]||(n.IncludesShadersStore[s]=c),Ut={name:s,shader:c}})),l,u,Gt,Kt=e((()=>{t(),at(),l=`pbrBlockAlbedoOpacity`,u=`struct albedoOpacityOutParams
{vec3 surfaceAlbedo;float alpha;};
#define pbr_inline
albedoOpacityOutParams albedoOpacityBlock(
in vec4 vAlbedoColor
#ifdef ALBEDO
,in vec4 albedoTexture
,in vec2 albedoInfos
#endif
,in float baseWeight
#ifdef BASE_WEIGHT
,in vec4 baseWeightTexture
,in vec2 vBaseWeightInfos
#endif
#ifdef OPACITY
,in vec4 opacityMap
,in vec2 vOpacityInfos
#endif
#ifdef DETAIL
,in vec4 detailColor
,in vec4 vDetailInfos
#endif
#ifdef DECAL
,in vec4 decalColor
,in vec4 vDecalInfos
#endif
)
{albedoOpacityOutParams outParams;vec3 surfaceAlbedo=vAlbedoColor.rgb;float alpha=vAlbedoColor.a;
#ifdef ALBEDO
#if defined(ALPHAFROMALBEDO) || defined(ALPHATEST)
alpha*=albedoTexture.a;
#endif
#ifdef GAMMAALBEDO
surfaceAlbedo*=toLinearSpace(albedoTexture.rgb);
#else
surfaceAlbedo*=albedoTexture.rgb;
#endif
surfaceAlbedo*=albedoInfos.y;
#endif
#ifndef DECAL_AFTER_DETAIL
#include<decalFragment>
#endif
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
surfaceAlbedo*=vColor.rgb;
#endif
#ifdef DETAIL
float detailAlbedo=2.0*mix(0.5,detailColor.r,vDetailInfos.y);surfaceAlbedo.rgb=surfaceAlbedo.rgb*detailAlbedo*detailAlbedo; 
#endif
#ifdef DECAL_AFTER_DETAIL
#include<decalFragment>
#endif
#define CUSTOM_FRAGMENT_UPDATE_ALBEDO
surfaceAlbedo*=baseWeight;
#ifdef BASE_WEIGHT
surfaceAlbedo*=baseWeightTexture.r;
#endif
#ifdef OPACITY
#ifdef OPACITYRGB
alpha=getLuminance(opacityMap.rgb);
#else
alpha*=opacityMap.a;
#endif
alpha*=vOpacityInfos.y;
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=vColor.a;
#endif
#if !defined(SS_LINKREFRACTIONTOTRANSPARENCY) && !defined(ALPHAFRESNEL)
#ifdef ALPHATEST
#if DEBUGMODE != 88
if (alpha<ALPHATESTVALUE)
discard;
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
#endif
outParams.surfaceAlbedo=surfaceAlbedo;outParams.alpha=alpha;return outParams;}
`,n.IncludesShadersStore[l]||(n.IncludesShadersStore[l]=u),Gt={name:l,shader:u}})),d,f,qt,Jt=e((()=>{t(),d=`pbrBlockReflectivity`,f=`struct reflectivityOutParams
{float microSurface;float roughness;float diffuseRoughness;float reflectanceF0;vec3 reflectanceF90;vec3 colorReflectanceF0;vec3 colorReflectanceF90;
#ifdef METALLICWORKFLOW
vec3 surfaceAlbedo;float metallic;float specularWeight;vec3 dielectricColorF0;
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
vec3 ambientOcclusionColor;
#endif
#if DEBUGMODE>0
#ifdef METALLICWORKFLOW
#ifdef REFLECTIVITY
vec4 surfaceMetallicColorMap;
#endif
vec3 metallicF0;
#else
#ifdef REFLECTIVITY
vec4 surfaceReflectivityColorMap;
#endif
#endif
#endif
};
#define pbr_inline
reflectivityOutParams reflectivityBlock(
in vec4 reflectivityColor
#ifdef METALLICWORKFLOW
,in vec3 surfaceAlbedo
,in vec4 metallicReflectanceFactors
#endif
,in float baseDiffuseRoughness
#ifdef BASE_DIFFUSE_ROUGHNESS
,in float baseDiffuseRoughnessTexture
,in vec2 baseDiffuseRoughnessInfos
#endif
#ifdef REFLECTIVITY
,in vec3 reflectivityInfos
,in vec4 surfaceMetallicOrReflectivityColorMap
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
,in vec3 ambientOcclusionColorIn
#endif
#ifdef MICROSURFACEMAP
,in vec4 microSurfaceTexel
#endif
#ifdef DETAIL
,in vec4 detailColor
,in vec4 vDetailInfos
#endif
)
{reflectivityOutParams outParams;float microSurface=reflectivityColor.a;vec3 surfaceReflectivityColor=reflectivityColor.rgb;
#ifdef METALLICWORKFLOW
vec2 metallicRoughness=surfaceReflectivityColor.rg;float ior=surfaceReflectivityColor.b;
#ifdef REFLECTIVITY
#if DEBUGMODE>0
outParams.surfaceMetallicColorMap=surfaceMetallicOrReflectivityColorMap;
#endif
#ifdef AOSTOREINMETALMAPRED
vec3 aoStoreInMetalMap=vec3(surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r,surfaceMetallicOrReflectivityColorMap.r);outParams.ambientOcclusionColor=mix(ambientOcclusionColorIn,aoStoreInMetalMap,reflectivityInfos.z);
#endif
#ifdef METALLNESSSTOREINMETALMAPBLUE
metallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.b;
#else
metallicRoughness.r*=surfaceMetallicOrReflectivityColorMap.r;
#endif
#ifdef ROUGHNESSSTOREINMETALMAPALPHA
metallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.a;
#else
#ifdef ROUGHNESSSTOREINMETALMAPGREEN
metallicRoughness.g*=surfaceMetallicOrReflectivityColorMap.g;
#endif
#endif
#endif
#ifdef DETAIL
float detailRoughness=mix(0.5,detailColor.b,vDetailInfos.w);float loLerp=mix(0.,metallicRoughness.g,detailRoughness*2.);float hiLerp=mix(metallicRoughness.g,1.,(detailRoughness-0.5)*2.);metallicRoughness.g=mix(loLerp,hiLerp,step(detailRoughness,0.5));
#endif
#ifdef MICROSURFACEMAP
metallicRoughness.g*=microSurfaceTexel.r;
#endif
#define CUSTOM_FRAGMENT_UPDATE_METALLICROUGHNESS
microSurface=1.0-metallicRoughness.g;vec3 baseColor=surfaceAlbedo;outParams.metallic=metallicRoughness.r;outParams.specularWeight=metallicReflectanceFactors.a;float dielectricF0=reflectivityColor.a*outParams.specularWeight;surfaceReflectivityColor=metallicReflectanceFactors.rgb;
#if DEBUGMODE>0
outParams.metallicF0=vec3(dielectricF0)*surfaceReflectivityColor;
#endif
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
outParams.surfaceAlbedo=baseColor.rgb*(vec3(1.0)-vec3(dielectricF0)*surfaceReflectivityColor)*(1.0-outParams.metallic);
#else
outParams.surfaceAlbedo=baseColor.rgb;
#endif
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
{vec3 reflectivityColor=mix(dielectricF0*surfaceReflectivityColor,baseColor.rgb,outParams.metallic);outParams.reflectanceF0=max(reflectivityColor.r,max(reflectivityColor.g,reflectivityColor.b));}
#else
#if DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_GLTF
float maxF0=max(surfaceReflectivityColor.r,max(surfaceReflectivityColor.g,surfaceReflectivityColor.b));outParams.reflectanceF0=mix(dielectricF0*maxF0,1.0,outParams.metallic);
#else
outParams.reflectanceF0=mix(dielectricF0,1.0,outParams.metallic);
#endif
#endif
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
outParams.reflectanceF90=vec3(outParams.specularWeight);float f90Scale=1.0;
#else
float f90Scale=clamp(2.0*(ior-1.0),0.0,1.0);outParams.reflectanceF90=vec3(mix(outParams.specularWeight*f90Scale,1.0,outParams.metallic));
#endif
outParams.dielectricColorF0=vec3(dielectricF0*surfaceReflectivityColor);vec3 metallicColorF0=baseColor.rgb;outParams.colorReflectanceF0=mix(outParams.dielectricColorF0,metallicColorF0,outParams.metallic);
#if (DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_OPENPBR)
vec3 dielectricColorF90=surfaceReflectivityColor*vec3(outParams.specularWeight)*vec3(f90Scale);
#else
vec3 dielectricColorF90=vec3(outParams.specularWeight*f90Scale);
#endif
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
vec3 conductorColorF90=surfaceReflectivityColor;
#else
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
vec3 conductorColorF90=outParams.reflectanceF90;
#else
vec3 conductorColorF90=vec3(1.0);
#endif
#endif
outParams.colorReflectanceF90=mix(dielectricColorF90,conductorColorF90,outParams.metallic);
#else
#ifdef REFLECTIVITY
surfaceReflectivityColor*=surfaceMetallicOrReflectivityColorMap.rgb;
#if DEBUGMODE>0
outParams.surfaceReflectivityColorMap=surfaceMetallicOrReflectivityColorMap;
#endif
#ifdef MICROSURFACEFROMREFLECTIVITYMAP
microSurface*=surfaceMetallicOrReflectivityColorMap.a;microSurface*=reflectivityInfos.z;
#else
#ifdef MICROSURFACEAUTOMATIC
microSurface*=computeDefaultMicroSurface(microSurface,surfaceReflectivityColor);
#endif
#ifdef MICROSURFACEMAP
microSurface*=microSurfaceTexel.r;
#endif
#define CUSTOM_FRAGMENT_UPDATE_MICROSURFACE
#endif
#endif
outParams.colorReflectanceF0=surfaceReflectivityColor;outParams.reflectanceF0=max(surfaceReflectivityColor.r,max(surfaceReflectivityColor.g,surfaceReflectivityColor.b));outParams.reflectanceF90=vec3(1.0);
#if (DIELECTRIC_SPECULAR_MODEL==DIELECTRIC_SPECULAR_MODEL_OPENPBR)
outParams.colorReflectanceF90=surfaceReflectivityColor;
#else
outParams.colorReflectanceF90=vec3(1.0);
#endif
#endif
microSurface=saturate(microSurface);float roughness=1.-microSurface;float diffuseRoughness=baseDiffuseRoughness;
#ifdef BASE_DIFFUSE_ROUGHNESS
diffuseRoughness*=baseDiffuseRoughnessTexture*baseDiffuseRoughnessInfos.y;
#endif
outParams.microSurface=microSurface;outParams.roughness=roughness;outParams.diffuseRoughness=diffuseRoughness;return outParams;}
`,n.IncludesShadersStore[d]||(n.IncludesShadersStore[d]=f),qt={name:d,shader:f}})),p,m,Yt,Xt=e((()=>{t(),p=`pbrBlockAmbientOcclusion`,m=`struct ambientOcclusionOutParams
{vec3 ambientOcclusionColor;
#if DEBUGMODE>0 && defined(AMBIENT)
vec3 ambientOcclusionColorMap;
#endif
};ambientOcclusionOutParams ambientOcclusionBlock(
#ifdef AMBIENT
in vec3 ambientOcclusionColorMap_,
in vec4 vAmbientInfos
#endif
)
{ambientOcclusionOutParams outParams;vec3 ambientOcclusionColor=vec3(1.,1.,1.);
#ifdef AMBIENT
vec3 ambientOcclusionColorMap=ambientOcclusionColorMap_*vAmbientInfos.y;
#ifdef AMBIENTINGRAYSCALE
ambientOcclusionColorMap=vec3(ambientOcclusionColorMap.r,ambientOcclusionColorMap.r,ambientOcclusionColorMap.r);
#endif
ambientOcclusionColor=mix(ambientOcclusionColor,ambientOcclusionColorMap,vAmbientInfos.z);
#if DEBUGMODE>0
outParams.ambientOcclusionColorMap=ambientOcclusionColorMap;
#endif
#endif
outParams.ambientOcclusionColor=ambientOcclusionColor;return outParams;}
`,n.IncludesShadersStore[p]||(n.IncludesShadersStore[p]=m),Yt={name:p,shader:m}})),h,g,Zt,Qt=e((()=>{t(),h=`pbrBlockAlphaFresnel`,g=`#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
struct alphaFresnelOutParams
{float alpha;};
#define pbr_inline
alphaFresnelOutParams alphaFresnelBlock(
in vec3 normalW,
in vec3 viewDirectionW,
in float alpha,
in float microSurface
)
{alphaFresnelOutParams outParams;float opacityPerceptual=alpha;
#ifdef LINEARALPHAFRESNEL
float opacity0=opacityPerceptual;
#else
float opacity0=opacityPerceptual*opacityPerceptual;
#endif
float opacity90=fresnelGrazingReflectance(opacity0);vec3 normalForward=faceforward(normalW,-viewDirectionW,normalW);outParams.alpha=getReflectanceFromAnalyticalBRDFLookup_Jones(saturate(dot(viewDirectionW,normalForward)),vec3(opacity0),vec3(opacity90),sqrt(microSurface)).x;
#ifdef ALPHATEST
if (outParams.alpha<ALPHATESTVALUE)
discard;
#ifndef ALPHABLEND
outParams.alpha=1.0;
#endif
#endif
return outParams;}
#endif
#endif
`,n.IncludesShadersStore[h]||(n.IncludesShadersStore[h]=g),Zt={name:h,shader:g}})),_,v,$t,en=e((()=>{t(),_=`pbrBlockAnisotropic`,v=`#ifdef ANISOTROPIC
struct anisotropicOutParams
{float anisotropy;vec3 anisotropicTangent;vec3 anisotropicBitangent;vec3 anisotropicNormal;
#if DEBUGMODE>0 && defined(ANISOTROPIC_TEXTURE)
vec3 anisotropyMapData;
#endif
};
#define pbr_inline
anisotropicOutParams anisotropicBlock(
in vec3 vAnisotropy,
in float roughness,
#ifdef ANISOTROPIC_TEXTURE
in vec3 anisotropyMapData,
#endif
in mat3 TBN,
in vec3 normalW,
in vec3 viewDirectionW
)
{anisotropicOutParams outParams;float anisotropy=vAnisotropy.b;vec3 anisotropyDirection=vec3(vAnisotropy.xy,0.);
#ifdef ANISOTROPIC_TEXTURE
anisotropy*=anisotropyMapData.b;
#if DEBUGMODE>0
outParams.anisotropyMapData=anisotropyMapData;
#endif
anisotropyMapData.rg=anisotropyMapData.rg*2.0-1.0;
#ifdef ANISOTROPIC_LEGACY
anisotropyDirection.rg*=anisotropyMapData.rg;
#else
anisotropyDirection.xy=mat2(anisotropyDirection.x,anisotropyDirection.y,-anisotropyDirection.y,anisotropyDirection.x)*normalize(anisotropyMapData.rg);
#endif
#endif
mat3 anisoTBN=mat3(normalize(TBN[0]),normalize(TBN[1]),normalize(TBN[2]));vec3 anisotropicTangent=normalize(anisoTBN*anisotropyDirection);vec3 anisotropicBitangent=normalize(cross(anisoTBN[2],anisotropicTangent));outParams.anisotropy=anisotropy;outParams.anisotropicTangent=anisotropicTangent;outParams.anisotropicBitangent=anisotropicBitangent;outParams.anisotropicNormal=getAnisotropicBentNormals(anisotropicTangent,anisotropicBitangent,normalW,viewDirectionW,anisotropy,roughness);return outParams;}
#endif
`,n.IncludesShadersStore[_]||(n.IncludesShadersStore[_]=v),$t={name:_,shader:v}})),y,b,tn,nn=e((()=>{t(),y=`pbrBlockReflection`,b=`#ifdef REFLECTION
struct reflectionOutParams
{vec4 environmentRadiance;vec3 environmentIrradiance;
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords;
#else
vec2 reflectionCoords;
#endif
#ifdef SS_TRANSLUCENCY
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
vec3 irradianceVector;
#endif
#endif
#endif
};
#define pbr_inline
void createReflectionCoords(
in vec3 vPositionW,
in vec3 normalW,
#ifdef ANISOTROPIC
in anisotropicOutParams anisotropicOut,
#endif
#ifdef REFLECTIONMAP_3D
out vec3 reflectionCoords
#else
out vec2 reflectionCoords
#endif
)
{
#ifdef ANISOTROPIC
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),anisotropicOut.anisotropicNormal);
#else
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
reflectionCoords=reflectionVector;
#else
reflectionCoords=reflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
reflectionCoords/=reflectionVector.z;
#endif
reflectionCoords.y=1.0-reflectionCoords.y;
#endif
}
#define pbr_inline
#define inline
void sampleReflectionTexture(
in float alphaG,
in vec3 vReflectionMicrosurfaceInfos,
in vec2 vReflectionInfos,
in vec3 vReflectionColor,
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
in float NdotVUnclamped,
#endif
#ifdef LINEARSPECULARREFLECTION
in float roughness,
#endif
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSampler,
const vec3 reflectionCoords,
#else
in sampler2D reflectionSampler,
const vec2 reflectionCoords,
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSamplerLow,
in samplerCube reflectionSamplerHigh,
#else
in sampler2D reflectionSamplerLow,
in sampler2D reflectionSamplerHigh,
#endif
#endif
#ifdef REALTIME_FILTERING
in vec2 vReflectionFilteringInfo,
#endif
out vec4 environmentRadiance
)
{
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
float reflectionLOD=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG,NdotVUnclamped);
#elif defined(LINEARSPECULARREFLECTION)
float reflectionLOD=getLinearLodFromRoughness(vReflectionMicrosurfaceInfos.x,roughness);
#else
float reflectionLOD=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG);
#endif
#ifdef LODBASEDMICROSFURACE
reflectionLOD=reflectionLOD*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;
#ifdef LODINREFLECTIONALPHA
float automaticReflectionLOD=UNPACK_LOD(sampleReflection(reflectionSampler,reflectionCoords).a);float requestedReflectionLOD=max(automaticReflectionLOD,reflectionLOD);
#else
float requestedReflectionLOD=reflectionLOD;
#endif
#ifdef REALTIME_FILTERING
environmentRadiance=vec4(radiance(alphaG,reflectionSampler,reflectionCoords,vReflectionFilteringInfo),1.0);
#else
environmentRadiance=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);
#endif
#else
float lodReflectionNormalized=saturate(reflectionLOD/log2(vReflectionMicrosurfaceInfos.x));float lodReflectionNormalizedDoubled=lodReflectionNormalized*2.0;vec4 environmentMid=sampleReflection(reflectionSampler,reflectionCoords);if (lodReflectionNormalizedDoubled<1.0){environmentRadiance=mix(
sampleReflection(reflectionSamplerHigh,reflectionCoords),
environmentMid,
lodReflectionNormalizedDoubled
);} else {environmentRadiance=mix(
environmentMid,
sampleReflection(reflectionSamplerLow,reflectionCoords),
lodReflectionNormalizedDoubled-1.0
);}
#endif
#ifdef RGBDREFLECTION
environmentRadiance.rgb=fromRGBD(environmentRadiance);
#endif
#ifdef GAMMAREFLECTION
environmentRadiance.rgb=toLinearSpace(environmentRadiance.rgb);
#endif
environmentRadiance.rgb*=vReflectionInfos.x;environmentRadiance.rgb*=vReflectionColor.rgb;}
#define pbr_inline
#define inline
reflectionOutParams reflectionBlock(
in vec3 vPositionW
,in vec3 normalW
,in float alphaG
,in vec3 vReflectionMicrosurfaceInfos
,in vec2 vReflectionInfos
,in vec3 vReflectionColor
#ifdef ANISOTROPIC
,in anisotropicOutParams anisotropicOut
#endif
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,in float NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,in float roughness
#endif
#ifdef REFLECTIONMAP_3D
,in samplerCube reflectionSampler
#else
,in sampler2D reflectionSampler
#endif
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,in vec3 vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,in mat4 reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
,in samplerCube irradianceSampler
#else
,in sampler2D irradianceSampler
#endif
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,in vec3 reflectionDominantDirection
#endif
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,in samplerCube reflectionSamplerLow
,in samplerCube reflectionSamplerHigh
#else
,in sampler2D reflectionSamplerLow
,in sampler2D reflectionSamplerHigh
#endif
#endif
#ifdef REALTIME_FILTERING
,in vec2 vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,in sampler2D icdfSampler
#endif
#endif
,in vec3 viewDirectionW
,in float diffuseRoughness
,in vec3 surfaceAlbedo
)
{reflectionOutParams outParams;vec4 environmentRadiance=vec4(0.,0.,0.,0.);
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.);
#else
vec2 reflectionCoords=vec2(0.);
#endif
createReflectionCoords(
vPositionW,
normalW,
#ifdef ANISOTROPIC
anisotropicOut,
#endif
reflectionCoords
);sampleReflectionTexture(
alphaG,
vReflectionMicrosurfaceInfos,
vReflectionInfos,
vReflectionColor,
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
NdotVUnclamped,
#endif
#ifdef LINEARSPECULARREFLECTION
roughness,
#endif
#ifdef REFLECTIONMAP_3D
reflectionSampler,
reflectionCoords,
#else
reflectionSampler,
reflectionCoords,
#endif
#ifndef LODBASEDMICROSFURACE
reflectionSamplerLow,
reflectionSamplerHigh,
#endif
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
#endif
environmentRadiance
);vec3 environmentIrradiance=vec3(0.,0.,0.);
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
#ifdef ANISOTROPIC
vec3 irradianceVector=vec3(reflectionMatrix*vec4(anisotropicOut.anisotropicNormal,0)).xyz;
#else
vec3 irradianceVector=vec3(reflectionMatrix*vec4(normalW,0)).xyz;
#endif
vec3 irradianceView=vec3(reflectionMatrix*vec4(viewDirectionW,0)).xyz;
#if !defined(USE_IRRADIANCE_DOMINANT_DIRECTION) && !defined(REALTIME_FILTERING)
#if BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LAMBERT && BASE_DIFFUSE_MODEL != BRDF_DIFFUSE_MODEL_LEGACY
float NdotV=max(dot(normalW,viewDirectionW),0.0);irradianceVector=mix(irradianceVector,irradianceView,(0.5*(1.0-NdotV))*diffuseRoughness);
#endif
#endif
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0;irradianceView.z*=-1.0;
#endif
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;irradianceView.y*=-1.0;
#endif
#endif
#ifdef USESPHERICALFROMREFLECTIONMAP
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
environmentIrradiance=vEnvironmentIrradiance;
#else
#if defined(REALTIME_FILTERING)
environmentIrradiance=irradiance(reflectionSampler,irradianceVector,vReflectionFilteringInfo,diffuseRoughness,surfaceAlbedo,irradianceView
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
);
#else
environmentIrradiance=computeEnvironmentIrradiance(irradianceVector);
#endif
#ifdef SS_TRANSLUCENCY
outParams.irradianceVector=irradianceVector;
#endif
#endif
#elif defined(USEIRRADIANCEMAP)
#ifdef REFLECTIONMAP_3D
vec4 environmentIrradiance4=sampleReflection(irradianceSampler,irradianceVector);
#else
vec4 environmentIrradiance4=sampleReflection(irradianceSampler,reflectionCoords);
#endif
environmentIrradiance=environmentIrradiance4.rgb;
#ifdef RGBDREFLECTION
environmentIrradiance.rgb=fromRGBD(environmentIrradiance4);
#endif
#ifdef GAMMAREFLECTION
environmentIrradiance.rgb=toLinearSpace(environmentIrradiance.rgb);
#endif
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
vec3 Ls=normalize(reflectionDominantDirection);float NoL=dot(irradianceVector,Ls);float NoV=dot(irradianceVector,irradianceView);vec3 diffuseRoughnessTerm=vec3(1.0);
#if BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_EON
float LoV=dot (Ls,irradianceView);float mag=length(reflectionDominantDirection)*2.0;vec3 clampedAlbedo=clamp(surfaceAlbedo,vec3(0.1),vec3(1.0));diffuseRoughnessTerm=diffuseBRDF_EON(clampedAlbedo,diffuseRoughness,NoL,NoV,LoV)*PI;diffuseRoughnessTerm=diffuseRoughnessTerm/clampedAlbedo;diffuseRoughnessTerm=mix(vec3(1.0),diffuseRoughnessTerm,sqrt(clamp(mag*NoV,0.0,1.0)));
#elif BASE_DIFFUSE_MODEL==BRDF_DIFFUSE_MODEL_BURLEY
vec3 H=(irradianceView+Ls)*0.5;float VoH=dot(irradianceView,H);diffuseRoughnessTerm=vec3(diffuseBRDF_Burley(NoL,NoV,VoH,diffuseRoughness)*PI);
#endif
environmentIrradiance=environmentIrradiance.rgb*diffuseRoughnessTerm;
#endif
#endif
environmentIrradiance*=vReflectionColor.rgb*vReflectionInfos.x;
#ifdef MIX_IBL_RADIANCE_WITH_IRRADIANCE
outParams.environmentRadiance=vec4(mix(environmentRadiance.rgb,environmentIrradiance,alphaG),environmentRadiance.a);
#else
outParams.environmentRadiance=environmentRadiance;
#endif
outParams.environmentIrradiance=environmentIrradiance;outParams.reflectionCoords=reflectionCoords;return outParams;}
#endif
`,n.IncludesShadersStore[y]||(n.IncludesShadersStore[y]=b),tn={name:y,shader:b}})),x,S,rn,an=e((()=>{t(),x=`pbrBlockSheen`,S=`#ifdef SHEEN
struct sheenOutParams
{float sheenIntensity;vec3 sheenColor;float sheenRoughness;
#ifdef SHEEN_LINKWITHALBEDO
vec3 surfaceAlbedo;
#endif
#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
float sheenAlbedoScaling;
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
vec3 finalSheenRadianceScaled;
#endif
#if DEBUGMODE>0
#ifdef SHEEN_TEXTURE
vec4 sheenMapData;
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
vec3 sheenEnvironmentReflectance;
#endif
#endif
};
#define pbr_inline
#define inline
sheenOutParams sheenBlock(
in vec4 vSheenColor
#ifdef SHEEN_ROUGHNESS
,in float vSheenRoughness
#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
,in vec4 sheenMapRoughnessData
#endif
#endif
,in float roughness
#ifdef SHEEN_TEXTURE
,in vec4 sheenMapData
,in float sheenMapLevel
#endif
,in float reflectance
#ifdef SHEEN_LINKWITHALBEDO
,in vec3 baseColor
,in vec3 surfaceAlbedo
#endif
#ifdef ENVIRONMENTBRDF
,in float NdotV
,in vec3 environmentBrdf
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,in vec2 AARoughnessFactors
,in vec3 vReflectionMicrosurfaceInfos
,in vec2 vReflectionInfos
,in vec3 vReflectionColor
,in vec4 vLightingIntensity
#ifdef REFLECTIONMAP_3D
,in samplerCube reflectionSampler
,in vec3 reflectionCoords
#else
,in sampler2D reflectionSampler
,in vec2 reflectionCoords
#endif
,in float NdotVUnclamped
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,in samplerCube reflectionSamplerLow
,in samplerCube reflectionSamplerHigh
#else
,in sampler2D reflectionSamplerLow
,in sampler2D reflectionSamplerHigh
#endif
#endif
#ifdef REALTIME_FILTERING
,in vec2 vReflectionFilteringInfo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
,in float seo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
,in float eho
#endif
#endif
)
{sheenOutParams outParams;float sheenIntensity=vSheenColor.a;
#ifdef SHEEN_TEXTURE
#if DEBUGMODE>0
outParams.sheenMapData=sheenMapData;
#endif
#endif
#ifdef SHEEN_LINKWITHALBEDO
float sheenFactor=pow5(1.0-sheenIntensity);vec3 sheenColor=baseColor.rgb*(1.0-sheenFactor);float sheenRoughness=sheenIntensity;outParams.surfaceAlbedo=surfaceAlbedo*sheenFactor;
#ifdef SHEEN_TEXTURE
sheenIntensity*=sheenMapData.a;
#endif
#else
vec3 sheenColor=vSheenColor.rgb;
#ifdef SHEEN_TEXTURE
#ifdef SHEEN_GAMMATEXTURE
sheenColor.rgb*=toLinearSpace(sheenMapData.rgb);
#else
sheenColor.rgb*=sheenMapData.rgb;
#endif
sheenColor.rgb*=sheenMapLevel;
#endif
#ifdef SHEEN_ROUGHNESS
float sheenRoughness=vSheenRoughness;
#ifdef SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE
#if defined(SHEEN_TEXTURE)
sheenRoughness*=sheenMapData.a;
#endif
#elif defined(SHEEN_TEXTURE_ROUGHNESS)
sheenRoughness*=sheenMapRoughnessData.a;
#endif
#else
float sheenRoughness=roughness;
#ifdef SHEEN_TEXTURE
sheenIntensity*=sheenMapData.a;
#endif
#endif
#if !defined(SHEEN_ALBEDOSCALING)
sheenIntensity*=(1.-reflectance);
#endif
sheenColor*=sheenIntensity;
#endif
#ifdef ENVIRONMENTBRDF
/*#ifdef SHEEN_SOFTER
vec3 environmentSheenBrdf=vec3(0.,0.,getBRDFLookupCharlieSheen(NdotV,sheenRoughness));
#else*/
#ifdef SHEEN_ROUGHNESS
vec3 environmentSheenBrdf=getBRDFLookup(NdotV,sheenRoughness);
#else
vec3 environmentSheenBrdf=environmentBrdf;
#endif
/*#endif*/
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
float sheenAlphaG=convertRoughnessToAverageSlope(sheenRoughness);
#ifdef SPECULARAA
sheenAlphaG+=AARoughnessFactors.y;
#endif
vec4 environmentSheenRadiance=vec4(0.,0.,0.,0.);sampleReflectionTexture(
sheenAlphaG,
vReflectionMicrosurfaceInfos,
vReflectionInfos,
vReflectionColor,
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
NdotVUnclamped,
#endif
#ifdef LINEARSPECULARREFLECTION
sheenRoughness,
#endif
reflectionSampler,
reflectionCoords,
#ifndef LODBASEDMICROSFURACE
reflectionSamplerLow,
reflectionSamplerHigh,
#endif
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
#endif
environmentSheenRadiance
);vec3 sheenEnvironmentReflectance=getSheenReflectanceFromBRDFLookup(sheenColor,environmentSheenBrdf);
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
sheenEnvironmentReflectance*=seo;
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
sheenEnvironmentReflectance*=eho;
#endif
#if DEBUGMODE>0
outParams.sheenEnvironmentReflectance=sheenEnvironmentReflectance;
#endif
outParams.finalSheenRadianceScaled=
environmentSheenRadiance.rgb *
sheenEnvironmentReflectance *
vLightingIntensity.z;
#endif
#if defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
outParams.sheenAlbedoScaling=1.0-sheenIntensity*max(max(sheenColor.r,sheenColor.g),sheenColor.b)*environmentSheenBrdf.b;
#endif
outParams.sheenIntensity=sheenIntensity;outParams.sheenColor=sheenColor;outParams.sheenRoughness=sheenRoughness;return outParams;}
#endif
`,n.IncludesShadersStore[x]||(n.IncludesShadersStore[x]=S),rn={name:x,shader:S}})),C,w,on,sn=e((()=>{t(),C=`pbrBlockClearcoat`,w=`struct clearcoatOutParams
{vec3 specularEnvironmentR0;float conservationFactor;vec3 clearCoatNormalW;vec2 clearCoatAARoughnessFactors;float clearCoatIntensity;float clearCoatRoughness;
#ifdef REFLECTION
vec3 finalClearCoatRadianceScaled;
#endif
#ifdef CLEARCOAT_TINT
vec3 absorption;float clearCoatNdotVRefract;vec3 clearCoatColor;float clearCoatThickness;
#endif
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
vec3 energyConservationFactorClearCoat;
#endif
#if DEBUGMODE>0
#ifdef CLEARCOAT_BUMP
mat3 TBNClearCoat;
#endif
#ifdef CLEARCOAT_TEXTURE
vec2 clearCoatMapData;
#endif
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
vec4 clearCoatTintMapData;
#endif
#ifdef REFLECTION
vec4 environmentClearCoatRadiance;vec3 clearCoatEnvironmentReflectance;
#endif
float clearCoatNdotV;
#endif
};
#ifdef CLEARCOAT
#define pbr_inline
#define inline
clearcoatOutParams clearcoatBlock(
in vec3 vPositionW
,in vec3 geometricNormalW
,in vec3 viewDirectionW
,in vec2 vClearCoatParams
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
,in vec4 clearCoatMapRoughnessData
#endif
,in vec3 specularEnvironmentR0
#ifdef CLEARCOAT_TEXTURE
,in vec2 clearCoatMapData
#endif
#ifdef CLEARCOAT_TINT
,in vec4 vClearCoatTintParams
,in float clearCoatColorAtDistance
,in vec4 vClearCoatRefractionParams
#ifdef CLEARCOAT_TINT_TEXTURE
,in vec4 clearCoatTintMapData
#endif
#endif
#ifdef CLEARCOAT_BUMP
,in vec2 vClearCoatBumpInfos
,in vec4 clearCoatBumpMapData
,in vec2 vClearCoatBumpUV
#if defined(TANGENT) && defined(NORMAL)
,in mat3 vTBN
#else
,in vec2 vClearCoatTangentSpaceParams
#endif
#ifdef OBJECTSPACE_NORMALMAP
,in mat4 normalMatrix
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
,in vec3 faceNormal
#endif
#ifdef REFLECTION
,in vec3 vReflectionMicrosurfaceInfos
,in vec2 vReflectionInfos
,in vec3 vReflectionColor
,in vec4 vLightingIntensity
#ifdef REFLECTIONMAP_3D
,in samplerCube reflectionSampler
#else
,in sampler2D reflectionSampler
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
,in samplerCube reflectionSamplerLow
,in samplerCube reflectionSamplerHigh
#else
,in sampler2D reflectionSamplerLow
,in sampler2D reflectionSamplerHigh
#endif
#endif
#ifdef REALTIME_FILTERING
,in vec2 vReflectionFilteringInfo
#endif
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
,in float frontFacingMultiplier
#endif
)
{clearcoatOutParams outParams;float clearCoatIntensity=vClearCoatParams.x;float clearCoatRoughness=vClearCoatParams.y;
#ifdef CLEARCOAT_TEXTURE
clearCoatIntensity*=clearCoatMapData.x;
#ifdef CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE
clearCoatRoughness*=clearCoatMapData.y;
#endif
#if DEBUGMODE>0
outParams.clearCoatMapData=clearCoatMapData;
#endif
#endif
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
clearCoatRoughness*=clearCoatMapRoughnessData.y;
#endif
outParams.clearCoatIntensity=clearCoatIntensity;outParams.clearCoatRoughness=clearCoatRoughness;
#ifdef CLEARCOAT_TINT
vec3 clearCoatColor=vClearCoatTintParams.rgb;float clearCoatThickness=vClearCoatTintParams.a;
#ifdef CLEARCOAT_TINT_TEXTURE
#ifdef CLEARCOAT_TINT_GAMMATEXTURE
clearCoatColor*=toLinearSpace(clearCoatTintMapData.rgb);
#else
clearCoatColor*=clearCoatTintMapData.rgb;
#endif
clearCoatThickness*=clearCoatTintMapData.a;
#if DEBUGMODE>0
outParams.clearCoatTintMapData=clearCoatTintMapData;
#endif
#endif
outParams.clearCoatColor=computeColorAtDistanceInMedia(clearCoatColor,clearCoatColorAtDistance);outParams.clearCoatThickness=clearCoatThickness;
#endif
#ifdef CLEARCOAT_REMAP_F0
vec3 specularEnvironmentR0Updated=getR0RemappedForClearCoat(specularEnvironmentR0);
#else
vec3 specularEnvironmentR0Updated=specularEnvironmentR0;
#endif
outParams.specularEnvironmentR0=mix(specularEnvironmentR0,specularEnvironmentR0Updated,clearCoatIntensity);vec3 clearCoatNormalW=geometricNormalW;
#ifdef CLEARCOAT_BUMP
#ifdef NORMALXYSCALE
float clearCoatNormalScale=1.0;
#else
float clearCoatNormalScale=vClearCoatBumpInfos.y;
#endif
#if defined(TANGENT) && defined(NORMAL)
mat3 TBNClearCoat=vTBN;
#else
vec2 TBNClearCoatUV=vClearCoatBumpUV*frontFacingMultiplier;mat3 TBNClearCoat=cotangent_frame(clearCoatNormalW*clearCoatNormalScale,vPositionW,TBNClearCoatUV,vClearCoatTangentSpaceParams);
#endif
#if DEBUGMODE>0
outParams.TBNClearCoat=TBNClearCoat;
#endif
#ifdef OBJECTSPACE_NORMALMAP
clearCoatNormalW=normalize(clearCoatBumpMapData.xyz *2.0-1.0);clearCoatNormalW=normalize(mat3(normalMatrix)*clearCoatNormalW);
#else
clearCoatNormalW=perturbNormal(TBNClearCoat,clearCoatBumpMapData.xyz,vClearCoatBumpInfos.y);
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
clearCoatNormalW*=sign(dot(clearCoatNormalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
clearCoatNormalW=clearCoatNormalW*frontFacingMultiplier;
#endif
outParams.clearCoatNormalW=clearCoatNormalW;outParams.clearCoatAARoughnessFactors=getAARoughnessFactors(clearCoatNormalW.xyz);float clearCoatNdotVUnclamped=dot(clearCoatNormalW,viewDirectionW);float clearCoatNdotV=absEps(clearCoatNdotVUnclamped);
#if DEBUGMODE>0
outParams.clearCoatNdotV=clearCoatNdotV;
#endif
#ifdef CLEARCOAT_TINT
vec3 clearCoatVRefract=refract(-viewDirectionW,clearCoatNormalW,vClearCoatRefractionParams.y);outParams.clearCoatNdotVRefract=absEps(dot(clearCoatNormalW,clearCoatVRefract));
#endif
#if defined(ENVIRONMENTBRDF) && (!defined(REFLECTIONMAP_SKYBOX) || defined(MS_BRDF_ENERGY_CONSERVATION))
vec3 environmentClearCoatBrdf=getBRDFLookup(clearCoatNdotV,clearCoatRoughness);
#endif
#if defined(REFLECTION)
float clearCoatAlphaG=convertRoughnessToAverageSlope(clearCoatRoughness);
#ifdef SPECULARAA
clearCoatAlphaG+=outParams.clearCoatAARoughnessFactors.y;
#endif
vec4 environmentClearCoatRadiance=vec4(0.,0.,0.,0.);vec3 clearCoatReflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),clearCoatNormalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
clearCoatReflectionVector.z*=-1.0;
#endif
#ifdef REFLECTIONMAP_3D
vec3 clearCoatReflectionCoords=clearCoatReflectionVector;
#else
vec2 clearCoatReflectionCoords=clearCoatReflectionVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
clearCoatReflectionCoords/=clearCoatReflectionVector.z;
#endif
clearCoatReflectionCoords.y=1.0-clearCoatReflectionCoords.y;
#endif
sampleReflectionTexture(
clearCoatAlphaG,
vReflectionMicrosurfaceInfos,
vReflectionInfos,
vReflectionColor,
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
clearCoatNdotVUnclamped,
#endif
#ifdef LINEARSPECULARREFLECTION
clearCoatRoughness,
#endif
reflectionSampler,
clearCoatReflectionCoords,
#ifndef LODBASEDMICROSFURACE
reflectionSamplerLow,
reflectionSamplerHigh,
#endif
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
#endif
environmentClearCoatRadiance
);
#if DEBUGMODE>0
outParams.environmentClearCoatRadiance=environmentClearCoatRadiance;
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
vec3 clearCoatEnvironmentReflectance=getReflectanceFromBRDFLookup(vec3(vClearCoatRefractionParams.x),environmentClearCoatBrdf);
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
float clearCoatEho=environmentHorizonOcclusion(-viewDirectionW,clearCoatNormalW,geometricNormalW);clearCoatEnvironmentReflectance*=clearCoatEho;
#endif
#endif
#endif
#else
vec3 clearCoatEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(clearCoatNdotV,vec3(1.),vec3(1.),sqrt(1.-clearCoatRoughness));
#endif
clearCoatEnvironmentReflectance*=clearCoatIntensity;
#if DEBUGMODE>0
outParams.clearCoatEnvironmentReflectance=clearCoatEnvironmentReflectance;
#endif
outParams.finalClearCoatRadianceScaled=
environmentClearCoatRadiance.rgb *
clearCoatEnvironmentReflectance *
vLightingIntensity.z;
#endif
#if defined(CLEARCOAT_TINT)
outParams.absorption=computeClearCoatAbsorption(outParams.clearCoatNdotVRefract,outParams.clearCoatNdotVRefract,outParams.clearCoatColor,clearCoatThickness,clearCoatIntensity);
#endif
float fresnelIBLClearCoat=fresnelSchlickGGX(clearCoatNdotV,vClearCoatRefractionParams.x,CLEARCOATREFLECTANCE90);fresnelIBLClearCoat*=clearCoatIntensity;outParams.conservationFactor=(1.-fresnelIBLClearCoat);
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
outParams.energyConservationFactorClearCoat=getEnergyConservationFactor(outParams.specularEnvironmentR0,environmentClearCoatBrdf);
#endif
return outParams;}
#endif
`,n.IncludesShadersStore[C]||(n.IncludesShadersStore[C]=w),on={name:C,shader:w}})),T,E,cn,ln=e((()=>{t(),T=`pbrBlockIridescence`,E=`struct iridescenceOutParams
{float iridescenceIntensity;float iridescenceIOR;float iridescenceThickness;vec3 specularEnvironmentR0;};
#ifdef IRIDESCENCE
#define pbr_inline
#define inline
iridescenceOutParams iridescenceBlock(
in vec4 vIridescenceParams
,in float viewAngle
,in vec3 specularEnvironmentR0
#ifdef IRIDESCENCE_TEXTURE
,in vec2 iridescenceMapData
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
,in vec2 iridescenceThicknessMapData
#endif
#ifdef CLEARCOAT
,in float NdotVUnclamped
,in vec2 vClearCoatParams
#ifdef CLEARCOAT_TEXTURE
,in vec2 clearCoatMapData
#endif
#endif
)
{iridescenceOutParams outParams;float iridescenceIntensity=vIridescenceParams.x;float iridescenceIOR=vIridescenceParams.y;float iridescenceThicknessMin=vIridescenceParams.z;float iridescenceThicknessMax=vIridescenceParams.w;float iridescenceThicknessWeight=1.;
#ifdef IRIDESCENCE_TEXTURE
iridescenceIntensity*=iridescenceMapData.x;
#endif
#if defined(IRIDESCENCE_THICKNESS_TEXTURE)
iridescenceThicknessWeight=iridescenceThicknessMapData.g;
#endif
float iridescenceThickness=mix(iridescenceThicknessMin,iridescenceThicknessMax,iridescenceThicknessWeight);float topIor=1.; 
#ifdef CLEARCOAT
float clearCoatIntensity=vClearCoatParams.x;
#ifdef CLEARCOAT_TEXTURE
clearCoatIntensity*=clearCoatMapData.x;
#endif
topIor=mix(1.0,vClearCoatRefractionParams.w-1.,clearCoatIntensity);viewAngle=sqrt(1.0+square(1.0/topIor)*(square(NdotVUnclamped)-1.0));
#endif
vec3 iridescenceFresnel=evalIridescence(topIor,iridescenceIOR,viewAngle,iridescenceThickness,specularEnvironmentR0);outParams.specularEnvironmentR0=mix(specularEnvironmentR0,iridescenceFresnel,iridescenceIntensity);outParams.iridescenceIntensity=iridescenceIntensity;outParams.iridescenceThickness=iridescenceThickness;outParams.iridescenceIOR=iridescenceIOR;return outParams;}
#endif
`,n.IncludesShadersStore[T]||(n.IncludesShadersStore[T]=E),cn={name:T,shader:E}})),D,O,un,dn=e((()=>{t(),D=`pbrBlockSubSurface`,O=`struct subSurfaceOutParams
{vec3 specularEnvironmentReflectance;
#ifdef SS_REFRACTION
vec3 finalRefraction;vec3 surfaceAlbedo;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
float alpha;
#endif
float refractionOpacity;
#endif
#ifdef SS_TRANSLUCENCY
vec3 transmittance;float translucencyIntensity;
#ifdef REFLECTION
vec3 refractionIrradiance;
#endif
#endif
#if DEBUGMODE>0
#ifdef SS_THICKNESSANDMASK_TEXTURE
vec4 thicknessMap;
#endif
#ifdef SS_REFRACTION
vec4 environmentRefraction;vec3 refractionTransmittance;
#endif
#endif
};
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
#define pbr_inline
#define inline
vec4 sampleEnvironmentRefraction(
in float ior
,in float thickness
,in float refractionLOD
,in vec3 normalW
,in vec3 vPositionW
,in vec3 viewDirectionW
,in mat4 view
,in vec4 vRefractionInfos
,in mat4 refractionMatrix
,in vec4 vRefractionMicrosurfaceInfos
,in float alphaG
#ifdef SS_REFRACTIONMAP_3D
,in samplerCube refractionSampler
#ifndef LODBASEDMICROSFURACE
,in samplerCube refractionSamplerLow
,in samplerCube refractionSamplerHigh
#endif
#else
,in sampler2D refractionSampler
#ifndef LODBASEDMICROSFURACE
,in sampler2D refractionSamplerLow
,in sampler2D refractionSamplerHigh
#endif
#endif
#ifdef ANISOTROPIC
,in anisotropicOutParams anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,in vec2 vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,in vec3 refractionPosition
,in vec3 refractionSize
#endif
) {vec4 environmentRefraction=vec4(0.,0.,0.,0.);
#ifdef ANISOTROPIC
vec3 refractionVector=refract(-viewDirectionW,anisotropicOut.anisotropicNormal,ior);
#else
vec3 refractionVector=refract(-viewDirectionW,normalW,ior);
#endif
#ifdef SS_REFRACTIONMAP_OPPOSITEZ
refractionVector.z*=-1.0;
#endif
#ifdef SS_REFRACTIONMAP_3D
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
refractionVector=parallaxCorrectNormal(vPositionW,refractionVector,refractionSize,refractionPosition);
#endif
refractionVector.y=refractionVector.y*vRefractionInfos.w;vec3 refractionCoords=refractionVector;refractionCoords=vec3(refractionMatrix*vec4(refractionCoords,0));
#else
#ifdef SS_USE_THICKNESS_AS_DEPTH
vec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*thickness,1.0)));
#else
vec3 vRefractionUVW=vec3(refractionMatrix*(view*vec4(vPositionW+refractionVector*vRefractionInfos.z,1.0)));
#endif
vec2 refractionCoords=vRefractionUVW.xy/vRefractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;
#endif
#ifdef LODBASEDMICROSFURACE
refractionLOD=refractionLOD*vRefractionMicrosurfaceInfos.y+vRefractionMicrosurfaceInfos.z;
#ifdef SS_LODINREFRACTIONALPHA
float automaticRefractionLOD=UNPACK_LOD(sampleRefraction(refractionSampler,refractionCoords).a);float requestedRefractionLOD=max(automaticRefractionLOD,refractionLOD);
#else
float requestedRefractionLOD=refractionLOD;
#endif
#if defined(REALTIME_FILTERING) && defined(SS_REFRACTIONMAP_3D)
environmentRefraction=vec4(radiance(alphaG,refractionSampler,refractionCoords,vRefractionFilteringInfo),1.0);
#else
environmentRefraction=sampleRefractionLod(refractionSampler,refractionCoords,requestedRefractionLOD);
#endif
#else
float lodRefractionNormalized=saturate(refractionLOD/log2(vRefractionMicrosurfaceInfos.x));float lodRefractionNormalizedDoubled=lodRefractionNormalized*2.0;vec4 environmentRefractionMid=sampleRefraction(refractionSampler,refractionCoords);if (lodRefractionNormalizedDoubled<1.0){environmentRefraction=mix(
sampleRefraction(refractionSamplerHigh,refractionCoords),
environmentRefractionMid,
lodRefractionNormalizedDoubled
);} else {environmentRefraction=mix(
environmentRefractionMid,
sampleRefraction(refractionSamplerLow,refractionCoords),
lodRefractionNormalizedDoubled-1.0
);}
#endif
#ifdef SS_RGBDREFRACTION
environmentRefraction.rgb=fromRGBD(environmentRefraction);
#endif
#ifdef SS_GAMMAREFRACTION
environmentRefraction.rgb=toLinearSpace(environmentRefraction.rgb);
#endif
return environmentRefraction;}
#endif
#define pbr_inline
#define inline
subSurfaceOutParams subSurfaceBlock(
in vec3 vSubSurfaceIntensity
,in vec2 vThicknessParam
,in vec4 vTintColor
,in vec3 normalW
,in vec3 vSpecularEnvironmentReflectance
#ifdef SS_THICKNESSANDMASK_TEXTURE
,in vec4 thicknessMap
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
,in vec4 refractionIntensityMap
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
,in vec4 translucencyIntensityMap
#endif
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
,in mat4 reflectionMatrix
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,in vec3 irradianceVector_
#endif
#if defined(REALTIME_FILTERING)
,in samplerCube reflectionSampler
,in vec2 vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,in sampler2D icdfSampler
#endif
#endif
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
,in samplerCube irradianceSampler
#else
,in sampler2D irradianceSampler
#endif
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
,in vec3 surfaceAlbedo
#endif
#ifdef SS_REFRACTION
,in vec3 vPositionW
,in vec3 viewDirectionW
,in mat4 view
,in vec4 vRefractionInfos
,in mat4 refractionMatrix
,in vec4 vRefractionMicrosurfaceInfos
,in vec4 vLightingIntensity
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
,in float alpha
#endif
#ifdef SS_LODINREFRACTIONALPHA
,in float NdotVUnclamped
#endif
#ifdef SS_LINEARSPECULARREFRACTION
,in float roughness
#endif
,in float alphaG
#ifdef SS_REFRACTIONMAP_3D
,in samplerCube refractionSampler
#ifndef LODBASEDMICROSFURACE
,in samplerCube refractionSamplerLow
,in samplerCube refractionSamplerHigh
#endif
#else
,in sampler2D refractionSampler
#ifndef LODBASEDMICROSFURACE
,in sampler2D refractionSamplerLow
,in sampler2D refractionSamplerHigh
#endif
#endif
#ifdef ANISOTROPIC
,in anisotropicOutParams anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,in vec2 vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,in vec3 refractionPosition
,in vec3 refractionSize
#endif
#ifdef SS_DISPERSION
,in float dispersion
#endif
#endif
#ifdef SS_TRANSLUCENCY
,in vec3 vDiffusionDistance
,in vec4 vTranslucencyColor
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
,in vec4 translucencyColorMap
#endif
#endif
)
{subSurfaceOutParams outParams;outParams.specularEnvironmentReflectance=vSpecularEnvironmentReflectance;
#ifdef SS_REFRACTION
float refractionIntensity=vSubSurfaceIntensity.x;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
refractionIntensity*=(1.0-alpha);outParams.alpha=1.0;
#endif
#endif
#ifdef SS_TRANSLUCENCY
float translucencyIntensity=vSubSurfaceIntensity.y;
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
#ifdef SS_USE_GLTF_TEXTURES
float thickness=thicknessMap.g*vThicknessParam.y+vThicknessParam.x;
#else
float thickness=thicknessMap.r*vThicknessParam.y+vThicknessParam.x;
#endif
#if DEBUGMODE>0
outParams.thicknessMap=thicknessMap;
#endif
#if defined(SS_REFRACTION) && defined(SS_REFRACTION_USE_INTENSITY_FROM_THICKNESS)
#ifdef SS_USE_GLTF_TEXTURES
refractionIntensity*=thicknessMap.r;
#else
refractionIntensity*=thicknessMap.g;
#endif
#endif
#if defined(SS_TRANSLUCENCY) && defined(SS_TRANSLUCENCY_USE_INTENSITY_FROM_THICKNESS)
#ifdef SS_USE_GLTF_TEXTURES
translucencyIntensity*=thicknessMap.a;
#else
translucencyIntensity*=thicknessMap.b;
#endif
#endif
#else
float thickness=vThicknessParam.y;
#endif
#if defined(SS_REFRACTION) && defined(SS_REFRACTIONINTENSITY_TEXTURE)
#ifdef SS_USE_GLTF_TEXTURES
refractionIntensity*=refractionIntensityMap.r;
#else
refractionIntensity*=refractionIntensityMap.g;
#endif
#endif
#if defined(SS_TRANSLUCENCY) && defined(SS_TRANSLUCENCYINTENSITY_TEXTURE)
#ifdef SS_USE_GLTF_TEXTURES
translucencyIntensity*=translucencyIntensityMap.a;
#else
translucencyIntensity*=translucencyIntensityMap.b;
#endif
#endif
#ifdef SS_TRANSLUCENCY
thickness=maxEps(thickness);vec4 translucencyColor=vTranslucencyColor;
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
translucencyColor*=translucencyColorMap;
#endif
vec3 transmittance=transmittanceBRDF_Burley(translucencyColor.rgb,vDiffusionDistance,thickness);transmittance*=translucencyIntensity;outParams.transmittance=transmittance;outParams.translucencyIntensity=translucencyIntensity;
#endif
#ifdef SS_REFRACTION
vec4 environmentRefraction=vec4(0.,0.,0.,0.);
#ifdef SS_HAS_THICKNESS
float ior=vRefractionInfos.y;
#else
float ior=vRefractionMicrosurfaceInfos.w;
#endif
#ifdef SS_LODINREFRACTIONALPHA
float refractionAlphaG=alphaG;refractionAlphaG=mix(alphaG,0.0,clamp(ior*3.0-2.0,0.0,1.0));float refractionLOD=getLodFromAlphaG(vRefractionMicrosurfaceInfos.x,refractionAlphaG,NdotVUnclamped);
#elif defined(SS_LINEARSPECULARREFRACTION)
float refractionRoughness=alphaG;refractionRoughness=mix(alphaG,0.0,clamp(ior*3.0-2.0,0.0,1.0));float refractionLOD=getLinearLodFromRoughness(vRefractionMicrosurfaceInfos.x,refractionRoughness);
#else
float refractionAlphaG=alphaG;refractionAlphaG=mix(alphaG,0.0,clamp(ior*3.0-2.0,0.0,1.0));float refractionLOD=getLodFromAlphaG(vRefractionMicrosurfaceInfos.x,refractionAlphaG);
#endif
float refraction_ior=vRefractionInfos.y;
#ifdef SS_DISPERSION
float realIOR=1.0/refraction_ior;float iorDispersionSpread=0.04*dispersion*(realIOR-1.0);vec3 iors=vec3(1.0/(realIOR-iorDispersionSpread),refraction_ior,1.0/(realIOR+iorDispersionSpread));for (int i=0; i<3; i++) {refraction_ior=iors[i];
#endif
vec4 envSample=sampleEnvironmentRefraction(refraction_ior,thickness,refractionLOD,normalW,vPositionW,viewDirectionW,view,vRefractionInfos,refractionMatrix,vRefractionMicrosurfaceInfos,alphaG
#ifdef SS_REFRACTIONMAP_3D
,refractionSampler
#ifndef LODBASEDMICROSFURACE
,refractionSamplerLow
,refractionSamplerHigh
#endif
#else
,refractionSampler
#ifndef LODBASEDMICROSFURACE
,refractionSamplerLow
,refractionSamplerHigh
#endif
#endif
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,refractionPosition
,refractionSize
#endif
);
#ifdef SS_DISPERSION
environmentRefraction[i]=envSample[i];}
#else
environmentRefraction=envSample;
#endif
environmentRefraction.rgb*=vRefractionInfos.x;
#endif
#ifdef SS_REFRACTION
vec3 refractionTransmittance=vec3(refractionIntensity);
#ifdef SS_THICKNESSANDMASK_TEXTURE
vec3 volumeAlbedo=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);refractionTransmittance*=cocaLambert(volumeAlbedo,thickness);
#elif defined(SS_LINKREFRACTIONTOTRANSPARENCY)
float maxChannel=max(max(surfaceAlbedo.r,surfaceAlbedo.g),surfaceAlbedo.b);vec3 volumeAlbedo=saturate(maxChannel*surfaceAlbedo);environmentRefraction.rgb*=volumeAlbedo;
#else
vec3 volumeAlbedo=computeColorAtDistanceInMedia(vTintColor.rgb,vTintColor.w);refractionTransmittance*=cocaLambert(volumeAlbedo,vThicknessParam.y);
#endif
#ifdef SS_ALBEDOFORREFRACTIONTINT
environmentRefraction.rgb*=surfaceAlbedo.rgb;
#endif
outParams.surfaceAlbedo=surfaceAlbedo;outParams.refractionOpacity=1.-refractionIntensity;
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
outParams.surfaceAlbedo*=outParams.refractionOpacity;
#endif
#ifdef UNUSED_MULTIPLEBOUNCES
vec3 bounceSpecularEnvironmentReflectance=(2.0*vSpecularEnvironmentReflectance)/(1.0+vSpecularEnvironmentReflectance);outParams.specularEnvironmentReflectance=mix(bounceSpecularEnvironmentReflectance,vSpecularEnvironmentReflectance,refractionIntensity);
#endif
#if DEBUGMODE>0
outParams.refractionTransmittance=refractionTransmittance;
#endif
outParams.finalRefraction=environmentRefraction.rgb*refractionTransmittance*vLightingIntensity.z;outParams.finalRefraction*=vec3(1.0)-vSpecularEnvironmentReflectance;
#if DEBUGMODE>0
outParams.environmentRefraction=environmentRefraction;
#endif
#endif
#if defined(REFLECTION) && defined(SS_TRANSLUCENCY)
#if defined(NORMAL) && defined(USESPHERICALINVERTEX) || !defined(USESPHERICALFROMREFLECTIONMAP)
vec3 irradianceVector=vec3(reflectionMatrix*vec4(normalW,0)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0;
#endif
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;
#endif
#else
vec3 irradianceVector=irradianceVector_;
#endif
#if defined(USESPHERICALFROMREFLECTIONMAP)
#if defined(REALTIME_FILTERING)
vec3 refractionIrradiance=irradiance(reflectionSampler,-irradianceVector,vReflectionFilteringInfo,0.0,surfaceAlbedo,irradianceVector
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
);
#else
vec3 refractionIrradiance=computeEnvironmentIrradiance(-irradianceVector);
#endif
#elif defined(USEIRRADIANCEMAP)
#ifdef REFLECTIONMAP_3D
vec3 irradianceCoords=irradianceVector;
#else
vec2 irradianceCoords=irradianceVector.xy;
#ifdef REFLECTIONMAP_PROJECTION
irradianceCoords/=irradianceVector.z;
#endif
irradianceCoords.y=1.0-irradianceCoords.y;
#endif
vec4 refractionIrradiance=sampleReflection(irradianceSampler,-irradianceCoords);
#ifdef RGBDREFLECTION
refractionIrradiance.rgb=fromRGBD(refractionIrradiance);
#endif
#ifdef GAMMAREFLECTION
refractionIrradiance.rgb=toLinearSpace(refractionIrradiance.rgb);
#endif
#else
vec4 refractionIrradiance=vec4(0.);
#endif
refractionIrradiance.rgb*=transmittance;
#ifdef SS_ALBEDOFORTRANSLUCENCYTINT
refractionIrradiance.rgb*=surfaceAlbedo.rgb;
#endif
outParams.refractionIrradiance=refractionIrradiance.rgb;
#endif
return outParams;}
#endif
`,n.IncludesShadersStore[D]||(n.IncludesShadersStore[D]=O),un={name:D,shader:O}})),k,A,fn,pn=e((()=>{t(),k=`pbrBlockReflectance0`,A=`float reflectanceF0=reflectivityOut.reflectanceF0;vec3 specularEnvironmentR0=reflectivityOut.colorReflectanceF0;vec3 specularEnvironmentR90=reflectivityOut.colorReflectanceF90;
#ifdef ALPHAFRESNEL
float reflectance90=fresnelGrazingReflectance(reflectanceF0);specularEnvironmentR90=specularEnvironmentR90*reflectance90;
#endif
`,n.IncludesShadersStore[k]||(n.IncludesShadersStore[k]=A),fn={name:k,shader:A}})),j,M,mn,hn=e((()=>{t(),ze(),pn(),j=`pbrClusteredLightingFunctions`,M=`#if defined(CLUSTLIGHT_BATCH) && CLUSTLIGHT_BATCH>0
#include<clusteredLightingFunctions>
#define inline
lightingInfo computeClusteredLighting(
sampler2D lightDataTexture,
sampler2D tileMaskTexture,
vec4 lightData,
ivec2 sliceRange,
vec3 V,
vec3 N,
vec3 posW,
vec3 surfaceAlbedo,
reflectivityOutParams reflectivityOut
#ifdef IRIDESCENCE
,float iridescenceIntensity
#endif
#ifdef SS_TRANSLUCENCY
,subSurfaceOutParams subSurfaceOut
#endif
#ifdef SPECULARTERM
,float AARoughnessFactor
#endif
#ifdef ANISOTROPIC
,anisotropicOutParams anisotropicOut
#endif
#ifdef SHEEN
,sheenOutParams sheenOut
#endif
#ifdef CLEARCOAT
,clearcoatOutParams clearcoatOut
#endif
) {float NdotV=absEps(dot(N,V));
#include<pbrBlockReflectance0>
#ifdef CLEARCOAT
specularEnvironmentR0=clearcoatOut.specularEnvironmentR0;
#endif
lightingInfo result;ivec2 tilePosition=ivec2(gl_FragCoord.xy*lightData.xy);int maskHeight=int(lightData.z);tilePosition.y=min(tilePosition.y,maskHeight-1);ivec2 batchRange=sliceRange/CLUSTLIGHT_BATCH;int batchOffset=batchRange.x*CLUSTLIGHT_BATCH;tilePosition.y+=maskHeight*batchRange.x;for (int i=batchRange.x; i<=batchRange.y; i+=1) {uint mask=uint(texelFetch(tileMaskTexture,tilePosition,0).r);tilePosition.y+=maskHeight;int maskOffset=max(sliceRange.x-batchOffset,0);int maskWidth=min(sliceRange.y-batchOffset+1,CLUSTLIGHT_BATCH);mask=extractBits(mask,maskOffset,maskWidth);while (mask != 0u) {uint bit=mask & -mask;mask ^= bit;int position=onlyBitPosition(bit);ClusteredLight light=getClusteredLight(lightDataTexture,batchOffset+maskOffset+position);preLightingInfo preInfo=computePointAndSpotPreLightingInfo(light.vLightData,V,N,posW);preInfo.NdotV=NdotV;preInfo.attenuation=computeDistanceLightFalloff(preInfo.lightOffset,preInfo.lightDistanceSquared,light.vLightFalloff.x,light.vLightFalloff.y);if (light.vLightDirection.w>=0.0) {preInfo.attenuation*=computeDirectionalLightFalloff(light.vLightDirection.xyz,preInfo.L,light.vLightDirection.w,light.vLightData.w,light.vLightFalloff.z,light.vLightFalloff.w);}
preInfo.roughness=adjustRoughnessFromLightProperties(reflectivityOut.roughness,light.vLightSpecular.a,preInfo.lightDistance);preInfo.diffuseRoughness=reflectivityOut.diffuseRoughness;preInfo.surfaceAlbedo=surfaceAlbedo;
#ifdef IRIDESCENCE
preInfo.iridescenceIntensity=iridescenceIntensity;
#endif
lightingInfo info;
#ifdef SS_TRANSLUCENCY
#ifdef SS_TRANSLUCENCY_LEGACY
info.diffuse=computeDiffuseTransmittedLighting(preInfo,light.vLightDiffuse.rgb,subSurfaceOut.transmittance);info.diffuseTransmission=vec3(0);
#else
info.diffuse=computeDiffuseLighting(preInfo,light.vLightDiffuse.rgb)*(1.0-subSurfaceOut.translucencyIntensity);info.diffuseTransmission=computeDiffuseTransmittedLighting(preInfo,light.vLightDiffuse.rgb,subSurfaceOut.transmittance);
#endif
#else
info.diffuse=computeDiffuseLighting(preInfo,light.vLightDiffuse.rgb);
#endif
#ifdef SPECULARTERM
#if CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR
vec3 metalFresnel=reflectivityOut.specularWeight*getF82Specular(preInfo.VdotH,specularEnvironmentR0,reflectivityOut.colorReflectanceF90,reflectivityOut.roughness);vec3 dielectricFresnel=fresnelSchlickGGX(preInfo.VdotH,reflectivityOut.dielectricColorF0,reflectivityOut.colorReflectanceF90);vec3 coloredFresnel=mix(dielectricFresnel,metalFresnel,reflectivityOut.metallic);
#else
vec3 coloredFresnel=fresnelSchlickGGX(preInfo.VdotH,specularEnvironmentR0,reflectivityOut.colorReflectanceF90);
#endif
#ifndef LEGACY_SPECULAR_ENERGY_CONSERVATION
float NdotH=dot(N,preInfo.H);vec3 fresnel=fresnelSchlickGGX(NdotH,vec3(reflectanceF0),specularEnvironmentR90);info.diffuse*=(vec3(1.0)-fresnel);
#endif
#ifdef ANISOTROPIC
info.specular=computeAnisotropicSpecularLighting(preInfo,V,N,anisotropicOut.anisotropicTangent,anisotropicOut.anisotropicBitangent,anisotropicOut.anisotropy,specularEnvironmentR0,specularEnvironmentR90,AARoughnessFactor,light.vLightDiffuse.rgb);
#else
info.specular=computeSpecularLighting(preInfo,N,specularEnvironmentR0,coloredFresnel,AARoughnessFactor,light.vLightDiffuse.rgb);
#endif
#endif
#ifdef SHEEN
#ifdef SHEEN_LINKWITHALBEDO
preInfo.roughness=sheenOut.sheenIntensity;
#else
preInfo.roughness=adjustRoughnessFromLightProperties(sheenOut.sheenRoughness,light.vLightSpecular.a,preInfo.lightDistance);
#endif
info.sheen=computeSheenLighting(preInfo,normalW,sheenOut.sheenColor,specularEnvironmentR90,AARoughnessFactor,light.vLightDiffuse.rgb);
#endif
#ifdef CLEARCOAT
preInfo.roughness=adjustRoughnessFromLightProperties(clearcoatOut.clearCoatRoughness,light.vLightSpecular.a,preInfo.lightDistance);info.clearCoat=computeClearCoatLighting(preInfo,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatAARoughnessFactors.x,clearcoatOut.clearCoatIntensity,light.vLightDiffuse.rgb);
#ifdef CLEARCOAT_TINT
float absorption=computeClearCoatLightingAbsorption(clearcoatOut.clearCoatNdotVRefract,preInfo.L,clearcoatOut.clearCoatNormalW,clearcoatOut.clearCoatColor,clearcoatOut.clearCoatThickness,clearcoatOut.clearCoatIntensity);info.diffuse*=absorption;
#ifdef SS_TRANSLUCENCY
info.diffuseTransmission*=absorption;
#endif
#ifdef SPECULARTERM
info.specular*=absorption;
#endif
#endif
info.diffuse*=info.clearCoat.w;
#ifdef SS_TRANSLUCENCY
info.diffuseTransmission*=info.clearCoat.w;
#endif
#ifdef SPECULARTERM
info.specular*=info.clearCoat.w;
#endif
#ifdef SHEEN
info.sheen*=info.clearCoat.w;
#endif
#endif
result.diffuse+=info.diffuse;
#ifdef SS_TRANSLUCENCY
result.diffuseTransmission+=info.diffuseTransmission;
#endif
#ifdef SPECULARTERM
result.specular+=info.specular;
#endif
#ifdef CLEARCOAT
result.clearCoat+=info.clearCoat;
#endif
#ifdef SHEEN
result.sheen+=info.sheen;
#endif
}
batchOffset+=CLUSTLIGHT_BATCH;}
return result;}
#endif
`,n.IncludesShadersStore[j]||(n.IncludesShadersStore[j]=M),mn={name:j,shader:M}})),N,P,gn,_n=e((()=>{t(),N=`pbrBlockNormalFinal`,P=`#if defined(FORCENORMALFORWARD) && defined(NORMAL)
vec3 faceNormal=normalize(cross(dFdx(vPositionW),dFdy(vPositionW)))*vEyePosition.w;
#if defined(TWOSIDEDLIGHTING)
faceNormal=gl_FrontFacing ? faceNormal : -faceNormal;
#endif
normalW*=sign(dot(normalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
#if defined(MIRRORED)
normalW=gl_FrontFacing ? -normalW : normalW;
#else
normalW=gl_FrontFacing ? normalW : -normalW;
#endif
#endif
`,n.IncludesShadersStore[N]||(n.IncludesShadersStore[N]=P),gn={name:N,shader:P}})),F,I,vn,yn=e((()=>{t(),F=`pbrBlockLightmapInit`,I=`#ifdef LIGHTMAP
vec4 lightmapColor=TEXRD(lightmapSampler,vLightmapUV+uvOffset);
#ifdef RGBDLIGHTMAP
lightmapColor.rgb=fromRGBD(lightmapColor);
#endif
#ifdef GAMMALIGHTMAP
lightmapColor.rgb=toLinearSpace(lightmapColor.rgb);
#endif
lightmapColor.rgb*=vLightmapInfos.y;
#endif
`,n.IncludesShadersStore[F]||(n.IncludesShadersStore[F]=I),vn={name:F,shader:I}})),L,R,bn,xn=e((()=>{t(),L=`pbrBlockGeometryInfo`,R=`float NdotVUnclamped=dot(normalW,viewDirectionW);float NdotV=absEps(NdotVUnclamped);float alphaG=convertRoughnessToAverageSlope(roughness);vec2 AARoughnessFactors=getAARoughnessFactors(normalW.xyz);
#ifdef SPECULARAA
alphaG+=AARoughnessFactors.y;
#endif
#if defined(ENVIRONMENTBRDF)
vec3 environmentBrdf=getBRDFLookup(NdotV,roughness);
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef RADIANCEOCCLUSION
#ifdef AMBIENTINGRAYSCALE
float ambientMonochrome=aoOut.ambientOcclusionColor.r;
#else
float ambientMonochrome=getLuminance(aoOut.ambientOcclusionColor);
#endif
float seo=environmentRadianceOcclusion(ambientMonochrome,NdotVUnclamped);
#endif
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
float eho=environmentHorizonOcclusion(-viewDirectionW,normalW,geometricNormalW);
#endif
#endif
#endif
#endif
`,n.IncludesShadersStore[L]||(n.IncludesShadersStore[L]=R),bn={name:L,shader:R}})),z,B,Sn,Cn=e((()=>{t(),z=`pbrBlockReflectance`,B=`#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
vec3 baseSpecularEnvironmentReflectance=getReflectanceFromBRDFLookup(vec3(reflectanceF0),reflectivityOut.reflectanceF90,environmentBrdf);
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
vec3 metalEnvironmentReflectance=reflectivityOut.specularWeight*getF82Specular(NdotV,clearcoatOut.specularEnvironmentR0,reflectivityOut.colorReflectanceF90,reflectivityOut.roughness);vec3 dielectricEnvironmentReflectance=getReflectanceFromBRDFLookup(reflectivityOut.dielectricColorF0,reflectivityOut.colorReflectanceF90,environmentBrdf);vec3 colorSpecularEnvironmentReflectance=mix(dielectricEnvironmentReflectance,metalEnvironmentReflectance,reflectivityOut.metallic);
#else
vec3 colorSpecularEnvironmentReflectance=getReflectanceFromBRDFLookup(clearcoatOut.specularEnvironmentR0,reflectivityOut.colorReflectanceF90,environmentBrdf);
#endif
#ifdef RADIANCEOCCLUSION
colorSpecularEnvironmentReflectance*=seo;
#endif
#ifdef HORIZONOCCLUSION
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
colorSpecularEnvironmentReflectance*=eho;
#endif
#endif
#endif
#else
vec3 colorSpecularEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(NdotV,clearcoatOut.specularEnvironmentR0,specularEnvironmentR90,sqrt(microSurface));vec3 baseSpecularEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(NdotV,vec3(reflectanceF0),reflectivityOut.reflectanceF90,sqrt(microSurface));
#endif
#ifdef CLEARCOAT
colorSpecularEnvironmentReflectance*=clearcoatOut.conservationFactor;
#if defined(CLEARCOAT_TINT)
colorSpecularEnvironmentReflectance*=clearcoatOut.absorption;
#endif
#endif
`,n.IncludesShadersStore[z]||(n.IncludesShadersStore[z]=B),Sn={name:z,shader:B}})),V,H,wn,Tn=e((()=>{t(),V=`pbrBlockDirectLighting`,H=`vec3 diffuseBase=vec3(0.,0.,0.);
#ifdef SS_TRANSLUCENCY
vec3 diffuseTransmissionBase=vec3(0.,0.,0.);
#endif
#ifdef SPECULARTERM
vec3 specularBase=vec3(0.,0.,0.);
#endif
#ifdef CLEARCOAT
vec3 clearCoatBase=vec3(0.,0.,0.);
#endif
#ifdef SHEEN
vec3 sheenBase=vec3(0.,0.,0.);
#endif
#if defined(SPECULARTERM) && defined(LIGHT0)
vec3 coloredFresnel;
#endif
preLightingInfo preInfo;lightingInfo info;float shadow=1.; 
float aggShadow=0.;float numLights=0.;
#if defined(CLEARCOAT) && defined(CLEARCOAT_TINT)
vec3 absorption=vec3(0.);
#endif
`,n.IncludesShadersStore[V]||(n.IncludesShadersStore[V]=H),wn={name:V,shader:H}})),U,W,En,Dn=e((()=>{t(),U=`pbrBlockFinalLitComponents`,W=`aggShadow=aggShadow/numLights;
#if defined(ENVIRONMENTBRDF)
#ifdef MS_BRDF_ENERGY_CONSERVATION
vec3 baseSpecularEnergyConservationFactor=getEnergyConservationFactor(vec3(reflectanceF0),environmentBrdf);vec3 coloredEnergyConservationFactor=getEnergyConservationFactor(clearcoatOut.specularEnvironmentR0,environmentBrdf);
#endif
#endif
#if defined(SHEEN) && defined(SHEEN_ALBEDOSCALING) && defined(ENVIRONMENTBRDF)
surfaceAlbedo.rgb=sheenOut.sheenAlbedoScaling*surfaceAlbedo.rgb;
#endif
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
#ifndef METALLICWORKFLOW
#ifdef SPECULAR_GLOSSINESS_ENERGY_CONSERVATION
surfaceAlbedo.rgb=(1.-reflectanceF0)*surfaceAlbedo.rgb;
#endif
#endif
#endif
#ifdef REFLECTION
vec3 finalIrradiance=reflectionOut.environmentIrradiance;
#ifndef LEGACY_SPECULAR_ENERGY_CONSERVATION
#if defined(METALLICWORKFLOW) || defined(SPECULAR_GLOSSINESS_ENERGY_CONSERVATION)
vec3 baseSpecularEnergy=vec3(baseSpecularEnvironmentReflectance);
#if defined(ENVIRONMENTBRDF)
#ifdef MS_BRDF_ENERGY_CONSERVATION
baseSpecularEnergy*=baseSpecularEnergyConservationFactor;
#endif
#endif
finalIrradiance*=clamp(vec3(1.0)-baseSpecularEnergy,0.0,1.0);
#endif
#endif
#if defined(CLEARCOAT)
finalIrradiance*=clearcoatOut.conservationFactor;
#if defined(CLEARCOAT_TINT)
finalIrradiance*=clearcoatOut.absorption;
#endif
#endif
#ifndef SS_APPLY_ALBEDO_AFTER_SUBSURFACE
finalIrradiance*=surfaceAlbedo.rgb;
#endif
#if defined(SS_REFRACTION) && !defined(LEGACY_SPECULAR_ENERGY_CONSERVATION) 
finalIrradiance*=subSurfaceOut.refractionOpacity;
#endif
#if defined(SS_TRANSLUCENCY)
finalIrradiance*=(1.0-subSurfaceOut.translucencyIntensity);finalIrradiance+=subSurfaceOut.refractionIrradiance;
#endif
#ifdef SS_APPLY_ALBEDO_AFTER_SUBSURFACE
finalIrradiance*=surfaceAlbedo.rgb;
#endif
finalIrradiance*=vLightingIntensity.z;finalIrradiance*=aoOut.ambientOcclusionColor;
#endif
#ifdef SPECULARTERM
vec3 finalSpecular=specularBase;finalSpecular=max(finalSpecular,0.0);vec3 finalSpecularScaled=finalSpecular*vLightingIntensity.x*vLightingIntensity.w;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
finalSpecularScaled*=coloredEnergyConservationFactor;
#endif
#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
finalSpecularScaled*=sheenOut.sheenAlbedoScaling;
#endif
#endif
#ifdef REFLECTION
vec3 finalRadiance=reflectionOut.environmentRadiance.rgb;finalRadiance*=colorSpecularEnvironmentReflectance;vec3 finalRadianceScaled=finalRadiance*vLightingIntensity.z;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
finalRadianceScaled*=coloredEnergyConservationFactor;
#endif
#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
finalRadianceScaled*=sheenOut.sheenAlbedoScaling;
#endif
#endif
#ifdef SHEEN
vec3 finalSheen=sheenBase*sheenOut.sheenColor;finalSheen=max(finalSheen,0.0);vec3 finalSheenScaled=finalSheen*vLightingIntensity.x*vLightingIntensity.w;
#if defined(CLEARCOAT) && defined(REFLECTION) && defined(ENVIRONMENTBRDF)
sheenOut.finalSheenRadianceScaled*=clearcoatOut.conservationFactor;
#if defined(CLEARCOAT_TINT)
sheenOut.finalSheenRadianceScaled*=clearcoatOut.absorption;
#endif
#endif
#endif
#ifdef CLEARCOAT
vec3 finalClearCoat=clearCoatBase;finalClearCoat=max(finalClearCoat,0.0);vec3 finalClearCoatScaled=finalClearCoat*vLightingIntensity.x*vLightingIntensity.w;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
finalClearCoatScaled*=clearcoatOut.energyConservationFactorClearCoat;
#endif
#ifdef SS_REFRACTION
subSurfaceOut.finalRefraction*=clearcoatOut.conservationFactor;
#ifdef CLEARCOAT_TINT
subSurfaceOut.finalRefraction*=clearcoatOut.absorption;
#endif
#endif
#endif
#ifdef ALPHABLEND
float luminanceOverAlpha=0.0;
#if defined(REFLECTION) && defined(RADIANCEOVERALPHA)
luminanceOverAlpha+=getLuminance(finalRadianceScaled);
#if defined(CLEARCOAT)
luminanceOverAlpha+=getLuminance(clearcoatOut.finalClearCoatRadianceScaled);
#endif
#endif
#if defined(SPECULARTERM) && defined(SPECULAROVERALPHA)
luminanceOverAlpha+=getLuminance(finalSpecularScaled);
#endif
#if defined(CLEARCOAT) && defined(CLEARCOATOVERALPHA)
luminanceOverAlpha+=getLuminance(finalClearCoatScaled);
#endif
#if defined(RADIANCEOVERALPHA) || defined(SPECULAROVERALPHA) || defined(CLEARCOATOVERALPHA)
alpha=saturate(alpha+luminanceOverAlpha*luminanceOverAlpha);
#endif
#endif
`,n.IncludesShadersStore[U]||(n.IncludesShadersStore[U]=W),En={name:U,shader:W}})),G,K,On,kn=e((()=>{t(),G=`pbrBlockFinalUnlitComponents`,K=`vec3 finalDiffuse=diffuseBase;finalDiffuse*=surfaceAlbedo;
#if defined(SS_REFRACTION) && !defined(UNLIT) && !defined(LEGACY_SPECULAR_ENERGY_CONSERVATION)
finalDiffuse*=subSurfaceOut.refractionOpacity;
#endif
#if defined(SS_TRANSLUCENCY) && !defined(UNLIT)
finalDiffuse+=diffuseTransmissionBase;
#endif
finalDiffuse=max(finalDiffuse,0.0);finalDiffuse*=vLightingIntensity.x;vec3 finalAmbient=vAmbientColor;finalAmbient*=surfaceAlbedo.rgb;vec3 finalEmissive=vEmissiveColor;
#ifdef EMISSIVE
vec3 emissiveColorTex=TEXRD(emissiveSampler,vEmissiveUV+uvOffset).rgb;
#ifdef GAMMAEMISSIVE
finalEmissive*=toLinearSpace(emissiveColorTex.rgb);
#else
finalEmissive*=emissiveColorTex.rgb;
#endif
finalEmissive*= vEmissiveInfos.y;
#endif
finalEmissive*=vLightingIntensity.y;
#ifdef AMBIENT
vec3 ambientOcclusionForDirectDiffuse=mix(vec3(1.),aoOut.ambientOcclusionColor,vAmbientInfos.w);
#else
vec3 ambientOcclusionForDirectDiffuse=aoOut.ambientOcclusionColor;
#endif
finalAmbient*=aoOut.ambientOcclusionColor;finalDiffuse*=ambientOcclusionForDirectDiffuse;
`,n.IncludesShadersStore[G]||(n.IncludesShadersStore[G]=K),On={name:G,shader:K}})),q,J,An,jn=e((()=>{t(),q=`pbrBlockFinalColorComposition`,J=`vec4 finalColor=vec4(
#ifndef UNLIT
#ifdef REFLECTION
finalIrradiance +
#endif
#ifdef SPECULARTERM
finalSpecularScaled +
#endif
#ifdef SHEEN
finalSheenScaled +
#endif
#ifdef CLEARCOAT
finalClearCoatScaled +
#endif
#ifdef REFLECTION
finalRadianceScaled +
#if defined(SHEEN) && defined(ENVIRONMENTBRDF)
sheenOut.finalSheenRadianceScaled +
#endif
#ifdef CLEARCOAT
clearcoatOut.finalClearCoatRadianceScaled +
#endif
#endif
#ifdef SS_REFRACTION
subSurfaceOut.finalRefraction +
#endif
#endif
finalAmbient +
finalDiffuse,
alpha);
#ifdef LIGHTMAP
#ifndef LIGHTMAPEXCLUDED
#ifdef USELIGHTMAPASSHADOWMAP
finalColor.rgb*=lightmapColor.rgb;
#else
finalColor.rgb+=lightmapColor.rgb;
#endif
#endif
#endif
finalColor.rgb+=finalEmissive;
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,0.0);
`,n.IncludesShadersStore[q]||(n.IncludesShadersStore[q]=J),An={name:q,shader:J}})),Y,X,Mn,Nn=e((()=>{t(),Y=`pbrBlockPrePass`,X=`#if SCENE_MRT_COUNT>0
float writeGeometryInfo=finalColor.a>ALPHATESTVALUE ? 1.0 : 0.0;
#ifdef PREPASS_POSITION
gl_FragData[PREPASS_POSITION_INDEX]=vec4(vPositionW,writeGeometryInfo);
#endif
#ifdef PREPASS_LOCAL_POSITION
gl_FragData[PREPASS_LOCAL_POSITION_INDEX]=vec4(vPosition,writeGeometryInfo);
#endif
#if defined(PREPASS_VELOCITY)
vec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;vec2 b=(vPreviousPosition.xy/vPreviousPosition.w)*0.5+0.5;vec2 velocity=abs(a-b);velocity=vec2(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;gl_FragData[PREPASS_VELOCITY_INDEX]=vec4(velocity,0.0,writeGeometryInfo);
#elif defined(PREPASS_VELOCITY_LINEAR)
vec2 velocity=vec2(0.5)*((vPreviousPosition.xy/vPreviousPosition.w)-(vCurrentPosition.xy/vCurrentPosition.w));gl_FragData[PREPASS_VELOCITY_LINEAR_INDEX]=vec4(velocity,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO
gl_FragData[PREPASS_ALBEDO_INDEX]=vec4(surfaceAlbedo,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
vec3 sqAlbedo=sqrt(surfaceAlbedo); 
#endif
#ifdef PREPASS_IRRADIANCE_LEGACY
vec3 irradiance=finalDiffuse;
#ifndef UNLIT
#ifdef REFLECTION
irradiance+=finalIrradiance;
#endif
#endif
#ifdef SS_SCATTERING
#ifdef PREPASS_COLOR
gl_FragData[PREPASS_COLOR_INDEX]=vec4(finalColor.rgb-irradiance,finalColor.a); 
#endif
irradiance/=sqAlbedo;
#else
#ifdef PREPASS_COLOR
gl_FragData[PREPASS_COLOR_INDEX]=finalColor; 
#endif
float scatteringDiffusionProfile=255.;
#endif
gl_FragData[PREPASS_IRRADIANCE_LEGACY_INDEX]=vec4(clamp(irradiance,vec3(0.),vec3(1.)),writeGeometryInfo*scatteringDiffusionProfile/255.); 
#else
#ifdef PREPASS_IRRADIANCE
vec3 irradiance=finalDiffuse;
#ifndef UNLIT
#ifdef REFLECTION
irradiance+=finalIrradiance;
#endif
#endif
gl_FragData[PREPASS_IRRADIANCE_INDEX]=vec4(irradiance,writeGeometryInfo);
#endif
#if defined(PREPASS_COLOR)
gl_FragData[PREPASS_COLOR_INDEX]=vec4(finalColor.rgb,finalColor.a);
#endif
#endif
#ifdef PREPASS_DEPTH
gl_FragData[PREPASS_DEPTH_INDEX]=vec4(vViewPos.z,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_SCREENSPACE_DEPTH
gl_FragData[PREPASS_SCREENSPACE_DEPTH_INDEX]=vec4(gl_FragCoord.z,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
gl_FragData[PREPASS_NORMALIZED_VIEW_DEPTH_INDEX]=vec4(vNormViewDepth,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMAL
#ifdef PREPASS_NORMAL_WORLDSPACE
gl_FragData[PREPASS_NORMAL_INDEX]=vec4(normalW,writeGeometryInfo);
#else
gl_FragData[PREPASS_NORMAL_INDEX]=vec4(normalize((view*vec4(normalW,0.0)).rgb),writeGeometryInfo);
#endif
#endif
#ifdef PREPASS_WORLD_NORMAL
gl_FragData[PREPASS_WORLD_NORMAL_INDEX]=vec4(normalW*0.5+0.5,writeGeometryInfo); 
#endif
#ifdef PREPASS_ALBEDO_SQRT
gl_FragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4(sqAlbedo,writeGeometryInfo); 
#endif
#ifdef PREPASS_REFLECTIVITY
#ifndef UNLIT
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4(specularEnvironmentR0,microSurface)*writeGeometryInfo;
#else
gl_FragData[PREPASS_REFLECTIVITY_INDEX]=vec4( 0.0,0.0,0.0,1.0 )*writeGeometryInfo;
#endif
#endif
#endif
`,n.IncludesShadersStore[Y]||(n.IncludesShadersStore[Y]=X),Mn={name:Y,shader:X}})),Pn=ee({pbrPixelShader:()=>$}),Z,Q,Fn,$,In=e((()=>{t(),Qe(),Ge(),et(),Bt(),We(),nt(),Rt(),it(),yt(),Me(),Pe(),ce(),Ht(),dt(),Wt(),ye(),he(),Oe(),le(),Ze(),De(),Tt(),ht(),jt(),be(),Re(),Ce(),Ie(),St(),Dt(),mt(),gt(),Nt(),ft(),ie(),re(),He(),at(),Kt(),Jt(),Xt(),Qt(),en(),nn(),an(),sn(),ln(),dn(),ze(),pn(),hn(),ue(),bt(),ne(),_n(),st(),yn(),xn(),Cn(),Tn(),Ae(),Dn(),kn(),jn(),xe(),de(),Mt(),Nn(),$e(),Pt(),Z=`pbrPixelShader`,Q=`#define PBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_EXTENSION
#if defined(BUMP) || !defined(NORMAL) || defined(FORCENORMALFORWARD) || defined(SPECULARAA) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC)
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef LODBASEDMICROSFURACE
#extension GL_EXT_shader_texture_lod : enable
#endif
#define CUSTOM_FRAGMENT_BEGIN
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#if SCENE_MRT_COUNT>0
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#endif
precision highp float;
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<__decl__pbrFragment>
#include<pbrFragmentExtraDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<pbrFragmentSamplersDeclaration>
#include<imageProcessingDeclaration>
#include<clipPlaneFragmentDeclaration>
#include<logDepthDeclaration>
#include<fogFragmentDeclaration>
#include<textureRepetitionFunctions>
#include<helperFunctions>
#include<subSurfaceScatteringFunctions>
#include<importanceSampling>
#include<pbrHelperFunctions>
#include<imageProcessingFunctions>
#include<shadowsFragmentFunctions>
#include<harmonicsFunctions>
#include<pbrDirectLightingSetupFunctions>
#include<pbrDirectLightingFalloffFunctions>
#include<pbrBRDFFunctions>
#include<hdrFilteringFunctions>
#include<pbrDirectLightingFunctions>
#include<pbrIBLFunctions>
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<pbrBlockAlbedoOpacity>
#include<pbrBlockReflectivity>
#include<pbrBlockAmbientOcclusion>
#include<pbrBlockAlphaFresnel>
#include<pbrBlockAnisotropic>
#include<pbrBlockReflection>
#include<pbrBlockSheen>
#include<pbrBlockClearcoat>
#include<pbrBlockIridescence>
#include<pbrBlockSubSurface>
#include<pbrClusteredLightingFunctions>
void main(void) {
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
#include<bumpFragment>
#include<pbrBlockNormalFinal>
albedoOpacityOutParams albedoOpacityOut;
#ifdef ALBEDO
vec4 albedoTexture=TEXRD(albedoSampler,vAlbedoUV+uvOffset);
#endif
#ifdef BASE_WEIGHT
vec4 baseWeightTexture=TEXRD(baseWeightSampler,vBaseWeightUV+uvOffset);
#endif
#ifdef OPACITY
vec4 opacityMap=TEXRD(opacitySampler,vOpacityUV+uvOffset);
#endif
#ifdef DECAL
vec4 decalColor=texture2D(decalSampler,vDecalUV+uvOffset);
#endif
albedoOpacityOut=albedoOpacityBlock(
vAlbedoColor
#ifdef ALBEDO
,albedoTexture
,vAlbedoInfos
#endif
,baseWeight
#ifdef BASE_WEIGHT
,baseWeightTexture
,vBaseWeightInfos
#endif
#ifdef OPACITY
,opacityMap
,vOpacityInfos
#endif
#ifdef DETAIL
,detailColor
,vDetailInfos
#endif
#ifdef DECAL
,decalColor
,vDecalInfos
#endif
);vec3 surfaceAlbedo=albedoOpacityOut.surfaceAlbedo;float alpha=albedoOpacityOut.alpha;
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
ambientOcclusionOutParams aoOut;
#ifdef AMBIENT
vec3 ambientOcclusionColorMap=TEXRD(ambientSampler,vAmbientUV+uvOffset).rgb;
#endif
aoOut=ambientOcclusionBlock(
#ifdef AMBIENT
ambientOcclusionColorMap,
vAmbientInfos
#endif
);
#include<pbrBlockLightmapInit>
#ifdef UNLIT
vec3 diffuseBase=vec3(1.,1.,1.);
#else 
vec3 baseColor=surfaceAlbedo;reflectivityOutParams reflectivityOut;
#if defined(REFLECTIVITY)
vec4 surfaceMetallicOrReflectivityColorMap=TEXRD(reflectivitySampler,vReflectivityUV+uvOffset);vec4 baseReflectivity=surfaceMetallicOrReflectivityColorMap;
#ifndef METALLICWORKFLOW
#ifdef REFLECTIVITY_GAMMA
surfaceMetallicOrReflectivityColorMap=toLinearSpace(surfaceMetallicOrReflectivityColorMap);
#endif
surfaceMetallicOrReflectivityColorMap.rgb*=vReflectivityInfos.y;
#endif
#endif
#if defined(MICROSURFACEMAP)
vec4 microSurfaceTexel=TEXRD(microSurfaceSampler,vMicroSurfaceSamplerUV+uvOffset)*vMicroSurfaceSamplerInfos.y;
#endif
#ifdef METALLICWORKFLOW
vec4 metallicReflectanceFactors=vMetallicReflectanceFactors;
#ifdef REFLECTANCE
vec4 reflectanceFactorsMap=TEXRD(reflectanceSampler,vReflectanceUV+uvOffset);
#ifdef REFLECTANCE_GAMMA
reflectanceFactorsMap=toLinearSpace(reflectanceFactorsMap);
#endif
metallicReflectanceFactors.rgb*=reflectanceFactorsMap.rgb;
#endif
#ifdef METALLIC_REFLECTANCE
vec4 metallicReflectanceFactorsMap=TEXRD(metallicReflectanceSampler,vMetallicReflectanceUV+uvOffset);
#ifdef METALLIC_REFLECTANCE_GAMMA
metallicReflectanceFactorsMap=toLinearSpace(metallicReflectanceFactorsMap);
#endif
#ifndef METALLIC_REFLECTANCE_USE_ALPHA_ONLY
metallicReflectanceFactors.rgb*=metallicReflectanceFactorsMap.rgb;
#endif
metallicReflectanceFactors.a*=metallicReflectanceFactorsMap.a;
#endif
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
float baseDiffuseRoughnessTexture=TEXRD(baseDiffuseRoughnessSampler,vBaseDiffuseRoughnessUV+uvOffset).r;
#endif
reflectivityOut=reflectivityBlock(
vReflectivityColor
#ifdef METALLICWORKFLOW
,surfaceAlbedo
,metallicReflectanceFactors
#endif
,baseDiffuseRoughness
#ifdef BASE_DIFFUSE_ROUGHNESS
,baseDiffuseRoughnessTexture
,vBaseDiffuseRoughnessInfos
#endif
#ifdef REFLECTIVITY
,vReflectivityInfos
,surfaceMetallicOrReflectivityColorMap
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
,aoOut.ambientOcclusionColor
#endif
#ifdef MICROSURFACEMAP
,microSurfaceTexel
#endif
#ifdef DETAIL
,detailColor
,vDetailInfos
#endif
);float microSurface=reflectivityOut.microSurface;float roughness=reflectivityOut.roughness;float diffuseRoughness=reflectivityOut.diffuseRoughness;
#ifdef METALLICWORKFLOW
surfaceAlbedo=reflectivityOut.surfaceAlbedo;
#endif
#if defined(METALLICWORKFLOW) && defined(REFLECTIVITY) && defined(AOSTOREINMETALMAPRED)
aoOut.ambientOcclusionColor=reflectivityOut.ambientOcclusionColor;
#endif
#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
alphaFresnelOutParams alphaFresnelOut;alphaFresnelOut=alphaFresnelBlock(
normalW,
viewDirectionW,
alpha,
microSurface
);alpha=alphaFresnelOut.alpha;
#endif
#endif
#include<pbrBlockGeometryInfo>
#ifdef ANISOTROPIC
anisotropicOutParams anisotropicOut;
#ifdef ANISOTROPIC_TEXTURE
vec3 anisotropyMapData=TEXRD(anisotropySampler,vAnisotropyUV+uvOffset).rgb*vAnisotropyInfos.y;
#endif
anisotropicOut=anisotropicBlock(
vAnisotropy,
roughness,
#ifdef ANISOTROPIC_TEXTURE
anisotropyMapData,
#endif
TBN,
normalW,
viewDirectionW
);
#endif
#ifdef REFLECTION
reflectionOutParams reflectionOut;
#ifndef USE_CUSTOM_REFLECTION
reflectionOut=reflectionBlock(
vPositionW
,normalW
,alphaG
,vReflectionMicrosurfaceInfos
,vReflectionInfos
,vReflectionColor
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
,NdotVUnclamped
#endif
#ifdef LINEARSPECULARREFLECTION
,roughness
#endif
,reflectionSampler
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,vReflectionDominantDirection
#endif
#endif
#ifndef LODBASEDMICROSFURACE
,reflectionSamplerLow
,reflectionSamplerHigh
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,viewDirectionW
,diffuseRoughness
,baseColor
);
#else
#define CUSTOM_REFLECTION
#endif
#endif
#include<pbrBlockReflectance0>
#ifdef SHEEN
sheenOutParams sheenOut;
#ifdef SHEEN_TEXTURE
vec4 sheenMapData=TEXRD(sheenSampler,vSheenUV+uvOffset);
#endif
#if defined(SHEEN_ROUGHNESS) && defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
vec4 sheenMapRoughnessData=TEXRD(sheenRoughnessSampler,vSheenRoughnessUV+uvOffset)*vSheenInfos.w;
#endif
sheenOut=sheenBlock(
vSheenColor
#ifdef SHEEN_ROUGHNESS
,vSheenRoughness
#if defined(SHEEN_TEXTURE_ROUGHNESS) && !defined(SHEEN_USE_ROUGHNESS_FROM_MAINTEXTURE)
,sheenMapRoughnessData
#endif
#endif
,roughness
#ifdef SHEEN_TEXTURE
,sheenMapData
,vSheenInfos.y
#endif
,reflectanceF0
#ifdef SHEEN_LINKWITHALBEDO
,baseColor
,surfaceAlbedo
#endif
#ifdef ENVIRONMENTBRDF
,NdotV
,environmentBrdf
#endif
#if defined(REFLECTION) && defined(ENVIRONMENTBRDF)
,AARoughnessFactors
,vReflectionMicrosurfaceInfos
,vReflectionInfos
,vReflectionColor
,vLightingIntensity
,reflectionSampler
,reflectionOut.reflectionCoords
,NdotVUnclamped
#ifndef LODBASEDMICROSFURACE
,reflectionSamplerLow
,reflectionSamplerHigh
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(RADIANCEOCCLUSION)
,seo
#endif
#if !defined(REFLECTIONMAP_SKYBOX) && defined(HORIZONOCCLUSION) && defined(BUMP) && defined(REFLECTIONMAP_3D)
,eho
#endif
#endif
);
#ifdef SHEEN_LINKWITHALBEDO
surfaceAlbedo=sheenOut.surfaceAlbedo;
#endif
#endif
#ifdef CLEARCOAT
#ifdef CLEARCOAT_TEXTURE
vec2 clearCoatMapData=TEXRD(clearCoatSampler,vClearCoatUV+uvOffset).rg*vClearCoatInfos.y;
#endif
#endif
#ifdef IRIDESCENCE
iridescenceOutParams iridescenceOut;
#ifdef IRIDESCENCE_TEXTURE
vec2 iridescenceMapData=TEXRD(iridescenceSampler,vIridescenceUV+uvOffset).rg*vIridescenceInfos.y;
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
vec2 iridescenceThicknessMapData=TEXRD(iridescenceThicknessSampler,vIridescenceThicknessUV+uvOffset).rg*vIridescenceInfos.w;
#endif
iridescenceOut=iridescenceBlock(
vIridescenceParams
,NdotV
,specularEnvironmentR0
#ifdef IRIDESCENCE_TEXTURE
,iridescenceMapData
#endif
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
,iridescenceThicknessMapData
#endif
#ifdef CLEARCOAT
,NdotVUnclamped
,vClearCoatParams
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#endif
);float iridescenceIntensity=iridescenceOut.iridescenceIntensity;specularEnvironmentR0=iridescenceOut.specularEnvironmentR0;
#endif
clearcoatOutParams clearcoatOut;
#ifdef CLEARCOAT
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
vec4 clearCoatMapRoughnessData=TEXRD(clearCoatRoughnessSampler,vClearCoatRoughnessUV+uvOffset)*vClearCoatInfos.w;
#endif
#if defined(CLEARCOAT_TINT) && defined(CLEARCOAT_TINT_TEXTURE)
vec4 clearCoatTintMapData=TEXRD(clearCoatTintSampler,vClearCoatTintUV+uvOffset);
#endif
#ifdef CLEARCOAT_BUMP
vec4 clearCoatBumpMapData=TEXRD(clearCoatBumpSampler,vClearCoatBumpUV+uvOffset);
#endif
clearcoatOut=clearcoatBlock(
vPositionW
,geometricNormalW
,viewDirectionW
,vClearCoatParams
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
,clearCoatMapRoughnessData
#endif
,specularEnvironmentR0
#ifdef CLEARCOAT_TEXTURE
,clearCoatMapData
#endif
#ifdef CLEARCOAT_TINT
,vClearCoatTintParams
,clearCoatColorAtDistance
,vClearCoatRefractionParams
#ifdef CLEARCOAT_TINT_TEXTURE
,clearCoatTintMapData
#endif
#endif
#ifdef CLEARCOAT_BUMP
,vClearCoatBumpInfos
,clearCoatBumpMapData
,vClearCoatBumpUV
#if defined(TANGENT) && defined(NORMAL)
,vTBN
#else
,vClearCoatTangentSpaceParams
#endif
#ifdef OBJECTSPACE_NORMALMAP
,normalMatrix
#endif
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
,faceNormal
#endif
#ifdef REFLECTION
,vReflectionMicrosurfaceInfos
,vReflectionInfos
,vReflectionColor
,vLightingIntensity
,reflectionSampler
#ifndef LODBASEDMICROSFURACE
,reflectionSamplerLow
,reflectionSamplerHigh
#endif
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
,(gl_FrontFacing ? 1. : -1.)
#endif
);
#else
clearcoatOut.specularEnvironmentR0=specularEnvironmentR0;
#endif
#include<pbrBlockReflectance>
subSurfaceOutParams subSurfaceOut;
#ifdef SUBSURFACE
#ifdef SS_THICKNESSANDMASK_TEXTURE
vec4 thicknessMap=TEXRD(thicknessSampler,vThicknessUV+uvOffset);
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
vec4 refractionIntensityMap=TEXRD(refractionIntensitySampler,vRefractionIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
vec4 translucencyIntensityMap=TEXRD(translucencyIntensitySampler,vTranslucencyIntensityUV+uvOffset);
#endif
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
vec4 translucencyColorMap=TEXRD(translucencyColorSampler,vTranslucencyColorUV+uvOffset);
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE_GAMMA
translucencyColorMap=toLinearSpace(translucencyColorMap);
#endif
#endif
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
vec3 vSpecularEnvironmentReflectance=vec3(max(colorSpecularEnvironmentReflectance.r,max(colorSpecularEnvironmentReflectance.g,colorSpecularEnvironmentReflectance.b)));
#endif
subSurfaceOut=subSurfaceBlock(
vSubSurfaceIntensity
,vThicknessParam
,vTintColor
,normalW
#ifdef LEGACY_SPECULAR_ENERGY_CONSERVATION
,vSpecularEnvironmentReflectance
#else
,baseSpecularEnvironmentReflectance
#endif
#ifdef SS_THICKNESSANDMASK_TEXTURE
,thicknessMap
#endif
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
,refractionIntensityMap
#endif
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
,translucencyIntensityMap
#endif
#ifdef REFLECTION
#ifdef SS_TRANSLUCENCY
,reflectionMatrix
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
,reflectionOut.irradianceVector
#endif
#if defined(REALTIME_FILTERING)
,reflectionSampler
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
#endif
#endif
#endif
#if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
,surfaceAlbedo
#endif
#ifdef SS_REFRACTION
,vPositionW
,viewDirectionW
,view
,vRefractionInfos
,refractionMatrix
,vRefractionMicrosurfaceInfos
,vLightingIntensity
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
,alpha
#endif
#ifdef SS_LODINREFRACTIONALPHA
,NdotVUnclamped
#endif
#ifdef SS_LINEARSPECULARREFRACTION
,roughness
#endif
,alphaG
,refractionSampler
#ifndef LODBASEDMICROSFURACE
,refractionSamplerLow
,refractionSamplerHigh
#endif
#ifdef ANISOTROPIC
,anisotropicOut
#endif
#ifdef REALTIME_FILTERING
,vRefractionFilteringInfo
#endif
#ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
,vRefractionPosition
,vRefractionSize
#endif
#ifdef SS_DISPERSION
,dispersion
#endif
#endif
#ifdef SS_TRANSLUCENCY
,vDiffusionDistance
,vTranslucencyColor
#ifdef SS_TRANSLUCENCYCOLOR_TEXTURE
,translucencyColorMap
#endif
#endif
);
#ifdef SS_REFRACTION
surfaceAlbedo=subSurfaceOut.surfaceAlbedo;
#ifdef SS_LINKREFRACTIONTOTRANSPARENCY
alpha=subSurfaceOut.alpha;
#endif
#endif
#else
subSurfaceOut.specularEnvironmentReflectance=colorSpecularEnvironmentReflectance;
#endif
#include<pbrBlockDirectLighting>
#include<lightFragment>[0..maxSimultaneousLights]
#include<pbrBlockFinalLitComponents>
#endif 
#include<pbrBlockFinalUnlitComponents>
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
#include<pbrBlockFinalColorComposition>
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<pbrBlockPrePass>
#endif
#if !defined(PREPASS) || defined(WEBGL2)
gl_FragColor=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {frontColor.rgb+=finalColor.rgb*finalColor.a*alphaMultiplier;frontColor.a=1.0-alphaMultiplier*(1.0-finalColor.a);} else {backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
}
`,n.ShadersStore[Z]||(n.ShadersStore[Z]=Q),Fn=[Ke,Xe,Je,zt,Ue,tt,Lt,rt,It,je,Ne,se,Vt,lt,Ut,ve,ge,Ee,pe,qe,Te,wt,_t,Ot,Se,Le,we,Fe,Ct,Ft,pt,vt,xt,ut,oe,te,Ve,ot,Gt,qt,Yt,Zt,$t,tn,rn,on,cn,un,Be,fn,mn,fe,At,ae,gn,ct,vn,bn,Sn,wn,ke,En,On,An,_e,me,Et,Mn,Ye,kt];for(let e of Fn)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);$={name:Z,shader:Q}}));export{$ as n,Pn as r,In as t};