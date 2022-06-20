"use strict"; 

import * as THREE from "../../libs/three.js/three.module.js"
import * as CONTROLS from "../../libs/three.js/controls/OrbitControls.js"

let renderer = null, scene = null, camera = null;
let sistmesolar = null;
let mercury = null;
let moveLeft = false, moveRight = false;
let blocker = null, instructions = null, pauseMessage = null, blockerPause=null;
let mercuryGroup = null;
let asteroids = [];
let asteroidsGroup = null;
const duration = 5000; // ms
let currentTime = Date.now();
let isPause = null;

function initialInstructions() {
    blocker = document.getElementById( 'blocker' );
    instructions = document.getElementById( 'instructions' );

    if (blocker.style.display === 'none') {
        isPause = true;
        blocker.style.display = 'block'
        instructions.style.display = '';
      }
    else {
        isPause = false;
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    }
  }

  function pauseGame() {
    blockerPause = document.getElementById( 'blockerPause' );
    pauseMessage = document.getElementById( 'pauseMessage' );

    if (blockerPause.style.display === 'none') {
        isPause = true;
        blockerPause.style.display = 'block'
        pauseMessage.style.display = '';
      }
    else {
        isPause = false;
        pauseMessage.style.display = 'none';
        blockerPause.style.display = 'none';
    }
  }

  function returnMenu() {

  }

  function startAgain() {
    window.location.reload();
  }

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);    

    setInterval(createAsteroid, 4000)

    update();
}


/**
 * Updates the rotation of the objects in the scene
 */
function animate() {

    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

     // Cochesito
     const fractMercurio = deltat / 3000;
     const angleMercurio = Math.PI * 2 * fractMercurio;

    sistmesolar.rotation.x += angle / 2;
    mercuryGroup.rotation.x -=angleMercurio/2
    // Debo de hacerlo rotar en z
     
    // esto lo hace rotar a la iuzquierda 
    //  mercury.rotation.z += angleMercurio;
    // esto lo hace rotar a la derecha
    //  mercury.rotation.z -= angleMercurio;
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    document.addEventListener( 'click', initialInstructions);
    requestAnimationFrame(function() { update(); });

    const now = Date.now();
    const deltat = now - currentTime;


    const fractMercurio = deltat / 3000;
    const angleMercurio = Math.PI * 2 * fractMercurio;
    // Render the scene
    let killAsteroidX = false
    let killAsteroidZ = false
    let killAsteroidY = false
   
    for(const asteroid of asteroids){
        killAsteroidX = false
        killAsteroidZ = false
        killAsteroidY = false

        // X asteroid movement 
        if (asteroid.position.x > 2) {
            asteroid.position.x -= 0.02 * deltat;
            if(asteroid.position.x < 1) {
                killAsteroidX = true
            }
        }

        if (asteroid.position.x < 2) {
            asteroid.position.x += 0.02 * deltat;
            killAsteroidX = true
        }

        // Y asteroid Movement
        if (asteroid.position.y > 2) {
            asteroid.position.y -= 0.02 * deltat;
            if(asteroid.position.y < 2) {
                killAsteroidY = true
            }
        }
        if (asteroid.position.y < .5) {
            asteroid.position.y += 0.02 * deltat;
            killAsteroidY = true
        }

        // Z asteroid Movement
        if (asteroid.position.z > 2) {
            asteroid.position.z -= 0.02 * deltat;
            if(asteroid.position.z < 2) {
                killAsteroidZ = true
            }
        }
        if (asteroid.position.z < 2) {
            asteroid.position.z += 0.02 * deltat;
            killAsteroidZ = true
        }

        if (killAsteroidY && killAsteroidX && killAsteroidZ) {
            asteroids.splice(asteroids.indexOf(asteroid), 1);
            asteroidsGroup.children = asteroids;
        }

        if (asteroid.position.x >2300 || asteroid.position.y > 300 || asteroid.position>300) {
            asteroids.splice(asteroids.indexOf(asteroid), 1);
            asteroidsGroup.children = asteroids;
        }
        if (asteroid.position.x <-300 || asteroid.position.y <-300 || asteroid.position<-300) {
            asteroids.splice(asteroids.indexOf(asteroid), 1);
            asteroidsGroup.children = asteroids;
        }
    }

    if (moveLeft == true) {

        if(mercury.rotation.y < 2 && mercury.rotation.y>1.54) {
            mercury.rotation.y += angleMercurio-.025;
        }
        sistmesolar.rotation.x += angleMercurio / 2;
        sistmesolar.rotation.y -=angleMercurio/2 
        mercuryGroup.rotation.y +=angleMercurio/2
        mercuryGroup.rotation.x -=angleMercurio/2
    }

    if (moveRight == true) {
        
        if(mercury.rotation.y <1.56 && mercury.rotation.y>1) {
            mercury.rotation.y -= angleMercurio-.025;
        }
        sistmesolar.rotation.x += angleMercurio / 2;
        sistmesolar.rotation.y +=angleMercurio/2 
        mercuryGroup.rotation.y -=angleMercurio/2
        mercuryGroup.rotation.x -=angleMercurio/2
    }
    if (isPause === false) {
        animate();
    }
    renderer.render( scene, camera );
    // Spin the cube for next frame
}

function onKeyDown ( event )
{
    switch ( event.keyCode ) {


        case 37: // left
        case 65: // a
            moveLeft = true; 
            console.log("L")
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            console.log("R")
            break;
        case 80: // P = Pause
            pauseGame();
            break;
        case 77: // M = Main Menu
            returnMenu();
            break;
        case 78: // N = New Game
            startAgain();
    }

}

