import {
  Scene,
  Vector3,
  MeshBuilder,
  PhysicsImpostor,
  Color3,
  HemisphericLight,
  DirectionalLight,
  GroundMesh,
  Mesh
} from "babylonjs";
import { mapGlobals } from "./globalVariables";

function map(scene: Scene) {
  const groundMaterial = scene.getMaterialByID("groundMaterial");
  const skyMaterial = scene.getMaterialByID("skyMaterial");

  const skyLight = new HemisphericLight(
    "skyLight",
    new Vector3(1, -1.05, 0),
    scene
  );

  const upLight = new DirectionalLight(
    "upLight",
    new Vector3(0.5, -1.2, -0.5),
    scene
  );

  upLight.intensity = mapGlobals.lightIntensity * 2;
  upLight.diffuse = new Color3(0.82, 0.89, 0.94);
  // upLight.groundColor = new Color3(0.05, 0, 0.18);

  skyLight.intensity = mapGlobals.lightIntensity;
  skyLight.diffuse = new Color3(0.82, 0.89, 0.94);
  skyLight.groundColor = new Color3(0.05, 0, 0.18);

  scene.ambientColor = mapGlobals.sceneAmbient;

  const atmosphere = MeshBuilder.CreateIcoSphere(
    "atmosphere",
    {
      radius: mapGlobals.size * 2,
      subdivisions: 5,
      updatable: false
    },
    scene
  ) as Mesh;

  atmosphere.isPickable = false;
  // atmosphere.infiniteDistance = true;

  atmosphere.flipFaces(true);
  // atmosphere.freezeWorldMatrix(); // freeze ground

  atmosphere.material = skyMaterial;

  const ground = MeshBuilder.CreateGround(
    "ground",
    {
      height: mapGlobals.size,
      width: mapGlobals.size,
      subdivisions: mapGlobals.size / 10,
      updatable: false
    },
    scene
  ) as GroundMesh;

  ground.material = groundMaterial;
  ground.freezeWorldMatrix(); // freeze ground

  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9, friction: 1 },
    scene
  ) as PhysicsImpostor;
}

export { map };
