import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// Initializing a canvas
const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

// Setting up renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true, antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );


// Creating camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

// Sphere geometry for the sun & earth
const geometry_sphere = new THREE.SphereGeometry(1, 10, 10);

// Sun use basic material since emits orange visible light
const material_sun = new THREE.MeshBasicMaterial({color: 0xffaa00});
const sun = new THREE.Mesh(geometry_sphere, material_sun);

// earth use lambert material since will reflect sun light
const material_earth = new THREE.MeshLambertMaterial({color: 0x4444ff, flatShading: true});
const earth = new THREE.Mesh(geometry_sphere, material_earth);

// smaller size than sun
earth.scale.set(0.2, 0.2, 0.2);

const material_moon = new THREE.MeshLambertMaterial({color: 0xaaaaaa, flatShading: true});
const moon = new THREE.Mesh(geometry_sphere, material_moon);
moon.scale.set(0.1, 0.1, 0.1);

const light = new THREE.PointLight(0xffffff, 50);
light.position.set(0, 0, 0);

const earth_orbit = new THREE.Object3D();
const earth_equator = new THREE.Object3D();
const moon_orbit = new THREE.Object3D();

// Tilted rotation axis
earth_equator.rotateZ(23.5*Math.PI/180);

const scene = new THREE.Scene();
scene.add(sun);
scene.add(earth_orbit);
sun.add(light);
earth_orbit.add(earth_equator);
earth_equator.add(earth);
earth_equator.add(moon_orbit);
moon_orbit.add(moon);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// moon orbiting earth
const w_moon = 5;
const w_orbit = 0.5;
// moon tilted on its axis
const w_rotate = 0.1;

function updateSystem(sec) {
    moon.position.set(0.4*Math.cos(w_moon*sec), 0, -0.4*Math.sin(w_moon*sec));
    
    
    earth_equator.position.set(3*Math.cos(w_orbit*sec), 0, -3*Math.sin(w_orbit*sec));
    earth.rotateY(w_rotate);
}

function animate (msec) {
    requestAnimationFrame(animate);
    
    updateSystem(msec * 0.001);

    controls.update();
    renderer.render(scene, camera);
}
animate();