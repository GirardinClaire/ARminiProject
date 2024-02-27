import * as THREE from "three";
import { ARButton } from "three/addons/webxr/ARButton.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";

let camera, scene, renderer;
let controller;
let testModel;
// let testModel2;
// let testModel3;
// let testModel4;
// let testModel5;
// let testModel = [testModel1, testModel2, testModel3, testModel4, testModel5];
let i = 0;

init();
animate();

function init() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 3);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  //

  loadData();

  //

  document.body.appendChild(ARButton.createButton(renderer));

  //

  function onSelect() {
    if (i < 10) {
      console.log(i);
      if (testModel) {
        const clonedScene = SkeletonUtils.clone(testModel);
        clonedScene.position
          .set(0, 0, -0.3)
          .applyMatrix4(controller.matrixWorld);
        clonedScene.quaternion.setFromRotationMatrix(controller.matrixWorld);
        scene.add(clonedScene);
      } else {
        console.log("This testModel is NULL");
      }
      i += 1;
    } else {
      console.log("Nbr d'élements dépassé i = " + i);
    }
  }

  controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  renderer.setAnimationLoop(render);
}

function render() {
  renderer.render(scene, camera);
}

function loadData() {
  new GLTFLoader().setPath("assets/models/").load("test.glb", gltfReader);
}

function gltfReader(gltf) {
  console.log(i);

  testModel = gltf.scene;

  if (testModel != null) {
    console.log("Model loaded: " + testModel);
    testModel.scale.set(0.1, 0.1, 0.1);
  } else {
    console.log("Load FAILED.");
  }
}
