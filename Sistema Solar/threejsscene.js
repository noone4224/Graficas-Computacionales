"use strict"; 

import * as THREE from "../libs/three.js/three.module.js"
import * as CONTROLS from "../libs/three.js/controls/OrbitControls.js"

let renderer = null, scene = null, camera = null;
let sistmesolar = null;
let mercury = null,
venus = null,
earth = null,
marte = null,
jupiter = null,
saturno = null,
urano = null,
neptuno = null,
pluton = null;

let moon = null;

let mercuryGroup = null,
venusGroup = null,
earthGroup = null,
marteGroup = null,
jupiterGroup = null,
saturnoGroup = null,
uranoGroup = null,
neptunoGroup = null,
plutonGroup = null;

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


    // Sol
    sistmesolar.rotation.y += angle * 2;

    // Mercurio
    const fractMercurio = deltat / 3000;
    const angleMercurio = Math.PI * 2 * fractMercurio;
    mercuryGroup.rotation.y += angleMercurio;
    mercury.rotation.y +=  angleMercurio * 2;

    // Venus
    const fractVenus = deltat / 4000;
    const angleVenus = Math.PI * 2 * fractVenus;
    venusGroup.rotation.y += angleVenus;
    venus.rotation.y +=  angleVenus * 2;

    // Tierra
    const fractTierra = deltat / 5000;
    const angleTierra = Math.PI * 2 * fractTierra;
    earthGroup.rotation.y += angleTierra;
    earth.rotation.y +=  angleTierra * 2;

     // Marte
     const fractMarte = deltat / 6000;
     const angleMarte = Math.PI * 2 * fractMarte;
     marteGroup.rotation.y += angleMarte;
     marte.rotation.y +=  angleMarte * 2;
     
     // Jupiter
     const fractJupiter = deltat / 7000;
     const angleJupiter = Math.PI * 2 * fractJupiter;
     jupiterGroup.rotation.y += angleJupiter;
     jupiter.rotation.y +=  angleJupiter * 2;
     
     // Saturno
     const fractSaturno = deltat / 8000;
     const angleSaturno = Math.PI * 2 * fractSaturno;
     saturnoGroup.rotation.y += angleSaturno;
     saturno.rotation.y +=  angleSaturno * 2;

     // Urano
     const fractUrano = deltat / 9000;
     const angleUrano = Math.PI * 2 * fractUrano;
     uranoGroup.rotation.y += angleUrano;
     urano.rotation.y +=  angleUrano * 2;

     // Neptuno
     const fractNeptuno = deltat / 10000;
     const angleNeptuno = Math.PI * 2 * fractNeptuno;
     neptunoGroup.rotation.y += angleNeptuno;
     neptuno.rotation.y +=  angleNeptuno * 2;

     // Pluton
     const fractPluton = deltat / 11000;
     const anglePluton = Math.PI * 2 * fractPluton;
     plutonGroup.rotation.y += anglePluton;
     pluton.rotation.y +=  anglePluton * 2;
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

    venusGroup = new THREE.Object3D;
    venusGroup.position.set(0, 0, 0);

    earthGroup = new THREE.Object3D;
    earthGroup.position.set(0, 0, 0);

    marteGroup = new THREE.Object3D;
    marteGroup.position.set(0, 0, 0);

    jupiterGroup = new THREE.Object3D;
    jupiterGroup.position.set(0, 0, 0);

    saturnoGroup = new THREE.Object3D;
    saturnoGroup.position.set(0, 0, 0);

    uranoGroup = new THREE.Object3D;
    uranoGroup.position.set(0, 0, 0);
    
    neptunoGroup = new THREE.Object3D;
    neptunoGroup.position.set(0, 0, 0);

    plutonGroup = new THREE.Object3D;
    plutonGroup.position.set(0, 0, 0);

    // Sun
    const sunTextureURL = "./Textures/sun.png"
    const sunTexture = new THREE.TextureLoader().load(sunTextureURL)
    const sunMaterial = new THREE.MeshPhongMaterial({map: sunTexture})
    let geometry = new THREE.SphereGeometry(0.6, 32, 32)
    let sun = new THREE.Mesh(geometry, sunMaterial)
    sun.position.set(0,0,0)

    
