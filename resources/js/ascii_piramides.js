import * as THREE from "three";

import { AsciiEffect } from "three/addons/effects/AsciiEffect.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

let camera, camera2, controls, scene, renderer, renderer2, effect, effect2;

let sphere, plane;

const start = Date.now();

// let i = 0;
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    camera.position.y = 50;
    camera.position.z = 500;

    camera2 = camera.clone();

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0, 0, 0);

    const pointLight1 = new THREE.PointLight(0xffffff);
    pointLight1.position.set(500, 500, 500);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.25);
    pointLight2.position.set(-500, -500, -500);
    scene.add(pointLight2);

    sphere = new THREE.Mesh(
        new THREE.SphereGeometry(200, 20, 10),
        new THREE.MeshPhongMaterial({ flatShading: true })
    );
    scene.add(sphere);

    // Plane

    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(400, 400),
        new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
    );
    plane.position.y = -200;
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300);

    renderer2 = new THREE.WebGLRenderer();
    renderer2.setSize(300, 300);

    effect = new AsciiEffect(renderer, " .:-+*=%@#", {
        invert: true,
    });
    effect.setSize(300, 300);
    effect.domElement.style.color = "#22C55E";
    effect.domElement.style.backgroundColor = "black";

    effect2 = new AsciiEffect(renderer2, " .:-+*=%@#", {
        invert: true,
    });
    effect2.setSize(300, 300);
    // 22C55E
    effect2.domElement.style.color = "#22C55E";
    effect2.domElement.style.backgroundColor = "black";

    // Special case: append effect.domElement, instead of renderer.domElement.
    // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

    document.getElementById("piramid").appendChild(effect.domElement);
    document.getElementById("piramid2").appendChild(effect2.domElement);

    // effect.render(scene, camera);
    // effect2.render(scene, camera2);

    // controls = new TrackballControls(camera, effect.domElement);

    //

    // window.addEventListener("resize", onWindowResize);

    // setInterval(() => {
    //     i = 0;
    // }, 1000);
}

// function onWindowResize() {
// camera.aspect = window.innerWidth / window.innerHeight;
// camera.updateProjectionMatrix();
// renderer.setSize(window.innerWidth, window.innerHeight);
// effect.setSize(window.innerWidth, window.innerHeight);
// }

//

function animate() {
    requestAnimationFrame(animate);

    render();
}

function render() {
    // if (i !== 0) return;
    // i += 1;
    const timer = Date.now() - start;

    sphere.position.y = Math.abs(Math.sin(timer * 0.002)) * 150;
    sphere.rotation.x = timer * 0.0003;
    sphere.rotation.z = timer * 0.0002;

    // controls.update();

    effect.render(scene, camera);
    effect2.render(scene, camera2);
}
