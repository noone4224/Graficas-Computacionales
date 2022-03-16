"use strict";

import * as shaderUtils from '../common/shaderUtils.js'
const mat4 = glMatrix.mat4;

let projectionMatrix;

let shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

const duration = 10000; // ms

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.

const vertexShaderSource = `#version 300 es

        in vec3 vertexPos; // Vertex from the buffer
        in vec4 vertexColor;

        out vec4 color;

        uniform mat4 modelViewMatrix; // Object's position
        uniform mat4 projectionMatrix; // Camera's position

        void main(void) {
    		// Return the transformed and projected vertex value
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
            color = vertexColor * 0.8;
        }`;

const fragmentShaderSource = `#version 300 es

        precision mediump float;
        in vec4 color;
        out vec4 fragColor;

        void main(void) {
        fragColor = color;
    }`;

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    const gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    
    let dodecaedro = createDodecaedro(gl, [-1 , 0, -4], [-0.4, 1.0, 0.1]);
    let octaedro = createOctaedro(gl, [2, 0, -2],  [0, 1, 0]);
    
    const shaderProgram = shaderUtils.initShader(gl, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(gl, shaderProgram);

    update(gl, shaderProgram, [dodecaedro, octaedro]);
}

function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";
    try {
        gl = canvas.getContext("webgl2");
    } 
    catch (e) {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl) {
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    // mat4.orthoNO(projectionMatrix, -4, 4, -3.5, 3.5, 1, 100)
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

// Create the vertex, color and index data for a multi-color cube
function createOctaedro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [
       // Top face front
        0.0,  0.0,  1.0,
       -0.5, -0.5,  0.0,
       -0.5,  0.5,  0.0,

       // Top Face Right 
        0.0,  0.0,  1.0,
        0.5, -0.5,  0.0,
       -0.5, -0.5,  0.0,

       // Top Face Back
        0.0,  0.0,  1.0,
        0.5,  0.5,  0.0,
        0.5, -0.5,  0.0,

       // Top Face Left
        0.0,  0.0,  1.0,
       -0.5,  0.5,  0.0,
        0.5,  0.5,  0.0,

       // Bottom Face Front
        0.0,  0.0, -1.0,
       -0.5, -0.5,  0.0,
       -0.5,  0.5,  0.0,

       // Bottom Face Right
        0.0,  0.0, -1.0,
        0.5, -0.5,  0.0,
       -0.5, -0.5,  0.0,

       // Bottom Face Back
        0.0,  0.0, -1.0,
        0.5,  0.5,  0.0,
        0.5, -0.5,  0.0,

       // Bottom Face Left
        0.0,  0.0, -1.0,
       -0.5,  0.5,  0.0,
        0.5,  0.5,  0.0,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [0.7, 0.1, 0.5, 0.7], // Top Face Front
        [0.0, 1.0, 0.9, 0.7], // Top Face Right
        [0.5, 0.4, 1.0, 1.0], // Top Face Back
        [0.9, 1.0, 0.3, 1.0], // Top Face Left
        [.15, 0.1, 0.8, 0.5], // Bottom Face Front
        [0.1, 1.0, 1.0, 1.0], // Bottom Face Right
        [.81, 0.0, 0.7, 1.0], // Bottom Face Back
        [0.0, 1.0, 0.9, 0.7], // Bottom Face Left
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let octaedroIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octaedroIndexBuffer);

    let octaedroIndices = [
        0, 1, 2,    // Face 1
        3, 4, 5,    // Face 2
        6, 7, 8,    // Face 3
        9, 10, 11,  // Face 4
        12, 13, 14, // Face 5
        15, 16, 17, // Face 6
        18, 19, 20, // Face 7
        21, 22, 23, // Face 8
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octaedroIndices), gl.STATIC_DRAW);
    
    let octaedro = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:octaedroIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices: 24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(octaedro.modelViewMatrix, octaedro.modelViewMatrix, translation);

    let top = false;
    let bottom = true;

    octaedro.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);

        if(bottom == true){
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0, .01,0])

            if(this.modelViewMatrix[13]>1.85){
                bottom  = false;
                top = true;
            }
        }

        if(top == true){
            mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,-.01,0])

            if(this.modelViewMatrix[13]<-1.85){
                bottom  = true;
                top = false;
            }
        }
        
    };
    
    return octaedro;
}

