#version 300 es

in vec3 in_position; 
in vec3 in_normal;

out vec3 fsNormal; 
out vec4 fsPosition;
out vec4 fsCamera;

uniform mat4 worldViewProjectionMatrix; // World view rojection matrix (passed in js as transpose to match the glsl convention)
uniform mat4 worldMatrix; // world matrix (passed in js as transpose to match the glsl convention)
uniform mat4 normalMatrix; //normal matrix (passed in js as transpose to match the glsl convention)

uniform vec4 cameraPosition;

void main() {

    fsNormal = mat3(normalMatrix) * in_normal;
    fsPosition = (worldMatrix * vec4(in_position, 1.0)); // coordinates in world space

    fsCamera = cameraPosition;

    gl_Position = worldViewProjectionMatrix * vec4(in_position, 1.0);

}