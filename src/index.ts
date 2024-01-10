import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import * as threeToCannon from "three-to-cannon"

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0xaaaaaa); // 배경색 설정

const renderer = new THREE.WebGLRenderer(); 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const ambientLight = new THREE.AmbientLight(0xffffff, 4);
// scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 색상과 밝기 설정
directionalLight.position.set(0, 0, 10); // 빛의 방향 설정
scene.add(directionalLight);

camera.position.z = 10;

let eggWhite: THREE.Group<THREE.Object3DEventMap>, eggBlack: THREE.Group<THREE.Object3DEventMap>;
const loader = new GLTFLoader();

// egg-white.glb 로드
loader.load(
  "egg-white.glb",
  function (gltf) {
    eggWhite = gltf.scene;
    scene.add(eggWhite);
    startAnimation();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// egg-black.glb 로드
loader.load(
  "egg-black.glb",
  function (gltf) {
    eggBlack = gltf.scene;
    eggBlack.position.y = 3;
    scene.add(eggBlack);
    startAnimation();
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function startAnimation() {
  if (eggWhite && eggBlack) {
    animate();
  }
}

const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.8, 0), // m/s²
});

const timeStep = 1 / 60;
let lastCallTime: number;
function animate() {
  requestAnimationFrame(animate);

  eggWhite.rotation.x += 0.01;
  eggWhite.rotation.z += 0.01;
  eggWhite.rotation.y += 0.01;

  eggBlack.rotation.x += 0.01;
  eggBlack.rotation.z += 0.01;
  eggBlack.rotation.y += 0.01;

  const time = performance.now() / 1000; // seconds
  if (!lastCallTime) {
    world.step(timeStep);
  } else {
    const dt = time - lastCallTime;
    world.step(timeStep, dt);
  }
  lastCallTime = time;

  renderer.render(scene, camera);
}