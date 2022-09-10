import { Pane } from 'tweakpane'
import { Color } from 'three'

export class Debug {
  constructor(app) {
    this.app = app

    this.#createPanel()
    this.#createSceneConfig()
    this.#createSphereConfig()
  }

  refresh() {
    this.pane.refresh()
  }

  #createPanel() {
    this.pane = new Pane({
      container: document.querySelector('#debug')
    })
  }

  #createSceneConfig() {
    const folder = this.pane.addFolder({ title: 'Scene' })

    const params = {
      background: { r: 18, g: 18, b: 18 }
    }

    folder.addInput(params, 'background', { label: 'Background Color' }).on('change', e => {
      this.app.renderer.setClearColor(new Color(e.value.r / 255, e.value.g / 255, e.value.b / 255))
    })
  }

  #createSphereConfig() {
    const folder = this.pane.addFolder({ title: 'Sphere' })
    const mesh = this.app.sphere

    this.#createColorUniformControl(mesh.material, 'u_FlameColor', folder, 'Flame Color')

    folder.addSeparator()

    folder.addInput(mesh.material.uniforms.u_AlphaFalloffStart, 'value', { label: 'Alpha falloff start', min: 0, max: 1 })
    folder.addInput(mesh.material.uniforms.u_AlphaFalloffEnd, 'value', { label: 'Alpha falloff end', min: 0, max: 1 })

    folder.addSeparator()

    folder.addInput(mesh.material.uniforms.u_FlameFalloffStart, 'value', { label: 'Flame falloff start', min: 0, max: 1 })
    folder.addInput(mesh.material.uniforms.u_FlameFalloffEnd, 'value', { label: 'Flame falloff end', min: 0, max: 1 })
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {*} obj Any THREE object with a color property
   * @param {*} folder The folder to add the control to
   */
  #createColorControl(obj, folder) {
    const baseColor255 = obj.color.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label: 'Color' }).on('change', e => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {*} obj Any THREE object with a color property
   * @param {*} folder The folder to add the control to
   */
  #createColorUniformControl(material, uniformName, folder, label = 'Color') {
    const baseColor255 = material.uniforms[`${uniformName}`].value.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label }).on('change', e => {
      material.uniforms[`${uniformName}`].value.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }
}