// MercurioOrbita

  let gemoetryOrbitMercury = new THREE.RingGeometry(1,.99,32);

  const mercuryOrbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });

  // Mercury Orbit
  let orbitMercury = new THREE.Mesh(gemoetryOrbitMercury, mercuryOrbitMaterial);
  sistmesolar.add(orbitMercury);
  orbitMercury.position.set(0,0,0);
  orbitMercury.rotation.x = 1.6;

  // Venus Orbit
  let gemoetryOrbitVenus = new THREE.RingGeometry(1.5,1.49,32);
  let orbitVenus = new THREE.Mesh(gemoetryOrbitVenus, mercuryOrbitMaterial);
  sistmesolar.add(orbitVenus);
  orbitVenus.position.set(0,0,0);
  orbitVenus.rotation.x = 1.6;

  // Earth Orbit
  let gemoetryOrbitEarth = new THREE.RingGeometry(2,1.99,32);
  let orbitEarth = new THREE.Mesh(gemoetryOrbitEarth, mercuryOrbitMaterial);
  sistmesolar.add(orbitEarth);
  orbitEarth.position.set(0,0,0);
  orbitEarth.rotation.x = 1.6;

  // Mars Orbit
  let gemoetryOrbitMars = new THREE.RingGeometry(2.5,2.49,32);
  let orbitMars = new THREE.Mesh(gemoetryOrbitMars, mercuryOrbitMaterial);
  sistmesolar.add(orbitMars);
  orbitMars.position.set(0,0,0);
  orbitMars.rotation.x = 1.6;

  // Jupiter Orbit
  let gemoetryOrbitJupiter = new THREE.RingGeometry(3,2.99,32);
  let orbitJupiter = new THREE.Mesh(gemoetryOrbitJupiter, mercuryOrbitMaterial);
  sistmesolar.add(orbitJupiter);
  orbitJupiter.position.set(0,0,0);
  orbitJupiter.rotation.x = 1.6;

  // Saturno Orbit
  let gemoetryOrbitSaturn = new THREE.RingGeometry(3.5,3.49,32);
  let orbitSaturn = new THREE.Mesh(gemoetryOrbitSaturn, mercuryOrbitMaterial);
  sistmesolar.add(orbitSaturn);
  orbitSaturn.position.set(0,0,0);
  orbitSaturn.rotation.x = 1.6;
  
  // Urano Orbit
  let gemoetryOrbitUranus = new THREE.RingGeometry(4,3.99,32);
  let orbitUranus = new THREE.Mesh(gemoetryOrbitUranus, mercuryOrbitMaterial);
  sistmesolar.add(orbitUranus);
  orbitUranus.position.set(0,0,0);
  orbitUranus.rotation.x = 1.6;

  // Neptuno Orbit
  let gemoetryOrbitNeptuno = new THREE.RingGeometry(4.5,4.49,32);
  let orbitNeptuno = new THREE.Mesh(gemoetryOrbitNeptuno, mercuryOrbitMaterial);
  sistmesolar.add(orbitNeptuno);
  orbitNeptuno.position.set(0,0,0);
  orbitNeptuno.rotation.x = 1.6;

  // Pluton Orbit
  let gemoetryOrbitPluto = new THREE.RingGeometry(5,4.99,32);
  let orbitPluto = new THREE.Mesh(gemoetryOrbitPluto, mercuryOrbitMaterial);
  sistmesolar.add(orbitPluto);
  orbitPluto.position.set(0,0,0);
  orbitPluto.rotation.x = 1.6;





    // Mercurio
    const mercuryTextureURL = "./Textures/mercurio.jpeg"
    const mercuryTexture = new THREE.TextureLoader().load(mercuryTextureURL)
    const mercuryMaterial = new THREE.MeshPhongMaterial({map: mercuryTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    mercury = new THREE.Mesh(geometry, mercuryMaterial)
    mercury.position.set(1,0,0)

    // Venus
    const venusTextureURL = "./Textures/venus.jpeg"
    const venusTexture = new THREE.TextureLoader().load(venusTextureURL)
    const venusMaterial = new THREE.MeshPhongMaterial({map: venusTexture})
    geometry = new THREE.SphereGeometry(0.2, 32, 32)
    venus = new THREE.Mesh(geometry, venusMaterial)
    venus.position.set(1.5,0,0)

    // Tierra
    const earthTextureURL = "./Textures/earth.jpeg"
    const earthTexture = new THREE.TextureLoader().load(earthTextureURL)
    const earthMaterial = new THREE.MeshPhongMaterial({map: earthTexture})
    geometry = new THREE.SphereGeometry(0.3, 32, 32)
    earth = new THREE.Mesh(geometry, earthMaterial)
    earth.position.set(2,0,0)
      
    // //Moon
    //   const moonTextureURL = "./Textures/moon.jpeg"
    //   const moonTexture = new THREE.TextureLoader().load(moonTextureURL)
    //   const moonMaterial = new THREE.MeshPhongMaterial({map: moonTexture})
    //   geometry = new THREE.SphereGeometry(0.5, 32, 32)
    //   moon = new THREE.Mesh(geometry, moonMaterial)
    //   moon.position.set(.5,0,0)



     // Marte
    const marteTextureURL = "./Textures/mars.jpeg"
    const marteTexture = new THREE.TextureLoader().load(marteTextureURL)
    const marteMaterial = new THREE.MeshPhongMaterial({map: marteTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    marte = new THREE.Mesh(geometry, marteMaterial)
    marte.position.set(2.5,0,0)

      // Jupiter
    const jupiterTextureURL = "./Textures/jupiter.png"
    const jupiterTexture = new THREE.TextureLoader().load(jupiterTextureURL)
    const jupiterMaterial = new THREE.MeshPhongMaterial({map: jupiterTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    jupiter = new THREE.Mesh(geometry, jupiterMaterial)
    jupiter.position.set(3,0,0)

     // Saturno
    const saturnoTextureURL = "./Textures/saturn.jpeg"
    const saturnoTexture = new THREE.TextureLoader().load(saturnoTextureURL)
    const saturnoMaterial = new THREE.MeshPhongMaterial({map: saturnoTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    saturno = new THREE.Mesh(geometry, saturnoMaterial)
    saturno.position.set(3.5,0,0)

      // Urano
    const uranoTextureURL = "./Textures/uranus.jpeg"
    const uranoTexture = new THREE.TextureLoader().load(uranoTextureURL)
    const uranoMaterial = new THREE.MeshPhongMaterial({map: uranoTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    urano = new THREE.Mesh(geometry, uranoMaterial)
    urano.position.set(4,0,0)

    // Neptuno
    const neptunoTextureURL = "./Textures/neptun.png"
    const neptunoTexture = new THREE.TextureLoader().load(neptunoTextureURL)
    const neptunoMaterial = new THREE.MeshPhongMaterial({map: neptunoTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    neptuno = new THREE.Mesh(geometry, neptunoMaterial)
    neptuno.position.set(4.5,0,0)

     // Plutón
    const plutonTextureURL = "./Textures/pluto.jpeg"
    const plutonTexture = new THREE.TextureLoader().load(plutonTextureURL)
    const plutonMaterial = new THREE.MeshPhongMaterial({map: plutonTexture})
    geometry = new THREE.SphereGeometry(0.15, 32, 32)
    pluton = new THREE.Mesh(geometry, plutonMaterial)
    pluton.position.set(5,0,0)


    // Add mercury
    mercuryGroup.add(mercury)
    // Add Venus
    venusGroup.add(venus)
    // Add Earth
    earthGroup.add(earth)
    // earthGroup.add(moon)
    // Add Marte
    marteGroup.add(marte)
    // Add Jupiter
    jupiterGroup.add(jupiter)
    // Add Saturno
    saturnoGroup.add(saturno)
    // Add Urano
    uranoGroup.add(urano)
    // Add Neptuno
    neptunoGroup.add(neptuno)
    // Add Pluto
    plutonGroup.add(pluton)

    scene.add(sistmesolar);
    scene.add(mercuryGroup)
    scene.add(venusGroup)
    scene.add(earthGroup)
    scene.add(marteGroup)
    scene.add(jupiterGroup)
    scene.add(saturnoGroup)
    scene.add(uranoGroup)
    scene.add(neptunoGroup)
    scene.add(plutonGroup)
    sistmesolar.add(sun)


}

main();