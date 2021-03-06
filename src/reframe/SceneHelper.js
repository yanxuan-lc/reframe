import {
  AmbientLight,
  DirectionalLight, DoubleSide,
  HemisphereLight,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
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
  static init(scene, opts) {

    // create ambient light.
    if (opts.hemisphere) {
      const hemisphere = new HemisphereLight(0xffffff, 0xcccccc, 0.5);
      hemisphere.position.set(0, 20, 0);
      scene.add(hemisphere);
    }

    if (opts.ambient) {
      const ambient = new AmbientLight(0xffffff, 0.5);
      ambient.position.set(0, 20, 0);
      scene.add(ambient);
    }

    // create directional light.
    if (opts.directional) {
      const directional = new DirectionalLight(0xffffff, 0.5);
      directional.position.set(20, 20, -20);
      scene.add(directional);
    }

    // create point light.
    if (opts.point) {
      const point = new PointLight(0x00ff00, 1, 2);
      point.position.set(0, 2, 0);
      scene.add(point);
    }

    // create ground
    if (opts.ground) {
      const ground = new Mesh(
        new PlaneGeometry(20, 20, 20, 20),
        new MeshStandardMaterial({
          side: DoubleSide,
        }),
      );
      ground.rotation.set(-Math.PI / 2, 0, 0);
      scene.add(ground);
    }
  }
}