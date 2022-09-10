import { Pane } from 'tweakpane'
import { Color } from 'three'

export class Debug {
  constructor(app) {
    this.app = app

    this.#createPanel()
    this.#createSceneConfig()
    this.#createSphereConfig()
    this.#createBloomConfig()
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

  #createBloomConfig() {
    const folder = this.pane.addFolder({ title: 'Postprocess - Bloom' })

    folder.addInput(this.app.bloomPass, 'enabled', { label: 'Enabled' })

    folder.addSeparator()

    folder.addInput(this.app.bloomPass, 'threshold', { label: 'Threshold', min: 0, max: 1 })
    folder.addInput(this.app.bloomPass, 'strength', { label: 'Strength', min: 0, max: 3 })
    folder.addInput(this.app.bloomPass, 'radius', { label: 'Radius', min: 0, max: 1 })
  }

  /**
   * Adds a color control for the given object to the given folder.
   *
   * @param {Object} obj Any THREE object with a color property
   * @param {Object} folder The folder to add the control to
   *
   * @method #createColorControl()
   */
  #createColorControl(obj, folder) {
    const baseColor255 = obj.color.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label: 'Color' }).on('change', e => {
      obj.color.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }

  /**
   * Adds a control for a custom color uniform of the given material.
   *
   * @param {THREE.Material} material The target `THREE.Material`
   * @param {String} uniformName The name of the target uniform
   * @param {Object} folder The folder to add the control to
   * @param {String} label The custom label for the control
   *
   * @method #createColorUniformControl()
   */
  #createColorUniformControl(material, uniformName, folder, label = 'Color') {
    const baseColor255 = material.uniforms[`${uniformName}`].value.clone().multiplyScalar(255)
    const params = { color: { r: baseColor255.r, g: baseColor255.g, b: baseColor255.b } }

    folder.addInput(params, 'color', { label }).on('change', e => {
      material.uniforms[`${uniformName}`].value.setRGB(e.value.r, e.value.g, e.value.b).multiplyScalar(1 / 255)
    })
  }
}
