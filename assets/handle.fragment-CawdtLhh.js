import{n as e}from"./rolldown-runtime-B0Z9INg1.js";import{n as t,t as n}from"./shaderStore-DBiNfWDC.js";var r,i,a;e((()=>{t(),r=`handlePixelShader`,i=`uniform color: vec3f;@fragment
fn main(input: FragmentInputs)->FragmentOutputs {fragmentOutputs.color=vec4f(uniforms.color,1.0);}
`,n.ShadersStoreWGSL[r]||(n.ShadersStoreWGSL[r]=i),a={name:r,shader:i}}))();export{a as handlePixelShaderWGSL};