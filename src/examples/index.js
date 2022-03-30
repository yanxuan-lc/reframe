//
// https://zhuanlan.zhihu.com/p/350355621
//
import {GameEngine} from 'reframe';
import {BoxGeometry, Mesh, ShaderMaterial, Vector3} from "three";

const engine = new GameEngine(document.querySelector('#container'));
engine.start();

// get shader source.
const vss = document.querySelector('#vss').textContent;
const fss = document.querySelector('#fss').textContent;

// add box geometry.
const geometry = new BoxGeometry(5, 1, 2, 10, 3, 4);
const material = new ShaderMaterial({
  // wireframe: true,
  uniforms: {
    points: {
      value: [
        new Vector3(0, 0.2, 0),
        new Vector3(1, 0.2, 0),
        new Vector3(1.5, 0.2, 0),
      ]
    },
    count:{
      value: 3,
    }
  },
  vertexShader: vss,
  fragmentShader: fss,
});
const box = new Mesh(geometry, material);
engine.scene.add(box);