// Create the vertex, color and index data for a multi-colored cube
function createDodecaedro(gl, translation, rotationAxis)
{    
    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    const t = ( 1 + Math.sqrt( 5 ) ) / 2;
    const r = 1 / t;

    let verts = [
        // Face 1
        -1, -1, -1,
        -t, 0, -r,
        -t, 0, r,
        -1, -1, 1,
        -r, -t, 0,
    
        // Face 2
        -1, 1, -1,
        -r, t, 0,
        -1, 1, 1,
        -t, 0, r,
        -t, 0, -r,
    
        // Face 3
        -r, t, 0,
        r, t, 0,
        1, 1, 1,
        0, r, t,
        -1, 1, 1,
    
        // Face 4
        0, r, -t,
        1, 1, -1,
        r, t, 0,
        -r, t, 0,
        -1, 1, -1,
    
        // Face 5
        1, 1, -1,
        t, 0, -r,
        t, 0, r,
        1, 1, 1,
        r, t, 0,
    
        // Face 6
        1, 1, 1,
        t, 0, r,
        1, -1, 1,
        0, -r, t,
        0, r, t,
    
        // Face 7
        r, -t, 0,
        -r, -t, 0,
        -1, -1, 1,
        0, -r, t,
        1, -1, 1,
    
        // Face 8
        0, -r, -t,
        0, r, -t,
        -1, 1, -1,
        -t, 0, -r,
        -1, -1, -1,
    
        // Face 9
        -1, -1, 1,
        -t, 0, r,
        -1, 1, 1,
        0, r, t,
        0, -r, t,
    
        // Face 10
        1, -1, -1,
        0, -r, -t,
        -1, -1, -1,
        -r, -t, 0,
        r, -t, 0,
    
        // Face 11
        0, r, -t,
        0, -r, -t,
        1, -1, -1,
        t, 0, -r,
        1, 1, -1,  
    
        // Face 12
        t, 0, -r,
        1, -1, -1,
        r, -t, 0,
        1, -1, 1,
        t, 0, r
    ];
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [0.1, 0.0, 0.1, 1.0], // Face 1
        [0.2, 1.0, 0.1, 1.0], // Face 2
        [0.3, 0.0, 1.0, 1.0], // Face 3
        [0.5, 1.0, 0.3, 1.0], // Face 4
        [1.0, 0.0, 0.8, 1.0], // Face 5
        [0.9, 1.0, 1.0, 1.0], // Face 6
        [1.0, 0.0, 0.7, 1.0], // Face 7
        [0.82, 1.0, 0.0, 1.0], // Face 8
        [0.2, 0.0, 0.2, 1.0], // Face 9
        [1.0, 1.0, 0.3, 1.0], // Face 10
        [0.29, 0.0, 0.8, 1.0], // Face 11
        [0.12, 0.0, 0.5, 1.0]  // Face 12
    ];

    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    let vertexColors = [];
    // for (const color of faceColors) 
    // {
    //     for (let j=0; j < 4; j++)
    //         vertexColors.push(...color);
    // }
    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodecaedroIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodecaedroIndexBuffer);

    let dodecaedroIndices = [
        0, 1, 2,      2, 3, 0,      3, 4, 0,      // Face 1
        5, 6, 7,      7, 8, 5,      8, 9, 5,      // Face 2
        10, 11, 12,   12, 13, 10,   13, 14, 10,   // Face 3
        15, 16, 17,   17, 18, 15,   18, 19, 15,   // Face 4
        20, 21, 22,   22, 23, 20,   23, 24, 20,   // Face 5
        25, 26, 27,   27, 28, 25,   28, 29, 25,   // Face 6
        30, 31, 32,   32, 33, 30,   33, 34, 30,   // Face 7
        35, 36, 37,   37, 38, 35,   38, 39, 35,   // Face 8
        40, 41, 42,   42, 43, 40,   43, 44, 40,   // Face 9
        45, 46, 47,   47, 48, 45,   48, 49, 45,   // Face 10
        50, 51, 52,   52, 53, 50,   53, 54, 50,   // Face 11
        55, 56, 57,   57, 58, 55,   58, 59, 55,   // Face 12
    ];
    
    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodecaedroIndices), gl.STATIC_DRAW);
    
    let dodecaedro = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:dodecaedroIndexBuffer,
            vertSize:3, nVerts: 60, colorSize:4, nColors: 60, nIndices:108,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(dodecaedro.modelViewMatrix, dodecaedro.modelViewMatrix, translation);

    dodecaedro.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
        
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return dodecaedro;
}

function bindShaderAttributes(gl, shaderProgram)
{
    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
}

function draw(gl, shaderProgram, objs) 
{
    // clear the background (with black)
    gl.clearColor(0.1, 0.1, 0.1, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set the shader to use
    gl.useProgram(shaderProgram);

    for(let i = 0; i< objs.length; i++)
    {
        let obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);
        
        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function update(gl, shaderProgram, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(()=> update(gl, shaderProgram, objs));

    draw(gl,shaderProgram, objs);

    objs.forEach(obj =>{
        obj.update();
    })
    // for(const obj of objs)
    //     obj.update();
    // for(let i = 0; i<objs.length; i++)
    //     objs[i].update();
}

main();