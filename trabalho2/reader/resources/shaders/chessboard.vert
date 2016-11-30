attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;


void main() {
	float gapx = 1.0/du;
	float gapy = 1.0/dv;

	if((aTextureCoord[0])*du >= su && (aTextureCoord[1])*dv >= sv && (aTextureCoord[0])*du <= su+1.00001 && (aTextureCoord[1])*dv <= sv+1.00001)
		gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition+aVertexNormal*0.03, 1.0);
	else gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vTextureCoord = aTextureCoord;
}
