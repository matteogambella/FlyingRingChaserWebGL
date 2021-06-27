function clearBits(){
    gl.clearColor(0.0, 0.0, 0.0, 0.0); 
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function setViewportAndCanvas(){
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.LINE_SMOOTH);
    
    clearBits();
}

function setMatrices(){
    // Compute the camera matrix
    aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    perspectiveMatrix = utils.MakePerspective(fieldOfViewDeg, aspect, zNear, zFar);
    viewMatrix = utils.MakeView(camera_x, camera_y, camera_z, camera_elevation, camera_angle);
}

function getAttributesAndUniforms(){
    
    for (var i = 0; i < programs.length - 1; i++){

        positionAttributeLocation[i] = gl.getAttribLocation(programs[i], "in_position");
        normalAttributeLocation[i] = gl.getAttribLocation(programs[i], "in_normal");
        
        if (i == XWING_INDEX){
            uvAttributeLocation[i] = gl.getAttribLocation(programs[i], "in_UV");
        }
        
        worldViewProjectionMatrixLocation[i] = gl.getUniformLocation(programs[i], "worldViewProjectionMatrix");  
        normalMatrixLocation[i] = gl.getUniformLocation(programs[i], "normalMatrix");
        worldMatrixLocation[i] = gl.getUniformLocation(programs[i], "worldMatrix");

        if (i == XWING_INDEX){
            textureLocation[i] = gl.getUniformLocation(programs[i], "in_texture");
            //cameraPositionLocation[i] = gl.getUniformLocation(programs[i], "cameraPosition");
            normalMapLocation = gl.getUniformLocation(programs[i], "normalMap");
        }

        if (i == RING_INDEX){

            cameraPositionLocation[i] = gl.getUniformLocation(programs[i], "cameraPosition");

        }

        if (i == ASTEROID_INDEX){
            //diffuseLocation = gl.getUniformLocation(programs[i], "diffuseMap");
            //normalLocation = gl.getUniformLocation(programs[i], "normalMap");
            //depthLocation = gl.getUniformLocation(programs[i], "depthMap");
            tangentLocation = gl.getUniformLocation(programs[i], "in_tangent");
            
        }


        // Light uniforms location COMMON to all objects

        ambientLightColorHandle[i] = gl.getUniformLocation(programs[i], "ambientLightCol");
        ambientMaterialHandle[i] = gl.getUniformLocation(programs[i], "ambientMat");
        materialDiffColorHandle[i] = gl.getUniformLocation(programs[i], 'mDiffColor');
        specularColorHandle[i] = gl.getUniformLocation(programs[i], "specularColor");
        shineSpecularHandle[i] = gl.getUniformLocation(programs[i], "specShine");
        emissionColorHandle[i] = gl.getUniformLocation(programs[i], "emit");    
        lightDirectionHandleA[i] = gl.getUniformLocation(programs[i], 'lightDirectionA');
        lightColorHandleA[i] = gl.getUniformLocation(programs[i], 'lightColorA');
        lightDirectionHandleB[i] = gl.getUniformLocation(programs[i], 'lightDirectionB');
        lightColorHandleB[i] = gl.getUniformLocation(programs[i], 'lightColorB');

    }

}

var images = [];
var textures = [];

