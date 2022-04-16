"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import { GUI } from "../libs/three.js/libs/dat.gui.module.js"

let renderer = null, 
scene = null, 
camera = null, 
shoulder = null,
arm = null, 
elbow = null,
foreArm = null, 
wrist = null, 
hand = null, 
armGroup = null, 
foreArmGroup = null, 
handGroup = null;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}


function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );
}

function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 20 );
    camera.position.z = 10;
    scene.add(camera);
    
    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);
    
    const material = new THREE.MeshPhongMaterial({ });

    // ArmGroup
    armGroup = new THREE.Object3D;
    let geometry = new THREE.BoxGeometry(1, 1, .5);
    shoulder = new THREE.Mesh(geometry, material);
    armGroup.add( shoulder );

    geometry = new THREE.BoxGeometry(2.5, 1.5, 1);
    arm = new THREE.Mesh(geometry, material);
    arm.position.set(1.5,0,0);
    armGroup.add( arm );
    armGroup.position.set(0, 0, -5);

    // ForeArmGroup
    foreArmGroup = new THREE.Object3D;
    armGroup.add(foreArmGroup);
    foreArmGroup.position.set(3., 0, 0);

    // Elbow 
    geometry = new THREE.BoxGeometry(1, 1, .5);
    elbow = new THREE.Mesh(geometry, material);
    foreArmGroup.add( elbow );

    // Forearm
    geometry = new THREE.BoxGeometry(2.5, 1.5, 1);
    foreArm = new THREE.Mesh(geometry, material);
    foreArm.position.set(1.5,0,0);
    foreArmGroup.add( foreArm );

    // HandGroup
    handGroup = new THREE.Object3D;
    foreArmGroup.add(handGroup);
    handGroup.position.set(3, 0, 0);

    // Wrist
    geometry = new THREE.BoxGeometry(1, 1, .5);
    wrist = new THREE.Mesh(geometry, material);
    wrist.position.set(.3, 0, 0);
        
    // mesh Wrist
    foreArmGroup.add( wrist );
    geometry = new THREE.BoxGeometry(1, 1.5, 1);
    hand = new THREE.Mesh(geometry, material);
    handGroup.add( wrist );
    handGroup.add( hand );
    hand.position.set(1,0,0);
    
    // Now add the group to our scene
    scene.add( armGroup );
    
    // This code gets the world position of the wrist
    const handWorldPosition = new THREE.Vector3();

    armGroup.updateMatrixWorld();
    foreArmGroup.updateMatrixWorld();
    handGroup.updateMatrixWorld();
    wrist.getWorldPosition(handWorldPosition);

    const parts = {
        shoulder_z: 0,
        forearm_y: 0,
        shoulder_x: 0,
        elbow_x: 0,
        wrist_x: 0,
        hand_x: 0,
        hand_z: 0
    }
    const gui = new GUI();

    gui.add(parts, 'forearm_y', -1.5, 1.5, 0.01).onChange( (e) => {foreArmGroup.rotation.x = e;});
    gui.add(parts, 'shoulder_z', -1, .5, 0.01).onChange( (e) => {armGroup.rotation.y = e;});
    gui.add(parts, 'shoulder_x', -1, 2, 0.01).onChange( (e) => {armGroup.rotation.z = e;});
    gui.add(parts, 'elbow_x', -1, 0, 0.01).onChange( (e) => {foreArmGroup.rotation.y = e;});
    gui.add(parts, 'wrist_x', -1, 1, 0.01).onChange( (e) => {handGroup.rotation.z = e;});
    gui.add(parts, 'hand_x', -1, 1, 0.01).onChange( (e) => {handGroup.rotation.z = e;});
    gui.add(parts, 'hand_z', -1, 1, 0.01).onChange( (e) => {handGroup.rotation.y = e;});
}

main();