import * as THREE from "three";
import * as CANNON from "cannon-es";
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// scene.background = new THREE.Color(0xaaaaaa); // 배경색 설정
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);
// // const ambientLight = new THREE.AmbientLight(0xffffff, 4);
// // scene.add(ambientLight);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 색상과 밝기 설정
// directionalLight.position.set(0, 0, 10); // 빛의 방향 설정
// scene.add(directionalLight);
// camera.position.z = 10;
// let eggWhite: THREE.Group<THREE.Object3DEventMap>, eggBlack: THREE.Group<THREE.Object3DEventMap>;
// const loader = new GLTFLoader();
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
//   if (eggWhite && eggBlack) {
//     animate();
//   }
// }
// const world = new CANNON.World({
//   gravity: new CANNON.Vec3(0, -9.8, 0), // m/s²
// });
// function animate() {
//   requestAnimationFrame(animate);
//   eggWhite.rotation.x += 0.01;
//   eggWhite.rotation.z += 0.01;
//   eggWhite.rotation.y += 0.01;
//   eggBlack.rotation.x += 0.01;
//   eggBlack.rotation.z += 0.01;
//   eggBlack.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }
// Cannon.js 월드 생성
var world = new CANNON.World();
// world.gravity.set(0, -9.8, 0); // 중력 설정
// Three.js 씬 생성
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Cannon.js 월드에 바디 추가 (예: 럭비 공 모양)
var rugbyBallShape = new CANNON.Cylinder(1, 1, 2, 16);
var rugbyBallBody = new CANNON.Body({ mass: 1, shape: rugbyBallShape });
world.addBody(rugbyBallBody);
// Three.js에서 럭비 공 렌더링
var rugbyBallGeometry = new THREE.CylinderGeometry(1, 1, 2, 16);
var rugbyBallMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var rugbyBallMesh = new THREE.Mesh(rugbyBallGeometry, rugbyBallMaterial);
scene.add(rugbyBallMesh);
camera.position.z = 10;
// 렌더링 루프 설정
function animate() {
    requestAnimationFrame(animate);
    // Cannon.js에서 물리 시뮬레이션 갱신
    world.step(1 / 60);
    // Three.js에서 렌더링 업데이트
    rugbyBallMesh.position.set(rugbyBallBody.position.x, rugbyBallBody.position.y, rugbyBallBody.position.z);
    rugbyBallMesh.quaternion.set(rugbyBallBody.quaternion.x, rugbyBallBody.quaternion.y, rugbyBallBody.quaternion.z, rugbyBallBody.quaternion.w);
    renderer.render(scene, camera);
}
// 렌더링 루프 시작
animate();
//# sourceMappingURL=index.js.map