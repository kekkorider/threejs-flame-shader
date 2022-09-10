import { Color, ShaderMaterial } from 'three'

import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export const SphereMaterial = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  uniforms: {
    diffuse: { value: new Color(0xffffff) },
    opacity: { value: 1 },
    matcap: { value: null }
  }
})