function loadObjectsTextures(){

    // X-wing textures
    // ---------------
    
    // Create a texture.
    textures[0] = gl.createTexture();
    
    // Asynchronously load an image
    images[0] = new Image();
    images[0].onload = function() {
        // use texture unit 1
        gl.activeTexture(gl.TEXTURE1);
        // bind to the TEXTURE_2D bind point of texture unit 1
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[0]);
                
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.generateMipmap(gl.TEXTURE_2D);
    };
    images[0].src = textureDir + "xwing/XWing_Diffuse.png";

    // ---

    textures[1] = gl.createTexture();
    
    // Asynchronously load an image
    images[1] = new Image();
    images[1].onload = function() {
        // use texture unit 1
        gl.activeTexture(gl.TEXTURE2);
        // bind to the TEXTURE_2D bind point of texture unit 1
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[1]);
                
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.generateMipmap(gl.TEXTURE_2D);
    };
    images[1].src = textureDir + "xwing/XWing_Norm.png";

    // ---------------

    // Asteroid textures
    // -----------------

    textures[3] = gl.createTexture();

    images[3] = new Image();
    images[3].onload = function() {
        //gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, textures[3]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[3]);
                
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.generateMipmap(gl.TEXTURE_2D);
    };
    images[3].src = textureDir + "asteroid/rock_diffuse.jpg";

    textures[4] = gl.createTexture();

    images[4] = new Image();
    images[4].onload = function() {
        //gl.activeTexture(gl.TEXTURE0 + 3);
        gl.bindTexture(gl.TEXTURE_2D, textures[4]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[4]);
                
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        gl.generateMipmap(gl.TEXTURE_2D);
    };
    images[4].src = textureDir + "asteroid/rock_normal.jpg";
    
    // -----------------

}

function main() {

    utils.resizeCanvasToDisplaySize(gl.canvas);
    setViewportAndCanvas();

    getAttributesAndUniforms(); 

    vaos = new Array(allMeshes.length);
    for (let i in allMeshes){
        vaos[i] = gl.createVertexArray(); 
        createMeshVAO(i);
    }

    loadObjectsTextures();

    createShowcaseSceneGraph();

    updateLights();

    drawScene();
}

function render(){

    utils.resizeCanvasToDisplaySize(gl.canvas);
    setViewportAndCanvas();

    createShowcaseSceneGraph();

    updateLights();

    drawScene();
}

function animate(){

    //**TODO**// Update score e.g. livesP.innerHTML = "LIVES: " + lives;
    //Rx = Rx + 0.1;
    //Tz = Tz + 0.1;
     
    if(gameOn){
        
        if ( Date.now() - lastNewRingTime > SPAWNTIME ) {
            makeNewRing();
        }

    }
    else{
        Ry = Ry + 1;
    }
}

