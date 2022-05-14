// En base a los archivos examen2_game.html y examen2_game.js, 
// desarrolla un juego sencillo que cree cubos de manera aleatoria, 
// y que al darles click con el mouse se quiten de la escena y se suma un punto al puntaje.
// Puedes ver un ejemplo en la Figura 2, y en el video game.mp4. 
// Los cubos se generan aleatoriamente entre -40 y 40 en X, entre 0 y 40 en Y, y en -80 en Z. 
// Utilizando setInterval (Enlaces a un sitio externo.) crea un cubo cada 0.5 segundos. 
// Los cubos van a moverse sobre Z en dirección a la cámara. 
// Usa raycasting para darle click a los cubos, y para quitarlos de la escena. 
// Se consideran hasta 5 puntos extra si cuando los cubos pasan de un punto específico en Z, 
// se quitan de la escena automáticamente, y al pasar esto, se resta un punto al puntaje

import * as THREE from '.././libs/three.module.js'

let renderer = null, scene = null, camera = null, root = null;
let cubeGroup = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let directionalLight = null, spotLight = null, ambientLight = null;

let cubes = [];
let score = 0;

const mapUrl = ".././images/checker_large.gif";
let currentTime = Date.now();

function animate()
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    for(const cube of cubes){
        cube.position.z += 0.02 * deltat;

        if(cube.position.z > 125){
            cubes.splice(cubes.indexOf(cube), 1);
            score -= 1;
            if (score <= 0) {
                score = 0
            }
            cubeGroup.children = cubes;
        }
    }
}

function update() 
{
    requestAnimationFrame(function() { update(); });
    renderer.render( scene, camera );
    animate();
    let scoreH = document.getElementById("scoreText");
    scoreH.innerHTML = "Score: " + score;
}

function createScene(canvas) 
{
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 15, 125);
    scene.add(camera);
    
    root = new THREE.Object3D;
    cubeGroup = new THREE.Object3D;
    
    directionalLight = new THREE.DirectionalLight( 0xaaaaaa, 1);
    directionalLight.position.set(0, 5, 100);

    root.add(directionalLight);
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 8, 100);
    root.add(spotLight);

    ambientLight = new THREE.AmbientLight ( 0xffffff, 0.3);
    root.add(ambientLight);

    let map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(10, 10);

    let geometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4;
    root.add( mesh );
    
    raycaster = new THREE.Raycaster();

    document.addEventListener('pointermove', onDocumentPointerMove);
    document.addEventListener('pointerdown', onDocumentPointerDown);

    scene.add( root );
    scene.add( cubeGroup );
}

function onDocumentPointerMove( event ) 
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( cubeGroup.children );

    if ( intersects.length > 0 ) 
    {
        if ( intersected != intersects[ 0 ].object ) 
        {
            if ( intersected )
                intersected.material.emissive.set( intersected.currentHex );

            intersected = intersects[ 0 ].object;
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.set( 0xff0000 );
        }
    } 
    else 
    {
        if ( intersected ) 
            intersected.material.emissive.set( intersected.currentHex );

        intersected = null;
    }
}

function onDocumentPointerDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( cubeGroup.children );

    if ( intersects.length > 0 ) 
    {
        clicked = intersects[ 0 ].object;

        cubes.splice(cubes.indexOf(clicked), 1);
        cubeGroup.remove(clicked)
        cubeGroup.children = cubes;
        score += 1;
    }
}

function addCube()
{
    const geometry = new THREE.BoxGeometry( 5, 5, 5 );
    
    let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    
    object.position.set(
        Math.floor((Math.random() * 40) + 1) * (Math.round(Math.random()) ? 1 : -1),
        Math.floor((Math.random() * 40) + 1),
        -80
    );
        
    cubeGroup.add( object );
    cubes.push(object)
}

function main()
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    setInterval(addCube, 500);

    update();
}

function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main();
    resize(); 
};

window.addEventListener('resize', resize, false);
