import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import { threeToCannon } from "three-to-cannon";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 렌더링 기본설정
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0xffffff); // 배경색 설정
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Camera
var controls = new OrbitControls(camera, renderer.domElement);
camera.position.z = 50;
camera.position.y = 10;
// 조명 조절
var AmbientLight = new THREE.AmbientLight(0xaaaaaa); // soft white light
scene.add(AmbientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 색상과 밝기 설정
directionalLight.position.set(0, 50, 0); // 빛의 방향 설정
scene.add(directionalLight);
// CANNON 기본설정
var world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.8, 0), // m/s²
});
// box
// CANNON은 Box에서 둘레의 절반을 인수로 사용함 -> 2배 줄여서 넣어야됨
var boxGeometry = new THREE.BoxGeometry(1, 1, 1);
var boxMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);
var boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(1 / 2, 1 / 2, 1 / 2)),
});
boxBody.position.set(0, 10, 0);
world.addBody(boxBody);
// ground
var groundGeometry = new THREE.BoxGeometry(10, 1, 10);
var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaa00aa });
var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.position.set(0, 0, 0);
scene.add(groundMesh);
var groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(10 / 2, 1 / 2, 10 / 2)),
});
groundBody.position.set(0, 0, 0);
world.addBody(groundBody);
var timeStep = 1 / 60;
var lastCallTime = 0;
var loader = new GLTFLoader();
var whiteEgg;
var whiteEggBody;
loader.load("egg-black.glb", function (gltf) {
    whiteEgg = gltf.scene;
    scene.add(whiteEgg);
    var _a = threeToCannon(whiteEgg), shape = _a.shape, offset = _a.offset, orientation = _a.orientation;
    whiteEggBody = new CANNON.Body({ mass: 1 });
    whiteEggBody.addShape(shape, offset, orientation);
    whiteEggBody.position.set(0, 40, 0);
    world.addBody(whiteEggBody);
    animate();
}, undefined, function (error) {
    console.error(error);
});
// let eggWhite: THREE.Group<THREE.Object3DEventMap>, eggBlack: THREE.Group<THREE.Object3DEventMap>;
// const loader = new GLTFLoader();
// let whiteEggBody: CANNON.Body;
// // egg-white.glb 로드
// loader.load(
//   "egg-white.glb",
//   function (gltf) {
//     eggWhite = gltf.scene;
//     scene.add(eggWhite);
//     startAnimation();
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );
// // egg-black.glb 로드
// loader.load(
//   "egg-black.glb",
//   function (gltf) {
//     eggBlack = gltf.scene;
//     eggBlack.position.y = 3;
//     scene.add(eggBlack);
//     startAnimation();
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );
// function startAnimation() {
//   if (!eggWhite || !eggBlack) return;
//   const result = threeToCannon(eggWhite);
//   const { shape: eggShape, offset, orientation } = result as ShapeResult<CANNON.Shape>;
//   whiteEggBody = new CANNON.Body({
//     mass: 0.1,
//     shape: eggShape,
//   });
//   whiteEggBody.position.set(0, 10, 0);
//   world.addBody(whiteEggBody);
//   animate();
// }
function animate() {
    requestAnimationFrame(animate);
    whiteEgg.position.set(whiteEggBody.position.x, whiteEggBody.position.y, whiteEggBody.position.z);
    boxMesh.position.set(boxBody.position.x, boxBody.position.y, boxBody.position.z);
    var time = performance.now() / 1000; // seconds
    var dt = (time - lastCallTime);
    // console.log(boxBody.position.y, lastCallTime, dt);
    boxMesh.quaternion.set(boxBody.quaternion.x, boxBody.quaternion.y, boxBody.quaternion.z, boxBody.quaternion.w);
    controls.update();
    if (!lastCallTime) {
        world.step(timeStep);
    }
    else {
        world.step(timeStep, dt);
    }
    lastCallTime = time;
    renderer.render(scene, camera);
}
//# sourceMappingURL=index.js.map