//x  [-6,6] y[0,4]
function updateShowcaseWorldMatrix(){

    setMatrices();

    if(gameOn){
        objects[0].worldMatrix = utils.MakeWorld(0.0, 0.0, Tz, Rx, Ry, Rz, S); ///////////////// just to make it work (do it iteratively or similarly)
        move();
        //console.log("NEW SCENE GRAPH");
    }
    else{
        //starshipArray = matricesArrays[0]; 
        /*
        ringsArray = matricesArrays[1];
        asteroidsArray = matricesArrays[2];
        ringsArray[0]= utils.MakeWorld(-3.0, 0.0, -1.5, Rx, Ry, Rz, S);
        asteroidsArray[0]= utils.MakeWorld(3.0, 0.0, -1.5, Rx, Ry, Rz, S);
        */
        //starshipArray[0] = utils.MakeWorld(0.0, 0.0, Tz, Rx, Ry, Rz + 90, S);

        objects[0].updateWorldMatrix(utils.MakeRotateYMatrix(Ry));

    }
    //objects[0].worldMatrix = utils.MakeWorld(0.0, -1.0, 45.0, Rx-90, Ry, Rz, S); ///////////////// just to make it work (do it iteratively or similarly)

}
/*
function drawElement(i,j){ // i is the index for vaos, j is index for worldMatrix

    gl.useProgram(programs[i]);
    let matricesArray = matricesArrays[i]; 
    let worldMatrix = matricesArray[j];

    utils.resizeCanvasToDisplaySize(gl.canvas);


    /////////// WORLD SPACE /////////////

    //clearBits();  // multiple draw of objects doesn't work with this here

    normalMatrix = utils.invertMatrix(utils.transposeMatrix(worldMatrix));
    MV = utils.multiplyMatrices(viewMatrix, worldMatrix);
    Projection = utils.multiplyMatrices(perspectiveMatrix, MV);

    gl.uniformMatrix4fv(worldViewProjectionMatrixLocation[i], gl.FALSE, utils.transposeMatrix(Projection));
    gl.uniformMatrix4fv(normalMatrixLocation[i], gl.FALSE, utils.transposeMatrix(normalMatrix));
    gl.uniformMatrix4fv(worldMatrixLocation[i], gl.FALSE, utils.transposeMatrix(worldMatrix));
    
    if(i==0){

        gl.uniform3fv(materialDiffColorHandle[i], materialColor);
        gl.uniform3fv(lightColorHandleA[i], directionalLightColorA);
        gl.uniform3fv(lightDirectionHandleA[i], directionalLightA);
        gl.uniform3fv(lightColorHandleB[i], directionalLightColorB);
        gl.uniform3fv(lightDirectionHandleB[i], directionalLightB);
        gl.uniform3fv(ambientLightColorHandle[i], ambientLight);
        gl.uniform3fv(ambientMaterialHandle[i], ambientMat);
        gl.uniform3fv(specularColorHandle[i], specularColor);
        gl.uniform1f(shineSpecularHandle[i], specShine);
    }

    
    let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, worldMatrix);
    let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

    gl.uniformMatrix4fv(worldViewProjectionMatrixLocation[i], gl.FALSE, utils.transposeMatrix(projectionMatrix));
    gl.uniformMatrix4fv(normalMatrixLocation[i], gl.FALSE, utils.transposeMatrix(worldMatrix));

    gl.bindVertexArray(vaos[i]);
    gl.drawElements(gl.TRIANGLES, allMeshes[i].indices.length, gl.UNSIGNED_SHORT, 0 );

}
*/
function drawObject(obj){ // obj is the node that represent the object to draw

    gl.useProgram(obj.drawInfo.programInfo);

    /////////// WORLD SPACE /////////////

    let normalMatrix = utils.invertMatrix(utils.transposeMatrix(obj.worldMatrix));
    let viewWorldMatrix = utils.multiplyMatrices(viewMatrix, obj.worldMatrix);
    let projectionMatrix = utils.multiplyMatrices(perspectiveMatrix, viewWorldMatrix);

    if (obj.drawInfo.type == XWING_INDEX){

        // Diffuse map
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[0]);
        gl.uniform1i(textureLocation[obj.drawInfo.type], 1);
        
        // Normal map
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, textures[1]);
        gl.uniform1i(normalMapLocation, 2);
    }

    gl.uniformMatrix4fv(worldViewProjectionMatrixLocation[obj.drawInfo.type], gl.FALSE, utils.transposeMatrix(projectionMatrix));
    gl.uniformMatrix4fv(normalMatrixLocation[obj.drawInfo.type], gl.FALSE, utils.transposeMatrix(normalMatrix));
    gl.uniformMatrix4fv(worldMatrixLocation[obj.drawInfo.type], gl.FALSE, utils.transposeMatrix(obj.worldMatrix));

    gl.uniform3fv(lightColorHandleA[obj.drawInfo.type], directionalLightColorA);
    gl.uniform3fv(lightDirectionHandleA[obj.drawInfo.type], directionalLightA);
    gl.uniform3fv(lightColorHandleB[obj.drawInfo.type], directionalLightColorB);
    gl.uniform3fv(lightDirectionHandleB[obj.drawInfo.type], directionalLightB);
    
    if (obj.drawInfo.type == RING_INDEX){ // (obj.drawInfo.type == XWING_INDEX || obj.drawInfo.type == RING_INDEX)
        gl.uniform4fv(cameraPositionLocation[obj.drawInfo.type], [camera_x, camera_y, camera_z, 1]);
    }
    else{
        gl.uniform3fv(materialDiffColorHandle[obj.drawInfo.type], obj.drawInfo.materialColor);
        gl.uniform3fv(ambientLightColorHandle[obj.drawInfo.type], ambientLight);
        gl.uniform3fv(ambientMaterialHandle[obj.drawInfo.type], ambientMat);
        gl.uniform3fv(specularColorHandle[obj.drawInfo.type], specularColor);
        gl.uniform1f(shineSpecularHandle[obj.drawInfo.type], specShine);
    }

    //I think this two calls are a duplication of the upper ones so they can be deleted
    //gl.uniformMatrix4fv(worldViewProjectionMatrixLocation[obj.drawInfo.type], gl.FALSE, utils.transposeMatrix(projectionMatrix));
    //gl.uniformMatrix4fv(normalMatrixLocation[obj.drawInfo.type], gl.FALSE, utils.transposeMatrix(obj.worldMatrix));

    gl.bindVertexArray(obj.drawInfo.vertexArray);
    gl.drawElements(gl.TRIANGLES, obj.drawInfo.bufferLength, gl.UNSIGNED_SHORT, 0 );

}
    
