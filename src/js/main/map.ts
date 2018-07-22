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
import { mapGlobals, materialGlobals } from "./globalVariables";

function map(scene: Scene) {
  mapGlobals.skyLight = new HemisphericLight(
    "skyLight",
    new Vector3(1, -1.05, 0),
    scene
  );

  mapGlobals.upLight = new DirectionalLight(
    "upLight",
    new Vector3(0.5, -1.2, -0.5),
    scene
  );

  mapGlobals.upLight.intensity = mapGlobals.lightIntensity * 1.6;
  mapGlobals.upLight.diffuse = new Color3(0.82, 0.89, 0.94);

  mapGlobals.skyLight.intensity = mapGlobals.lightIntensity;
  mapGlobals.skyLight.diffuse = new Color3(0.82, 0.89, 0.94);
  mapGlobals.skyLight.groundColor = new Color3(0.05, 0, 0.18);
  // mapGlobals.skyLight.setEnabled(false);

  scene.ambientColor = mapGlobals.sceneAmbient;

  mapGlobals.atmosphereMesh = MeshBuilder.CreateIcoSphere(
    "atmosphere",
    {
      radius: mapGlobals.size * 2,
      subdivisions: 1,
      updatable: false
    },
    scene
  ) as Mesh;

  mapGlobals.atmosphereMesh.isPickable = false;
  mapGlobals.atmosphereMesh.flipFaces(true);
  mapGlobals.atmosphereMesh.freezeWorldMatrix(); // freeze sky
  mapGlobals.atmosphereMesh.convertToUnIndexedMesh();

  mapGlobals.atmosphereMesh.material = materialGlobals.skyMaterial;

  mapGlobals.groundMesh = MeshBuilder.CreateGround(
    "ground",
    {
      height: mapGlobals.size,
      width: mapGlobals.size,
      subdivisions: mapGlobals.size / 10,
      updatable: false
    },
    scene
  ) as GroundMesh;

  mapGlobals.groundMesh.material = materialGlobals.groundMaterial;
  mapGlobals.groundMesh.freezeWorldMatrix(); // freeze ground
  // mapGlobals.groundMesh.convertToUnIndexedMesh();

  mapGlobals.groundMesh.physicsImpostor = new PhysicsImpostor(
    mapGlobals.groundMesh,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9, friction: 1 },
    scene
  ) as PhysicsImpostor;
}

export { map };
