import{n as e,r as ee}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";import{n as te,t as r}from"./samplerFragmentDeclaration-DENWs8-u.js";import{i as ne,o as re,r as ie,t as ae}from"./clipPlaneFragmentDeclaration-BSFYK0Pi.js";import{a as oe,n as se,r as ce,t as le}from"./fogFragment-A7zB_yUn.js";import{n as ue,t as de}from"./logDepthFragment-BQfCxjhi.js";import{r as fe,t as pe}from"./harmonicsFunctions-D3NhM45M.js";import{r as me,t as he}from"./helperFunctions-CklT_CQT.js";import{i as ge,o as _e,r as ve,t as ye}from"./imageProcessingFunctions-C1qXJQoS.js";import{a as be,i as xe,n as Se,o as Ce,s as we,t as Te}from"./shadowsFragmentFunctions-B1-uvnta.js";import{n as Ee,t as De}from"./clusteredLightingFunctions-y0WQqpNl.js";import{n as Oe,t as ke}from"./logDepthDeclaration-xoumPMwY.js";import{n as Ae,t as je}from"./reflectionFunction-DI1t9CIi.js";import{n as Me,t as Ne}from"./sceneUboDeclaration-BucOHbCW.js";import{n as Pe,t as Fe}from"./meshUboDeclaration-DDlgBu5O.js";import{a as Ie,c as Le,i as Re,n as ze,o as Be,r as Ve,s as He,t as Ue}from"./oitFragment-BUzhDghx.js";import{n as We,t as Ge}from"./mainUVVaryingDeclaration-DnaK2KSJ.js";import{n as Ke,t as qe}from"./depthPrePass-CI4Wrsnz.js";import{i as Je,n as Ye,r as i,t as Xe}from"./pbrIBLFunctions-APJ7bpH3.js";import{n as Ze,t as Qe}from"./pbrBRDFFunctions-CWPBPXSx.js";import{a as $e,c as et,i as tt,l as nt,n as rt,o as it,r as at,s as ot,t as st,u as ct}from"./openpbrTransmissionLayerData-Cn5thn5F.js";import{i as lt,n as ut,r as dt,t as ft}from"./hdrFilteringFunctions-D32dZ0XS.js";import{n as pt,t as mt}from"./openpbrUboDeclaration-DjYzwQE4.js";import{S as ht,_ as gt,a as _t,b as vt,c as yt,d as bt,f as xt,g as St,h as Ct,i as wt,l as Tt,m as Et,n as Dt,o as Ot,p as kt,r as At,s as jt,t as Mt,u as Nt,v as Pt,x as Ft,y as It}from"./pbrDebug-BRUtwXEI.js";var a,o,s,Lt=e((()=>{t(),r(),i(),a=`openpbrFragmentSamplersDeclaration`,o=`#include<samplerFragmentDeclaration>(_DEFINENAME_,BASE_COLOR,_VARYINGNAME_,BaseColor,_SAMPLERNAME_,baseColor)
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
var environmentBrdfSamplerSampler: sampler;var environmentBrdfSampler: texture_2d<f32>;
#endif
#ifdef FUZZENVIRONMENTBRDF
var environmentFuzzBrdfSamplerSampler: sampler;var environmentFuzzBrdfSampler: texture_2d<f32>;
#endif
#ifdef REFRACTED_BACKGROUND
var backgroundRefractionSamplerSampler: sampler;var backgroundRefractionSampler: texture_2d<f32>;
#endif
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
var sceneIrradianceSampler: texture_2d<f32>;var sceneDepthSampler: texture_2d<f32>;
#endif
#if defined(ANISOTROPIC) || defined(FUZZ) || defined(REFRACTED_BACKGROUND) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING)
var blueNoiseSamplerSampler: sampler;var blueNoiseSampler: texture_2d<f32>;
#endif
#ifdef IBL_CDF_FILTERING
var icdfSamplerSampler: sampler;var icdfSampler: texture_2d<f32>;
#endif
`,n.IncludesShadersStoreWGSL[a]||(n.IncludesShadersStoreWGSL[a]=o),s={name:a,shader:o}})),c,l,Rt,zt=e((()=>{t(),c=`openpbrNormalMapFragmentMainFunctions`,l=`#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(ANISOTROPIC) || defined(FUZZ) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying vTBN0: vec3f;varying vTBN1: vec3f;varying vTBN2: vec3f;
#endif
#ifdef OBJECTSPACE_NORMALMAP
uniform normalMatrix: mat4x4f;fn toNormalMatrix(m: mat4x4f)->mat4x4f
{var a00=m[0][0];var a01=m[0][1];var a02=m[0][2];var a03=m[0][3];var a10=m[1][0];var a11=m[1][1];var a12=m[1][2];var a13=m[1][3];var a20=m[2][0]; 
var a21=m[2][1];var a22=m[2][2];var a23=m[2][3];var a30=m[3][0]; 
var a31=m[3][1];var a32=m[3][2];var a33=m[3][3];var b00=a00*a11-a01*a10;var b01=a00*a12-a02*a10;var b02=a00*a13-a03*a10;var b03=a01*a12-a02*a11;var b04=a01*a13-a03*a11;var b05=a02*a13-a03*a12;var b06=a20*a31-a21*a30;var b07=a20*a32-a22*a30;var b08=a20*a33-a23*a30;var b09=a21*a32-a22*a31;var b10=a21*a33-a23*a31;var b11=a22*a33-a23*a32;var det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;var mi=mat4x4<f32>(
(a11*b11-a12*b10+a13*b09)/det,
(a02*b10-a01*b11-a03*b09)/det,
(a31*b05-a32*b04+a33*b03)/det,
(a22*b04-a21*b05-a23*b03)/det,
(a12*b08-a10*b11-a13*b07)/det,
(a00*b11-a02*b08+a03*b07)/det,
(a32*b02-a30*b05-a33*b01)/det,
(a20*b05-a22*b02+a23*b01)/det,
(a10*b10-a11*b08+a13*b06)/det,
(a01*b08-a00*b10-a03*b06)/det,
(a30*b04-a31*b02+a33*b00)/det,
(a21*b02-a20*b04-a23*b00)/det,
(a11*b07-a10*b09-a12*b06)/det,
(a00*b09-a01*b07+a02*b06)/det,
(a31*b01-a30*b03-a32*b00)/det,
(a20*b03-a21*b01+a22*b00)/det);return mat4x4<f32>(mi[0][0],mi[1][0],mi[2][0],mi[3][0],
mi[0][1],mi[1][1],mi[2][1],mi[3][1],
mi[0][2],mi[1][2],mi[2][2],mi[3][2],
mi[0][3],mi[1][3],mi[2][3],mi[3][3]);}
#endif
fn perturbNormalBase(cotangentFrame: mat3x3f,normal: vec3f,scale: f32)->vec3f
{var output=normal;
#ifdef NORMALXYSCALE
output=normalize(output* vec3f(scale,scale,1.0));
#endif
return normalize(cotangentFrame*output);}
fn perturbNormal(cotangentFrame: mat3x3f,textureSample: vec3f,scale: f32)->vec3f
{return perturbNormalBase(cotangentFrame,textureSample*2.0-1.0,scale);}
fn cotangent_frame(normal: vec3f,p: vec3f,uv: vec2f,tangentSpaceParams: vec2f)->mat3x3f
{var dp1: vec3f=dpdx(p);var dp2: vec3f=dpdy(p);var duv1: vec2f=dpdx(uv);var duv2: vec2f=dpdy(uv);var dp2perp: vec3f=cross(dp2,normal);var dp1perp: vec3f=cross(normal,dp1);var tangent: vec3f=dp2perp*duv1.x+dp1perp*duv2.x;var bitangent: vec3f=dp2perp*duv1.y+dp1perp*duv2.y;tangent*=tangentSpaceParams.x;bitangent*=tangentSpaceParams.y;var det: f32=max(dot(tangent,tangent),dot(bitangent,bitangent));var invmax: f32=select(inverseSqrt(det),0.0,det==0.0);return mat3x3f(tangent*invmax,bitangent*invmax,normal);}
#endif
`,n.IncludesShadersStoreWGSL[c]||(n.IncludesShadersStoreWGSL[c]=l),Rt={name:c,shader:l}})),u,d,f,Bt=e((()=>{t(),r(),u=`openpbrNormalMapFragmentFunctions`,d=`#if defined(GEOMETRY_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_NORMAL,_VARYINGNAME_,GeometryNormal,_SAMPLERNAME_,geometryNormal)
#endif
#if defined(GEOMETRY_COAT_NORMAL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,GEOMETRY_COAT_NORMAL,_VARYINGNAME_,GeometryCoatNormal,_SAMPLERNAME_,geometryCoatNormal)
#endif
#if defined(DETAIL)
#include<samplerFragmentDeclaration>(_DEFINENAME_,DETAIL,_VARYINGNAME_,Detail,_SAMPLERNAME_,detail)
#endif
#if defined(GEOMETRY_NORMAL) && defined(PARALLAX)
const minSamples: f32=4.;const maxSamples: f32=15.;const iMaxSamples: i32=15;fn parallaxOcclusion(vViewDirCoT: vec3f,vNormalCoT: vec3f,texCoord: vec2f,parallaxScale: f32)->vec2f {var parallaxLimit: f32=length(vViewDirCoT.xy)/vViewDirCoT.z;parallaxLimit*=parallaxScale;var vOffsetDir: vec2f=normalize(vViewDirCoT.xy);var vMaxOffset: vec2f=vOffsetDir*parallaxLimit;var numSamples: f32=maxSamples+(dot(vViewDirCoT,vNormalCoT)*(minSamples-maxSamples));var stepSize: f32=1.0/numSamples;var currRayHeight: f32=1.0;var vCurrOffset: vec2f= vec2f(0,0);var vLastOffset: vec2f= vec2f(0,0);var lastSampledHeight: f32=1.0;var currSampledHeight: f32=1.0;var keepWorking: bool=true;for (var i: i32=0; i<iMaxSamples; i++)
{currSampledHeight=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,texCoord+vCurrOffset).w;if (!keepWorking)
{}
else if (currSampledHeight>currRayHeight)
{var delta1: f32=currSampledHeight-currRayHeight;var delta2: f32=(currRayHeight+stepSize)-lastSampledHeight;var ratio: f32=delta1/(delta1+delta2);vCurrOffset=(ratio)* vLastOffset+(1.0-ratio)*vCurrOffset;keepWorking=false;}
else
{currRayHeight-=stepSize;vLastOffset=vCurrOffset;
#ifdef PARALLAX_RHS
vCurrOffset-=stepSize*vMaxOffset;
#else
vCurrOffset+=stepSize*vMaxOffset;
#endif
lastSampledHeight=currSampledHeight;}}
return vCurrOffset;}
fn parallaxOffset(viewDir: vec3f,heightScale: f32)->vec2f
{var height: f32=textureSample(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV).w;var texCoordOffset: vec2f=heightScale*viewDir.xy*height;
#ifdef PARALLAX_RHS
return texCoordOffset;
#else
return -texCoordOffset;
#endif
}
#endif
`,n.IncludesShadersStoreWGSL[u]||(n.IncludesShadersStoreWGSL[u]=d),f={name:u,shader:d}})),p,m,h,Vt=e((()=>{t(),p=`openpbrConductorReflectance`,m=`#define pbr_inline
fn conductorReflectance(baseColor: vec3f,specularColor: vec3f,specularWeight: f32)->ReflectanceParams
{var outParams: ReflectanceParams;
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR)
outParams.coloredF0=baseColor*specularWeight;outParams.coloredF90=specularColor*specularWeight;
#else
outParams.coloredF0=baseColor;outParams.coloredF90=vec3f(1.0f);
#endif
outParams.F0=1.0f;outParams.F90=1.0f;return outParams;}`,n.IncludesShadersStoreWGSL[p]||(n.IncludesShadersStoreWGSL[p]=m),h={name:p,shader:m}})),g,_,Ht,Ut=e((()=>{t(),g=`openpbrAmbientOcclusionFunctions`,_=`fn compute_specular_occlusion(n_dot_v: f32,metallic: f32,ambient_occlusion: f32,roughness: f32)->f32
{let specular_occlusion: f32=saturate(pow(n_dot_v+ambient_occlusion,exp2(-16.0*roughness-1.0))-1.0+ambient_occlusion);return mix(specular_occlusion,1.0,metallic*square(1.0-roughness));}
`,n.IncludesShadersStoreWGSL[g]||(n.IncludesShadersStoreWGSL[g]=_),Ht={name:g,shader:_}})),v,y,b,Wt=e((()=>{t(),v=`openpbrVolumeFunctions`,y=`struct OpenPBRHomogeneousVolume {extinction_coeff: vec3f, 
ss_albedo: vec3f, 
multi_scatter_color: vec3f, 
absorption_coeff: vec3f, 
scatter_coeff: vec3f, 
anisotropy: f32, };fn computeOpenPBRTransmissionVolume(
transmission_color: vec3f,
transmission_depth: f32,
transmission_scatter: vec3f,
anisotropy: f32
)->OpenPBRHomogeneousVolume
{var volumeParams: OpenPBRHomogeneousVolume;volumeParams.absorption_coeff=vec3f(0.0f);volumeParams.scatter_coeff=vec3f(0.0f);volumeParams.anisotropy=anisotropy;
#ifdef GEOMETRY_THIN_WALLED
volumeParams.scatter_coeff=vec3f(1.0f);volumeParams.anisotropy=1.0f; 
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=vec3f(1.0f);
#else
if (transmission_depth>0.0f) {let invDepth: vec3f=vec3f(1.f/maxEps(transmission_depth));volumeParams.extinction_coeff=-log(maxEpsVec3(transmission_color.rgb))*invDepth;volumeParams.scatter_coeff=transmission_scatter.rgb*invDepth;volumeParams.absorption_coeff=volumeParams.extinction_coeff-volumeParams.scatter_coeff.rgb;let minCoeff: f32=min3(volumeParams.absorption_coeff);if (minCoeff<0.0f) {volumeParams.absorption_coeff-=vec3f(minCoeff);}
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/(volumeParams.extinction_coeff);} else {volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=vec3f(0.0f);}
#endif
return volumeParams;}
fn computeOpenPBRSubsurfaceVolume(
subsurface_color: vec3f,
subsurface_radius: f32,
subsurface_radius_scale: vec3f,
anisotropy: f32
)->OpenPBRHomogeneousVolume
{var volumeParams: OpenPBRHomogeneousVolume;volumeParams.absorption_coeff=vec3f(0.0f);volumeParams.scatter_coeff=vec3f(0.0f);volumeParams.anisotropy=anisotropy;volumeParams.multi_scatter_color=subsurface_color;let mfp: vec3f=subsurface_radius_scale*vec3f(subsurface_radius);volumeParams.extinction_coeff=vec3f(1.0f)/maxEpsVec3(mfp);volumeParams.ss_albedo=multiScatterToSingleScatterAlbedoWithAniso(subsurface_color,anisotropy);volumeParams.scatter_coeff=volumeParams.ss_albedo*volumeParams.extinction_coeff;volumeParams.absorption_coeff=volumeParams.extinction_coeff-volumeParams.scatter_coeff.rgb;let minCoeff: f32=min3(volumeParams.absorption_coeff);if (minCoeff<0.0f) {volumeParams.absorption_coeff-=vec3f(minCoeff);}
volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;return volumeParams;}
fn sss_pdf(r: f32,d: vec3f)->vec3f
{let d_clamped=max(vec3f(1e-4f),d);return (exp(-r/d_clamped)+exp(-r/(3.0f*d_clamped)))/max(vec3f(1e-5f),8.0f*PI*d_clamped*r);}
fn sss_samples_pdf(r: f32,d: f32)->f32
{let d_clamped=max(1e-4f,d);return exp(-r/(3.0f*d_clamped))/(6.0f*PI*d_clamped*r);}
fn sss_samples_icdf(x: f32,d: f32)->f32
{let d_clamped=max(1e-4f,d);let x_clamped=max(1e-4f,x);return -3.0f*log(x_clamped)*d_clamped;}
fn samples_scale(x: f32,d: f32)->f32
{return 1.0f-exp(-x/(3.0f*d));}
fn sss_get_position(depth_texture: texture_2d<f32>,tex_coord: vec2f,render_resolution: vec2f,inv_proj: mat4x4f)->vec3f
{var P: vec4f=vec4f(tex_coord,textureLoad(depth_texture,vec2i(tex_coord*render_resolution),0).x,1.0f);P.x=2.0f*P.x-1.0f;P.y=2.0f*P.y-1.0f;P=inv_proj*P;return P.xyz/P.w;}
fn sss_filter_scale(currZ: f32,proj: mat4x4f)->f32
{return 1.0f/dot(vec2f(proj[2].w,proj[3].w),vec2f(currZ,1.0f));}
fn projective_to_pixels(proj_dist: f32,proj: mat4x4f,resolution: vec2f)->f32
{return proj_dist*proj[1][1]*resolution.y;}
fn pixels_to_projective(pixel_dist: f32,proj: mat4x4f,resolution: vec2f)->f32
{return pixel_dist/(proj[1][1]*resolution.y);}
fn sss_convolve(sss_irradiance_texture: texture_2d<f32>,depth_texture: texture_2d<f32>,render_resolution: vec2f,d: vec3f,proj: mat4x4f,inv_proj: mat4x4f,sample_count: i32,noise: vec2f)->vec3f
{let tex_coord: vec2f=fragmentInputs.position.xy/render_resolution;let unconvolved_irradiance: vec3f=textureLoad(sss_irradiance_texture,vec2i(fragmentInputs.position.xy),0).rgb;let curr_pos: vec3f=sss_get_position(depth_texture,tex_coord,render_resolution,inv_proj);var dmax: f32=max3(d);let max_dmax: f32=0.1*f32(sample_count);var d_adjusted=d;if (dmax>max_dmax)
{d_adjusted*=max_dmax/dmax;dmax=max_dmax;}
var dz: f32=dmax*sss_filter_scale(curr_pos.z,proj);let projMat2d: mat2x2f=mat2x2f(proj[0].xy,proj[1].xy);if (determinant(projMat2d)*dz<1e-4f) {return unconvolved_irradiance;}
let overscan_size_in_pixels: f32=max(render_resolution.x,render_resolution.y)*0.1;let filter_crop_ratio: f32=0.8f; 
let crop_radius: f32=projective_to_pixels(sss_samples_icdf(1.0f-filter_crop_ratio,dz),proj,render_resolution);if (crop_radius>overscan_size_in_pixels)
{d_adjusted*=overscan_size_in_pixels/crop_radius;dz*=overscan_size_in_pixels/crop_radius;}
let filter_samples_scale: f32=samples_scale(pixels_to_projective(overscan_size_in_pixels,proj,render_resolution),dz);var irradiance_sum: vec3f=vec3f(0.0f);var weight_sum: vec3f=vec3f(0.0f);for (var i: i32=0; i<sample_count; i++)
{var r: vec2f=fract(plasticSequence(u32(i))+noise);r.x*=TWO_PI;r.y*=filter_samples_scale;let icdf: f32=sss_samples_icdf(1.0-r.y,dz);let sample_uv: vec2f=tex_coord+icdf*projMat2d*vec2f(cos(r.x),sin(r.x));let sss_irradiance: vec4f=textureLoad(sss_irradiance_texture,vec2i(sample_uv*render_resolution),0);let dist: f32=distance(curr_pos,sss_get_position(depth_texture,sample_uv,render_resolution,inv_proj));if (dist>0.0f)
{let weights: vec3f=sss_irradiance.a/sss_samples_pdf(icdf,dz)*sss_pdf(dist,d_adjusted);irradiance_sum+=weights*sss_irradiance.rgb;weight_sum+=weights;}}
return vec3f(select(unconvolved_irradiance.r,irradiance_sum.r/weight_sum.r,weight_sum.r>=1e-5f),
select(unconvolved_irradiance.g,irradiance_sum.g/weight_sum.g,weight_sum.g>=1e-5f),
select(unconvolved_irradiance.b,irradiance_sum.b/weight_sum.b,weight_sum.b>=1e-5f));}
`,n.IncludesShadersStoreWGSL[v]||(n.IncludesShadersStoreWGSL[v]=y),b={name:v,shader:y}})),x,S,Gt,Kt=e((()=>{t(),x=`openpbrNormalMapFragment`,S=`var uvOffset: vec2f= vec2f(0.0,0.0);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL) || defined(PARALLAX) || defined(DETAIL)
#ifdef NORMALXYSCALE
var normalScale: f32=1.0;
#elif defined(GEOMETRY_NORMAL)
var normalScale: f32=uniforms.vGeometryNormalInfos.y;
#else
var normalScale: f32=1.0;
#endif
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2); 
#elif defined(GEOMETRY_NORMAL)
var TBNUV: vec2f=select(-fragmentInputs.vGeometryNormalUV,fragmentInputs.vGeometryNormalUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV,uniforms.vTangentSpaceParams);
#elif defined(GEOMETRY_COAT_NORMAL)
var TBNUV: vec2f=select(-fragmentInputs.vGeometryCoatNormalUV,fragmentInputs.vGeometryCoatNormalUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV,uniforms.vTangentSpaceParams);
#else
var TBNUV: vec2f=select(-fragmentInputs.vDetailUV,fragmentInputs.vDetailUV,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW*normalScale,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#elif defined(ANISOTROPIC) || defined(FUZZ)
#if defined(TANGENT) && defined(NORMAL)
var TBN: mat3x3f=mat3x3<f32>(input.vTBN0,input.vTBN1,input.vTBN2);
#else
var TBNUV: vec2f=select( -fragmentInputs.vMainUV1,fragmentInputs.vMainUV1,fragmentInputs.frontFacing);var TBN: mat3x3f=cotangent_frame(normalW,input.vPositionW,TBNUV, vec2f(1.,1.));
#endif
#endif
#ifdef PARALLAX
var invTBN: mat3x3f=transposeMat3(TBN);
#ifdef PARALLAXOCCLUSION
#else
#endif
#endif
#ifdef DETAIL
var detailColor: vec4f=textureSample(detailSampler,detailSamplerSampler,fragmentInputs.vDetailUV+uvOffset);var detailNormalRG: vec2f=detailColor.wy*2.0-1.0;var detailNormalB: f32=sqrt(1.-saturate(dot(detailNormalRG,detailNormalRG)));var detailNormal: vec3f= vec3f(detailNormalRG,detailNormalB);
#endif
#ifdef GEOMETRY_COAT_NORMAL
coatNormalW=perturbNormal(TBN,TEXRD(geometryCoatNormalSampler,geometryCoatNormalSamplerSampler,fragmentInputs.vGeometryCoatNormalUV+uvOffset).xyz,uniforms.vGeometryCoatNormalInfos.y);
#endif
#ifdef GEOMETRY_NORMAL
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(TEXRD(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV).xyz *2.0-1.0);normalW=normalize(mat3x3f(uniforms.normalMatrix[0].xyz,uniforms.normalMatrix[1].xyz,uniforms.normalMatrix[2].xyz)*normalW);
#elif !defined(DETAIL)
normalW=perturbNormal(TBN,TEXRD(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV+uvOffset).xyz,uniforms.vGeometryNormalInfos.y);
#else
var sampledNormal: vec3f=TEXRD(geometryNormalSampler,geometryNormalSamplerSampler,fragmentInputs.vGeometryNormalUV+uvOffset).xyz*2.0-1.0;
#if DETAIL_NORMALBLENDMETHOD==0 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);var blendedNormal: vec3f=normalize( vec3f(sampledNormal.xy+detailNormal.xy,sampledNormal.z*detailNormal.z));
#elif DETAIL_NORMALBLENDMETHOD==1 
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);sampledNormal+= vec3f(0.0,0.0,1.0);detailNormal*= vec3f(-1.0,-1.0,1.0);var blendedNormal: vec3f=sampledNormal*dot(sampledNormal,detailNormal)/sampledNormal.z-detailNormal;
#endif
normalW=perturbNormalBase(TBN,blendedNormal,uniforms.vGeometryNormalInfos.y);
#endif
#elif defined(DETAIL)
detailNormal=vec3f(detailNormal.xy*uniforms.vDetailInfos.z,detailNormal.z);normalW=perturbNormalBase(TBN,detailNormal,uniforms.vDetailInfos.z);
#endif
`,n.IncludesShadersStoreWGSL[x]||(n.IncludesShadersStoreWGSL[x]=S),Gt={name:x,shader:S}})),C,w,T,qt=e((()=>{t(),C=`openpbrBlockNormalFinal`,w=`#if defined(FORCENORMALFORWARD) && defined(NORMAL)
var faceNormal: vec3f=normalize(cross(dpdx(fragmentInputs.vPositionW),dpdy(fragmentInputs.vPositionW)))*scene.vEyePosition.w;
#if defined(TWOSIDEDLIGHTING)
faceNormal=select(-faceNormal,faceNormal,fragmentInputs.frontFacing);
#endif
normalW*=sign(dot(normalW,faceNormal));coatNormalW*=sign(dot(coatNormalW,faceNormal));
#endif
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
#if defined(MIRRORED)
normalW=select(normalW,-normalW,fragmentInputs.frontFacing);coatNormalW=select(coatNormalW,-coatNormalW,fragmentInputs.frontFacing);
#else
normalW=select(-normalW,normalW,fragmentInputs.frontFacing);coatNormalW=select(-coatNormalW,coatNormalW,fragmentInputs.frontFacing);
#endif
#endif
`,n.IncludesShadersStoreWGSL[C]||(n.IncludesShadersStoreWGSL[C]=w),T={name:C,shader:w}})),E,D,Jt,Yt=e((()=>{t(),E=`openpbrBaseLayerData`,D=`var base_color=vec3f(0.8);var base_metalness: f32=0.0;var base_diffuse_roughness: f32=0.0;var specular_weight: f32=1.0;var specular_roughness: f32=0.3;var specular_color: vec3f=vec3f(1.0);var specular_roughness_anisotropy: f32=0.0;var specular_ior: f32=1.5;var alpha: f32=1.0;var geometry_tangent: vec2f=vec2f(1.0,0.0);var geometry_thickness: f32=0.0;
#ifdef BASE_WEIGHT
let baseWeightFromTexture: vec4f=TEXRD(baseWeightSampler,baseWeightSamplerSampler,fragmentInputs.vBaseWeightUV+uvOffset);
#endif
#ifdef BASE_COLOR
let baseColorFromTexture: vec4f=TEXRD(baseColorSampler,baseColorSamplerSampler,fragmentInputs.vBaseColorUV+uvOffset);
#endif
#ifdef BASE_METALNESS
let metallicFromTexture: vec4f=TEXRD(baseMetalnessSampler,baseMetalnessSamplerSampler,fragmentInputs.vBaseMetalnessUV+uvOffset);
#endif
#ifdef BASE_DIFFUSE_ROUGHNESS
let baseDiffuseRoughnessFromTexture: f32=TEXRD(baseDiffuseRoughnessSampler,baseDiffuseRoughnessSamplerSampler,fragmentInputs.vBaseDiffuseRoughnessUV+uvOffset).r;
#endif
#ifdef GEOMETRY_TANGENT
let geometryTangentFromTexture: vec3f=TEXRD(geometryTangentSampler,geometryTangentSamplerSampler,fragmentInputs.vGeometryTangentUV+uvOffset).rgb;
#endif
#ifdef SPECULAR_ROUGHNESS_ANISOTROPY
let anisotropyFromTexture: f32=TEXRD(specularRoughnessAnisotropySampler,specularRoughnessAnisotropySamplerSampler,fragmentInputs.vSpecularRoughnessAnisotropyUV+uvOffset).r*uniforms.vSpecularRoughnessAnisotropyInfos.y;
#endif
#ifdef GEOMETRY_OPACITY
let opacityFromTexture: vec4f=TEXRD(geometryOpacitySampler,geometryOpacitySamplerSampler,fragmentInputs.vGeometryOpacityUV+uvOffset);
#endif
#ifdef GEOMETRY_THICKNESS
let thicknessFromTexture: vec4f=TEXRD(geometryThicknessSampler,geometryThicknessSamplerSampler,fragmentInputs.vGeometryThicknessUV+uvOffset);
#endif
#ifdef DECAL
let decalFromTexture: vec4f=textureSample(decalSampler,decalSamplerSampler,fragmentInputs.vDecalUV+uvOffset);
#endif
#ifdef SPECULAR_COLOR
let specularColorFromTexture: vec4f=TEXRD(specularColorSampler,specularColorSamplerSampler,fragmentInputs.vSpecularColorUV+uvOffset);
#endif
#if defined(SPECULAR_WEIGHT)
#ifdef SPECULAR_WEIGHT_IN_ALPHA
let specularWeightFromTexture: f32=TEXRD(specularWeightSampler,specularWeightSamplerSampler,fragmentInputs.vSpecularWeightUV+uvOffset).a;
#else
let specularWeightFromTexture: f32=TEXRD(specularWeightSampler,specularWeightSamplerSampler,fragmentInputs.vSpecularWeightUV+uvOffset).r;
#endif
#endif
#if defined(ANISOTROPIC) || defined(FUZZ) || defined(REFRACTED_BACKGROUND) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING)
let noise=vec3f(2.0)*textureSample(blueNoiseSampler,blueNoiseSamplerSampler,fragmentInputs.position.xy/256.0).xyz-vec3f(1.0);
#endif
#if defined(SPECULAR_ROUGHNESS_FROM_METALNESS_TEXTURE_GREEN) && defined(BASE_METALNESS)
let roughnessFromTexture: f32=metallicFromTexture.g;
#elif defined(SPECULAR_ROUGHNESS)
let roughnessFromTexture: f32=TEXRD(specularRoughnessSampler,specularRoughnessSamplerSampler,fragmentInputs.vSpecularRoughnessUV+uvOffset).r;
#endif
base_color=uniforms.vBaseColor.rgb;
#if defined(VERTEXCOLOR) || defined(INSTANCESCOLOR) && defined(INSTANCES)
base_color*=fragmentInputs.vColor.rgb;
#endif
#if defined(VERTEXALPHA) || defined(INSTANCESCOLOR) && defined(INSTANCES)
alpha*=fragmentInputs.vColor.a;
#endif
base_color*=vec3(uniforms.vBaseWeight);alpha=uniforms.vBaseColor.a;base_metalness=uniforms.vReflectanceInfo.x;base_diffuse_roughness=uniforms.vBaseDiffuseRoughness;specular_roughness=uniforms.vReflectanceInfo.y;specular_color=uniforms.vSpecularColor.rgb;specular_weight=uniforms.vReflectanceInfo.a;specular_ior=uniforms.vReflectanceInfo.z;specular_roughness_anisotropy=uniforms.vSpecularAnisotropy.b;geometry_tangent=uniforms.vSpecularAnisotropy.rg;geometry_thickness=uniforms.vGeometryThickness;
#ifdef BASE_COLOR
#ifdef BASE_COLOR_GAMMA
base_color*=toLinearSpaceVec3(baseColorFromTexture.rgb);
#else
base_color*=baseColorFromTexture.rgb;
#endif
base_color*=uniforms.vBaseColorInfos.y;
#endif
#ifdef BASE_WEIGHT
base_color*=baseWeightFromTexture.r;
#endif
#if defined(BASE_COLOR) && defined(ALPHA_FROM_BASE_COLOR_TEXTURE)
alpha*=baseColorFromTexture.a;
#elif defined(GEOMETRY_OPACITY)
alpha*=opacityFromTexture.r;alpha*=uniforms.vGeometryOpacityInfos.y;
#endif
#ifdef GEOMETRY_THICKNESS
#ifdef GEOMETRY_THICKNESS_FROM_GREEN_CHANNEL
geometry_thickness*=thicknessFromTexture.g;
#else
geometry_thickness*=thicknessFromTexture.r;
#endif
geometry_thickness*=uniforms.vGeometryThicknessInfos.y;
#endif
#ifdef ALPHATEST
#if DEBUGMODE != 88
if (alpha<ALPHATESTVALUE) {discard;}
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
base_diffuse_roughness*=baseDiffuseRoughnessFromTexture*uniforms.vBaseDiffuseRoughnessInfos.y;
#endif
#ifdef SPECULAR_COLOR
#ifdef SPECULAR_COLOR_GAMMA
specular_color*=toLinearSpaceVec3(specularColorFromTexture.rgb);
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
{let tangentFromTexture: vec2f=normalize(geometryTangentFromTexture.xy*vec2f(2.0f)-vec2f(1.0f));let tangent_angle_texture: f32=atan2(tangentFromTexture.y,tangentFromTexture.x);let tangent_angle_uniform: f32=atan2(geometry_tangent.y,geometry_tangent.x);let tangent_angle: f32=tangent_angle_texture+tangent_angle_uniform;geometry_tangent=vec2f(cos(tangent_angle),sin(tangent_angle));}
#endif
#if defined(GEOMETRY_TANGENT) && defined(SPECULAR_ROUGHNESS_ANISOTROPY_FROM_TANGENT_TEXTURE)
specular_roughness_anisotropy*=geometryTangentFromTexture.b;
#elif defined(SPECULAR_ROUGHNESS_ANISOTROPY)
specular_roughness_anisotropy*=anisotropyFromTexture;
#endif
#ifdef DETAIL
let detailRoughness: f32=mix(0.5f,detailColor.b,vDetailInfos.w);let loLerp: f32=mix(0.f,specular_roughness,detailRoughness*2.f);let hiLerp: f32=mix(specular_roughness,1.f,(detailRoughness-0.5f)*2.f);specular_roughness=mix(loLerp,hiLerp,step(detailRoughness,0.5f));
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
let baseAlpha: f32=specular_roughness*specular_roughness;let roughnessT: f32=mix(baseAlpha,1.0f,specular_roughness_anisotropy*specular_roughness_anisotropy);let roughnessB: f32=baseAlpha;specular_roughness_anisotropy=1.0f-roughnessB/max(roughnessT,0.00001f);specular_roughness=sqrt(roughnessT/sqrt(2.0f/(1.0f+(1.0f-specular_roughness_anisotropy)*(1.0f-specular_roughness_anisotropy))));
#endif
`,n.IncludesShadersStoreWGSL[E]||(n.IncludesShadersStoreWGSL[E]=D),Jt={name:E,shader:D}})),O,k,A,Xt=e((()=>{t(),O=`openpbrCoatLayerData`,k=`var coat_weight: f32=0.0f;var coat_color: vec3f=vec3f(1.0f);var coat_roughness: f32=0.0f;var coat_roughness_anisotropy: f32=0.0f;var coat_ior: f32=1.6f;var coat_darkening: f32=1.0f;var geometry_coat_tangent: vec2f=vec2f(1.0f,0.0f);
#ifdef COAT_WEIGHT
var coatWeightFromTexture: vec4f=TEXRD(coatWeightSampler,coatWeightSamplerSampler,fragmentInputs.vCoatWeightUV+uvOffset);
#endif
#ifdef COAT_COLOR
var coatColorFromTexture: vec4f=TEXRD(coatColorSampler,coatColorSamplerSampler,fragmentInputs.vCoatColorUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS
var coatRoughnessFromTexture: vec4f=TEXRD(coatRoughnessSampler,coatRoughnessSamplerSampler,fragmentInputs.vCoatRoughnessUV+uvOffset);
#endif
#ifdef COAT_ROUGHNESS_ANISOTROPY
var coatRoughnessAnisotropyFromTexture: f32=TEXRD(coatRoughnessAnisotropySampler,coatRoughnessAnisotropySamplerSampler,fragmentInputs.vCoatRoughnessAnisotropyUV+uvOffset).r;
#endif
#ifdef COAT_DARKENING
var coatDarkeningFromTexture: vec4f=TEXRD(coatDarkeningSampler,coatDarkeningSamplerSampler,fragmentInputs.vCoatDarkeningUV+uvOffset);
#endif
#ifdef GEOMETRY_COAT_TANGENT
var geometryCoatTangentFromTexture: vec3f=TEXRD(geometryCoatTangentSampler,geometryCoatTangentSamplerSampler,fragmentInputs.vGeometryCoatTangentUV+uvOffset).rgb;
#endif
coat_color=uniforms.vCoatColor.rgb;coat_weight=uniforms.vCoatWeight;coat_roughness=uniforms.vCoatRoughness;coat_roughness_anisotropy=uniforms.vCoatRoughnessAnisotropy;coat_ior=uniforms.vCoatIor;coat_darkening=uniforms.vCoatDarkening;geometry_coat_tangent=uniforms.vGeometryCoatTangent.rg;
#ifdef COAT_WEIGHT
coat_weight*=coatWeightFromTexture.r;
#endif
#ifdef COAT_COLOR
#ifdef COAT_COLOR_GAMMA
coat_color*=toLinearSpaceVec3(coatColorFromTexture.rgb);
#else
coat_color*=coatColorFromTexture.rgb;
#endif
coat_color*=uniforms.vCoatColorInfos.y;
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
{let tangentFromTexture: vec2f=normalize(geometryCoatTangentFromTexture.xy*vec2f(2.0f)-vec2f(1.0f));let tangent_angle_texture: f32=atan2(tangentFromTexture.y,tangentFromTexture.x);let tangent_angle_uniform: f32=atan2(geometry_coat_tangent.y,geometry_coat_tangent.x);let tangent_angle: f32=tangent_angle_texture+tangent_angle_uniform;geometry_coat_tangent=vec2f(cos(tangent_angle),sin(tangent_angle));}
#endif
#ifdef USE_GLTF_STYLE_ANISOTROPY
let coatAlpha: f32=coat_roughness*coat_roughness;let coatRoughnessT: f32=mix(coatAlpha,1.0f,coat_roughness_anisotropy*coat_roughness_anisotropy);let coatRoughnessB: f32=coatAlpha;coat_roughness_anisotropy=1.0f-coatRoughnessB/max(coatRoughnessT,0.00001f);coat_roughness=sqrt(coatRoughnessT/sqrt(2.0f/(1.0f+(1.0f-coat_roughness_anisotropy)*(1.0f-coat_roughness_anisotropy))));
#endif
`,n.IncludesShadersStoreWGSL[O]||(n.IncludesShadersStoreWGSL[O]=k),A={name:O,shader:k}})),j,M,Zt,Qt=e((()=>{t(),j=`openpbrThinFilmLayerData`,M=`#ifdef THIN_FILM
var thin_film_weight: f32=uniforms.vThinFilmWeight;var thin_film_thickness: f32=uniforms.vThinFilmThickness.r*1000.0f; 
var thin_film_ior: f32=uniforms.vThinFilmIor;
#ifdef THIN_FILM_WEIGHT
var thinFilmWeightFromTexture: f32=TEXRD(thinFilmWeightSampler,thinFilmWeightSamplerSampler,fragmentInputs.vThinFilmWeightUV+uvOffset).r*uniforms.vThinFilmWeightInfos.y;
#endif
#ifdef THIN_FILM_THICKNESS
var thinFilmThicknessFromTexture: f32=TEXRD(thinFilmThicknessSampler,thinFilmThicknessSamplerSampler,fragmentInputs.vThinFilmThicknessUV+uvOffset).g*uniforms.vThinFilmThicknessInfos.y;
#endif
#ifdef THIN_FILM_WEIGHT
thin_film_weight*=thinFilmWeightFromTexture;
#endif
#ifdef THIN_FILM_THICKNESS
thin_film_thickness*=thinFilmThicknessFromTexture;
#endif
let thin_film_ior_scale: f32=clamp(2.0f*abs(thin_film_ior-1.0f),0.0f,1.0f);
#endif
`,n.IncludesShadersStoreWGSL[j]||(n.IncludesShadersStoreWGSL[j]=M),Zt={name:j,shader:M}})),N,P,$t,en=e((()=>{t(),N=`openpbrFuzzLayerData`,P=`var fuzz_weight: f32=0.0f;var fuzz_color: vec3f=vec3f(1.0f);var fuzz_roughness: f32=0.0f;
#ifdef FUZZ
#ifdef FUZZ_WEIGHT
let fuzzWeightFromTexture: vec4f=TEXRD(fuzzWeightSampler,fuzzWeightSamplerSampler,fragmentInputs.vFuzzWeightUV+uvOffset);
#endif
#ifdef FUZZ_COLOR
var fuzzColorFromTexture: vec4f=TEXRD(fuzzColorSampler,fuzzColorSamplerSampler,fragmentInputs.vFuzzColorUV+uvOffset);
#endif
#ifdef FUZZ_ROUGHNESS
let fuzzRoughnessFromTexture: vec4f=TEXRD(fuzzRoughnessSampler,fuzzRoughnessSamplerSampler,fragmentInputs.vFuzzRoughnessUV+uvOffset);
#endif
fuzz_color=uniforms.vFuzzColor.rgb;fuzz_weight=uniforms.vFuzzWeight;fuzz_roughness=uniforms.vFuzzRoughness;
#ifdef FUZZ_WEIGHT
fuzz_weight*=fuzzWeightFromTexture.r;
#endif
#ifdef FUZZ_COLOR
#ifdef FUZZ_COLOR_GAMMA
fuzz_color*=toLinearSpaceVec3(fuzzColorFromTexture.rgb);
#else
fuzz_color*=fuzzColorFromTexture.rgb;
#endif
fuzz_color*=uniforms.vFuzzColorInfos.y;
#endif
#if defined(FUZZ_ROUGHNESS) && defined(FUZZ_ROUGHNESS_FROM_TEXTURE_ALPHA)
fuzz_roughness*=fuzzRoughnessFromTexture.a;
#elif defined(FUZZ_ROUGHNESS)
fuzz_roughness*=fuzzRoughnessFromTexture.r;
#endif
#endif
`,n.IncludesShadersStoreWGSL[N]||(n.IncludesShadersStoreWGSL[N]=P),$t={name:N,shader:P}})),F,I,L,tn=e((()=>{t(),F=`openpbrAmbientOcclusionData`,I=`var ambient_occlusion: vec3f=vec3f(1.0f,1.0f,1.0f);var specular_ambient_occlusion: f32=1.0f;var coat_specular_ambient_occlusion: f32=1.0f;
#ifdef AMBIENT_OCCLUSION
var ambientOcclusionFromTexture: vec3f=TEXRD(ambientOcclusionSampler,ambientOcclusionSamplerSampler,fragmentInputs.vAmbientOcclusionUV+uvOffset).rgb;ambient_occlusion=vec3f(ambientOcclusionFromTexture.r*uniforms.vAmbientOcclusionInfos.y+(1.0f-uniforms.vAmbientOcclusionInfos.y));
#endif
`,n.IncludesShadersStoreWGSL[F]||(n.IncludesShadersStoreWGSL[F]=I),L={name:F,shader:I}})),R,z,B,nn=e((()=>{t(),R=`openpbrBackgroundTransmission`,z=`var slab_translucent_background: vec4f=vec4f(0.,0.,0.,1.);
#ifdef REFRACTED_BACKGROUND
{let refractionLOD: f32=min(transmission_roughness,0.8)*uniforms.vBackgroundRefractionInfos.x;let lodTexelSize: f32=pow(2.0f,refractionLOD-uniforms.vBackgroundRefractionInfos.x);
#ifdef DISPERSION
{
#ifdef REFRACTION_HIGH_QUALITY_BLUR
{var dispResult: vec3f=vec3f(0.0);var dispWeight: vec3f=vec3f(0.0);let noiseOffset: vec2f=noise.xy*select(0.0f,lodTexelSize,refractionLOD>0.0f);for (var k: i32=0; k<6; k++) {let t: f32=(f32(k)+noise.y)/6.0f;let t_rg: f32=clamp(t*2.0f,0.0f,1.0f);let t_gb: f32=clamp((t-0.5f)*2.0f,0.0f,1.0f);let refVec: vec3f=mix(mix(refractedViewVectors[0],refractedViewVectors[1],t_rg),refractedViewVectors[2],t_gb);let uvw: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refVec*geometry_thickness,1.0f))).xyz);var coords: vec2f=uvw.xy/uvw.z;coords.y=1.0f-coords.y;let s: vec4f=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords+noiseOffset,refractionLOD);let rw: f32=max(0.0f,1.0f-2.0f*t);let gw: f32=max(0.0f,1.0f-abs(2.0f*t-1.0f));let bw: f32=max(0.0f,2.0f*t-1.0f);let w: vec3f=vec3f(rw,gw,bw);dispResult+=s.rgb*w;dispWeight+=w;}
slab_translucent_background=vec4f(dispResult/max(dispWeight,vec3f(1e-6)),1.0f);}
#else
for (var i: i32=0; i<3; i++) {let refractedViewVector: vec3f=refractedViewVectors[i];let uvw: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refractedViewVector*geometry_thickness,1.0f))).xyz);var coords: vec2f=uvw.xy/uvw.z;coords.y=1.0f-coords.y;if (refractionLOD>0.0f) {let noiseOffset: vec2f=noise.xy*lodTexelSize;slab_translucent_background[i]=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords+noiseOffset,refractionLOD)[i];} else {slab_translucent_background[i]=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,coords,0.0f)[i];}}
#endif
}
#else
{let refractionUVW: vec3f=vec3f((uniforms.backgroundRefractionMatrix*(scene.view*vec4f(fragmentInputs.vPositionW+refractedViewVector*geometry_thickness,1.0f))).xyz);var refractionCoords: vec2f=refractionUVW.xy/refractionUVW.z;refractionCoords.y=1.0f-refractionCoords.y;if (refractionLOD>0.0f) {
#ifdef REFRACTION_HIGH_QUALITY_BLUR
let cosA: f32=cos(noise.x*PI);let sinA: f32=sin(noise.x*PI);let u: vec2f=vec2f( cosA,sinA)*(0.5f*lodTexelSize);let v: vec2f=vec2f(-sinA,cosA)*(0.5f*lodTexelSize);slab_translucent_background=0.25f*(
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+u+v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords-u+v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+u-v,refractionLOD) +
textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords-u-v,refractionLOD)
);
#else
let noiseOffset: vec2f=noise.xy*lodTexelSize;slab_translucent_background=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords+noiseOffset,refractionLOD);
#endif
} else {slab_translucent_background=textureSampleLevel(backgroundRefractionSampler,backgroundRefractionSamplerSampler,refractionCoords,0.0f);}}
#endif
}
#endif
`,n.IncludesShadersStoreWGSL[R]||(n.IncludesShadersStoreWGSL[R]=z),B={name:R,shader:z}})),V,H,U,rn=e((()=>{t(),V=`openpbrEnvironmentLighting`,H=`#if defined(REFLECTION) || defined(REFRACTED_BACKGROUND)
var coatAbsorption=vec3f(1.0f);var coatIblFresnel: f32=0.0;if (coat_weight>0.0) {coatIblFresnel=computeDielectricIblFresnel(coatReflectance,coatGeoInfo.environmentBrdf);let hemisphere_avg_fresnel: f32=coatReflectance.F0+0.5f*(1.0f-coatReflectance.F0);var averageReflectance: f32=(coatIblFresnel+hemisphere_avg_fresnel)*0.5f;let roughnessFactor=1.0f-coat_roughness*0.5f;averageReflectance*=roughnessFactor;var darkened_transmission: f32=(1.0f-averageReflectance)*(1.0f-averageReflectance);darkened_transmission=mix(1.0,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let effectivePathLength=coatPathLength*coat_weight;let colored_transmission: vec3f=pow(coat_color,vec3f(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0f,darkened_transmission,coat_weight);}
#endif
#ifdef REFLECTION
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
let environmentFuzzBrdf: vec3f=getFuzzBRDFLookup(fuzzGeoInfo.NdotV,sqrt(fuzz_roughness));
#endif
var baseDiffuseEnvironmentLight: vec3f=sampleIrradiance(
normalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
,base_diffuse_roughness
,base_color
);
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
let specularAlphaG: f32=specular_roughness*specular_roughness;
#ifdef ANISOTROPIC_BASE
var baseSpecularEnvironmentLight: vec3f=sampleRadianceAnisotropic(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,normalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,false 
,1.0 
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,normalW);var baseSpecularEnvironmentLight: vec3f=sampleRadiance(specularAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
#ifdef ANISOTROPIC_BASE
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG*specularAlphaG *max(1.0f-baseGeoInfo.anisotropy,0.3f));
#else
baseSpecularEnvironmentLight=mix(baseSpecularEnvironmentLight.rgb,baseDiffuseEnvironmentLight,specularAlphaG);
#endif
var coatEnvironmentLight: vec3f=vec3f(0.f,0.f,0.f);if (coat_weight>0.0) {
#ifdef REFLECTIONMAP_3D
var reflectionCoords: vec3f=vec3f(0.f,0.f,0.f);
#else
var reflectionCoords: vec2f=vec2f(0.f,0.f);
#endif
reflectionCoords=createReflectionCoords(fragmentInputs.vPositionW,coatNormalW);var coatAlphaG: f32=coat_roughness*coat_roughness;
#ifdef ANISOTROPIC_COAT
coatEnvironmentLight=sampleRadianceAnisotropic(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,coatNormalW
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,false 
,1.0 
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
coatEnvironmentLight=sampleRadiance(coatAlphaG,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,coatGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,reflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
let modifiedFuzzRoughness: f32=clamp(fuzz_roughness*fuzz_roughness*(1.0f+0.5f*environmentFuzzBrdf.y),0.0f,1.0f);var fuzzEnvironmentLight=vec3f(0.0f,0.0f,0.0f);let fuzzIblFresnel: f32=min(environmentFuzzBrdf.z*2.0f,1.0f);let viewTangent: vec2f=vec2f(dot(viewDirectionW,fuzzTangent),dot(viewDirectionW,fuzzBitangent));let centerAngle: f32=atan2(viewTangent.y,viewTangent.x);for (var i: i32=0; i<i32(FUZZ_IBL_SAMPLES); i++) {let angle: f32=centerAngle+(f32(i)/f32(FUZZ_IBL_SAMPLES)-0.5f+noise.x/f32(FUZZ_IBL_SAMPLES))*3.141592f;let fiberCylinderNormal: vec3f=normalize(cos(angle)*fuzzTangent+sin(angle)*fuzzBitangent);let fuzzReflectionCoords: vec3f=(uniforms.reflectionMatrix*vec4f(fiberCylinderNormal,0.0f)).xyz;let radianceSample: vec3f=sampleRadiance(modifiedFuzzRoughness,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,fuzzGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,fuzzReflectionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);fuzzEnvironmentLight+=radianceSample;}
fuzzEnvironmentLight/=f32(FUZZ_IBL_SAMPLES);
#if defined(GEOMETRY_NORMAL) || defined(GEOMETRY_COAT_NORMAL)
var fuzzDiffuseEnvironmentLight: vec3f=sampleIrradiance(
fuzzNormalW
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
,0.0f
,vec3f(1.0f)
);
#else
var fuzzDiffuseEnvironmentLight: vec3f=baseDiffuseEnvironmentLight;
#endif
fuzzEnvironmentLight=mix(min(fuzzEnvironmentLight,fuzzDiffuseEnvironmentLight),fuzzDiffuseEnvironmentLight,modifiedFuzzRoughness);
#endif
var dielectricIblFresnel: f32=computeDielectricIblFresnel(baseDielectricReflectance,baseGeoInfo.environmentBrdf);var dielectricIblColoredFresnel: vec3f=dielectricIblFresnel*specular_color;
#ifdef THIN_FILM
let thin_film_cos_theta: f32=max(baseGeoInfo.NdotV,specularAlphaG);let thin_film_desaturation_scale=(thin_film_ior-1.0)*sqrt(thin_film_thickness*0.001f*thin_film_cos_theta);let tf_brdf_x: f32=baseGeoInfo.environmentBrdf.x;let tf_E_ss: f32 =baseGeoInfo.environmentBrdf.y;var thinFilmDielectricF0: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricF0=mix(thinFilmDielectricF0,vec3(dot(thinFilmDielectricF0,vec3f(0.3333f))),thin_film_desaturation_scale);var thinFilmDielectricDir: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricDir=mix(thinFilmDielectricDir,vec3(dot(thinFilmDielectricDir,vec3f(0.3333f))),thin_film_desaturation_scale);let tf_f0d_avg: f32 =dot(thinFilmDielectricF0, vec3f(0.3333f));let tf_dird_avg: f32=dot(thinFilmDielectricDir,vec3f(0.3333f));var thin_film_dielectric: vec3f=thinFilmDielectricDir*(tf_f0d_avg/max(tf_dird_avg,1e-5));let tf_E_dielectric: vec3f=(vec3f(1.0)-thin_film_dielectric)*vec3f(tf_brdf_x)+thin_film_dielectric*vec3f(tf_E_ss);let tf_F_avg_dielectric: vec3f=thin_film_dielectric+(vec3f(1.0)-thin_film_dielectric)/21.0;let tf_ECF_dielectric: vec3f=vec3f(1.0)+tf_F_avg_dielectric*(vec3f(1.0)/vec3f(tf_E_ss)-vec3f(1.0));thin_film_dielectric=clamp(tf_E_dielectric*tf_ECF_dielectric,vec3f(0.0),vec3f(1.0));dielectricIblColoredFresnel=mix(dielectricIblColoredFresnel,thin_film_dielectric*specular_color,thin_film_weight*thin_film_ior_scale);dielectricIblFresnel=max(dielectricIblColoredFresnel.r,max(dielectricIblColoredFresnel.g,dielectricIblColoredFresnel.b));
#endif
var conductorIblFresnel: vec3f=computeConductorIblFresnel(baseConductorReflectance,baseGeoInfo.environmentBrdf);
#ifdef THIN_FILM
var thinFilmConductorF0: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,1.0,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorF0=mix(thinFilmConductorF0,vec3(dot(thinFilmConductorF0,vec3f(0.3333f))),thin_film_desaturation_scale);var thinFilmConductorDir: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thin_film_cos_theta,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorDir=mix(thinFilmConductorDir,vec3(dot(thinFilmConductorDir,vec3f(0.3333f))),thin_film_desaturation_scale);let tf_f0c_avg: f32 =dot(thinFilmConductorF0, vec3f(0.3333f));let tf_dirc_avg: f32=dot(thinFilmConductorDir,vec3f(0.3333f));var thinFilmConductorRaw: vec3f=thinFilmConductorDir*(tf_f0c_avg/max(tf_dirc_avg,1e-5));
#if (CONDUCTOR_SPECULAR_MODEL==CONDUCTOR_SPECULAR_MODEL_OPENPBR) && defined(ENVIRONMENTBRDF)
let tf_b: vec3f=getF82B(baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);let tf_brdf_z: f32=baseGeoInfo.environmentBrdf.z/BRDF_Z_SCALE;let tf_E_conductor: vec3f=(vec3f(1.0)-thinFilmConductorRaw)*vec3f(tf_brdf_x)+thinFilmConductorRaw*vec3f(tf_E_ss)-tf_b*vec3f(tf_brdf_z);let tf_F_avg_conductor: vec3f=thinFilmConductorRaw+(vec3f(1.0)-thinFilmConductorRaw)/21.0-tf_b/126.0;
#else
let tf_E_conductor: vec3f=(vec3f(1.0)-thinFilmConductorRaw)*vec3f(tf_brdf_x)+thinFilmConductorRaw*vec3f(tf_E_ss);let tf_F_avg_conductor: vec3f=thinFilmConductorRaw+(vec3f(1.0)-thinFilmConductorRaw)/21.0;
#endif
let tf_ECF_conductor: vec3f=vec3f(1.0)+tf_F_avg_conductor*(vec3f(1.0)/vec3f(tf_E_ss)-vec3f(1.0));var thinFilmConductorFresnel: vec3f=specular_weight*clamp(tf_E_conductor*tf_ECF_conductor,vec3f(0.0),vec3f(1.0));conductorIblFresnel=mix(conductorIblFresnel,thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
var slab_diffuse_ibl: vec3f=vec3f(0.,0.,0.);var slab_glossy_ibl: vec3f=vec3f(0.,0.,0.);var slab_metal_ibl: vec3f=vec3f(0.,0.,0.);var slab_coat_ibl: vec3f=vec3f(0.,0.,0.);slab_diffuse_ibl=baseDiffuseEnvironmentLight*uniforms.vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
specular_ambient_occlusion=compute_specular_occlusion(baseGeoInfo.NdotV,base_metalness,ambient_occlusion.x,specular_roughness);
#endif
slab_glossy_ibl=baseSpecularEnvironmentLight*uniforms.vLightingIntensity.z;slab_metal_ibl=baseSpecularEnvironmentLight*conductorIblFresnel*uniforms.vLightingIntensity.z;if (coat_weight>0.0) {slab_coat_ibl=coatEnvironmentLight*uniforms.vLightingIntensity.z;
#ifdef AMBIENT_OCCLUSION
coat_specular_ambient_occlusion=compute_specular_occlusion(coatGeoInfo.NdotV,0.0,ambient_occlusion.x,coat_roughness);
#endif
}
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
var slab_fuzz_ibl=fuzzEnvironmentLight*uniforms.vLightingIntensity.z;
#endif
var slab_translucent_base_ibl: vec3f=vec3f(0.0f,0.0f,0.0f);
#ifdef REFRACTED_ENVIRONMENT
#ifdef ANISOTROPIC_BASE
var forwardScatteredEnvironmentLight: vec3f=sampleRadianceAnisotropic(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
#ifdef GEOMETRY_THIN_WALLED
,viewDirectionW
#else
,normalW
#endif
,viewDirectionW
,fragmentInputs.vPositionW
,noise
,true 
#ifdef GEOMETRY_THIN_WALLED
,1.05f 
#else
,specular_ior 
#endif
,reflectionSampler
,reflectionSamplerSampler
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
);
#else
var forwardScatteredEnvironmentLight: vec3f=vec3f(0.,0.,0.);
#ifdef DISPERSION
for (var i: i32=0; i<3; i++) {var iblRefractionCoords: vec3f=refractedViewVectors[i];
#else
var iblRefractionCoords: vec3f=refractedViewVector;
#endif
#ifdef REFRACTED_ENVIRONMENT_OPPOSITEZ
iblRefractionCoords.z*=-1.0f;
#endif
#ifdef REFRACTED_ENVIRONMENT_LOCAL_CUBE
iblRefractionCoords=parallaxCorrectNormal(fragmentInputs.vPositionW,refractedViewVector,uniforms.refractionSize,uniforms.refractionPosition);
#endif
iblRefractionCoords=(uniforms.reflectionMatrix*vec4f(iblRefractionCoords,0.0f)).xyz;
#ifdef DISPERSION
forwardScatteredEnvironmentLight[i]=sampleRadiance(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#endif
)[i];
#else
forwardScatteredEnvironmentLight=sampleRadiance(transmission_roughness_alpha,uniforms.vReflectionMicrosurfaceInfos.rgb,uniforms.vReflectionInfos
,baseGeoInfo
,reflectionSampler
,reflectionSamplerSampler
,iblRefractionCoords
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
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
var scatterVector: vec3f=normalW;
#else
#if defined(USEIRRADIANCEMAP) && defined(USE_IRRADIANCE_DOMINANT_DIRECTION)
var scatterVector: vec3f=mix(uniforms.vReflectionDominantDirection,normalW,max3(iso_scatter_density));
#else
var scatterVector: vec3f=normalW;
#endif
scatterVector=mix(viewDirectionW,scatterVector,back_to_iso_scattering_blend);
#endif
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(GEOMETRY_THIN_WALLED)
var scatteredEnvironmentLight: vec3f=scattered_light_from_irradiance_texture;
#else
var scatteredEnvironmentLight: vec3f=sampleIrradiance(
scatterVector
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
,vEnvironmentIrradiance 
#endif
#if (defined(USESPHERICALFROMREFLECTIONMAP) && (!defined(NORMAL) || !defined(USESPHERICALINVERTEX))) || (defined(USEIRRADIANCEMAP) && defined(REFLECTIONMAP_3D))
,uniforms.reflectionMatrix
#endif
#ifdef USEIRRADIANCEMAP
,irradianceSampler
,irradianceSamplerSampler
#ifdef USE_IRRADIANCE_DOMINANT_DIRECTION
,uniforms.vReflectionDominantDirection
#endif
#endif
#ifdef REALTIME_FILTERING
,uniforms.vReflectionFilteringInfo
#ifdef IBL_CDF_FILTERING
,icdfSampler
,icdfSamplerSampler
#endif
#endif
,uniforms.vReflectionInfos
,viewDirectionW
#if defined(GEOMETRY_THIN_WALLED)
,base_diffuse_roughness
,subsurface_color.rgb
#else
,1.0f
,volumeParams.multi_scatter_color
#endif
);
#endif
#ifdef GEOMETRY_THIN_WALLED
let forward_scattered_light: vec3f=forwardScatteredEnvironmentLight*transmission_tint*volumeParams.multi_scatter_color;let back_scattered_light: vec3f=scatteredEnvironmentLight*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(back_scattered_light,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
let forward_scattered_light: vec3f=forwardScatteredEnvironmentLight*volume_absorption;let back_scattered_light: vec3f=mix(forward_scattered_light,scatteredEnvironmentLight*backscatter_color,iso_scatter_density);let iso_scattered_light: vec3f=mix(forward_scattered_light,scatteredEnvironmentLight*volumeParams.multi_scatter_color,iso_scatter_density);slab_translucent_base_ibl=mix(back_scattered_light,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#endif
#else
slab_translucent_base_ibl+=forwardScatteredEnvironmentLight*transmission_tint*volume_absorption;
#endif
#endif
#define CUSTOM_FRAGMENT_BEFORE_IBLLAYERCOMPOSITION
slab_diffuse_ibl*=ambient_occlusion;slab_metal_ibl*=specular_ambient_occlusion;slab_glossy_ibl*=specular_ambient_occlusion;slab_coat_ibl*=coat_specular_ambient_occlusion;let material_dielectric_base_ibl: vec3f=mix(slab_diffuse_ibl*base_color.rgb,slab_translucent_base_ibl,surface_translucency_weight);let material_dielectric_gloss_ibl: vec3f=material_dielectric_base_ibl*(1.0-dielectricIblFresnel)+slab_glossy_ibl*dielectricIblColoredFresnel;let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,slab_metal_ibl,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,slab_coat_ibl,coatIblFresnel,coatAbsorption,vec3f(1.0f));
#if defined(FUZZ) && defined(FUZZENVIRONMENTBRDF)
slab_fuzz_ibl*=min(vec3(specular_ambient_occlusion),ambient_occlusion);material_surface_ibl=layer(material_coated_base_ibl,slab_fuzz_ibl,fuzzIblFresnel*fuzz_weight,vec3f(1.0f),fuzz_color);
#else
material_surface_ibl=material_coated_base_ibl;
#endif
#elif defined(REFRACTED_BACKGROUND)
let black=vec3f(0.0f);var slab_translucent_base_ibl: vec3f=vec3f(0.0f);
#ifdef GEOMETRY_THIN_WALLED
#ifdef SCATTERING
let forward_scattered_light: vec3f=slab_translucent_background.rgb*transmission_tint*volumeParams.multi_scatter_color;slab_translucent_base_ibl=mix(black,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*transmission_tint;
#endif
#else
#ifdef SCATTERING
let forward_scattered_light: vec3f=slab_translucent_background.rgb*volume_absorption;let iso_scattered_light: vec3f=(1.0f-iso_scatter_density)*forward_scattered_light;slab_translucent_base_ibl=mix(black,iso_scattered_light,back_to_iso_scattering_blend);slab_translucent_base_ibl=mix(slab_translucent_base_ibl,forward_scattered_light,iso_to_forward_scattering_blend)*transmission_tint;
#else
slab_translucent_base_ibl=slab_translucent_background.rgb*volume_absorption*transmission_tint;
#endif
#endif
let material_dielectric_base_ibl: vec3f=mix(black,slab_translucent_base_ibl.rgb,surface_translucency_weight);let material_dielectric_gloss_ibl: vec3f=material_dielectric_base_ibl*(baseGeoInfo.NdotV);let material_base_substrate_ibl: vec3f=mix(material_dielectric_gloss_ibl,black,base_metalness);let material_coated_base_ibl: vec3f=layer(material_base_substrate_ibl,black,coatIblFresnel,coatAbsorption,vec3f(1.0f));material_surface_ibl=material_coated_base_ibl;
#endif
`,n.IncludesShadersStoreWGSL[V]||(n.IncludesShadersStoreWGSL[V]=H),U={name:V,shader:H}})),W,G,K,an=e((()=>{t(),W=`openpbrDirectLightingInit`,G=`#ifdef LIGHT{X}
var preInfo{X}: preLightingInfo;var preInfoCoat{X}: preLightingInfo;let lightColor{X}: vec4f=light{X}.vLightDiffuse;var shadow{X}: f32=1.0f;
#if defined(SHADOWONLY) || defined(LIGHTMAP) && defined(LIGHTMAPEXCLUDED{X}) && defined(LIGHTMAPNOSPECULAR{X})
#else
#define CUSTOM_LIGHT{X}_COLOR 
#ifdef SPOTLIGHT{X}
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,fragmentInputs.vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,fragmentInputs.vPositionW);
#elif defined(POINTLIGHT{X})
preInfo{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW,fragmentInputs.vPositionW);preInfoCoat{X}=computePointAndSpotPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW,fragmentInputs.vPositionW);
#elif defined(HEMILIGHT{X})
preInfo{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeHemisphericPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(DIRLIGHT{X})
preInfo{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,normalW);preInfoCoat{X}=computeDirectionalPreLightingInfo(light{X}.vLightData,viewDirectionW,coatNormalW);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
preInfo{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,viewDirectionW,normalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,specular_roughness);preInfoCoat{X}=computeAreaPreLightingInfo(areaLightsLTC1Sampler,areaLightsLTC1SamplerSampler,areaLightsLTC2Sampler,areaLightsLTC2SamplerSampler,viewDirectionW,coatNormalW,fragmentInputs.vPositionW,light{X}.vLightData.xyz,light{X}.vLightWidth.xyz,light{X}.vLightHeight.xyz,coat_roughness);
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
preInfo{X}.attenuation=1.0f;
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
`,n.IncludesShadersStoreWGSL[W]||(n.IncludesShadersStoreWGSL[W]=G),K={name:W,shader:G}})),q,J,on,sn=e((()=>{t(),q=`openpbrDirectLighting`,J=`#ifdef LIGHT{X}
{var slab_diffuse: vec3f=vec3f(0.f,0.f,0.f);var slab_translucent: vec3f=vec3f(0.f,0.f,0.f);var slab_glossy: vec3f=vec3f(0.f,0.f,0.f);var specularFresnel: f32=0.0f;var specularColoredFresnel: vec3f=vec3f(0.f,0.f,0.f);var slab_metal: vec3f=vec3f(0.f,0.f,0.f);var slab_coat: vec3f=vec3f(0.f,0.f,0.f);var coatFresnel: f32=0.0f;var slab_fuzz: vec3f=vec3f(0.f,0.f,0.f);var fuzzFresnel: f32=0.0f;
#ifdef HEMILIGHT{X}
slab_diffuse=computeHemisphericDiffuseLighting(preInfo{X},lightColor{X}.rgb,light{X}.vLightGround);
#elif defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_diffuse=computeAreaDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#else
slab_diffuse=computeDiffuseLighting(preInfo{X},lightColor{X}.rgb);
#endif
#ifdef PROJECTEDLIGHTTEXTURE{X}
slab_diffuse*=computeProjectionTextureDiffuseLighting(projectionLightTexture{X},textureProjectionMatrix{X},fragmentInputs.vPositionW);
#endif
#ifdef FUZZ
let fuzzNdotH: f32=max(dot(fuzzNormalW,preInfo{X}.H),0.0f);let fuzzBrdf: vec3f=getFuzzBRDFLookup(fuzzNdotH,sqrt(fuzz_roughness));
#endif
#ifdef THIN_FILM
let thin_film_desaturation_scale: f32=(thin_film_ior-1.0f)*sqrt(thin_film_thickness*0.001f);
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
0.0f,lightColor{X}.rgb);
#else
slab_glossy=computeSpecularLighting(preInfo{X},normalW,vec3(1.0),vec3(1.0),specular_roughness,lightColor{X}.rgb);
#endif
specularFresnel=fresnelSchlickGGX(preInfo{X}.VdotH,baseDielectricReflectance.F0,baseDielectricReflectance.F90);specularColoredFresnel=specularFresnel*specular_color;
#ifdef THIN_FILM
var thinFilmDielectricFresnel: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,preInfo{X}.VdotH,thin_film_thickness,vec3f(baseDielectricReflectance.F0));thinFilmDielectricFresnel=mix(thinFilmDielectricFresnel,vec3f(dot(thinFilmDielectricFresnel,vec3f(0.3333f))),thin_film_desaturation_scale);specularColoredFresnel=mix(specularColoredFresnel,thinFilmDielectricFresnel*specular_color,thin_film_weight*thin_film_ior_scale);
#endif
}
#endif
#ifdef REFRACTED_LIGHTS
var forwardScatteredLight: vec3f=vec3f(0.0f);
#if AREALIGHT{X}
#else
{var preInfoTrans=preInfo{X};
#ifdef SCATTERING
preInfoTrans.roughness=sqrt(sqrt(max(transmission_roughness_alpha,0.05f)));
#else
preInfoTrans.roughness=transmission_roughness;
#endif
if (preInfoTrans.NdotLUnclamped<=0.0) {specularFresnel=0.0;specularColoredFresnel=specularFresnel*specular_color;}
#ifdef GEOMETRY_THIN_WALLED
let refractNormalW: vec3f=viewDirectionW;
#else
let refractNormalW: vec3f=normalW;
#endif
preInfoTrans.NdotL=0.5f*max(dot(-refractNormalW,preInfoTrans.L),0.0f)+0.5f;
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
var dispersion_iors_local: vec3f=dispersion_iors;let diff: f32=min(dispersion_iors_local[2]-dispersion_iors_local[0],max(dispersion_iors_local[0]-1.0f,1.0f));dispersion_iors_local[2]+=diff;dispersion_iors_local[0]-=diff;for (var i: i32=0; i<3; i++) {let eta: f32=1.0f/dispersion_iors_local[i];
#elif defined(GEOMETRY_THIN_WALLED)
let eta: f32=1.0f;
#else
let eta: f32=1.0f/specular_ior;
#endif
preInfoTrans.H=preInfoTrans.L+min(eta,0.95f)*viewDirectionW;let len2: f32=dot(preInfoTrans.H,preInfoTrans.H);if (len2<1e-6f) {preInfoTrans.H=preInfoTrans.L;} else {preInfoTrans.H=preInfoTrans.H*inverseSqrt(len2);}
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
computeSpecularLighting(preInfoTrans,-refractNormalW,vec3f(1.0f),vec3f(1.0f),transmission_roughness_alpha,lightColor{X}.rgb
#endif
#if defined(DISPERSION) && !defined(GEOMETRY_THIN_WALLED)
)[i];}
#else
);
#endif
#if !defined(GEOMETRY_THIN_WALLED)
forwardScatteredLight=mix(forwardScatteredLight,0.25f*preInfoTrans.attenuation*lightColor{X}.rgb,clamp(1.0f-pow(baseGeoInfo.NdotV,transmission_roughness_alpha),0.0f,1.0f));
#endif
#ifdef REFRACTED_BACKGROUND
#ifdef GEOMETRY_THIN_WALLED
forwardScatteredLight=mix(vec3f(0.0f),forwardScatteredLight.rgb,0.2*transmission_roughness_alpha);
#else
forwardScatteredLight=max(vec3f(0.0f),mix(vec3f(0.0f),forwardScatteredLight,transmission_roughness_alpha));
#endif
#endif
#ifdef SCATTERING
#if !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) || defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
preInfoTrans.roughness=1.0f;let diffused_forward_scattered_light: vec3f=computeSpecularLighting(preInfoTrans,normalW,vec3f(1.0f),vec3f(1.0f),1.0f,lightColor{X}.rgb)*volume_absorption;
#endif
#ifdef GEOMETRY_THIN_WALLED
let forward_scattered_light: vec3f=forwardScatteredLight*transmission_tint*volumeParams.multi_scatter_color;let back_scattered_light: vec3f=slab_diffuse*volumeParams.multi_scatter_color;slab_translucent=mix(back_scattered_light,forward_scattered_light,0.5f+0.5f*volumeParams.anisotropy);
#else
let back_scattered_normal: vec3f=normalize(normalW+viewDirectionW);preInfoTrans.NdotL=max(dot(back_scattered_normal,preInfoTrans.L),0.0f);preInfoTrans.NdotV=dot(back_scattered_normal,viewDirectionW);preInfoTrans.H=normalize(viewDirectionW+preInfoTrans.L);preInfoTrans.VdotH=clamp(dot(viewDirectionW,preInfoTrans.H),0.0f,1.0f);preInfoTrans.roughness=0.2f;let back_scattered_light: vec3f=computeSpecularLighting(preInfoTrans,viewDirectionW,vec3f(1.0f),vec3f(0.08f),0.0f,lightColor{X}.rgb);let forward_scattered_light: vec3f=(forwardScatteredLight*volume_absorption);let iso_scattered_light: vec3f=slab_diffuse;let back_scattering: vec3f=mix(forward_scattered_light,forward_scattered_light+back_scattered_light*backscatter_color,iso_scatter_density);
#if defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING) && !defined(USE_IRRADIANCE_TEXTURE_FOR_SCATTERING_GBUFFER)
let iso_scattering: vec3f=mix(forward_scattered_light,scattered_light_from_irradiance_texture*volumeParams.multi_scatter_color,iso_scatter_density);
#else
let iso_scattering: vec3f=mix(forward_scattered_light,(diffused_forward_scattered_light+iso_scattered_light)*volumeParams.multi_scatter_color,iso_scatter_density);
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
var coloredFresnel: vec3f=getF82Specular(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90,specular_roughness);
#else
var coloredFresnel: vec3f=fresnelSchlickGGX(preInfo{X}.VdotH,baseConductorReflectance.coloredF0,baseConductorReflectance.coloredF90);
#endif
#ifdef THIN_FILM
let thinFilmConductorAngle: f32=max(preInfo{X}.VdotH,specular_roughness);var thinFilmConductorFresnel: vec3f=evalIridescence(thin_film_outside_ior,thin_film_ior,thinFilmConductorAngle,thin_film_thickness,baseConductorReflectance.coloredF0);thinFilmConductorFresnel=mix(thinFilmConductorFresnel,vec3f(dot(thinFilmConductorFresnel,vec3f(0.3333f))),thin_film_desaturation_scale);coloredFresnel=mix(coloredFresnel,specular_weight*thinFilmConductorFresnel,thin_film_weight*thin_film_ior_scale);
#endif
#ifdef ANISOTROPIC_BASE
slab_metal=computeAnisotropicSpecularLighting(preInfo{X},viewDirectionW,normalW,baseGeoInfo.anisotropicTangent,baseGeoInfo.anisotropicBitangent,baseGeoInfo.anisotropy,0.0,lightColor{X}.rgb);
#else
slab_metal=computeSpecularLighting(preInfo{X},normalW,vec3f(1.0f),coloredFresnel,specular_roughness,lightColor{X}.rgb);
#endif
}
#endif
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
slab_coat=computeOpenPBRAreaSpecularLighting(
preInfoCoat{X},
light{X}.vLightSpecular.rgb,
vec3f(coatReflectance.F0),
vec3f(coatReflectance.F90)
);
#else
{
#ifdef ANISOTROPIC_COAT
slab_coat=computeAnisotropicSpecularLighting(preInfoCoat{X},viewDirectionW,coatNormalW,
coatGeoInfo.anisotropicTangent,coatGeoInfo.anisotropicBitangent,coatGeoInfo.anisotropy,0.0,
lightColor{X}.rgb);
#else
slab_coat=computeSpecularLighting(preInfoCoat{X},coatNormalW,vec3f(coatReflectance.F0),vec3f(1.0f),coat_roughness,lightColor{X}.rgb);
#endif
let NdotH: f32=saturateEps(dot(coatNormalW,preInfoCoat{X}.H));coatFresnel=fresnelSchlickGGX(NdotH,coatReflectance.F0,coatReflectance.F90);}
#endif
var coatAbsorption=vec3f(1.0f);if (coat_weight>0.0) {let cosTheta_view: f32=max(preInfoCoat{X}.NdotV,0.001f);let cosTheta_light: f32=max(preInfoCoat{X}.NdotL,0.001f);let fresnel_view: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_view,5.0);let fresnel_light: f32=coatReflectance.F0+(1.0f-coatReflectance.F0)*pow(1.0f-cosTheta_light,5.0);let averageReflectance: f32=(fresnel_view+fresnel_light)*0.5;var darkened_transmission: f32=(1.0f-averageReflectance)/(1.0f+averageReflectance);darkened_transmission=mix(1.0f,darkened_transmission,coat_darkening);var sin2: f32=1.0f-coatGeoInfo.NdotV*coatGeoInfo.NdotV;sin2=sin2/(coat_ior*coat_ior)*coat_weight;let cos_t: f32=sqrt(1.0f-sin2);let coatPathLength=1.0f/cos_t;let effectivePathLength=coatPathLength*coat_weight;let colored_transmission: vec3f=pow(coat_color,vec3f(effectivePathLength));coatAbsorption=colored_transmission*mix(1.0f,darkened_transmission,coat_weight);}
#ifdef FUZZ
fuzzFresnel=fuzzBrdf.z;let fuzzNormalW=mix(normalW,coatNormalW,coat_weight);let fuzzNdotV: f32=max(dot(fuzzNormalW,viewDirectionW.xyz),0.0f);let fuzzNdotL: f32=max(dot(fuzzNormalW,preInfo{X}.L),0.0);slab_fuzz=lightColor{X}.rgb*preInfo{X}.attenuation*evalFuzz(preInfo{X}.L,fuzzNdotL,fuzzNdotV,fuzzTangent,fuzzBitangent,fuzzBrdf);
#else
let fuzz_color=vec3f(0.0);
#endif
#ifdef PREPASS_IRRADIANCE
total_direct_diffuse+=slab_diffuse;
#endif
let material_dielectric_base: vec3f=mix(slab_diffuse*base_color.rgb,slab_translucent,surface_translucency_weight);
#if defined(AREALIGHT{X}) && defined(AREALIGHTUSED) && defined(AREALIGHTSUPPORTED)
let material_dielectric_gloss: vec3f=material_dielectric_base*(1.0f-specularFresnel)+slab_glossy;
#else
let material_dielectric_gloss: vec3f=material_dielectric_base*(1.0f-specularFresnel)+slab_glossy*specularColoredFresnel;
#endif
let material_base_substrate: vec3f=mix(material_dielectric_gloss,slab_metal,base_metalness);let material_coated_base: vec3f=layer(material_base_substrate,slab_coat,coatFresnel,coatAbsorption,vec3f(1.0f));material_surface_direct+=layer(material_coated_base,slab_fuzz,fuzzFresnel*fuzz_weight,vec3f(1.0f),fuzz_color);}
#endif
`,n.IncludesShadersStoreWGSL[q]||(n.IncludesShadersStoreWGSL[q]=J),on={name:q,shader:J}})),Y,X,cn,ln=e((()=>{t(),Y=`openpbrBlockPrePass`,X=`#if SCENE_MRT_COUNT>0
var writeGeometryInfo: f32=select(0.0,1.0,finalColor.a>ALPHATESTVALUE);var fragData: array<vec4<f32>,SCENE_MRT_COUNT>;
#ifdef PREPASS_POSITION
fragData[PREPASS_POSITION_INDEX]= vec4f(fragmentInputs.vPositionW,writeGeometryInfo);
#endif
#ifdef PREPASS_LOCAL_POSITION
fragData[PREPASS_LOCAL_POSITION_INDEX]=vec4f(fragmentInputs.vPosition,writeGeometryInfo);
#endif
#ifdef PREPASS_VELOCITY
var a: vec2f=(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w)*0.5+0.5;var b: vec2f=(fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w)*0.5+0.5;var velocity: vec2f=abs(a-b);velocity= vec2f(pow(velocity.x,1.0/3.0),pow(velocity.y,1.0/3.0))*sign(a-b)*0.5+0.5;fragData[PREPASS_VELOCITY_INDEX]= vec4f(velocity,0.0,writeGeometryInfo);
#elif defined(PREPASS_VELOCITY_LINEAR)
var velocity : vec2f=vec2f(0.5)*((fragmentInputs.vPreviousPosition.xy/fragmentInputs.vPreviousPosition.w) -
(fragmentInputs.vCurrentPosition.xy/fragmentInputs.vCurrentPosition.w));fragData[PREPASS_VELOCITY_LINEAR_INDEX]=vec4f(velocity,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO
fragData[PREPASS_ALBEDO_INDEX]=vec4f(surfaceAlbedo,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
var sqAlbedo : vec3f=sqrt(surfaceAlbedo); 
#endif
#ifdef PREPASS_IRRADIANCE
var irradiance : vec3f=total_direct_diffuse;
#ifndef UNLIT
#ifdef REFLECTION
irradiance+=slab_diffuse_ibl;
#endif
#endif
#ifdef SCATTERING
let scatter_mask: f32=min(subsurface_weight+transmission_weight,1.0);
#else
let scatter_mask: f32=0.0;
#endif
fragData[PREPASS_IRRADIANCE_INDEX]=vec4f(irradiance,writeGeometryInfo*scatter_mask);
#elif defined(PREPASS_COLOR)
fragData[PREPASS_COLOR_INDEX]=vec4f(finalColor.rgb,finalColor.a);
#endif
#ifdef PREPASS_DEPTH
fragData[PREPASS_DEPTH_INDEX]=vec4f(fragmentInputs.vViewPos.z,0.0,0.0,writeGeometryInfo); 
#endif
#ifdef PREPASS_SCREENSPACE_DEPTH
fragData[PREPASS_SCREENSPACE_DEPTH_INDEX]=vec4f(fragmentInputs.position.z,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMALIZED_VIEW_DEPTH
fragData[PREPASS_NORMALIZED_VIEW_DEPTH_INDEX]=vec4f(fragmentInputs.vNormViewDepth,0.0,0.0,writeGeometryInfo);
#endif
#ifdef PREPASS_NORMAL
#ifdef PREPASS_NORMAL_WORLDSPACE
fragData[PREPASS_NORMAL_INDEX]=vec4f(normalW,writeGeometryInfo);
#else
fragData[PREPASS_NORMAL_INDEX]=vec4f(normalize((scene.view*vec4f(normalW,0.0)).rgb),writeGeometryInfo);
#endif
#endif
#ifdef PREPASS_WORLD_NORMAL
fragData[PREPASS_WORLD_NORMAL_INDEX]=vec4f(normalW*0.5+0.5,writeGeometryInfo);
#endif
#ifdef PREPASS_ALBEDO_SQRT
fragData[PREPASS_ALBEDO_SQRT_INDEX]=vec4f(sqAlbedo,writeGeometryInfo);
#endif
#ifdef PREPASS_REFLECTIVITY
#ifndef UNLIT
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(specularEnvironmentR0,microSurface)*writeGeometryInfo;
#else
fragData[PREPASS_REFLECTIVITY_INDEX]=vec4f(0.0,0.0,0.0,1.0)*writeGeometryInfo;
#endif
#endif
#if SCENE_MRT_COUNT>0
fragmentOutputs.fragData0=fragData[0];
#endif
#if SCENE_MRT_COUNT>1
fragmentOutputs.fragData1=fragData[1];
#endif
#if SCENE_MRT_COUNT>2
fragmentOutputs.fragData2=fragData[2];
#endif
#if SCENE_MRT_COUNT>3
fragmentOutputs.fragData3=fragData[3];
#endif
#if SCENE_MRT_COUNT>4
fragmentOutputs.fragData4=fragData[4];
#endif
#if SCENE_MRT_COUNT>5
fragmentOutputs.fragData5=fragData[5];
#endif
#if SCENE_MRT_COUNT>6
fragmentOutputs.fragData6=fragData[6];
#endif
#if SCENE_MRT_COUNT>7
fragmentOutputs.fragData7=fragData[7];
#endif
#endif
`,n.IncludesShadersStoreWGSL[Y]||(n.IncludesShadersStoreWGSL[Y]=X),cn={name:Y,shader:X}})),un=ee({openpbrPixelShaderWGSL:()=>$}),Z,Q,dn,$,fn=e((()=>{t(),He(),Ie(),Ne(),Fe(),mt(),Ge(),Ft(),Ce(),r(),i(),Lt(),_e(),ie(),ke(),oe(),Ve(),me(),It(),lt(),gt(),ve(),Te(),fe(),xe(),Ct(),kt(),Qe(),ut(),Ee(),bt(),Tt(),jt(),Xe(),zt(),Bt(),je(),nt(),Vt(),Ut(),ot(),$e(),Wt(),re(),_t(),Kt(),qt(),Yt(),st(),at(),Xt(),Qt(),en(),tn(),Ke(),nn(),rn(),an(),sn(),de(),se(),At(),ln(),Ue(),Mt(),Z=`openpbrPixelShader`,Q=`#define OPENPBR_FRAGMENT_SHADER
#define CUSTOM_FRAGMENT_BEGIN
#include<prePassDeclaration>[SCENE_MRT_COUNT]
#include<oitDeclaration>
#ifndef FROMLINEARSPACE
#define FROMLINEARSPACE
#endif
#include<openpbrUboDeclaration>
#include<pbrFragmentExtraDeclaration>
#include<lightUboDeclaration>[0..maxSimultaneousLights]
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
fn layer(slab_bottom: vec3f,slab_top: vec3f,lerp_factor: f32,bottom_multiplier: vec3f,top_multiplier: vec3f)->vec3f {return mix(slab_bottom*bottom_multiplier,slab_top*top_multiplier,lerp_factor);}
@fragment
fn main(input: FragmentInputs)->FragmentOutputs {
#ifdef PREPASS_IRRADIANCE
var total_direct_diffuse: vec3f=vec3f(0.0f);
#endif
#define CUSTOM_FRAGMENT_MAIN_BEGIN
#include<clipPlaneFragment>
#include<pbrBlockNormalGeometric>
var coatNormalW: vec3f=normalW;
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
#define DEPTHPREPASS_SKIP_EARLY_RETURN
#include<depthPrePass>
#ifndef DEPTHPREPASS
#define CUSTOM_FRAGMENT_BEFORE_LIGHTS
#ifdef ANISOTROPIC_COAT
let coatGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
,vec3f(geometry_coat_tangent.x,geometry_coat_tangent.y,coat_roughness_anisotropy),TBN
);
#else
let coatGeoInfo: geometryInfoOutParams=geometryInfo(
coatNormalW,viewDirectionW.xyz,coat_roughness,geometricNormalW
);
#endif
specular_roughness=mix(specular_roughness,pow(min(1.0f,pow(specular_roughness,4.0f)+2.0f*pow(coat_roughness,4.0f)),0.25f),coat_weight);
#ifdef ANISOTROPIC_BASE
let baseGeoInfo: geometryInfoAnisoOutParams=geometryInfoAniso(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
,vec3f(geometry_tangent.x,geometry_tangent.y,specular_roughness_anisotropy),TBN
);
#else
let baseGeoInfo: geometryInfoOutParams=geometryInfo(
normalW,viewDirectionW.xyz,specular_roughness,geometricNormalW
);
#endif
#ifdef FUZZ
let fuzzNormalW=normalize(mix(normalW,coatNormalW,coat_weight));var fuzzTangent=normalize(TBN[0]);fuzzTangent=normalize(fuzzTangent-dot(fuzzTangent,fuzzNormalW)*fuzzNormalW);let fuzzBitangent=cross(fuzzNormalW,fuzzTangent);let fuzzGeoInfo: geometryInfoOutParams=geometryInfo(
fuzzNormalW,viewDirectionW.xyz,fuzz_roughness,geometricNormalW
);
#endif
let coatReflectance: ReflectanceParams=dielectricReflectance(
coat_ior 
,1.0f 
,vec3f(1.0f)
,coat_weight
);
#ifdef THIN_FILM
let thin_film_outside_ior: f32=mix(1.0f,coat_ior,coat_weight);
#endif
let baseDielectricReflectance: ReflectanceParams=dielectricReflectance(
specular_ior 
,mix(1.0f,coat_ior,coat_weight) 
,specular_color
,specular_weight
);let baseConductorReflectance: ReflectanceParams=conductorReflectance(base_color,specular_color,specular_weight);var volume_absorption: vec3f=vec3f(1.0f);var transmission_tint: vec3f=vec3f(1.0f);var surface_translucency_weight: f32=0.0f;
#if defined(REFRACTED_BACKGROUND) || defined(REFRACTED_ENVIRONMENT) || defined(REFRACTED_LIGHTS)
#if defined(GEOMETRY_THIN_WALLED)
let refractedViewVector: vec3f=-viewDirectionW;
#else
#ifdef DISPERSION
var refractedViewVectors: array<vec3f,3>;let iorDispersionSpread: f32=transmission_dispersion_scale/transmission_dispersion_abbe_number*(specular_ior-1.0f);let dispersion_iors: vec3f=vec3f(specular_ior-iorDispersionSpread,specular_ior,specular_ior+iorDispersionSpread);for (var i: i32=0; i<3; i++) {refractedViewVectors[i]=double_refract(-viewDirectionW,normalW,dispersion_iors[i]); }
#else
let refractedViewVector: vec3f=double_refract(-viewDirectionW,normalW,specular_ior);
#endif
#endif
#ifdef GEOMETRY_THIN_WALLED
var transmission_roughness: f32=specular_roughness;
#else
var transmission_roughness: f32=specular_roughness*clamp(4.0f*(specular_ior-1.0f),0.001f,1.0f);
#endif
#if (defined(TRANSMISSION_SLAB) || defined(SUBSURFACE_SLAB))
var volumeParams: OpenPBRHomogeneousVolume;{
#if defined(TRANSMISSION_SLAB)
let transmissionVolumeParams: OpenPBRHomogeneousVolume=computeOpenPBRTransmissionVolume(
transmission_color.rgb,
transmission_depth,
transmission_scatter.rgb,
transmission_scatter_anisotropy
);
#endif
#if defined(SUBSURFACE_SLAB)
let subsurfaceVolumeParams: OpenPBRHomogeneousVolume=computeOpenPBRSubsurfaceVolume(
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
let subsurface_fraction_of_dielectric: f32=(1.0f-transmission_weight)*subsurface_weight;let subsurface_and_transmission_fraction_of_dielectric: f32=subsurface_fraction_of_dielectric+transmission_weight;let reciprocal_of_subsurface_and_transmission_fraction_of_dielectric: f32 =
1.0f/maxEps(subsurface_and_transmission_fraction_of_dielectric);let trans_weight: f32=transmission_weight*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;let subsurf_weight: f32=subsurface_fraction_of_dielectric*reciprocal_of_subsurface_and_transmission_fraction_of_dielectric;volumeParams.scatter_coeff=transmissionVolumeParams.scatter_coeff*trans_weight+subsurfaceVolumeParams.scatter_coeff*subsurf_weight;volumeParams.absorption_coeff=transmissionVolumeParams.absorption_coeff*trans_weight+subsurfaceVolumeParams.absorption_coeff*subsurf_weight;volumeParams.anisotropy=(transmissionVolumeParams.anisotropy*trans_weight+subsurfaceVolumeParams.anisotropy*subsurf_weight)/maxEps(trans_weight+subsurf_weight);volumeParams.extinction_coeff=volumeParams.absorption_coeff+volumeParams.scatter_coeff;volumeParams.ss_albedo=volumeParams.scatter_coeff/maxEpsVec3(volumeParams.extinction_coeff);volumeParams.multi_scatter_color=singleScatterToMultiScatterAlbedo(volumeParams.ss_albedo);surface_translucency_weight=subsurface_and_transmission_fraction_of_dielectric;
#endif
}
volume_absorption=exp(-volumeParams.absorption_coeff*geometry_thickness);var backscatter_color: vec3f=vec3f(1.0f);{let reduced_scatter: vec3f=volumeParams.scatter_coeff*vec3f(1.0f-volumeParams.anisotropy);let reduced_albedo: vec3f=reduced_scatter/(volumeParams.absorption_coeff+reduced_scatter);let sqrt_term: vec3f=max(sqrt(vec3f(1.0f)-reduced_albedo),vec3f(0.0001f));backscatter_color=(vec3f(1.0f)-sqrt_term)/(vec3f(1.0f)+sqrt_term);}
#elif defined(TRANSMISSION_SLAB)
surface_translucency_weight=transmission_weight;
#endif
#ifdef SCATTERING
#ifdef GEOMETRY_THIN_WALLED
var iso_scatter_density: vec3f=vec3f(1.0f);
#else
#ifdef USE_IRRADIANCE_TEXTURE_FOR_SCATTERING
let mfp: vec3f=vec3f(100.0f)/volumeParams.extinction_coeff;var scattered_light_from_irradiance_texture: vec3f=sss_convolve(sceneIrradianceSampler,sceneDepthSampler,uniforms.renderTargetSize,mfp,scene.projection,scene.inverseProjection,SSS_SAMPLE_COUNT,noise.xy);var numLights=f32(LIGHTCOUNT);
#ifdef REFLECTION
numLights+=1.0f;
#endif
scattered_light_from_irradiance_texture/=vec3f(numLights);
#else
let scattered_light_from_irradiance_texture: vec3f=vec3f(0.0f);
#endif
let back_to_iso_scattering_blend: f32=min(1.0f+volumeParams.anisotropy,1.0f);let iso_to_forward_scattering_blend: f32=max(volumeParams.anisotropy,0.0f);let iso_scatter_transmittance: vec3f=pow(exp(-volumeParams.scatter_coeff*geometry_thickness),vec3f(0.2f));var iso_scatter_density: vec3f=clamp(vec3f(1.0f)-iso_scatter_transmittance,vec3f(0.0f),vec3f(1.0f));transmission_roughness=min(transmission_roughness+pow((1.0f-abs(volumeParams.anisotropy))*max3(iso_scatter_density*iso_scatter_density),3.0f),1.0f);
#endif
volumeParams.multi_scatter_color=mix(volumeParams.ss_albedo,volumeParams.multi_scatter_color,max3(iso_scatter_density));
#endif
#if defined(TRANSMISSION_SLAB) && (!defined(TRANSMISSION_SLAB_VOLUME) || defined(GEOMETRY_THIN_WALLED))
transmission_tint*=transmission_color.rgb;
#ifdef GEOMETRY_THIN_WALLED
var sin2: f32=1.0f-baseGeoInfo.NdotV*baseGeoInfo.NdotV;sin2=sin2/(specular_ior*specular_ior);let cos_t: f32=sqrt(1.0f-sin2);let pathLength: f32=1.0f/cos_t;transmission_tint=pow(transmission_tint,vec3f(pathLength));
#else
transmission_tint*=transmission_color.rgb;
#endif
#endif
#if defined(SUBSURFACE_SLAB) && defined(GEOMETRY_THIN_WALLED)
let unweighted_translucency: f32=max(mix(subsurface_weight,1.0f,transmission_weight),0.0001f);transmission_tint=mix(vec3f(1.0f),transmission_tint,transmission_weight/unweighted_translucency);transmission_roughness=mix(1.0f,transmission_roughness,transmission_weight/unweighted_translucency);
#endif
let transmission_roughness_alpha: f32=transmission_roughness*transmission_roughness;
#endif
#include<openpbrBackgroundTransmission>
var material_surface_ibl: vec3f=vec3f(0.f,0.f,0.f);
#include<openpbrEnvironmentLighting>
var material_surface_direct: vec3f=vec3f(0.f,0.f,0.f);
#if defined(LIGHT0)
var aggShadow: f32=0.f;
#include<openpbrDirectLightingInit>[0..maxSimultaneousLights]
#include<openpbrDirectLighting>[0..maxSimultaneousLights]
#endif
var material_surface_emission: vec3f=uniforms.vEmissionColor;
#ifdef EMISSION_COLOR
let emissionColorTex: vec3f=textureSample(emissionColorSampler,emissionColorSamplerSampler,fragmentInputs.vEmissionColorUV+uvOffset).rgb;
#ifdef EMISSION_COLOR_GAMMA
material_surface_emission*=toLinearSpaceVec3(emissionColorTex.rgb);
#else
material_surface_emission*=emissionColorTex.rgb;
#endif
material_surface_emission*= uniforms.vEmissionColorInfos.y;
#endif
material_surface_emission*=uniforms.vLightingIntensity.y;
#define CUSTOM_FRAGMENT_BEFORE_FINALCOLORCOMPOSITION
var finalColor: vec4f=vec4f(material_surface_ibl+material_surface_direct+material_surface_emission,alpha);
#define CUSTOM_FRAGMENT_BEFORE_FOG
finalColor=max(finalColor,vec4f(0.0));
#include<logDepthFragment>
#include<fogFragment>(color,finalColor)
#include<pbrBlockImageProcessing>
#define CUSTOM_FRAGMENT_BEFORE_FRAGCOLOR
#ifdef PREPASS
#include<openpbrBlockPrePass>
#endif
#if !defined(PREPASS) && !defined(ORDER_INDEPENDENT_TRANSPARENCY)
fragmentOutputs.color=finalColor;
#endif
#include<oitFragment>
#if ORDER_INDEPENDENT_TRANSPARENCY
if (fragDepth==nearestDepth) {fragmentOutputs.frontColor=vec4f(fragmentOutputs.frontColor.rgb+finalColor.rgb*finalColor.a*alphaMultiplier,1.0-alphaMultiplier*(1.0-finalColor.a));} else {fragmentOutputs.backColor+=finalColor;}
#endif
#include<pbrDebug>
#define CUSTOM_FRAGMENT_MAIN_END
#endif
}
`,n.ShadersStoreWGSL[Z]||(n.ShadersStoreWGSL[Z]=Q),dn=[Le,Be,Me,Pe,pt,We,ht,we,te,Je,s,ge,ae,Oe,ce,Re,he,vt,dt,Pt,ye,Se,pe,be,St,Et,Ze,ft,De,xt,Nt,yt,Ye,Rt,f,Ae,ct,h,Ht,et,it,b,ne,Ot,Gt,T,Jt,rt,tt,A,Zt,$t,L,qe,B,U,K,on,ue,le,wt,cn,ze,Dt];for(let e of dn)n.IncludesShadersStoreWGSL[e.name]||(n.IncludesShadersStoreWGSL[e.name]=e.shader);$={name:Z,shader:Q}}));export{$ as n,un as r,fn as t};