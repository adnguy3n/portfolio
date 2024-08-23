import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

// Camera, Scene, and Renderer

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')!,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

// Scene Background
const spaceTexture = new THREE.TextureLoader().load('/space.jpg');
spaceTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = spaceTexture;

// Torus Geometry

const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({color: 0xff6347});
const torus = new THREE.Mesh(torusGeometry, torusMaterial)

scene.add(torus);

// Avatar

const avatarTexture = new THREE.TextureLoader().load('/avatar.jpg');
avatarTexture.colorSpace = THREE.SRGBColorSpace;
const avatar = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: avatarTexture }));

scene.add(avatar);

// Moon
const moonTexture = new THREE.TextureLoader().load('/moon.jpg');
moonTexture.colorSpace = THREE.SRGBColorSpace;
const moonNormalTexture = new THREE.TextureLoader().load('/normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    normalMap: moonNormalTexture
  })
);

moon.position.set(-10, 0, 30);

scene.add(moon)

// Lighting

const pointLight = new THREE.PointLight(0xFFFFFF, 0);
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 5);

pointLight.position.set(10,10,10);
scene.add(pointLight, ambientLight);

// Helpers

//const lightHelper = new THREE.PointLightHelper(pointLight);
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper);

// Orbit Controls

const controls = new OrbitControls(camera, renderer.domElement);

// Animation

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();

// Background Stars

function addStar() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3).fill(undefined).map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill(undefined).forEach(addStar);

// Camera Scroll

function moveCamera() {
  const scrollPosition = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  avatar.rotation.y += 0.01;
  avatar.rotation.z += 0.01;

  camera.position.x = scrollPosition * -0.0002;
  camera.position.y = scrollPosition * -0.0002;
  camera.position.z = scrollPosition * -0.01;
}

document.body.onscroll = moveCamera

// Updates Renderer Size and Pixel Ratio when the window size changes.

window.addEventListener('resize', ()=> {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});