"use strict"; 

import * as THREE from "../../libs/three.js/three.module.js"
import * as CONTROLS from "../../libs/three.js/controls/OrbitControls.js"

let renderer = null, scene = null, camera = null;
let sistmesolar = null;
let mercury = null;

let mercuryGroup = null;

const duration = 5000; // ms
let currentTime = Date.now();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

     // Cochesito
     const fractMercurio = deltat / 3000;
     const angleMercurio = Math.PI * 2 * fractMercurio;
     mercuryGroup.rotation.y += angleMercurio;


}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    
    renderer.render( scene, camera );
    // Spin the cube for next frame
    animate();
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas) {   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

     //create the background texture
     let backgroundUrl = "Textures/galaxy.jpeg";
     let texture = new THREE.TextureLoader().load(backgroundUrl);
 
     // Set the background texture
     scene.background = texture;

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 20 );
    camera.position.z = 10;
    scene.add(camera);

    let controls = new CONTROLS.OrbitControls( camera, renderer.domElement );
    controls.update();
    
    // Add a directional light to show off the objects
    const light = new THREE.PointLight( 0xffffff, 1.25, 0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 1);
    scene.add(ambientLight);

    sistmesolar = new THREE.Object3D;
    sistmesolar.position.set(0, 0, 0);

    mercuryGroup = new THREE.Object3D;
    mercuryGroup.position.set(0, 0, 0);

    // Sun
    const sunTextureURL = "./Textures/grass.jpeg"
    const sunTexture = new THREE.TextureLoader().load(sunTextureURL)
    const sunMaterial = new THREE.MeshPhongMaterial({map: sunTexture})
    let geometry = new THREE.SphereGeometry(2, 40, 40)
    let sun = new THREE.Mesh(geometry, sunMaterial)
    sun.position.set(0,0,0)



    // Mercurio
    const mercuryTextureURL = "./Textures/mercurio.jpeg"
    const mercuryTexture = new THREE.TextureLoader().load(mercuryTextureURL)
    const mercuryMaterial = new THREE.MeshPhongMaterial({map: mercuryTexture})
    geometry = new THREE.BoxGeometry(1, 1.5, 1)
    mercury = new THREE.Mesh(geometry, mercuryMaterial)
    mercury.position.set(2.4,0,0)


    // Add mercury
    mercuryGroup.add(mercury)
    
    scene.add(sistmesolar);
    scene.add(mercuryGroup)
    sistmesolar.add(sun)


}

main();