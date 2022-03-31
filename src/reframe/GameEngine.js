import {
  AxesHelper,
  Clock,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";
import {OrbitControls} from 'OrbitControls';

/**
 * Default initialize options.
 * @type {{renderer: {logarithmicDepthBuffer: boolean, antialias: boolean, preserveDrawingBuffer: boolean, precision: string, powerPreference: string}, camera: {far: number, aspect: number, near: number, fov: number}}}
 */
const OPTS = {
  renderer: {
    antialias: true,
    precision: 'highp',
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
    logarithmicDepthBuffer: true,
  },
  camera: {
    fov: 45,
    aspect: 1,
    near: 0.1,
    far: 500,
  }
};

/**
 * GameEngine.
 */
export class GameEngine {

  /**
   * Construct game engine instance.
   * @param container HTML container.
   */
  constructor(container) {
    this._container = container;

    // initialize rendering context.
    this._renderer = new WebGLRenderer(OPTS.renderer);
    this._renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this._renderer.domElement);

    // initialize camera.
    this._camera = new PerspectiveCamera(
      OPTS.camera.fov,
      OPTS.camera.aspect,
      OPTS.camera.near,
      OPTS.camera.far,
    );
    this._camera.position.set(5, 5, 5);

    // initialize clock.
    this._clock = new Clock();

    // initialize controls.
    this._controls = new OrbitControls(this._camera, this._container);

    // initialize scene.
    this._scene = new Scene();

    // initialize helpers.
    this._scene.add(new AxesHelper(100));

    // adjust viewport automatically.
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  /**
   * Start GameEngine.
   */
  start() {
    this._loop = requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Update rendering loop.
   */
  update() {
    const delta = this._clock.getDelta();

    // update controls.
    this._controls.update();

    // update renderer.
    this._renderer.render(this._scene, this._camera);

    // raf
    this._loop = requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Stop GameEngine.
   */
  stop() {
    cancelAnimationFrame(this._loop);
  }

  /**
   * Adjust viewport automatically.
   */
  resize() {
    this._viewport = {
      width: this._container.offsetWidth,
      height: this._container.offsetHeight,
      aspect: this._container.offsetWidth / this._container.offsetHeight,
    }
    this._renderer.setSize(this._viewport.width, this._viewport.height);
    this._camera.aspect = this._viewport.aspect;
    this._camera.updateProjectionMatrix();
  }

  get scene() {
    return this._scene;
  }

  get camera() {
    return this._camera;
  }
}