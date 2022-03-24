"use strict";

let projectionMatrix = null, shaderProgram = null;

let shaderVertexPositionAttribute = null, shaderVertexColorAttribute = null, shaderProjectionMatrixUniform = null, shaderModelViewMatrixUniform = null;

let mat4 = glMatrix.mat4;


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


function createShader(glCtx, str, type)
{
    let shader = null;
    
    if (type == "fragment") 
        shader = glCtx.createShader(glCtx.FRAGMENT_SHADER);
    else if (type == "vertex")
        shader = glCtx.createShader(glCtx.VERTEX_SHADER);
    else
        return null;

    glCtx.shaderSource(shader, str);
    glCtx.compileShader(shader);

    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        throw new Error(glCtx.getShaderInfoLog(shader));
    }

    return shader;
}
    
function initShader(glCtx, vertexShaderSource, fragmentShaderSource)
{
    const vertexShader = createShader(glCtx, vertexShaderSource, "vertex");
    const fragmentShader = createShader(glCtx, fragmentShaderSource, "fragment");

    let shaderProgram = glCtx.createProgram();

    glCtx.attachShader(shaderProgram, vertexShader);
    glCtx.attachShader(shaderProgram, fragmentShader);
    glCtx.linkProgram(shaderProgram);
    
    if (!glCtx.getProgramParameter(shaderProgram, glCtx.LINK_STATUS)) {
        throw new Error("Could not initialise shaders");
    }

    return shaderProgram;
}

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    const gl = initWebGL(canvas);
    initViewport(gl, canvas);
    initGL(canvas);
    
    let triangle = createTriangle(gl,  [1, -1, -5]);

    const shaderProgram = initShader(gl, vertexShaderSource, fragmentShaderSource);
    bindShaderAttributes(gl, shaderProgram);

    update(gl, shaderProgram, [triangle]);
}

function initWebGL(canvas) 
{
    let gl = null;
    let msg = "Your browser does not support WebGL, or it is not enabled by default.";

    try 
    {
        gl = canvas.getContext("webgl2");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
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


function createTriangle(glCtx, translation)
{
    let verts = [
        0, 1, 0,
        -1, -1, 0,
        1, -1, 0
    ];

    let vertexBuffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, vertexBuffer);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(verts), glCtx.STATIC_DRAW);

    // Color data
    let vertexColors = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1
    ];
    
    let colorBuffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, colorBuffer);
    glCtx.bufferData(glCtx.ARRAY_BUFFER, new Float32Array(vertexColors), glCtx.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let triangleIndexBuffer = glCtx.createBuffer();
    glCtx.bindBuffer(glCtx.ELEMENT_ARRAY_BUFFER, triangleIndexBuffer);

    let triangleIndices = [0, 1, 2]

    glCtx.bufferData(glCtx.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleIndices), glCtx.STATIC_DRAW);
    
    const triangle = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:triangleIndexBuffer,
            vertSize:3, nVerts:3, colorSize:4, nColors: 3, nIndices: triangleIndices.length,
            primtype:glCtx.TRIANGLES, modelViewMatrix: mat4.create()
        };

    mat4.translate(triangle.modelViewMatrix, triangle.modelViewMatrix, translation);
    
    return triangle;
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