import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as CANNON from "cannon-es";
import { threeToCannon } from "three-to-cannon";
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.background = new THREE.Color(0xaaaaaa); // 배경색 설정
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// const ambientLight = new THREE.AmbientLight(0xffffff, 4);
// scene.add(ambientLight);
var directionalLight = new THREE.DirectionalLight(0xffffff, 5); // 색상과 밝기 설정
directionalLight.position.set(0, 0, 10); // 빛의 방향 설정
scene.add(directionalLight);
camera.position.z = 10;
var eggWhite, eggBlack;
var loader = new GLTFLoader();
var eggShape;
var whiteEggBody;
// egg-white.glb 로드
loader.load("egg-white.glb", function (gltf) {
    eggWhite = gltf.scene;
    scene.add(eggWhite);
    startAnimation();
}, undefined, function (error) {
    console.error(error);
});
// egg-black.glb 로드
loader.load("egg-black.glb", function (gltf) {
    eggBlack = gltf.scene;
    eggBlack.position.y = 3;
    scene.add(eggBlack);
    startAnimation();
}, undefined, function (error) {
    console.error(error);
});
function startAnimation() {
    if (!eggWhite || !eggBlack)
        return;
    eggShape = threeToCannon(eggWhite);
    whiteEggBody = new CANNON.Body({
        mass: 1,
        shape: eggShape.shape,
    });
    whiteEggBody.position.set(0, 10, 0);
    world.addBody(whiteEggBody);
    var groundBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Box(new CANNON.Vec3(10, 5, 10)),
    });
    // groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(groundBody);
    var groundGeometry = new THREE.PlaneGeometry(10, 10);
    var groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaa00aa, side: THREE.DoubleSide });
    var groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    scene.add(groundMesh);
    groundMesh.position.set(groundBody.position.x, groundBody.position.y, groundBody.position.z);
    groundMesh.quaternion.set(groundBody.quaternion.x, groundBody.quaternion.y, groundBody.quaternion.z, groundBody.quaternion.w);
    animate();
}
var world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.8, 0), // m/s²
});
var timeStep = 1 / 60;
var lastCallTime;
function animate() {
    requestAnimationFrame(animate);
    eggWhite.position.set(whiteEggBody.position.x, whiteEggBody.position.y, whiteEggBody.position.z);
    var time = performance.now() / 1000; // seconds
    if (!lastCallTime) {
        world.step(timeStep);
    }
    else {
        var dt = time - lastCallTime;
        world.step(timeStep, dt);
    }
    lastCallTime = time;
    renderer.render(scene, camera);
}
//# sourceMappingURL=index.js.map