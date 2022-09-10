import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  SphereGeometry,
  BoxGeometry,
  Mesh,
  Clock,
  Vector2,
  MeshBasicMaterial,
  RepeatWrapping
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

import { textureLoader } from './loaders'

import { SphereMaterial } from './materials/SphereMaterial/index.js'

class App {
  #resizeCallback = () => this.#onResize()

  constructor(container) {
    this.container = document.querySelector(container)
    this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight)
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()

    await this.#loadTextures()

    this.#createBox()
    this.#createSphere()
    this.#createClock()
    this.#addListeners()
    this.#createControls()
    this.#createTransformControls()

    if (window.location.hash.includes('#debug')) {
      const panel = await import('./Debug.js')
      new panel.Debug(this)
    }

    this.renderer.setAnimationLoop(() => {
      this.#update()
      this.#render()
    })

    console.log(this)
  }

  destroy() {
    this.renderer.dispose()
    this.#removeListeners()
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()

    this.sphere.material.uniforms.u_PivotPosition.value = this.box.position
    this.sphere.material.uniforms.u_time.value = elapsed
  }

  #render() {
    this.renderer.render(this.scene, this.camera)
  }

  #createScene() {
    this.scene = new Scene()
  }

  #createCamera() {
    this.camera = new PerspectiveCamera(75, this.screen.x / this.screen.y, 0.1, 100)
    this.camera.position.set(-0.7, 0.8, 3)
  }

  #createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1
    })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0x121212)
    this.renderer.physicallyCorrectLights = true
  }

  async #loadTextures() {
    const [matcap, noise] = await textureLoader.load([
      '/matcap-01.png',
      '/noise.jpg'
    ])

    noise.wrapS = noise.wrapT = RepeatWrapping

    this.textures = {
      matcap,
      noise
    }
  }

  #createBox() {
    const geometry = new BoxGeometry(1, 1, 1)
    geometry.scale(0.35, 0.35, 0.35)

    const material = new MeshBasicMaterial({ color: 0xffffff, wireframe: true })

    this.box = new Mesh(geometry, material)

    this.scene.add(this.box)
  }

  #createSphere() {
    const geometry = new SphereGeometry(1, 32, 32)

    this.sphere = new Mesh(geometry, SphereMaterial)

    this.sphere.material.uniforms.matcap.value = this.textures.matcap
    this.sphere.material.uniforms.t_noise.value = this.textures.noise

    this.sphere.position.set(1.7, 0.1, 0.0)

    this.scene.add(this.sphere)
  }

  #createControls() {
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  #createTransformControls() {
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement)

    this.transformControls.addEventListener('dragging-changed', event => {
      this.orbitControls.enabled = !event.value
    })

    this.transformControls.attach(this.box)
    this.transformControls.attach(this.sphere)

    this.scene.add(this.transformControls)
  }

  #createClock() {
    this.clock = new Clock()
  }

  #addListeners() {
    window.addEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #removeListeners() {
    window.removeEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #onResize() {
    this.screen.set(this.container.clientWidth, this.container.clientHeight)

    this.camera.aspect = this.screen.x / this.screen.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.screen.x, this.screen.y)
  }
}

const app = new App('#app')
app.init()