function onKeyUp( event ) {

    switch( event.keyCode ) {

        case 37: // left
        case 65: // a
            moveLeft = false;
            mercury.rotation.y = 1.55 
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            mercury.rotation.y = 1.55 
            break;

    }
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
    asteroidsGroup = new THREE.Object3D;

     //create the background texture
     let backgroundUrl = "Textures/galaxy.jpeg";
     let texture = new THREE.TextureLoader().load(backgroundUrl);
 
     // Set the background texture
     scene.background = texture;

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 50, canvas.width / canvas.height, 10, 1000 );
    
    camera.position.set(0, 100, 0);
    scene.add(camera);

    let controls = new CONTROLS.OrbitControls( camera, renderer.domElement );
    controls.update();
    
    // Add a directional light to show off the objects
    const light = new THREE.PointLight( 0xffffff, 1.25, 0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    scene.add(light);

    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

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
    let geometry = new THREE.SphereGeometry(40, 40, 40)
    let sun = new THREE.Mesh(geometry, sunMaterial)
    sun.position.set(0,0,0)

    let gemoetryOrbitMercury = new THREE.RingGeometry(40.5,25,100);

    const mercuryOrbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000,
        side: THREE.DoubleSide,
    });

    // Mercury Orbit
    let orbitMercury = new THREE.Mesh(gemoetryOrbitMercury, mercuryOrbitMaterial);
    sistmesolar.add(orbitMercury);
    orbitMercury.position.set(0,0,0);


    // // Cochesito
    // const mercuryTextureURL = "./Textures/mercurio.jpeg"
    // const mercuryTexture = new THREE.TextureLoader().load(mercuryTextureURL)
    // const mercuryMaterial = new THREE.MeshPhongMaterial({map: mercuryTexture})
    // geometry = new THREE.BoxGeometry(.5, .75, .5)
    // mercury = new THREE.Mesh(geometry, mercuryMaterial)
    // mercury.position.set(0,0,4)

    mercury = createCar()
    mercury.position.set(0,29.1,4)
    mercury.rotation.y = 1.55 
    // Add mercury
    mercuryGroup.add(mercury)
    mercuryGroup.add(camera)
    
    scene.add(sistmesolar);
    scene.add(mercuryGroup);
    sistmesolar.add(asteroidsGroup)
    sistmesolar.add(sun)
}

function createAsteroid() {

    const sunTextureURL = "./Textures/grass.jpeg"
    const sunTexture = new THREE.TextureLoader().load(sunTextureURL)
    const sunMaterial = new THREE.MeshPhongMaterial({map: sunTexture})

    let geometry = new THREE.SphereGeometry(4, 10, 40)
    let asteroid = new THREE.Mesh(geometry, sunMaterial)

    asteroid.position.set(
        Math.floor((Math.random() * 100) + 5) * (Math.round(Math.random()) ? 1 : -5), // X
        Math.floor((Math.random() * 100) + 1) * (Math.round(Math.random()) ? 1 : -1), // Y
        Math.floor((Math.random() * 100) + 1) * (Math.round(Math.random()) ? 1 : -1) // Z
    );

    asteroidsGroup.add(asteroid)
    mercuryGroup.add(asteroidsGroup)
    asteroids.push(asteroid)
}

function createCar() {
    const car = new THREE.Group();
  
    const backWheel = createWheels();
    backWheel.position.y = 11;
    backWheel.position.x = -3;
    car.add(backWheel);
  
    const frontWheel = createWheels();
    frontWheel.position.y = 11;
    frontWheel.position.x = 2;
    car.add(frontWheel);
  
    const main = new THREE.Mesh(
      new THREE.BoxBufferGeometry(10, 2.5, 5),
      new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    main.position.y = 12;
    car.add(main);
  
    const carFrontTexture = getCarFrontTexture();
  
    const carBackTexture = getCarFrontTexture();
  
    const carRightSideTexture = getCarSideTexture();
  
    const carLeftSideTexture = getCarSideTexture();
    carLeftSideTexture.center = new THREE.Vector2(0.5, 0.5);
    carLeftSideTexture.rotation = Math.PI;
    carLeftSideTexture.flipY = false;
  
    const cabin = new THREE.Mesh(new THREE.BoxBufferGeometry(5.5, 2, 4), [
      new THREE.MeshLambertMaterial({ map: carFrontTexture }),
      new THREE.MeshLambertMaterial({ map: carBackTexture }),
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // top
      new THREE.MeshLambertMaterial({ color: 0xffffff }), // bottom
      new THREE.MeshLambertMaterial({ map: carRightSideTexture }),
      new THREE.MeshLambertMaterial({ map: carLeftSideTexture })
    ]);
    cabin.position.x = -2;
    cabin.position.y = 14.5;
    car.add(cabin);
  
    return car;
  }
  
  function createWheels() {
    const geometry = new THREE.BoxBufferGeometry(2, 2, 5.5);
    //const geometry = new THREE.CylinderGeometry( 2, 2, 5.5, 32 );
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const wheel = new THREE.Mesh(geometry, material);
    return wheel;
  }
  
  function getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 24);
  
    return new THREE.CanvasTexture(canvas);
  }
  
  function getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");
  
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);
  
    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);
  
    return new THREE.CanvasTexture(canvas);
  }
  
main();