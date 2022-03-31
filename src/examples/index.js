//
// https://zhuanlan.zhihu.com/p/350355621
//
import {GameEngine, SceneHelper} from 'reframe';
import {BoxGeometry, Mesh, ShaderMaterial, TextureLoader, Vector4} from "three";

const engine = new GameEngine(document.querySelector('#container'));
SceneHelper.init(engine.scene);
engine.start();

// get shader source.
const vss = document.querySelector('#vss').textContent;
const fss = document.querySelector('#fss').textContent;

// geometry parameters
const width = 5;
const height = 1;
const depth = 2;
const w = 20;
const h = 4;
const d = 6;

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

// load color map.
const colors = await new TextureLoader().loadAsync('colormap.jpg');

// add box geometry.
const geometry = new BoxGeometry(
  width, height, depth,
  width * 10, height * 10, depth * 10
);
const material = new ShaderMaterial({
  // wireframe: true,
  defines: {
    MAX_SAMPLING_POINT_COUNT: points.length,
  },
  uniforms: {
    tColorMap: {
      value: colors,
    },
    uSamplingPoints: {
      value: points,
    },
  },
  vertexShader: vss,
  fragmentShader: fss,
});
const box = new Mesh(geometry, material);
// box.position.set(1, 0, 0);
engine.scene.add(box);