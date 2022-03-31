import {
  AmbientLight,
  DirectionalLight,
  HemisphereLight,
  PointLight
} from "three";

/**
 * Scene helper.
 */
export class SceneHelper {

  /**
   * Initialize specified scene with light.
   *
   * @param scene
   */
  static init(scene) {

    // create ambient light.
    const hemisphere = new HemisphereLight(0xffffff, 0xcccccc, 0.2);
    hemisphere.position.set(0, 20, 0);
    scene.add(hemisphere);

    // create directional light.
    // const directional = new DirectionalLight(0xffffff);
    // directional.position.set(20, 20, 20);
    // scene.add(directional);

    // create point light.
    const point = new PointLight(0xff0000, 1, 2);
    point.position.set(0, 2, 0);
    scene.add(point);
  }
}