function drawScene() {    

    animate();

    updateShowcaseWorldMatrix(); // to update rings world matrices

    clearBits();

    // add each mesh / object with its world matrix
    /*
    for (var i = 0; i < allMeshes.length; i++) { //for each type of object
        let matricesArray = matricesArrays[i];
        for(var j = 0; j < matricesArray.length; j++){  // for each instance of that type
            drawElement(i,j);
        }
    }
    */
   
    drawSkybox();

    for (var i = 0; i < objects.length; i++){
        drawObject(objects[i]);
    }

    requestAnimationId = window.requestAnimationFrame(drawScene);
}

function createMeshVAO(i) {

    let mesh = allMeshes[i];
    gl.bindVertexArray(vaos[i]);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionAttributeLocation[i]);
    gl.vertexAttribPointer(positionAttributeLocation[i], 3, gl.FLOAT, false, 0, 0);

    if (i == XWING_INDEX){

        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.textures), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(uvAttributeLocation[i]);
        gl.vertexAttribPointer(uvAttributeLocation[i], 2, gl.FLOAT, false, 0, 0);

    }

    var normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(normalAttributeLocation[i]);
    gl.vertexAttribPointer(normalAttributeLocation[i], 3, gl.FLOAT, false, 0, 0);

    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.indices), gl.STATIC_DRAW);

}

async function loadShaders() {

    await utils.loadFiles([shaderDir + 'skybox_vs.glsl', shaderDir + 'skybox_fs.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

        programs[SKYBOX_INDEX] = utils.createProgram(gl, vertexShader, fragmentShader);
    });

    await utils.loadFiles([shaderDir + 'xwing_vs2.glsl', shaderDir + 'xwing_fs2.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

        programs[XWING_INDEX] = utils.createProgram(gl, vertexShader, fragmentShader);
    });

    await utils.loadFiles([shaderDir + 'ring_vs.glsl', shaderDir + 'ring_fs.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);
        
        programs[RING_INDEX] = utils.createProgram(gl, vertexShader, fragmentShader);
    });
  
    await utils.loadFiles([shaderDir + 'asteroid_vs.glsl', shaderDir + 'asteroid_fs.glsl'], function (shaderText) {
        var vertexShader = utils.createShader(gl, gl.VERTEX_SHADER, shaderText[0]);
        var fragmentShader = utils.createShader(gl, gl.FRAGMENT_SHADER, shaderText[1]);

        programs[ASTEROID_INDEX] = utils.createProgram(gl, vertexShader, fragmentShader);
    });

}

async function loadMeshes() {

    xwingMesh = await utils.loadMesh(modelsDir + "xwing_tiefighter2.obj");
    ringMesh = await utils.loadMesh(modelsDir + "ring2.obj" );
    asteroidMesh = await utils.loadMesh(modelsDir + "sphere_triangulate.obj");

    allMeshes = [xwingMesh, ringMesh, asteroidMesh];

}

async function init(){

    gl = canvas.getContext("webgl2");
    if (!gl) {
        document.write("GL context not opened");
        return;
    }
    utils.resizeCanvasToDisplaySize(gl.canvas);

    await loadShaders();

    await loadMeshes();

    loadEnvironment();
    
    main();
}

window.onload = init;
window.onresize = changeRender; 

function changeRender(){
    window.cancelAnimationFrame(requestAnimationId);
    render();
}