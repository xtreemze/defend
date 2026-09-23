import{n as e,r as ee}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{n as te,t as r}from"./samplerFragmentDeclaration-EP0koXA0.js";import{a as ne,c as re,n as ie,o as ae,r as oe,t as se}from"./fogFragment-DddV-x4-.js";import{r as ce,t as le}from"./clipPlaneFragmentDeclaration-BeW0wzU5.js";import{c as ue,i as de,o as fe,r as pe,s as me,t as he}from"./imageProcessingFunctions-C5BKlD0g.js";import{r as ge,t as _e}from"./harmonicsFunctions-DgCylLPg.js";import{i as ve,n as ye,o as be,t as xe}from"./logDepthDeclaration-DEg-fR3E.js";import{a as Se,i as Ce,n as we,t as Te}from"./lightUboDeclaration-C5wTJIy-.js";import{a as Ee,i as De,n as Oe,t as ke}from"./shadowsFragmentFunctions-Bc-DtcDh.js";import{n as Ae,t as je}from"./reflectionFunction-CYt6SqVq.js";import{n as Me,t as Ne}from"./sceneUboDeclaration-DY0whaDI.js";import{a as Pe,c as Fe,i as Ie,l as Le,n as Re,o as ze,r as Be,s as Ve,t as He,u as i}from"./oitFragment-Db3N6RUB.js";import{n as Ue,t as We}from"./meshUboDeclaration-DmH0C9dB.js";import{n as Ge,t as Ke}from"./mainUVVaryingDeclaration-BlaxkZjG.js";import{n as qe,t as Je}from"./depthPrePass-CgCyzsEz.js";import{i as Ye,n as Xe,r as a,t as Ze}from"./pbrIBLFunctions-DbBTfOiP.js";import{a as Qe,c as $e,d as o,f as et,i as tt,l as nt,n as rt,o as it,r as at,s as ot,t as st,u as ct}from"./openpbrTransmissionLayerData-BIop0oFs.js";import{n as lt,t as ut}from"./pbrBRDFFunctions-B2sEeQXA.js";import{i as dt,n as ft,r as pt,t as mt}from"./hdrFilteringFunctions-Dr3F2B6G.js";import{n as ht,t as gt}from"./openpbrUboDeclaration-DUwW8LRK.js";import{_ as _t,a as vt,c as yt,d as bt,f as xt,g as St,h as Ct,i as wt,l as Tt,m as Et,n as Dt,o as Ot,p as kt,r as At,s as jt,t as Mt,u as Nt,v as Pt}from"./pbrDebug-Bgn2KxJW.js";var s,c,l,Ft=e((()=>{t(),o(),i(),s=`openpbrFragmentDeclaration`,c=`uniform float vBaseWeight;uniform vec4 vBaseColor;uniform float vBaseDiffuseRoughness;uniform vec4 vReflectanceInfo;uniform vec4 vSpecularColor;uniform vec3 vSpecularAnisotropy;uniform float vTransmissionWeight;uniform vec3 vTransmissionColor;uniform float vTransmissionDepth;uniform vec3 vTransmissionScatter;uniform float vTransmissionScatterAnisotropy;uniform float vTransmissionDispersionScale;uniform float vTransmissionDispersionAbbeNumber;uniform float vSubsurfaceWeight;uniform vec3 vSubsurfaceColor;uniform float vSubsurfaceRadius;uniform vec3 vSubsurfaceRadiusScale;uniform float vSubsurfaceScatterAnisotropy;uniform float vCoatWeight;uniform vec3 vCoatColor;uniform float vCoatRoughness;uniform float vCoatRoughnessAnisotropy;uniform float vCoatIor;uniform float vCoatDarkening;uniform float vFuzzWeight;uniform vec3 vFuzzColor;uniform float vFuzzRoughness;uniform vec2 vGeometryCoatTangent;uniform float vGeometryThickness;uniform vec3 vEmissionColor;uniform float vThinFilmWeight;uniform vec2 vThinFilmThickness;uniform float vThinFilmIor;uniform float vGeometryThinWalled;uniform vec4 vLightingIntensity;uniform float visibility;uniform vec2 renderTargetSize;
#ifdef BASE_COLOR
uniform vec2 vBaseColorInfos;
#endif
#ifdef BASE_WEIGHT
uniform vec2 vBaseWeightInfos;
#endif
#ifdef BASE_METALNESS
uniform vec2 vBaseMetalnessInfos;
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
uniform vec2 vBaseDiffuseRoughnessInfos;
#endif
#ifdef SPECULAR_WEIGHT
uniform vec2 vSpecularWeightInfos;
#endif
#ifdef SPECULAR_COLOR
uniform vec2 vSpecularColorInfos;
#endif
#ifdef SPECULAR_ROUGHNESS
uniform vec2 vSpecularRoughnessInfos;
#endif
#ifdef SPECULAR_ROUGHNESS_ANISOTROPY
uniform vec2 vSpecularRoughnessAnisotropyInfos;
#endif
#ifdef SPECULAR_IOR
uniform vec2 vSpecularIorInfos;
#endif
#ifdef AMBIENT_OCCLUSION
uniform vec2 vAmbientOcclusionInfos;
#endif
#ifdef GEOMETRY_NORMAL
uniform vec2 vGeometryNormalInfos;
#endif
#ifdef GEOMETRY_TANGENT
uniform vec2 vGeometryTangentInfos;
#endif
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
uniform vec2 vTangentSpaceParams;
#endif
#ifdef GEOMETRY_COAT_NORMAL
uniform vec2 vGeometryCoatNormalInfos;
#endif
#ifdef GEOMETRY_OPACITY
uniform vec2 vGeometryOpacityInfos;
#endif
#ifdef GEOMETRY_THICKNESS
uniform vec2 vGeometryThicknessInfos;
#endif
#ifdef EMISSION_COLOR
uniform vec2 vEmissionColorInfos;
#endif
#ifdef TRANSMISSION_WEIGHT
uniform vec2 vTransmissionWeightInfos;
#endif
#ifdef TRANSMISSION_COLOR
uniform vec2 vTransmissionColorInfos;
#endif
#ifdef TRANSMISSION_DEPTH
uniform vec2 vTransmissionDepthInfos;
#endif
#ifdef TRANSMISSION_SCATTER
uniform vec2 vTransmissionScatterInfos;
#endif
#ifdef TRANSMISSION_DISPERSION_SCALE
uniform vec2 vTransmissionDispersionScaleInfos;
#endif
#ifdef SUBSURFACE_WEIGHT
uniform vec2 vSubsurfaceWeightInfos;
#endif
#ifdef SUBSURFACE_COLOR
uniform vec2 vSubsurfaceColorInfos;
#endif
#ifdef SUBSURFACE_RADIUS_SCALE
uniform vec2 vSubsurfaceRadiusScaleInfos;
#endif
#ifdef COAT_WEIGHT
uniform vec2 vCoatWeightInfos;
#endif
#ifdef COAT_COLOR
uniform vec2 vCoatColorInfos;
#endif
#ifdef COAT_ROUGHNESS
uniform vec2 vCoatRoughnessInfos;
#endif
#ifdef COAT_ROUGHNESS_ANISOTROPY
uniform vec2 vCoatRoughnessAnisotropyInfos;
#endif
#ifdef COAT_IOR
uniform vec2 vCoatIorInfos;
#endif
#ifdef COAT_DARKENING
uniform vec2 vCoatDarkeningInfos;
#endif
#ifdef FUZZ_WEIGHT
uniform vec2 vFuzzWeightInfos;
#endif
#ifdef FUZZ_COLOR
uniform vec2 vFuzzColorInfos;
#endif
#ifdef FUZZ_ROUGHNESS
uniform vec2 vFuzzRoughnessInfos;
#endif
#ifdef GEOMETRY_COAT_TANGENT
uniform vec2 vGeometryCoatTangentInfos;
#endif
#ifdef THIN_FILM_WEIGHT
uniform vec2 vThinFilmWeightInfos;
#endif
#ifdef THIN_FILM_THICKNESS
uniform vec2 vThinFilmThicknessInfos;
#endif
#include<sceneFragmentDeclaration>
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
#ifdef REFRACTED_BACKGROUND
uniform mat4 backgroundRefractionMatrix;uniform vec3 vBackgroundRefractionInfos;
#endif
#if TEXTURE_REPETITION_MODE>0
uniform vec4 vTextureRepetitionHexTilingParams;
#endif
#define ADDITIONAL_FRAGMENT_DECLARATION
`,n.IncludesShadersStore[s]||(n.IncludesShadersStore[s]=c),l={name:s,shader:c}})),u,d,f,It=e((()=>{t(),r(),a(),u=`openpbrFragmentSamplersDeclaration`,d=`#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_SAMPLERNAME_,baseColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_WEIGHT,_VARYINGNAME_,BaseWeight,_SAMPLERNAME_,baseWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_DIFFUSE_ROUGHNESS,_VARYINGNAME_,BaseDiffuseRoughness,_SAMPLERNAME_,baseDiffuseRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_METALNESS,_VARYINGNAME_,BaseMetalness,_SAMPLERNAME_,baseMetalness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_WEIGHT,_VARYINGNAME_,SpecularWeight,_SAMPLERNAME_,specularWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_COLOR,_VARYINGNAME_,SpecularColor,_SAMPLERNAME_,specularColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS,_VARYINGNAME_,SpecularRoughness,_SAMPLERNAME_,specularRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SPECULAR_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,SpecularRoughnessAnisotropy,_SAMPLERNAME_,specularRoughnessAnisotropy)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_WEIGHT,_VARYINGNAME_,TransmissionWeight,_SAMPLERNAME_,transmissionWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_COLOR,_VARYINGNAME_,TransmissionColor,_SAMPLERNAME_,transmissionColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_DEPTH,_VARYINGNAME_,TransmissionDepth,_SAMPLERNAME_,transmissionDepth)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_SCATTER,_VARYINGNAME_,TransmissionScatter,_SAMPLERNAME_,transmissionScatter)
#include<samplerFragmentDeclaration>(_DEFINENAME_,TRANSMISSION_DISPERSION_SCALE,_VARYINGNAME_,TransmissionDispersionScale,_SAMPLERNAME_,transmissionDispersionScale)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_WEIGHT,_VARYINGNAME_,SubsurfaceWeight,_SAMPLERNAME_,subsurfaceWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_COLOR,_VARYINGNAME_,SubsurfaceColor,_SAMPLERNAME_,subsurfaceColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,SUBSURFACE_RADIUS_SCALE,_VARYINGNAME_,SubsurfaceRadiusScale,_SAMPLERNAME_,subsurfaceRadiusScale)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_WEIGHT,_VARYINGNAME_,CoatWeight,_SAMPLERNAME_,coatWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_COLOR,_VARYINGNAME_,CoatColor,_SAMPLERNAME_,coatColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_ROUGHNESS,_VARYINGNAME_,CoatRoughness,_SAMPLERNAME_,coatRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_ROUGHNESS_ANISOTROPY,_VARYINGNAME_,CoatRoughnessAnisotropy,_SAMPLERNAME_,coatRoughnessAnisotropy)
#include<samplerFragmentDeclaration>(_DEFINENAME_,COAT_DARKENING,_VARYINGNAME_,CoatDarkening,_SAMPLERNAME_,coatDarkening)
#include<samplerFragmentDeclaration>(_DEFINENAME_,FUZZ_WEIGHT,_VARYINGNAME_,FuzzWeight,_SAMPLERNAME_,fuzzWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,FUZZ_COLOR,_VARYINGNAME_,FuzzColor,_SAMPLERNAME_,fuzzColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,FUZZ_ROUGHNESS,_VARYINGNAME_,FuzzRoughness,_SAMPLERNAME_,fuzzRoughness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_OPACITY,_VARYINGNAME_,GeometryOpacity,_SAMPLERNAME_,geometryOpacity)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_TANGENT,_VARYINGNAME_,GeometryTangent,_SAMPLERNAME_,geometryTangent)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_TANGENT,_VARYINGNAME_,GeometryCoatTangent,_SAMPLERNAME_,geometryCoatTangent)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_THICKNESS,_VARYINGNAME_,GeometryThickness,_SAMPLERNAME_,geometryThickness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,EMISSION_COLOR,_VARYINGNAME_,EmissionColor,_SAMPLERNAME_,emissionColor)
#include<samplerFragmentDeclaration>(_DEFINENAME_,THIN_FILM_WEIGHT,_VARYINGNAME_,ThinFilmWeight,_SAMPLERNAME_,thinFilmWeight)
#include<samplerFragmentDeclaration>(_DEFINENAME_,THIN_FILM_THICKNESS,_VARYINGNAME_,ThinFilmThickness,_SAMPLERNAME_,thinFilmThickness)
#include<samplerFragmentDeclaration>(_DEFINENAME_,AMBIENT_OCCLUSION,_VARYINGNAME_,AmbientOcclusion,_SAMPLERNAME_,ambientOcclusion)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DECAL,_VARYINGNAME_,Decal,_SAMPLERNAME_,decal)
#include<pbrFragmentReflectionDeclaration>
#ifdef ENVIRONMENTBRDF
uniform sampler2D environmentBrdfSampler;
#endif
#ifdef FUZZENVIRONMENTBRDF
uniform sampler2D environmentFuzzBrdfSampler;
#endif
#ifdef REFRACTED_BACKGROUND
uniform sampler2D backgroundRefractionSampler;
#endif
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
uniform sampler2D sceneIrradianceSampler;uniform sampler2D sceneDepthSampler;
#endif
#if defined(ANISOTROPIC) || defined(FUZZ) || defined(REFRACTED_BACKGROUND) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING)
uniform sampler2D blueNoiseSampler;
#endif
#ifdef IBL_CDF_FILTERING
uniform sampler2D icdfSampler;
#endif
`,n.IncludesShadersStore[u]||(n.IncludesShadersStore[u]=d),f={name:u,shader:d}})),p,m,h,Lt=e((()=>{t(),p=`openpbrNormalMapFragmentMainFunctions`,m=`#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(ANISOTROPIC) || defined(FUZZ) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;
#endif
#ifdef OBJECTSPACE_NORMALMAP
uniform mat4 normalMatrix;
#if defined(WEBGL2) || defined(WEBGPU)
mat4 toNormalMatrix(mat4 wMatrix)
{mat4 ret=inverse(wMatrix);ret=transpose(ret);ret[0][3]=0.;ret[1][3]=0.;ret[2][3]=0.;ret[3]=vec4(0.,0.,0.,1.);return ret;}
#else
mat4 toNormalMatrix(mat4 m)
{float
a00=m[0][0],a01=m[0][1],a02=m[0][2],a03=m[0][3],
a10=m[1][0],a11=m[1][1],a12=m[1][2],a13=m[1][3],
a20=m[2][0],a21=m[2][1],a22=m[2][2],a23=m[2][3],
a30=m[3][0],a31=m[3][1],a32=m[3][2],a33=m[3][3],
b00=a00*a11-a01*a10,
b01=a00*a12-a02*a10,
b02=a00*a13-a03*a10,
b03=a01*a12-a02*a11,
b04=a01*a13-a03*a11,
b05=a02*a13-a03*a12,
b06=a20*a31-a21*a30,
b07=a20*a32-a22*a30,
b08=a20*a33-a23*a30,
b09=a21*a32-a22*a31,
b10=a21*a33-a23*a31,
b11=a22*a33-a23*a32,
det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;mat4 mi=mat4(
a11*b11-a12*b10+a13*b09,
a02*b10-a01*b11-a03*b09,
a31*b05-a32*b04+a33*b03,
a22*b04-a21*b05-a23*b03,
a12*b08-a10*b11-a13*b07,
a00*b11-a02*b08+a03*b07,
a32*b02-a30*b05-a33*b01,
a20*b05-a22*b02+a23*b01,
a10*b10-a11*b08+a13*b06,
a01*b08-a00*b10-a03*b06,
a30*b04-a31*b02+a33*b00,
a21*b02-a20*b04-a23*b00,
a11*b07-a10*b09-a12*b06,
a00*b09-a01*b07+a02*b06,
a31*b01-a30*b03-a32*b00,
a20*b03-a21*b01+a22*b00)/det;return mat4(mi[0][0],mi[1][0],mi[2][0],mi[3][0],
mi[0][1],mi[1][1],mi[2][1],mi[3][1],
mi[0][2],mi[1][2],mi[2][2],mi[3][2],
mi[0][3],mi[1][3],mi[2][3],mi[3][3]);}
#endif
#endif
vec3 perturbNormalBase(mat3 cotangentFrame,vec3 normal,float scale)
{
#ifdef NORMALXYSCALE
normal=normalize(normal*vec3(scale,scale,1.0));
#endif
return normalize(cotangentFrame*normal);}
vec3 perturbNormal(mat3 cotangentFrame,vec3 textureSample,float scale)
{return perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);}
mat3 cotangent_frame(vec3 normal,vec3 p,vec2 uv,vec2 tangentSpaceParams)
{vec3 dp1=dFdx(p);vec3 dp2=dFdy(p);vec2 duv1=dFdx(uv);vec2 duv2=dFdy(uv);vec3 dp2perp=cross(dp2,normal);vec3 dp1perp=cross(normal,dp1);vec3 tangent=dp2perp*duv1.x+dp1perp*duv2.x;vec3 bitangent=dp2perp*duv1.y+dp1perp*duv2.y;tangent*=tangentSpaceParams.x;bitangent*=tangentSpaceParams.y;float det=max(dot(tangent,tangent),dot(bitangent,bitangent));float invmax=det==0.0 ? 0.0 : inversesqrt(det);return mat3(tangent*invmax,bitangent*invmax,normal);}
#endif
`,n.IncludesShadersStore[p]||(n.IncludesShadersStore[p]=m),h={name:p,shader:m}})),g,_,Rt,zt=e((()=>{t(),r(),g=`openpbrNormalMapFragmentFunctions`,_=`#if defined(GEOMETRY_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_SAMPLERNAME_,geometryNormal)
#endif
#if defined(GEOMETRY_COAT_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_SAMPLERNAME_,geometryCoatNormal)
#endif
#if defined(DETAIL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_SAMPLERNAME_,detail)
#endif
#if defined(GEOMETRY_NORMAL) && defined(PARALLAX)
const float minSamples=4.;const float maxSamples=15.;const int iMaxSamples=15;vec2 parallaxOcclusion(vec3 vViewDirCoT,vec3 vNormalCoT,vec2 texCoord,float parallaxScale) {float parallaxLimit=length(vViewDirCoT.xy)/vViewDirCoT.z;parallaxLimit*=parallaxScale;vec2 vOffsetDir=normalize(vViewDirCoT.xy);vec2 vMaxOffset=vOffsetDir*parallaxLimit;float numSamples=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));float stepSize=1.0/numSamples;float currRayHeight=1.0;vec2 vCurrOffset=vec2(0,0);vec2 vLastOffset=vec2(0,0);float lastSampledHeight=1.0;float currSampledHeight=1.0;bool keepWorking=true;for (int i=0; i<iMaxSamples; i++)
{currSampledHeight=texture2D(geometryNormalSampler,texCoord+vCurrOffset).w;if (!keepWorking)
{}
else if (currSampledHeight>currRayHeight)
{float delta1=currSampledHeight-currRayHeight;float delta2=(currRayHeight+stepSize)-lastSampledHeight;float ratio=delta1/(delta1+delta2);vCurrOffset=(ratio)* vLastOffset+(1.0-ratio)*vCurrOffset;keepWorking=false;}
else
{currRayHeight-=stepSize;vLastOffset=vCurrOffset;
#ifdef PARALLAX_RHS
vCurrOffset-=stepSize*vMaxOffset;
#else
vCurrOffset+=stepSize*vMaxOffset;
#endif
lastSampledHeight=currSampledHeight;}}
return vCurrOffset;}
vec2 parallaxOffset(vec3 viewDir,float heightScale)
{float height=texture2D(geometryNormalSampler,vGeometryNormalUV).w;vec2 texCoordOffset=heightScale*viewDir.xy*height;
#ifdef PARALLAX_RHS
return texCoordOffset;
#else
return -texCoordOffset;
#endif
}
#endif
`,n.IncludesShadersStore[g]||(n.IncludesShadersStore[g]=_),Rt={name:g,shader:_}})),v,y,b,Bt=e((()=>{t(),v=`openpbrConductorReflectance`,y=`#define pbr_inline
ReflectanceParams conductorReflectance(in vec3 baseColor,in vec3 specularColor,in float specularWeight)
{ReflectanceParams outParams;
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
outParams.coloredF0=baseColor*specularWeight;outParams.coloredF90=specularColor*specularWeight;
#else
outParams.coloredF0=baseColor;outParams.coloredF90=vec3(1.0);
#endif
outParams.F0=1.0;outParams.F90=1.0;return outParams;}`,n.IncludesShadersStore[v]||(n.IncludesShadersStore[v]=y),b={name:v,shader:y}})),x,S,C,Vt=e((()=>{t(),x=`openpbrAmbientOcclusionFunctions`,S=`float compute_specular_occlusion(const float n_dot_v,const float metallic,const float ambient_occlusion,const float roughness)
{float specular_occlusion=saturate(pow(n_dot_v+ambient_occlusion,exp2(-16.0*roughness-1.0))-1.0+ambient_occlusion);return mix(specular_occlusion,1.0,metallic*square(1.0-roughness));}
`,n.IncludesShadersStore[x]||(n.IncludesShadersStore[x]=S),C={name:x,shader:S}})),w,T,E,Ht=e((()=>{t(),w=`openpbrVolumeFunctions`,T=`struct OpenPBRHomogeneousVolume {vec3 extinction_coeff; 
vec3 ss_albedo; 
vec3 multi_scatter_color; 
vec3 absorption_coeff; 
vec3 scatter_coeff; 
float anisotropy; };OpenPBRHomogeneousVolume computeOpenPBRTransmissionVolume(
in vec3 transmission_color,
in float transmission_depth,
in vec3 transmission_scatter,
in float anisotropy
)
{OpenPBRHomogeneousVolume volumeParams;volumeParams.absorption_coeff=vec3(0.0);volumeParams.scatter_coeff=vec3(0.0);volumeParams.anisotropy=anisotropy;
#ifdef GEOMETRY_THIN_WALLED
volumeParams.scatter_coeff=vec3(1.0);volumeParams.anisotropy=1.0; 
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=vec3(1.0);
#else
if (transmission_depth>0.0) {vec3 invDepth=vec3(1./maxEps(transmission_depth));volumeParams.extinction_coeff=-log(maxEps(transmission_color.rgb))*invDepth;volumeParams.scatter_coeff=transmission_scatter.rgb*invDepth;volumeParams.absorption_coeff=volumeParams.extinction_coeff-volumeParams.scatter_coeff.rgb;float minCoeff=min3(volumeParams.absorption_coeff);if (minCoeff<0.0) {volumeParams.absorption_coeff-=vec3(minCoeff);}
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/(volumeParams.extinction_coeff);} else {volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=vec3(0.0);}
#endif
return volumeParams;}
OpenPBRHomogeneousVolume computeOpenPBRSubsurfaceVolume(
in vec3 subsurface_color,
in float subsurface_radius,
in vec3 subsurface_radius_scale,
in float anisotropy
)
{OpenPBRHomogeneousVolume volumeParams;volumeParams.absorption_coeff=vec3(0.0);volumeParams.scatter_coeff=vec3(0.0);volumeParams.anisotropy=anisotropy;volumeParams.multi_scatter_color=subsurface_color;vec3 mfp=subsurface_radius_scale*vec3(subsurface_radius);volumeParams.extinction_coeff=vec3(1.0)/maxEps(mfp);volumeParams.ss_albedo=multiScatterToSingleScatterAlbedo(subsurface_color,anisotropy);volumeParams.scatter_coeff=volumeParams.ss_albedo*volumeParams.extinction_coeff;volumeParams.absorption_coeff=volumeParams.extinction_coeff-volumeParams.scatter_coeff.rgb;float minCoeff=min3(volumeParams.absorption_coeff);if (minCoeff<0.0) {volumeParams.absorption_coeff-=vec3(minCoeff);}
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;return volumeParams;}
vec3 sss_pdf(float r,vec3 d)
{d=max(vec3(1e-4f),d);return (exp(-r/d)+exp(-r/(3.0f*d)))/max(vec3(1e-5f),8.0f*PI*d*r);}
float sss_samples_pdf(float r,float d)
{d=max(1e-4f,d);return exp(-r/(3.0f*d))/(6.0f*PI*d*r);}
float sss_samples_icdf(float x,float d)
{d=max(1e-4f,d);x=max(1e-4f,x);return -3.0f*log(x)*d;}
float samples_scale(float x,float d)
{return 1.0f-exp(-x/(3.0f*d));}
vec3 sss_get_position(sampler2D depth_texture,vec2 tex_coord,vec2 render_resolution,mat4 inv_proj)
{vec4 P=vec4(tex_coord,texelFetch(depth_texture,ivec2(tex_coord*render_resolution),0).x,1.0f);P.xy=2.0f*P.xy-1.0f;P=inv_proj*P;return P.xyz/P.w;}
float sss_filter_scale(float currZ,mat4 proj)
{return 1.0f/dot(vec2(proj[2].w,proj[3].w),vec2(currZ,1.0f));}
float projective_to_pixels(float proj_dist,mat4 proj,vec2 resolution)
{return proj_dist*proj[1][1]*resolution.y;}
float pixels_to_projective(float pixel_dist,mat4 proj,vec2 resolution)
{return pixel_dist/(proj[1][1]*resolution.y);}
vec3 sss_convolve(sampler2D sss_irradiance_texture,sampler2D depth_texture,vec2 render_resolution,vec3 d,mat4 proj,mat4 inv_proj,int sample_count,vec2 noise)
{vec2 tex_coord=gl_FragCoord.xy/render_resolution;vec3 unconvolved_irradiance=texelFetch(sss_irradiance_texture,ivec2(gl_FragCoord.xy),0).rgb;vec3 curr_pos=sss_get_position(depth_texture,tex_coord,render_resolution,inv_proj);float dmax=max3(d);float max_dmax=0.1*float(sample_count);if (dmax>max_dmax)
{d.rgb*=max_dmax/dmax;dmax=max_dmax;}
float dz=dmax*sss_filter_scale(curr_pos.z,proj);mat2 projMat2d=mat2(proj);if (determinant(projMat2d)*dz<1e-4f)
return unconvolved_irradiance;float overscan_size_in_pixels=max(render_resolution.x,render_resolution.y)*0.1;const float filter_crop_ratio=0.8f; 
float crop_radius=projective_to_pixels(sss_samples_icdf(1.0f-filter_crop_ratio,dz),proj,render_resolution);if (crop_radius>overscan_size_in_pixels)
{d.rgb*=overscan_size_in_pixels/crop_radius;dz*=overscan_size_in_pixels/crop_radius;}
float filter_samples_scale=samples_scale(pixels_to_projective(overscan_size_in_pixels,proj,render_resolution),dz);vec3 irradiance_sum=vec3(0.0f);vec3 weight_sum=vec3(0.0f);for (int i=0; i<sample_count; i++)
{vec2 r=fract(plasticSequence(uint(i))+noise);r.x*=TWO_PI;r.y*=filter_samples_scale;float icdf=sss_samples_icdf(1.0-r.y,dz);vec2 sample_uv=tex_coord+icdf*projMat2d*vec2(cos(r.x),sin(r.x));vec4 sss_irradiance=texelFetch(sss_irradiance_texture,ivec2(sample_uv*render_resolution),0);float dist=distance(curr_pos,sss_get_position(depth_texture,sample_uv,render_resolution,inv_proj));if (dist>0.0f)
{vec3 weights=sss_irradiance.a/sss_samples_pdf(icdf,dz)*sss_pdf(dist,d.rgb);irradiance_sum+=weights*sss_irradiance.rgb;weight_sum+=weights;}}
return vec3(weight_sum.r<1e-5f ? unconvolved_irradiance.r : irradiance_sum.r/weight_sum.r,
weight_sum.g<1e-5f ? unconvolved_irradiance.g : irradiance_sum.g/weight_sum.g,
weight_sum.b<1e-5f ? unconvolved_irradiance.b : irradiance_sum.b/weight_sum.b);}`,n.IncludesShadersStore[w]||(n.IncludesShadersStore[w]=T),E={name:w,shader:T}})),D,O,Ut,Wt=e((()=>{t(),D=`openpbrNormalMapFragment`,O=`vec2 uvOffset=vec2(0.0,0.0);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(PARALLAX) || defined(DETAIL)
#ifdef NORMALXYSCALE
float normalScale=1.0;
#elif defined(GEOMETRY_NORMAL)
float normalScale=vGeometryNormalInfos.y;
#else
float normalScale=1.0;
#endif
#if defined(TANGENT) && defined(NORMAL)
mat3 TBN=vTBN;
#elif defined(GEOMETRY_NORMAL)
vec2 TBNUV=gl_FrontFacing ? vGeometryNormalUV : -vGeometryNormalUV;mat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,TBNUV,vTangentSpaceParams);
#elif defined(GEOMETRY_COAT_NORMAL)
vec2 TBNUV=gl_FrontFacing ? vGeometryCoatNormalUV : -vGeometryCoatNormalUV;mat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,TBNUV,vTangentSpaceParams);
#else
vec2 TBNUV=gl_FrontFacing ? vDetailUV : -vDetailUV;mat3 TBN=cotangent_frame(normalW*normalScale,vPositionW,TBNUV,vec2(1.,1.));
#endif
#elif defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL)
mat3 TBN=vTBN;
#else
vec2 TBNUV=gl_FrontFacing ? vMainUV1 : -vMainUV1;mat3 TBN=cotangent_frame(normalW,vPositionW,TBNUV,vec2(1.,1.));
#endif
#endif
#ifdef PARALLAX
mat3 invTBN=transposeMat3(TBN);
#ifdef PARALLAXOCCLUSION
#else
#endif
#endif
#ifdef DETAIL
vec4 detailColor=texture2D(detailSampler,vDetailUV+uvOffset);vec2 detailNormalRG=detailColor.wy*2.0-1.0;float detailNormalB=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));vec3 detailNormal=vec3(detailNormalRG,detailNormalB);
#endif
#ifdef GEOMETRY_COAT_NORMAL
coatNormalW=perturbNormal(TBN,TEXRD(geometryCoatNormalSampler,vGeometryCoatNormalUV+uvOffset).xyz,vGeometryCoatNormalInfos.y);
#endif
#ifdef GEOMETRY_NORMAL
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(TEXRD(geometryNormalSampler,vGeometryNormalUV).xyz *2.0-1.0);normalW=normalize(mat3(normalMatrix)*normalW);
#elif !defined(DETAIL)
normalW=perturbNormal(TBN,TEXRD(geometryNormalSampler,vGeometryNormalUV+uvOffset).xyz,vGeometryNormalInfos.y);
#else
vec3 sampledNormal=TEXRD(geometryNormalSampler,vGeometryNormalUV+uvOffset).xyz*2.0-1.0;
#if DETAIL_NORMALBLENDMETHOD==0 
detailNormal.xy*=vDetailInfos.z;vec3 blendedNormal=normalize(vec3(sampledNormal.xy+detailNormal.xy,sampledNormal.z*detailNormal.z));
#elif DETAIL_NORMALBLENDMETHOD==1 
detailNormal.xy*=vDetailInfos.z;sampledNormal+=vec3(0.0,0.0,1.0);detailNormal*=vec3(-1.0,-1.0,1.0);vec3 blendedNormal=sampledNormal*dot(sampledNormal,detailNormal)/sampledNormal.z-detailNormal;
#endif
normalW=perturbNormalBase(TBN,blendedNormal,vGeometryNormalInfos.y);
#endif
#elif defined(DETAIL)
detailNormal.xy*=vDetailInfos.z;normalW=perturbNormalBase(TBN,detailNormal,vDetailInfos.z);
#endif
`,n.IncludesShadersStore[D]||(n.IncludesShadersStore[D]=O),Ut={name:D,shader:O}})),k,A,Gt,Kt=e((()=>{t(),k=`openpbrBlockNormalFinal`,A=`#if defined(FORCENORMALFORWARD) && defined(NORMAL)
vec3 faceNormal=normalize(cross(dFdx(vPositionW),dFdy(vPositionW)))*vEyePosition.w;
#if defined(TWOSIDEDLIGHTING)
faceNormal=gl_FrontFacing ? faceNormal : -faceNormal;
#endif
normalW*=sign(dot(normalW,faceNormal));coatNormalW*=sign(dot(coatNormalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
#if defined(MIRRORED)
normalW=gl_FrontFacing ? -normalW : normalW;coatNormalW=gl_FrontFacing ? -coatNormalW : coatNormalW;
#else
normalW=gl_FrontFacing ? normalW : -normalW;coatNormalW=gl_FrontFacing ? coatNormalW : -coatNormalW;
#endif
#endif
`,n.IncludesShadersStore[k]||(n.IncludesShadersStore[k]=A),Gt={name:k,shader:A}})),j,M,qt,Jt=e((()=>{t(),j=`openpbrBaseLayerData`,M=`vec3 base_color=vec3(0.8);float base_metalness=0.0;float base_diffuse_roughness=0.0;float specular_weight=1.0;float specular_roughness=0.3;vec3 specular_color=vec3(1.0);float specular_roughness_anisotropy=0.0;float specular_ior=1.5;float alpha=1.0;vec2 geometry_tangent=vec2(1.0,0.0);float geometry_thickness=0.0;
#ifdef BASE_WEIGHT
vec4 baseWeightFromTexture=TEXRD(baseWeightSampler,vBaseWeightUV+uvOffset);
#endif
#ifdef BASE_COLOR
vec4 baseColorFromTexture=TEXRD(baseColorSampler,vBaseColorUV+uvOffset);
#endif
#ifdef BASE_METALNESS
vec4 metallicFromTexture=TEXRD(baseMetalnessSampler,vBaseMetalnessUV+uvOffset);
#endif
#if defined(SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN) && defined(BASE_METALNESS)
float roughnessFromTexture=metallicFromTexture.g;
#elif defined(SPECULAR_ROUGHNESS)
float roughnessFromTexture=TEXRD(specularRoughnessSampler,vSpecularRoughnessUV+uvOffset).r;
#endif
#ifdef GEOMETRY_TANGENT
vec3 geometryTangentFromTexture=TEXRD(geometryTangentSampler,vGeometryTangentUV+uvOffset).rgb;
#endif
#ifdef SPECULAR_ROUGHNESS_ANISOTROPY
float anisotropyFromTexture=TEXRD(specularRoughnessAnisotropySampler,vSpecularRoughnessAnisotropyUV+uvOffset).r*vSpecularRoughnessAnisotropyInfos.y;
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
float baseDiffuseRoughnessFromTexture=TEXRD(baseDiffuseRoughnessSampler,vBaseDiffuseRoughnessUV+uvOffset).r;
#endif
#ifdef GEOMETRY_OPACITY
vec4 opacityFromTexture=TEXRD(geometryOpacitySampler,vGeometryOpacityUV+uvOffset);
#endif
#ifdef GEOMETRY_THICKNESS
vec4 thicknessFromTexture=TEXRD(geometryThicknessSampler,vGeometryThicknessUV+uvOffset);
#endif
#ifdef DECAL
vec4 decalFromTexture=texture2D(decalSampler,vDecalUV+uvOffset);
#endif
#ifdef SPECULAR_COLOR
vec4 specularColorFromTexture=TEXRD(specularColorSampler,vSpecularColorUV+uvOffset);
#endif
#ifdef SPECULAR_WEIGHT
#ifdef SPECULAR_WEIGHT_IN_ALPHA
float specularWeightFromTexture=TEXRD(specularWeightSampler,vSpecularWeightUV+uvOffset).a;
#else
float specularWeightFromTexture=TEXRD(specularWeightSampler,vSpecularWeightUV+uvOffset).r;
#endif
#endif
#if defined(ANISOTROPIC) || defined(FUZZ) || defined(REFRACTED_BACKGROUND) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING)
vec3 noise=vec3(2.0)*TEXRD(blueNoiseSampler,gl_FragCoord.xy/256.0).xyz-vec3(1.0);
#endif
base_color=vBaseColor.rgb;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
base_color*=vColor.rgb;
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=vColor.a;
#endif
base_color*=vec3(vBaseWeight);alpha=vBaseColor.a;base_metalness=vReflectanceInfo.x;base_diffuse_roughness=vBaseDiffuseRoughness;specular_roughness=vReflectanceInfo.y;specular_color=vSpecularColor.rgb;specular_weight=vReflectanceInfo.a;specular_ior=vReflectanceInfo.z;specular_roughness_anisotropy=vSpecularAnisotropy.b;geometry_tangent=vSpecularAnisotropy.rg;geometry_thickness=vGeometryThickness;
#ifdef BASE_COLOR
#ifdef BASE_COLOR_GAMMA
base_color*=toLinearSpace(baseColorFromTexture.rgb);
#else
base_color*=baseColorFromTexture.rgb;
#endif
base_color*=vBaseColorInfos.y;
#endif
#ifdef BASE_WEIGHT
base_color*=baseWeightFromTexture.r;
#endif
#if defined(BASE_COLOR) && defined(ALPHA_FROM_BASE_COLOR_TEXTURE)
alpha*=baseColorFromTexture.a;
#elif defined(GEOMETRY_OPACITY)
alpha*=opacityFromTexture.r;alpha*=vGeometryOpacityInfos.y;
#endif
#ifdef GEOMETRY_THICKNESS
#ifdef GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL
geometry_thickness*=thicknessFromTexture.g;
#else
geometry_thickness*=thicknessFromTexture.r;
#endif
geometry_thickness*=vGeometryThicknessInfos.y;
#endif
#ifdef ALPHATEST
#if DEBUGMODE != 88
if (alpha<ALPHATESTVALUE)
discard;
#endif
#ifndef ALPHABLEND
alpha=1.0;
#endif
#endif
#ifdef BASE_METALNESS
#ifdef BASE_METALNESS_FROM_METALNESS_TEXTURE_BLUE
base_metalness*=metallicFromTexture.b;
#else
base_metalness*=metallicFromTexture.r;
#endif
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
base_diffuse_roughness*=baseDiffuseRoughnessFromTexture*vBaseDiffuseRoughnessInfos.y;
#endif
#ifdef SPECULAR_COLOR
#ifdef SPECULAR_COLOR_GAMMA
specular_color*=toLinearSpace(specularColorFromTexture.rgb);
#else
specular_color*=specularColorFromTexture.rgb;
#endif
#ifdef SPECULAR_WEIGHT_FROM_SPECULAR_COLOR_TEXTURE
specular_weight*=specularColorFromTexture.a;
#elif defined(SPECULAR_WEIGHT)
specular_weight*=specularWeightFromTexture;
#endif
#endif
#if defined(SPECULAR_ROUGHNESS) || (defined(SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN) && defined(BASE_METALNESS))
specular_roughness*=roughnessFromTexture;
#endif
#ifdef GEOMETRY_TANGENT
{vec2 tangentFromTexture=normalize(geometryTangentFromTexture.xy*2.0-1.0);float tangent_angle_texture=atan(tangentFromTexture.y,tangentFromTexture.x);float tangent_angle_uniform=atan(geometry_tangent.y,geometry_tangent.x);float tangent_angle=tangent_angle_texture+tangent_angle_uniform;geometry_tangent=vec2(cos(tangent_angle),sin(tangent_angle));}
#endif
#if defined(GEOMETRY_TANGENT) && defined(SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
specular_roughness_anisotropy*=geometryTangentFromTexture.b;
#elif defined(SPECULAR_ROUGHNESS_ANISOTROPY)
specular_roughness_anisotropy*=anisotropyFromTexture;
#endif
#ifdef DETAIL
float detailRoughness=mix(0.5,detailColor.b,vDetailInfos.w);float loLerp=mix(0.,specular_roughness,detailRoughness*2.);float hiLerp=mix(specular_roughness,1.,(detailRoughness-0.5)*2.);specular_roughness=mix(loLerp,hiLerp,step(detailRoughness,0.5));
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
float baseAlpha=specular_roughness*specular_roughness;float roughnessT=mix(baseAlpha,1.0,specular_roughness_anisotropy*specular_roughness_anisotropy);float roughnessB=baseAlpha;specular_roughness_anisotropy=1.0-roughnessB/max(roughnessT,0.00001);specular_roughness=sqrt(roughnessT/sqrt(2.0/(1.0+(1.0-specular_roughness_anisotropy)*(1.0-specular_roughness_anisotropy))));
#endif
`,n.IncludesShadersStore[j]||(n.IncludesShadersStore[j]=M),qt={name:j,shader:M}})),N,P,Yt,Xt=e((()=>{t(),N=`openpbrCoatLayerData`,P=`float coat_weight=0.0;vec3 coat_color=vec3(1.0);float coat_roughness=0.0;float coat_roughness_anisotropy=0.0;float coat_ior=1.6;float coat_darkening=1.0;vec2 geometry_coat_tangent=vec2(1.0,0.0);
#ifdef COAT_WEIGHT
vec4 coatWeightFromTexture=TEXRD(coatWeightSampler,vCoatWeightUV+uvOffset);
#endif
#ifdef COAT_COLOR
vec4 coatColorFromTexture=TEXRD(coatColorSampler,vCoatColorUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS
vec4 coatRoughnessFromTexture=TEXRD(coatRoughnessSampler,vCoatRoughnessUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS_ANISOTROPY
float coatRoughnessAnisotropyFromTexture=TEXRD(coatRoughnessAnisotropySampler,vCoatRoughnessAnisotropyUV+uvOffset).r;
#endif
#ifdef COAT_DARKENING
vec4 coatDarkeningFromTexture=TEXRD(coatDarkeningSampler,vCoatDarkeningUV+uvOffset);
#endif
#ifdef GEOMETRY_COAT_TANGENT
vec3 geometryCoatTangentFromTexture=TEXRD(geometryCoatTangentSampler,vGeometryCoatTangentUV+uvOffset).rgb;
#endif
coat_color=vCoatColor.rgb;coat_weight=vCoatWeight;coat_roughness=vCoatRoughness;coat_roughness_anisotropy=vCoatRoughnessAnisotropy;coat_ior=vCoatIor;coat_darkening=vCoatDarkening;geometry_coat_tangent=vGeometryCoatTangent.rg;
#ifdef COAT_WEIGHT
coat_weight*=coatWeightFromTexture.r;
#endif
#ifdef COAT_COLOR
#ifdef COAT_COLOR_GAMMA
coat_color*=toLinearSpace(coatColorFromTexture.rgb);
#else
coat_color*=coatColorFromTexture.rgb;
#endif
coat_color*=vCoatColorInfos.y;
#endif
#ifdef COAT_ROUGHNESS
#ifdef COAT_ROUGHNESS_FROM_GREEN_CHANNEL
coat_roughness*=coatRoughnessFromTexture.g;
#else
coat_roughness*=coatRoughnessFromTexture.r;
#endif
#endif
#if defined(GEOMETRY_COAT_TANGENT) && defined(COAT_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
coat_roughness_anisotropy*=geometryCoatTangentFromTexture.b;
#elif defined(COAT_ROUGHNESS_ANISOTROPY)
coat_roughness_anisotropy*=coatRoughnessAnisotropyFromTexture;
#endif
#ifdef COAT_DARKENING
coat_darkening*=coatDarkeningFromTexture.r;
#endif
#ifdef GEOMETRY_COAT_TANGENT
{vec2 tangentFromTexture=normalize(geometryCoatTangentFromTexture.xy*2.0-1.0);float tangent_angle_texture=atan(tangentFromTexture.y,tangentFromTexture.x);float tangent_angle_uniform=atan(geometry_coat_tangent.y,geometry_coat_tangent.x);float tangent_angle=tangent_angle_texture+tangent_angle_uniform;geometry_coat_tangent=vec2(cos(tangent_angle),sin(tangent_angle));}
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
float coatAlpha=coat_roughness*coat_roughness;float coatRoughnessT=mix(coatAlpha,1.0,coat_roughness_anisotropy*coat_roughness_anisotropy);float coatRoughnessB=coatAlpha;coat_roughness_anisotropy=1.0-coatRoughnessB/max(coatRoughnessT,0.00001);coat_roughness=sqrt(coatRoughnessT/sqrt(2.0/(1.0+(1.0-coat_roughness_anisotropy)*(1.0-coat_roughness_anisotropy))));
#endif
`,n.IncludesShadersStore[N]||(n.IncludesShadersStore[N]=P),Yt={name:N,shader:P}})),F,I,Zt,Qt=e((()=>{t(),F=`openpbrThinFilmLayerData`,I=`#ifdef THIN_FILM
float thin_film_weight=vThinFilmWeight;float thin_film_thickness=vThinFilmThickness.r*1000.0; 
float thin_film_ior=vThinFilmIor;
#ifdef THIN_FILM_WEIGHT
float thinFilmWeightFromTexture=TEXRD(thinFilmWeightSampler,vThinFilmWeightUV+uvOffset).r*vThinFilmWeightInfos.y;
#endif
#ifdef THIN_FILM_THICKNESS
float thinFilmThicknessFromTexture=TEXRD(thinFilmThicknessSampler,vThinFilmThicknessUV+uvOffset).g*vThinFilmThicknessInfos.y;
#endif
#ifdef THIN_FILM_WEIGHT
thin_film_weight*=thinFilmWeightFromTexture;
#endif
#ifdef THIN_FILM_THICKNESS
thin_film_thickness*=thinFilmThicknessFromTexture;
#endif
float thin_film_ior_scale=clamp(2.0f*abs(thin_film_ior-1.0f),0.0f,1.0f);
#endif
`,n.IncludesShadersStore[F]||(n.IncludesShadersStore[F]=I),Zt={name:F,shader:I}})),L,R,$t,en=e((()=>{t(),L=`openpbrFuzzLayerData`,R=`float fuzz_weight=0.0;vec3 fuzz_color=vec3(1.0);float fuzz_roughness=0.0;
#ifdef FUZZ
#ifdef FUZZ_WEIGHT
vec4 fuzzWeightFromTexture=TEXRD(fuzzWeightSampler,vFuzzWeightUV+uvOffset);
#endif
#ifdef FUZZ_COLOR
vec4 fuzzColorFromTexture=TEXRD(fuzzColorSampler,vFuzzColorUV+uvOffset);
#endif
#ifdef FUZZ_ROUGHNESS
vec4 fuzzRoughnessFromTexture=TEXRD(fuzzRoughnessSampler,vFuzzRoughnessUV+uvOffset);
#endif
fuzz_color=vFuzzColor.rgb;fuzz_weight=vFuzzWeight;fuzz_roughness=vFuzzRoughness;
#ifdef FUZZ_WEIGHT
fuzz_weight*=fuzzWeightFromTexture.r;
#endif
#ifdef FUZZ_COLOR
#ifdef FUZZ_COLOR_GAMMA
fuzz_color*=toLinearSpace(fuzzColorFromTexture.rgb);
#else
fuzz_color*=fuzzColorFromTexture.rgb;
#endif
fuzz_color*=vFuzzColorInfos.y;
#endif
#if defined(FUZZ_ROUGHNESS) && defined(FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA)
fuzz_roughness*=fuzzRoughnessFromTexture.a;
#elif defined(FUZZ_ROUGHNESS)
fuzz_roughness*=fuzzRoughnessFromTexture.r;
#endif
#endif
`,n.IncludesShadersStore[L]||(n.IncludesShadersStore[L]=R),$t={name:L,shader:R}})),z,B,tn,nn=e((()=>{t(),z=`openpbrAmbientOcclusionData`,B=`vec3 ambient_occlusion=vec3(1.0);float specular_ambient_occlusion=1.0;float coat_specular_ambient_occlusion=1.0;
#ifdef AMBIENT_OCCLUSION
vec3 ambientOcclusionFromTexture=TEXRD(ambientOcclusionSampler,vAmbientOcclusionUV+uvOffset).rgb;ambient_occlusion=vec3(ambientOcclusionFromTexture.r*vAmbientOcclusionInfos.y+(1.0-vAmbientOcclusionInfos.y));
#endif
`,n.IncludesShadersStore[z]||(n.IncludesShadersStore[z]=B),tn={name:z,shader:B}})),V,H,rn,an=e((()=>{t(),V=`openpbrBackgroundTransmission`,H=`vec4 slab_translucent_background=vec4(0.,0.,0.,1.);
#ifdef REFRACTED_BACKGROUND
{float refractionLOD=min(transmission_roughness,0.8)*vBackgroundRefractionInfos.x;float lodTexelSize=pow(2.0,refractionLOD-vBackgroundRefractionInfos.x);
#ifdef DISPERSION
{
#ifdef REFRACTION_HIGH_QUALITY_BLUR
{vec3 dispResult=vec3(0.0);vec3 dispWeight=vec3(0.0);vec2 noiseOffset=noise.xy*(refractionLOD>0.0 ? lodTexelSize : 0.0);for (int k=0; k<6; k++) {float t=(float(k)+noise.y)/6.0;float t_rg=clamp(t*2.0,0.0,1.0);float t_gb=clamp((t-0.5)*2.0,0.0,1.0);vec3 refVec=mix(mix(refractedViewVectors[0],refractedViewVectors[1],t_rg),refractedViewVectors[2],t_gb);vec3 uvw=vec3(backgroundRefractionMatrix*(view*vec4(vPositionW+refVec*geometry_thickness,1.0)));vec2 coords=uvw.xy/uvw.z;coords.y=1.0-coords.y;vec4 s=texture2DLodEXT(backgroundRefractionSampler,coords+noiseOffset,refractionLOD);float rw=max(0.0,1.0-2.0*t);float gw=max(0.0,1.0-abs(2.0*t-1.0));float bw=max(0.0,2.0*t-1.0);vec3 w=vec3(rw,gw,bw);dispResult+=s.rgb*w;dispWeight+=w;}
slab_translucent_background=vec4(dispResult/max(dispWeight,vec3(1e-6)),1.0);}
#else
for (int i=0; i<3; i++) {vec3 refractedViewVector=refractedViewVectors[i];vec3 uvw=vec3(backgroundRefractionMatrix*(view*vec4(vPositionW+refractedViewVector*geometry_thickness,1.0)));vec2 coords=uvw.xy/uvw.z;coords.y=1.0-coords.y;if (refractionLOD>0.0) {vec2 noiseOffset=noise.xy*lodTexelSize;slab_translucent_background[i]=texture2DLodEXT(backgroundRefractionSampler,coords+noiseOffset,refractionLOD)[i];} else {slab_translucent_background[i]=texture2DLodEXT(backgroundRefractionSampler,coords,0.0)[i];}}
#endif
}
#else
{vec3 refractionUVW=vec3(backgroundRefractionMatrix*(view*vec4(vPositionW+refractedViewVector*geometry_thickness,1.0)));vec2 refractionCoords=refractionUVW.xy/refractionUVW.z;refractionCoords.y=1.0-refractionCoords.y;if (refractionLOD>0.0) {
#ifdef REFRACTION_HIGH_QUALITY_BLUR
float cosA=cos(noise.x*PI);float sinA=sin(noise.x*PI);vec2 u=vec2( cosA,sinA)*(0.5*lodTexelSize);vec2 v=vec2(-sinA,cosA)*(0.5*lodTexelSize);slab_translucent_background=0.25*(
texture2DLodEXT(backgroundRefractionSampler,refractionCoords+u+v,refractionLOD) +
texture2DLodEXT(backgroundRefractionSampler,refractionCoords-u+v,refractionLOD) +
texture2DLodEXT(backgroundRefractionSampler,refractionCoords+u-v,refractionLOD) +
texture2DLodEXT(backgroundRefractionSampler,refractionCoords-u-v,refractionLOD)
);
#else
vec2 noiseOffset=noise.xy*lodTexelSize;slab_translucent_background=texture2DLodEXT(backgroundRefractionSampler,refractionCoords+noiseOffset,refractionLOD);
#endif
} else {slab_translucent_background=texture2DLodEXT(backgroundRefractionSampler,refractionCoords,0.0);}}
#endif
}
#endif
`,n.IncludesShadersStore[V]||(n.IncludesShadersStore[V]=H),rn={name:V,shader:H}})),U,W,on,sn=e((()=>{t(),U=`openpbrEnvironmentLighting`,W=`#if defined(REFLECTION) || defined(REFRACTED_BACKGROUND)
vec3 coatAbsorption=vec3(1.0);float coatIblFresnel=0.0;if (coat_weight>0.0) {coatIblFresnel=computeDielectricIblFresnel(coatReflectance,coatGeoInfo.environmentBrdf);float hemisphere_avg_fresnel=coatReflectance.F0+0.5*(1.0-coatReflectance.F0);float averageReflectance=(coatIblFresnel+hemisphere_avg_fresnel)*0.5;float roughnessFactor=1.0-coat_roughness*0.5;averageReflectance*=roughnessFactor;float darkened_transmission=(1.0-averageReflectance)*(1.0-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);float sin2=1.0-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;float cos_t=sqrt(1.0-sin2);float coatPathLength=1.0/cos_t;float effectivePathLength=coatPathLength*coat_weight;vec3 colored_transmission=pow(coat_color,vec3(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0,darkened_transmission,coat_weight);}
#endif
#ifdef REFLECTION
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
vec3 environmentFuzzBrdf=getFuzzBRDFLookup(fuzzGeoInfo.NdotV,sqrt(fuzz_roughness));
#endif
vec3 baseDiffuseEnvironmentLight=sampleIrradiance(
normalW
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
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.,0.,0.);
#else
vec2 reflectionCoords=vec2(0.,0.);
#endif
float specularAlphaG=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
vec3 baseSpecularEnvironmentLight=sampleRadianceAnisotropic(specularAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,vPositionW
,noise
,false 
,1.0 
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(vPositionW,normalW);vec3 baseSpecularEnvironmentLight=sampleRadiance(specularAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG*max(1.0-baseGeoInfo.anisotropy,0.3));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
vec3 coatEnvironmentLight=vec3(0.,0.,0.);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
vec3 reflectionCoords=vec3(0.,0.,0.);
#else
vec2 reflectionCoords=vec2(0.,0.);
#endif
reflectionCoords=createReflectionCoords(vPositionW,coatNormalW);float coatAlphaG=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,vPositionW
,noise
,false 
,1.0 
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
float modifiedFuzzRoughness=clamp(fuzz_roughness*fuzz_roughness*(1.0+0.5*environmentFuzzBrdf.y),0.0,1.0);vec3 fuzzEnvironmentLight=vec3(0.0);float fuzzIblFresnel=min(environmentFuzzBrdf.z*2.0,1.0);vec2 viewTangent=vec2(dot(viewDirectionW,fuzzTangent),dot(viewDirectionW,fuzzBitangent));float centerAngle=atan(viewTangent.y,viewTangent.x);for (int i=0; i<FUZZ_IBL_SAMPLES; ++i) {float angle=centerAngle+(float(i)/float(FUZZ_IBL_SAMPLES)-0.5+noise.x/float(FUZZ_IBL_SAMPLES))*3.141592;vec3 fiberCylinderNormal=normalize(cos(angle)*fuzzTangent+sin(angle)*fuzzBitangent);vec3 fuzzReflectionCoords=vec3(reflectionMatrix*vec4(fiberCylinderNormal,0));vec3 radianceSample=sampleRadiance(modifiedFuzzRoughness,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,fuzzGeoInfo
,reflectionSampler
,fuzzReflectionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);fuzzEnvironmentLight+=radianceSample;}
fuzzEnvironmentLight/=float(FUZZ_IBL_SAMPLES);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
vec3 fuzzDiffuseEnvironmentLight=sampleIrradiance(
fuzzNormalW
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
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
,0.0
,vec3(1.0)
);
#else
vec3 fuzzDiffuseEnvironmentLight=baseDiffuseEnvironmentLight;
#endif
fuzzEnvironmentLight=mix(min(fuzzEnvironmentLight,fuzzDiffuseEnvironmentLight),fuzzDiffuseEnvironmentLight,modifiedFuzzRoughness);
#endif
float dielectricIblFresnel=computeDielectricIblFresnel(baseDielectricReflectance,baseGeoInfo.environmentBrdf);vec3 dielectricIblColoredFresnel=dielectricIblFresnel*specular_color;
#ifdef THIN_FILM
float thin_film_cos_theta=max(baseGeoInfo.NdotV,specularAlphaG);float thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001*thin_film_cos_theta);float tf_brdf_x=baseGeoInfo.environmentBrdf.x;float tf_E_ss =baseGeoInfo.environmentBrdf.y;vec3 thinFilmDielectricF0=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,vec3(baseDielectricReflectance.F0));thinFilmDielectricF0=mix(thinFilmDielectricF0,vec3(dot(thinFilmDielectricF0,vec3(0.3333))),thin_film_desaturation_scale);vec3 thinFilmDielectricDir=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,vec3(baseDielectricReflectance.F0));thinFilmDielectricDir=mix(thinFilmDielectricDir,vec3(dot(thinFilmDielectricDir,vec3(0.3333))),thin_film_desaturation_scale);float tf_f0d_avg =dot(thinFilmDielectricF0, vec3(0.3333));float tf_dird_avg=dot(thinFilmDielectricDir,vec3(0.3333));vec3 thinFilmDielectricFresnel=thinFilmDielectricDir*(tf_f0d_avg/max(tf_dird_avg,1e-5));vec3 tf_E_dielectric=(vec3(1.0)-thinFilmDielectricFresnel)*vec3(tf_brdf_x)+thinFilmDielectricFresnel*vec3(tf_E_ss);vec3 tf_F_avg_dielectric=thinFilmDielectricFresnel+(vec3(1.0)-thinFilmDielectricFresnel)/21.0;vec3 tf_ECF_dielectric=vec3(1.0)+tf_F_avg_dielectric*(vec3(1.0)/vec3(tf_E_ss)-vec3(1.0));thinFilmDielectricFresnel=clamp(tf_E_dielectric*tf_ECF_dielectric,vec3(0.0),vec3(1.0));dielectricIblColoredFresnel=mix(dielectricIblColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);dielectricIblFresnel=max(dielectricIblColoredFresnel.r,max(dielectricIblColoredFresnel.g,dielectricIblColoredFresnel.b));
#endif
vec3 conductorIblFresnel=computeConductorIblFresnel(baseConductorReflectance,baseGeoInfo.environmentBrdf);
#ifdef THIN_FILM
vec3 thinFilmConductorF0=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorF0=mix(thinFilmConductorF0,vec3(dot(thinFilmConductorF0,vec3(0.3333))),thin_film_desaturation_scale);vec3 thinFilmConductorDir=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorDir=mix(thinFilmConductorDir,vec3(dot(thinFilmConductorDir,vec3(0.3333))),thin_film_desaturation_scale);float tf_f0c_avg =dot(thinFilmConductorF0, vec3(0.3333));float tf_dirc_avg=dot(thinFilmConductorDir,vec3(0.3333));vec3 thinFilmConductorRaw=thinFilmConductorDir*(tf_f0c_avg/max(tf_dirc_avg,1e-5));
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR) && defined(ENVIRONMENTBRDF)
vec3 tf_b=getF82B(baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);float tf_brdf_z=baseGeoInfo.environmentBrdf.z/BRDF_Z_SCALE;vec3 tf_E_conductor=(vec3(1.0)-thinFilmConductorRaw)*vec3(tf_brdf_x)+thinFilmConductorRaw*vec3(tf_E_ss)-tf_b*vec3(tf_brdf_z);vec3 tf_F_avg_conductor=thinFilmConductorRaw+(vec3(1.0)-thinFilmConductorRaw)/21.0-tf_b/126.0;
#else
vec3 tf_E_conductor=(vec3(1.0)-thinFilmConductorRaw)*vec3(tf_brdf_x)+thinFilmConductorRaw*vec3(tf_E_ss);vec3 tf_F_avg_conductor=thinFilmConductorRaw+(vec3(1.0)-thinFilmConductorRaw)/21.0;
#endif
vec3 tf_ECF_conductor=vec3(1.0)+tf_F_avg_conductor*(vec3(1.0)/vec3(tf_E_ss)-vec3(1.0));vec3 thinFilmConductorFresnel=specular_weight*clamp(tf_E_conductor*tf_ECF_conductor,vec3(0.0),vec3(1.0));conductorIblFresnel=mix(conductorIblFresnel,thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
vec3 slab_diffuse_ibl=vec3(0.,0.,0.);vec3 slab_glossy_ibl=vec3(0.,0.,0.);vec3 slab_metal_ibl=vec3(0.,0.,0.);vec3 slab_coat_ibl=vec3(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
specular_ambient_occlusion=compute_specular_occlusion(baseGeoInfo.NdotV,base_metalness,ambient_occlusion.x,specular_roughness);
#endif
slab_glossy_ibl=baseSpecularEnvironmentLight*vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*vLightingIntensity.z;if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
coat_specular_ambient_occlusion=compute_specular_occlusion(coatGeoInfo.NdotV,0.0,ambient_occlusion.x,coat_roughness);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
vec3 slab_fuzz_ibl=fuzzEnvironmentLight*vLightingIntensity.z;
#endif
vec3 slab_translucent_base_ibl=vec3(0.0);vec3 slab_subsurface_ibl=vec3(0.,0.,0.);
#ifdef REFRACTED_ENVIRONMENT
#ifdef ANISOTROPIC_BASE
vec3 forwardScatteredEnvironmentLight=sampleRadianceAnisotropic(transmission_roughness_alpha,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
#ifdef GEOMETRY_THIN_WALLED
,viewDirectionW
#else
,normalW
#endif
,viewDirectionW
,vPositionW
,noise
,true 
#ifdef GEOMETRY_THIN_WALLED
,1.05 
#else
,specular_ior 
#endif
,reflectionSampler
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#else
vec3 forwardScatteredEnvironmentLight=vec3(0.,0.,0.);
#ifdef DISPERSION
for (int i=0; i<3; i++) {vec3 iblRefractionCoords=refractedViewVectors[i];
#else
vec3 iblRefractionCoords=refractedViewVector;
#endif
#ifdef REFRACTED_ENVIRONMENT_OPPOSITEZ
iblRefractionCoords.z*=-1.0;
#endif
#ifdef REFRACTED_ENVIRONMENT_LOCAL_CUBE
iblRefractionCoords=parallaxCorrectNormal(vPositionW,refractedViewVector,refractionSize,refractionPosition);
#endif
iblRefractionCoords=vec3(reflectionMatrix*vec4(iblRefractionCoords,0));
#ifdef DISPERSION
forwardScatteredEnvironmentLight[i]=sampleRadiance(transmission_roughness_alpha,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
)[i];
#else
forwardScatteredEnvironmentLight=sampleRadiance(transmission_roughness_alpha,vReflectionMicrosurfaceInfos.rgb,vReflectionInfos
,baseGeoInfo
,reflectionSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#endif
);
#endif
#ifdef DISPERSION
}
#endif
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredEnvironmentLight=mix(slab_translucent_background.rgb,forwardScatteredEnvironmentLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredEnvironmentLight=max(slab_translucent_background.rgb,mix(slab_translucent_background.rgb,forwardScatteredEnvironmentLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
vec3 scatterVector=normalW;
#else
#if defined(USEIRRADIANCEMAP) && defined(USE_IRRADIANCE_DOMINANT_DIRECTION)
vec3 scatterVector=mix(vReflectionDominantDirection,normalW,max3(iso_scatter_density));
#else
vec3 scatterVector=normalW;
#endif
scatterVector=mix(viewDirectionW,scatterVector,back_to_iso_scattering_blend);
#endif
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(GEOMETRY_THIN_WALLED)
vec3 scatteredEnvironmentLight=scattered_light_from_irradiance_texture;
#else
vec3 scatteredEnvironmentLight=sampleIrradiance(
scatterVector
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
#ifdef REALTIME_FILTERING
,vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
#endif
#endif
,vReflectionInfos
,viewDirectionW
#if defined(GEOMETRY_THIN_WALLED)
,base_diffuse_roughness
,subsurface_color.rgb
#else
,1.0
,volumeParams.multi_scatter_color
#endif
);
#endif
#ifdef GEOMETRY_THIN_WALLED
vec3 forward_scattered_light=forwardScatteredEnvironmentLight*transmission_tint*volumeParams.multi_scatter_color;vec3 back_scattered_light=scatteredEnvironmentLight*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(back_scattered_light,forward_scattered_light,0.5+0.5*volumeParams.anisotropy);
#else
vec3 forward_scattered_light=forwardScatteredEnvironmentLight*volume_absorption;vec3 back_scattered_light=mix(forward_scattered_light,scatteredEnvironmentLight*backscatter_color,iso_scatter_density);vec3 iso_scattered_light=mix(forward_scattered_light,scatteredEnvironmentLight*volumeParams.multi_scatter_color,iso_scatter_density);slab_translucent_base_ibl=mix(back_scattered_light,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent_base_ibl+=forwardScatteredEnvironmentLight*transmission_tint*volume_absorption;
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
slab_diffuse_ibl*=ambient_occlusion;slab_metal_ibl*=specular_ambient_occlusion;slab_glossy_ibl*=specular_ambient_occlusion;slab_coat_ibl*=coat_specular_ambient_occlusion;vec3 material_dielectric_base_ibl=mix(slab_diffuse_ibl*base_color.rgb,slab_translucent_base_ibl,surface_translucency_weight);vec3 material_dielectric_gloss_ibl=material_dielectric_base_ibl*(1.0-dielectricIblFresnel)+slab_glossy_ibl*dielectricIblColoredFresnel;vec3 material_base_substrate_ibl=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);vec3 material_coated_base_ibl=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3(1.0));
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
slab_fuzz_ibl*=min(vec3(specular_ambient_occlusion),ambient_occlusion);material_surface_ibl=layer(material_coated_base_ibl,slab_fuzz_ibl,fuzzIblFresnel*fuzz_weight,vec3(1.0),fuzz_color);
#else
material_surface_ibl=material_coated_base_ibl;
#endif
#elif defined(REFRACTED_BACKGROUND)
vec3 black=vec3(0.0);vec3 slab_translucent_base_ibl=vec3(0.0);
#ifdef GEOMETRY_THIN_WALLED
#ifdef SCATTERING
vec3 forward_scattered_light=slab_translucent_background.rgb*transmission_tint*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(black,forward_scattered_light,0.5+0.5*volumeParams.anisotropy);
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*transmission_tint;
#endif
#else
#ifdef SCATTERING
vec3 forward_scattered_light=slab_translucent_background.rgb*volume_absorption;vec3 iso_scattered_light=(1.0-iso_scatter_density)*forward_scattered_light;slab_translucent_base_ibl=mix(black,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*volume_absorption*transmission_tint;
#endif
#endif
vec3 material_dielectric_base_ibl=mix(black,slab_translucent_base_ibl.rgb,surface_translucency_weight);vec3 material_dielectric_gloss_ibl=material_dielectric_base_ibl*(baseGeoInfo.NdotV);vec3 material_base_substrate_ibl=mix(material_dielectric_gloss_ibl,black,base_metalness);vec3 material_coated_base_ibl=layer(material_base_substrate_ibl,black,coatIblFresnel,coatAbsorption,vec3(1.0));material_surface_ibl=material_coated_base_ibl;
#endif
`,n.IncludesShadersStore[U]||(n.IncludesShadersStore[U]=W),on={name:U,shader:W}})),G,K,cn,ln=e((()=>{t(),G=`openpbrDirectLightingInit`,K=`#ifdef LIGHT{X}
preLightingInfo preInfo{X};preLightingInfo preInfoCoat{X};vec4 lightColor{X}=light{X}.vLightDiffuse;float shadow{X}=1.;
#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})
#else
#define CUSTOM_LIGHT{X}_COLOR 
#ifdef SPOTLIGHT{X}
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,vPositionW);
#elif defined(POINTLIGHT{X})
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,vPositionW);
#elif defined(HEMILIGHT{X})
preInfo{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(DIRLIGHT{X})
preInfo{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
preInfo{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC2Sampler,viewDirectionW,normalW,vPositionW,light{X}.vLightData,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,specular_roughness);preInfoCoat{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC2Sampler,viewDirectionW,coatNormalW,vPositionW,light{X}.vLightData,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,coat_roughness);
#endif
preInfo{X}.NdotV=baseGeoInfo.NdotV;preInfoCoat{X}.NdotV=coatGeoInfo.NdotV;
#ifdef SPOTLIGHT{X}
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo{X}.attenuation=computeDistanceLightFalloff_GLTF(preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_GLTF(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Physical(preInfo{X}.lightDistanceSquared);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_Physical(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w);
#endif
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Standard(preInfo{X}.lightOffset,light{X}.vLightFalloff.x);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff_Standard(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w,light{X}.vLightData.w);
#endif
#else
preInfo{X}.attenuation=computeDistanceLightFalloff(preInfo{X}.lightOffset,preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#ifdef IESLIGHTTEXTURE{X}
preInfo{X}.attenuation*=computeDirectionalLightFalloff_IES(light{X}.vLightDirection.xyz,preInfo{X}.L,iesLightTexture{X});
#else
preInfo{X}.attenuation*=computeDirectionalLightFalloff(light{X}.vLightDirection.xyz,preInfo{X}.L,light{X}.vLightDirection.w,light{X}.vLightData.w,light{X}.vLightFalloff.z,light{X}.vLightFalloff.w);
#endif
#endif
#elif defined(POINTLIGHT{X})
#ifdef LIGHT_FALLOFF_GLTF{X}
preInfo{X}.attenuation=computeDistanceLightFalloff_GLTF(preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.y);
#elif defined(LIGHT_FALLOFF_PHYSICAL{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Physical(preInfo{X}.lightDistanceSquared);
#elif defined(LIGHT_FALLOFF_STANDARD{X})
preInfo{X}.attenuation=computeDistanceLightFalloff_Standard(preInfo{X}.lightOffset,light{X}.vLightFalloff.x);
#else
preInfo{X}.attenuation=computeDistanceLightFalloff(preInfo{X}.lightOffset,preInfo{X}.lightDistanceSquared,light{X}.vLightFalloff.x,light{X}.vLightFalloff.y);
#endif
#else
preInfo{X}.attenuation=1.0;
#endif
preInfoCoat{X}.attenuation=preInfo{X}.attenuation;
#if defined(HEMILIGHT{X})
preInfo{X}.roughness=specular_roughness;preInfoCoat{X}.roughness=coat_roughness;
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
preInfo{X}.roughness=specular_roughness;preInfoCoat{X}.roughness=coat_roughness;
#else
preInfo{X}.roughness=adjustRoughnessFromLightProperties(specular_roughness,light{X}.vLightSpecular.a,preInfo{X}.lightDistance);preInfoCoat{X}.roughness=adjustRoughnessFromLightProperties(coat_roughness,light{X}.vLightSpecular.a,preInfoCoat{X}.lightDistance);
#endif
preInfo{X}.diffuseRoughness=base_diffuse_roughness;preInfo{X}.surfaceAlbedo=base_color.rgb;
#endif
#endif
`,n.IncludesShadersStore[G]||(n.IncludesShadersStore[G]=K),cn={name:G,shader:K}})),q,J,un,dn=e((()=>{t(),q=`openpbrDirectLighting`,J=`#ifdef LIGHT{X}
{vec3 slab_diffuse=vec3(0.,0.,0.);vec3 slab_translucent=vec3(0.,0.,0.);vec3 slab_glossy=vec3(0.,0.,0.);float specularFresnel=0.0;vec3 specularColoredFresnel=vec3(0.,0.,0.);vec3 slab_metal=vec3(0.,0.,0.);vec3 slab_coat=vec3(0.,0.,0.);float coatFresnel=0.0;vec3 slab_fuzz=vec3(0.,0.,0.);float fuzzFresnel=0.0;
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},vPositionW);
#endif
#ifdef FUZZ
float fuzzNdotH=max(dot(fuzzNormalW,preInfo{X}.H),0.0);vec3 fuzzBrdf=getFuzzBRDFLookup(fuzzNdotH,sqrt(fuzz_roughness));
#endif
#ifdef THIN_FILM
float thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001);
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_glossy=computeOpenPBRAreaSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseDielectricReflectance.coloredF0,
baseDielectricReflectance.coloredF90
);specularFresnel=computeOpenPBRAreaFresnel(preInfo{X},baseDielectricReflectance.F0,baseDielectricReflectance.F90);
#else
{
#ifdef ANISOTROPIC_BASE
slab_glossy=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
0.0,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),vec3(1.0),specular_roughness,lightColor{X}.rgb);
#endif
specularFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);specularColoredFresnel=specularFresnel*specular_color;
#ifdef THIN_FILM
vec3 thinFilmDielectricFresnel=evalIridescence(thin_film_outside_ior,thin_film_ior,preInfo{X}.VdotH,thin_film_thickness,vec3(baseDielectricReflectance.F0));thinFilmDielectricFresnel=mix(thinFilmDielectricFresnel,vec3(dot(thinFilmDielectricFresnel,vec3(0.3333))),thin_film_desaturation_scale);specularColoredFresnel=mix(specularColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);
#endif
}
#endif
#ifdef REFRACTED_LIGHTS
vec3 forwardScatteredLight=vec3(0.0);
#if AREALIGHT{X}
#else
{preLightingInfo preInfoTrans=preInfo{X};
#ifdef SCATTERING
preInfoTrans.roughness=sqrt(sqrt(max(transmission_roughness_alpha,0.05)));
#else
preInfoTrans.roughness=transmission_roughness;
#endif
if (preInfoTrans.NdotLUnclamped<=0.0) {specularFresnel=0.0;specularColoredFresnel=specularFresnel*specular_color;}
#ifdef GEOMETRY_THIN_WALLED
vec3 refractNormalW=viewDirectionW;
#else
vec3 refractNormalW=normalW;
#endif
preInfoTrans.NdotL=0.5*max(dot(-refractNormalW,preInfoTrans.L),0.0)+0.5;
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
float diff=min(dispersion_iors[2]-dispersion_iors[0],max(dispersion_iors[0]-1.0,1.0));dispersion_iors[2]+=diff;dispersion_iors[0]-=diff;for (int i=0; i<3; i++) {float eta=1.0/dispersion_iors[i];
#elif defined(GEOMETRY_THIN_WALLED)
float eta=1.0;
#else
float eta=1.0/specular_ior;
#endif
preInfoTrans.H=preInfoTrans.L+min(eta,0.95)*viewDirectionW;float len2=dot(preInfoTrans.H,preInfoTrans.H);if (len2<1e-6) {preInfoTrans.H=preInfoTrans.L;} else {preInfoTrans.H=preInfoTrans.H*inversesqrt(len2);}
#ifdef ANISOTROPIC_BASE
preInfoTrans.H=-preInfoTrans.H;
#endif
preInfoTrans.VdotH=dot(viewDirectionW,preInfoTrans.H);
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight[i]+=
#else
forwardScatteredLight+=
#endif
#if defined(ANISOTROPIC_BASE)
computeAnisotropicSpecularLighting(preInfoTrans,viewDirectionW,refractNormalW,
baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,
transmission_roughness_alpha,lightColor{X}.rgb
#else
computeSpecularLighting(preInfoTrans,-refractNormalW,vec3(1.0),vec3(1.0),transmission_roughness_alpha,lightColor{X}.rgb
#endif
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
)[i];}
#else
);
#endif
#if !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight=mix(forwardScatteredLight,0.25*preInfoTrans.attenuation*lightColor{X}.rgb,clamp(1.0-pow(baseGeoInfo.NdotV,transmission_roughness_alpha),0.0,1.0));
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredLight=mix(vec3(0.0),forwardScatteredLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredLight=max(vec3(0.0),mix(vec3(0.0),forwardScatteredLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#if !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
preInfoTrans.roughness=1.0;vec3 diffused_forward_scattered_light=computeSpecularLighting(preInfoTrans,normalW,vec3(1.0),vec3(1.0),1.0,lightColor{X}.rgb)*volume_absorption;
#endif
#ifdef GEOMETRY_THIN_WALLED
vec3 forward_scattered_light=forwardScatteredLight*transmission_tint*volumeParams.multi_scatter_color;vec3 back_scattered_light=slab_diffuse*volumeParams.multi_scatter_color;slab_translucent=mix(back_scattered_light,forward_scattered_light,0.5+0.5*volumeParams.anisotropy);
#else
vec3 back_scattered_normal=normalize(normalW+viewDirectionW);preInfoTrans.NdotL=max(dot(back_scattered_normal,preInfoTrans.L),0.0);preInfoTrans.NdotV=dot(back_scattered_normal,viewDirectionW);preInfoTrans.H=normalize(viewDirectionW+preInfoTrans.L);preInfoTrans.VdotH=clamp(dot(viewDirectionW,preInfoTrans.H),0.0,1.0);preInfoTrans.roughness=0.2;vec3 back_scattered_light=computeSpecularLighting(preInfoTrans,viewDirectionW,vec3(1.0),vec3(0.08),0.0,lightColor{X}.rgb);vec3 forward_scattered_light=(forwardScatteredLight*volume_absorption);vec3 iso_scattered_light=slab_diffuse;vec3 back_scattering=mix(forward_scattered_light,forward_scattered_light+back_scattered_light*backscatter_color,iso_scatter_density);
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
vec3 iso_scattering=mix(forward_scattered_light,scattered_light_from_irradiance_texture*volumeParams.multi_scatter_color,iso_scatter_density);
#else
vec3 iso_scattering=mix(forward_scattered_light,(diffused_forward_scattered_light+iso_scattered_light)*volumeParams.multi_scatter_color,iso_scatter_density);
#endif
slab_translucent=mix(back_scattering,iso_scattering,back_to_iso_scattering_blend);slab_translucent=mix(slab_translucent,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent=forwardScatteredLight*transmission_tint*volume_absorption;
#endif
}
#endif
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
#if CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR
slab_metal=computeOpenPBRAreaConductorSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseConductorReflectance.coloredF0,
baseConductorReflectance.coloredF90
);
#else
slab_metal=computeOpenPBRAreaSpecularLighting(
preInfo{X},
light{X}.vLightSpecular.rgb,
baseConductorReflectance.coloredF0,
baseConductorReflectance.coloredF90
);
#endif
#else
{
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
vec3 coloredFresnel=getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
vec3 coloredFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef THIN_FILM
float thinFilmConductorAngle=max(preInfo{X}.VdotH,specular_roughness);vec3 thinFilmConductorFresnel=evalIridescence(thin_film_outside_ior,thin_film_ior,thinFilmConductorAngle,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorFresnel=mix(thinFilmConductorFresnel,vec3(dot(thinFilmConductorFresnel,vec3(0.3333))),thin_film_desaturation_scale);coloredFresnel=mix(coloredFresnel,specular_weight*thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_coat=computeOpenPBRAreaSpecularLighting(
preInfoCoat{X},
light{X}.vLightSpecular.rgb,
vec3(coatReflectance.F0),
vec3(coatReflectance.F90)
);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,
0.0,lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3(coatReflectance.F0),vec3(1.0),coat_roughness,lightColor{X}.rgb);
#endif
float NdotH=max(dot(coatNormalW,preInfoCoat{X}.H),0.0);coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
vec3 coatAbsorption=vec3(1.0);if (coat_weight>0.0) {float cosTheta_view=max(preInfoCoat{X}.NdotV,0.001);float cosTheta_light=max(preInfoCoat{X}.NdotL,0.001);float fresnel_view=coatReflectance.F0+(1.0-coatReflectance.F0)*pow(1.0-cosTheta_view,5.0);float fresnel_light=coatReflectance.F0+(1.0-coatReflectance.F0)*pow(1.0-cosTheta_light,5.0);float averageReflectance=(fresnel_view+fresnel_light)*0.5;float darkened_transmission=(1.0-averageReflectance)/(1.0+averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);float sin2=1.0-cosTheta_view*cosTheta_view;sin2=sin2/(coat_ior*coat_ior)*coat_weight;float cos_t=sqrt(1.0-sin2);float coatPathLength=1.0/cos_t;float effectivePathLength=coatPathLength*coat_weight;vec3 colored_transmission=pow(coat_color,vec3(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0,darkened_transmission,coat_weight);}
#ifdef FUZZ
fuzzFresnel=fuzzBrdf.z;vec3 fuzzNormalW=mix(normalW,coatNormalW,coat_weight);float fuzzNdotV=max(dot(fuzzNormalW,viewDirectionW.xyz),0.0);float fuzzNdotL=max(dot(fuzzNormalW,preInfo{X}.L),0.0);slab_fuzz=lightColor{X}.rgb*preInfo{X}.attenuation*evalFuzz(preInfo{X}.L,fuzzNdotL,fuzzNdotV,fuzzTangent,fuzzBitangent,fuzzBrdf);
#else
vec3 fuzz_color=vec3(0.0);
#endif
#ifdef PREPASS_IRRADIANCE
total_direct_diffuse+=slab_diffuse;
#endif
vec3 material_dielectric_base=mix(slab_diffuse*base_color.rgb,slab_translucent,surface_translucency_weight);
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
vec3 material_dielectric_gloss=material_dielectric_base*(1.0-specularFresnel)+slab_glossy;
#else
vec3 material_dielectric_gloss=material_dielectric_base*(1.0-specularFresnel)+slab_glossy*specularColoredFresnel;
#endif
vec3 material_base_substrate=mix(material_dielectric_gloss,slab_metal,base_metalness);vec3 material_coated_base=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3(1.0));material_surface_direct+=layer(material_coated_base,slab_fuzz,fuzzFresnel*fuzz_weight,vec3(1.0),fuzz_color);}
#endif
`,n.IncludesShadersStore[q]||(n.IncludesShadersStore[q]=J),un={name:q,shader:J}})),Y,X,fn,pn=e((()=>{t(),Y=`openpbrBlockPrePass`,X=`#if SCENE_MRT_COUNT>0
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
gl_FragData[PREPASS_ALBEDO_INDEX]=vec4(base_color,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
vec3 sqAlbedo=sqrt(base_color);
#endif
#ifdef PREPASS_IRRADIANCE
vec3 irradiance=total_direct_diffuse;
#ifndef UNLIT
#ifdef REFLECTION
irradiance+=slab_diffuse_ibl;
#endif
#endif
#ifdef SCATTERING
float scatter_mask=min(subsurface_weight+transmission_weight,1.0);
#else
float scatter_mask=0.0;
#endif
gl_FragData[PREPASS_IRRADIANCE_INDEX]=vec4(irradiance,writeGeometryInfo*scatter_mask);
#endif
#if defined(PREPASS_COLOR)
gl_FragData[PREPASS_COLOR_INDEX]=vec4(finalColor.rgb,finalColor.a);
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
`,n.IncludesShadersStore[Y]||(n.IncludesShadersStore[Y]=X),fn={name:Y,shader:X}})),mn=ee({openpbrPixelShader:()=>$}),Z,Q,hn,$,gn=e((()=>{t(),Ve(),Pe(),o(),i(),Ft(),Ne(),We(),gt(),Ke(),_t(),Ce(),Te(),r(),a(),It(),fe(),ce(),xe(),ne(),Be(),be(),Ct(),dt(),kt(),pe(),ke(),ge(),De(),bt(),Tt(),ut(),ft(),jt(),Ze(),Lt(),zt(),je(),nt(),Bt(),Vt(),ot(),Qe(),Ht(),re(),vt(),Wt(),Kt(),Jt(),st(),at(),Xt(),Qt(),en(),nn(),qe(),an(),sn(),ln(),dn(),me(),ie(),At(),pn(),He(),Mt(),Z=`openpbrPixelShader`,Q=`#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_EXTENSION
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || !defined(NORMAL) || defined(FORCENORMALFORWARD) || defined(SPECULARAA)
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef LODBASEDMICROSFURACE
#extension GL_EXT_shader_texture_lod : enable
#endif
#define CUSTOM_FRAGMENT_BEGIN
#ifdef LOGARITHMICDEPTH
#extension GL_EXT_frag_depth : enable
#endif
#include<prePassDeclaration>[SCENE_MRT_COUNT]
precision highp float;
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<__decl__openpbrFragment>
#include<pbrFragmentExtraDeclaration>
#include<__decl__lightFragment>[0..maxSimultaneousLights]
#include<openpbrFragmentSamplersDeclaration>
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
#include<openpbrNormalMapFragmentMainFunctions>
#include<openpbrNormalMapFragmentFunctions>
#ifdef REFLECTION
#include<reflectionFunction>
#endif
#define CUSTOM_FRAGMENT_DEFINITIONS
#include<openpbrDielectricReflectance>
#include<openpbrConductorReflectance>
#include<openpbrAmbientOcclusionFunctions>
#include<openpbrGeometryInfo>
#include<openpbrIblFunctions>
#include<openpbrVolumeFunctions>
vec3 layer(vec3 slab_bottom,vec3 slab_top,float lerp_factor,vec3 bottom_multiplier,vec3 top_multiplier) {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
void main(void) {
#ifdef PREPASS_IRRADIANCE
vec3 total_direct_diffuse=vec3(0.0);
#endif
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
vec3 coatNormalW=normalW;
#include<openpbrNormalMapFragment>
#include<openpbrBlockNormalFinal>
#include<openpbrBaseLayerData>
#include<openpbrTransmissionLayerData>
#include<openpbrSubsurfaceLayerData>
#include<openpbrCoatLayerData>
#include<openpbrThinFilmLayerData>
#include<openpbrFuzzLayerData>
#include<openpbrAmbientOcclusionData>
#define CUSTOM_FRAGMENT_UPDATE_ALPHA
#include<depthPrePass>
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
#ifdef ANISOTROPIC_COAT
geometryInfoAnisoOutParams coatGeoInfo=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
geometryInfoOutParams coatGeoInfo=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0,pow(specular_roughness,4.0)+2.0*pow(coat_roughness,4.0)),0.25),coat_weight);
#ifdef ANISOTROPIC_BASE
geometryInfoAnisoOutParams baseGeoInfo=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
geometryInfoOutParams baseGeoInfo=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
#ifdef FUZZ
vec3 fuzzNormalW=normalize(mix(normalW,coatNormalW,coat_weight));vec3 fuzzTangent=normalize(TBN[0]);fuzzTangent=normalize(fuzzTangent-dot(fuzzTangent,fuzzNormalW)*fuzzNormalW);vec3 fuzzBitangent=cross(fuzzNormalW,fuzzTangent);geometryInfoOutParams fuzzGeoInfo=geometryInfo(
fuzzNormalW,viewDirectionW.xyz,fuzz_roughness,geometricNormalW
);
#endif
ReflectanceParams coatReflectance;coatReflectance=dielectricReflectance(
coat_ior 
,1.0 
,vec3(1.0)
,coat_weight
);
#ifdef THIN_FILM
float thin_film_outside_ior=mix(1.0,coat_ior,coat_weight);
#endif
ReflectanceParams baseDielectricReflectance;{float effectiveCoatIor=mix(1.0,coat_ior,coat_weight);baseDielectricReflectance=dielectricReflectance(
specular_ior 
,effectiveCoatIor 
,specular_color
,specular_weight
);}
ReflectanceParams baseConductorReflectance;baseConductorReflectance=conductorReflectance(base_color,specular_color,specular_weight);vec3 volume_absorption=vec3(1.0);vec3 transmission_tint=vec3(1.0);float surface_translucency_weight=0.0;
#if defined(REFRACTED_BACKGROUND) || defined(REFRACTED_ENVIRONMENT) || defined(REFRACTED_LIGHTS)
#if defined(GEOMETRY_THIN_WALLED)
vec3 refractedViewVector=-viewDirectionW;
#else
#ifdef DISPERSION
vec3 refractedViewVectors[3];float iorDispersionSpread=transmission_dispersion_scale/transmission_dispersion_abbe_number*(specular_ior-1.0);vec3 dispersion_iors=vec3(specular_ior-iorDispersionSpread,specular_ior,specular_ior+iorDispersionSpread);for (int i=0; i<3; i++) {refractedViewVectors[i]=double_refract(-viewDirectionW,normalW,dispersion_iors[i]); }
#else
vec3 refractedViewVector=double_refract(-viewDirectionW,normalW,specular_ior);
#endif
#endif
#ifdef GEOMETRY_THIN_WALLED
float transmission_roughness=specular_roughness;
#else
float transmission_roughness=specular_roughness*clamp(4.0*(specular_ior-1.0),0.001,1.0);
#endif
#if (defined(TRANSMISSION_SLAB) || defined(SUBSURFACE_SLAB))
OpenPBRHomogeneousVolume volumeParams;{
#if defined(TRANSMISSION_SLAB)
OpenPBRHomogeneousVolume transmissionVolumeParams=computeOpenPBRTransmissionVolume(
transmission_color.rgb,
transmission_depth,
transmission_scatter.rgb,
transmission_scatter_anisotropy
);
#endif
#if defined(SUBSURFACE_SLAB)
OpenPBRHomogeneousVolume subsurfaceVolumeParams=computeOpenPBRSubsurfaceVolume(
subsurface_color.rgb,
subsurface_radius,
subsurface_radius_scale.rgb,
subsurface_scatter_anisotropy
);
#endif
#if !defined(TRANSMISSION_SLAB)
volumeParams=subsurfaceVolumeParams;surface_translucency_weight=subsurface_weight;
#elif !defined(SUBSURFACE_SLAB)
volumeParams=transmissionVolumeParams;
#ifdef TRANSMISSION_SLAB_VOLUME
volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);
#endif
surface_translucency_weight=transmission_weight;
#else
float subsurface_fraction_of_dielectric=(1.0f-transmission_weight)*subsurface_weight;float subsurface_and_transmission_fraction_of_dielectric=subsurface_fraction_of_dielectric+transmission_weight;float reciprocal_of_subsurface_and_transmission_fraction_of_dielectric =
1.0f/maxEps(subsurface_and_transmission_fraction_of_dielectric);float trans_weight=transmission_weight*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;float subsurf_weight=subsurface_fraction_of_dielectric*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;volumeParams.scatter_coeff=transmissionVolumeParams.scatter_coeff*trans_weight+subsurfaceVolumeParams.scatter_coeff*subsurf_weight;volumeParams.absorption_coeff=transmissionVolumeParams.absorption_coeff*trans_weight+subsurfaceVolumeParams.absorption_coeff*subsurf_weight;volumeParams.anisotropy=(transmissionVolumeParams.anisotropy*trans_weight+subsurfaceVolumeParams.anisotropy*subsurf_weight)/maxEps(trans_weight+subsurf_weight);volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/maxEps(volumeParams.extinction_coeff);volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);surface_translucency_weight=subsurface_and_transmission_fraction_of_dielectric;
#endif
}
volume_absorption=exp(-volumeParams.absorption_coeff*geometry_thickness);vec3 backscatter_color=vec3(1.0);{vec3 reduced_scatter=volumeParams.scatter_coeff*vec3(1.0-volumeParams.anisotropy);vec3 reduced_albedo=reduced_scatter/(volumeParams.absorption_coeff+reduced_scatter);vec3 sqrt_term=max(sqrt(1.0-reduced_albedo),0.0001);backscatter_color=(1.0-sqrt_term)/(1.0+sqrt_term);}
#elif defined(TRANSMISSION_SLAB)
surface_translucency_weight=transmission_weight;
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
vec3 iso_scatter_density=vec3(1.0);
#else
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
vec3 mfp=vec3(100.0)/volumeParams.extinction_coeff;vec3 scattered_light_from_irradiance_texture=sss_convolve(sceneIrradianceSampler,sceneDepthSampler,renderTargetSize,mfp,projection,inverseProjection,SSS_SAMPLE_COUNT,noise.xy);float numLights=float(LIGHTCOUNT);
#ifdef REFLECTION
numLights+=1.0;
#endif
scattered_light_from_irradiance_texture/=numLights;
#else
vec3 scattered_light_from_irradiance_texture=vec3(0.0);
#endif
float back_to_iso_scattering_blend=min(1.0+volumeParams.anisotropy,1.0);float iso_to_forward_scattering_blend=max(volumeParams.anisotropy,0.0);vec3 iso_scatter_transmittance=pow(exp(-volumeParams.scatter_coeff*geometry_thickness),vec3(0.2));vec3 iso_scatter_density=clamp(vec3(1.0)-iso_scatter_transmittance,0.0,1.0);transmission_roughness=min(transmission_roughness+pow((1.0-abs(volumeParams.anisotropy))*max3(iso_scatter_density*iso_scatter_density),3.0),1.0);
#endif
volumeParams.multi_scatter_color=mix(volumeParams.ss_albedo,volumeParams.multi_scatter_color,max3(iso_scatter_density));
#endif
#if defined(TRANSMISSION_SLAB) && (!defined(TRANSMISSION_SLAB_VOLUME) || defined(GEOMETRY_THIN_WALLED))
transmission_tint*=transmission_color.rgb;
#ifdef GEOMETRY_THIN_WALLED
float sin2=1.0-baseGeoInfo.NdotV*baseGeoInfo.NdotV;sin2=sin2/(specular_ior*specular_ior);float cos_t=sqrt(1.0-sin2);float pathLength=1.0/cos_t;transmission_tint=pow(transmission_tint,vec3(pathLength));
#else
transmission_tint*=transmission_color.rgb;
#endif
#endif
#if defined(SUBSURFACE_SLAB) && defined(GEOMETRY_THIN_WALLED)
float unweighted_translucency=max(mix(subsurface_weight,1.0f,transmission_weight),0.0001);transmission_tint=mix(vec3(1.0),transmission_tint,transmission_weight/unweighted_translucency);transmission_roughness=mix(1.0,transmission_roughness,transmission_weight/unweighted_translucency);
#endif
float transmission_roughness_alpha=transmission_roughness*transmission_roughness;
#endif
#include<openpbrBackgroundTransmission>
vec3 material_surface_ibl=vec3(0.,0.,0.);
#include<openpbrEnvironmentLighting>
vec3 material_surface_direct=vec3(0.,0.,0.);
#if defined(LIGHT0)
float aggShadow=0.;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
vec3 material_surface_emission=vEmissionColor;
#ifdef EMISSION_COLOR
vec3 emissionColorTex=TEXRD(emissionColorSampler,vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpace(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= vEmissionColorInfos.y;
#endif
material_surface_emission*=vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
vec4 finalColor=vec4(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,0.0);
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<openpbrBlockPrePass>
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
`,n.ShadersStore[Z]||(n.ShadersStore[Z]=Q),hn=[Fe,ze,et,Le,l,Me,Ue,ht,Ge,Pt,Se,we,te,Ye,f,de,le,ye,oe,Ie,ve,St,pt,Et,he,Oe,_e,Ee,xt,Nt,lt,mt,yt,Xe,h,Rt,Ae,ct,b,C,$e,it,E,ae,Ot,Ut,Gt,qt,rt,tt,Yt,Zt,$t,tn,Je,rn,on,cn,un,ue,se,wt,fn,Re,Dt];for(let e of hn)n.IncludesShadersStore[e.name]||(n.IncludesShadersStore[e.name]=e.shader);$={name:Z,shader:Q}}));export{$ as n,mn as r,gn as t};