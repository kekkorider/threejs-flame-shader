import { Color, Vector3, ShaderMaterial, DoubleSide } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const SphereMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  side: DoubleSide,
  uniforms: {
    u_PivotPosition: { value: new Vector3() },
    diffuse: { value: new Color(0xffffff) },
    opacity: { value: 1 },
    matcap: { value: null },
    t_noise: { value: null },
    u_time: { value: 0 },
    u_FlameColor: { value: new Color(1, 0, 0) },
    u_AlphaFalloffStart: { value: 0.6 },
    u_AlphaFalloffEnd: { value: 0.7 },
    u_FlameFalloffStart: { value: 0.6 },
    u_FlameFalloffEnd: { value: 0.9 }
  }
})
