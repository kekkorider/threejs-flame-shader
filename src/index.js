import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  SphereGeometry,
  BoxGeometry,
  Mesh,
  Clock,
  Vector2,
  MeshBasicMaterial
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

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
    this.#createBox()
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

  #createBox() {
    const geometry = new BoxGeometry(1, 1, 1)
    geometry.scale(0.35, 0.35, 0.35)

    const material = new MeshBasicMaterial({ color: 0xffffff, wireframe: true })

    this.box = new Mesh(geometry, material)

    this.scene.add(this.box)
  }

  #createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  #createTransformControls() {
    const controls = new TransformControls(this.camera, this.renderer.domElement)

    controls.addEventListener('dragging-changed', event => {
      this.controls.enabled = !event.value
    })

    controls.attach(this.box)

    this.scene.add(controls)
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
