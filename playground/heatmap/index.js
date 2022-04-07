import {GameEngine, SceneHelper} from 'reframe';
import {
  AlwaysStencilFunc,
  BackSide,
  BoxGeometry,
  CanvasTexture,
  DecrementWrapStencilOp,
  DoubleSide,
  FrontSide,
  Group,
  IncrementWrapStencilOp,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NotEqualStencilFunc,
  Plane,
  PlaneGeometry,
  ReplaceStencilOp,
  ShaderMaterial, TorusGeometry, TorusKnotGeometry,
  UniformsLib,
  UniformsUtils,
  Vector3,
  Vector4,
} from "three";
import {FRAGMENT_SHADER_SOURCE, VERTEX_SHADER_SOURCE} from "./heatmap.glsl.js";
import {Lut} from "Lut";

// create and initialize 3d rendering engine.
const engine = new GameEngine(document.querySelector('#container'));
SceneHelper.init(engine.scene, {
  hemisphere: true,
  point: true,
});
engine.renderer.setClearColor(0xcccccc);
engine.start();

// load color map.
const lut = new Lut('blackbody');
const colors = new CanvasTexture(lut.createCanvas());

// geometry parameters
const width = 6;
const height = 1;
const depth = 2;
const w = 10;
const h = 2;
const d = 3;

// define sampling data.
const points = [];
for (let i = 0; i <= w; i++) {
  for (let j = 0; j < h; j++) {
    for (let k = 0; k < d; k++) {
      points.push(new Vector4(
        width * (i / w - 0.5),
        height * (j / h - 0.5),
        depth * (k / d - 0.5),
        Math.random() * 1.25,
      ));
    }
  }
}
// points.push(new Vector4(0, 0, 0));

// define clipping plane
const planes = [
  new Plane(new Vector3(0, 0, -1), 0),
];

// define customized shader material.
const material = new ShaderMaterial({
  clipping: true,
  clippingPlanes: planes,
  defines: {
    MAX_SAMPLING_POINT_COUNT: points.length,
  },
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    {
      tColorMap: {
        value: colors,
      },
      uSamplingPoints: {
        value: points,
      },
    }
  ]),
  vertexShader: VERTEX_SHADER_SOURCE,
  fragmentShader: FRAGMENT_SHADER_SOURCE,
});

// create geometry and mesh.
const geometry = new BoxGeometry(
  width, height, depth
);
const mesh = new Mesh(geometry, material);
mesh.position.set(0, 0, 0);
engine.scene.add(mesh);

// create stencil group.
const stencil = new Group();
stencil.add(new Mesh(geometry, new MeshBasicMaterial({
  side: FrontSide,
  clippingPlanes: planes,
  depthWrite: false,
  depthTest: false,
  colorWrite: false,
  stencilWrite: true,
  stencilFunc: AlwaysStencilFunc,
  stencilZPass: IncrementWrapStencilOp,
})));
stencil.add(new Mesh(geometry, new MeshBasicMaterial({
  side: BackSide,
  clippingPlanes: planes,
  depthWrite: false,
  depthTest: false,
  colorWrite: false,
  stencilWrite: true,
  stencilFunc: AlwaysStencilFunc,
  stencilZPass: DecrementWrapStencilOp,
})));
engine.scene.add(stencil);

// create clipping aspect.
const pGeo = new PlaneGeometry(100, 100);
const pM = new ShaderMaterial({
  defines: {
    MAX_SAMPLING_POINT_COUNT: points.length,
  },
  uniforms: UniformsUtils.merge([
    UniformsLib.common,
    {
      tColorMap: {
        value: colors,
      },
      uSamplingPoints: {
        value: points,
      }
    }
  ]),
  vertexShader: VERTEX_SHADER_SOURCE,
  fragmentShader: FRAGMENT_SHADER_SOURCE,
  stencilWrite: true,
  stencilRef: 0,
  stencilFunc: NotEqualStencilFunc,
  stencilZPass: ReplaceStencilOp,
});
const aspect = new Mesh(pGeo, pM);
engine.scene.add(aspect);

// enable local clipping.
engine.renderer.localClippingEnabled = true;

// transformer
engine.transformer.attach(aspect);
engine.transformer.addEventListener('change', (e) => {
  planes[0].constant = aspect.position.z;
});