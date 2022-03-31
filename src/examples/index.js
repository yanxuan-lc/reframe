//
// https://zhuanlan.zhihu.com/p/350355621
//
import {GameEngine} from 'reframe';
import {BoxGeometry, Mesh, ShaderMaterial, TextureLoader, Vector3} from "three";

const engine = new GameEngine(document.querySelector('#container'));
engine.start();

// get shader source.
const vss = document.querySelector('#vss').textContent;
const fss = document.querySelector('#fss').textContent;

// define sampling data.
const points = [
  new Vector3(0, 0.5, 0),
  new Vector3(1, 0.2, 0),
  new Vector3(1.5, 0.4, 0),
];

// load color map.
const colors = await new TextureLoader().loadAsync('colormap.jpg');

// add box geometry.
const geometry = new BoxGeometry(5, 1, 2, 20, 20, 20);
const material = new ShaderMaterial({
  // wireframe: true,
  defines: {
    MAX_SAMPLING_POINT_COUNT: 3,
  },
  uniforms: {
    tColorMap: {
      value: colors,
    },
    uSamplingPoints: {
      value: points,
    },
    uSamplingCount:{
      value: points.length,
    }
  },
  vertexShader: vss,
  fragmentShader: fss,
});
const box = new Mesh(geometry, material);
engine.scene.add(box);