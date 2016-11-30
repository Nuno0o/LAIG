#ifdef GL_ES
precision highp float;
#endif


varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec4 c1;
uniform vec4 c2;
uniform vec4 cs;

uniform float du;
uniform float dv;

uniform float su;
uniform float sv;

void main() {
    vec4 color;
    float gapx = 1.0/du;
    float gapy = 1.0/dv;
    if(mod(floor(vTextureCoord[0]/gapx),2.0) == 0.0 && mod(floor(vTextureCoord[1]/gapy),2.0) == 0.0 || mod(floor(vTextureCoord[0]/gapx),2.0) != 0.0 && mod(floor(vTextureCoord[1]/gapy),2.0) != 0.0){
      color = c1;
    }else color = c2;

    if(floor(vTextureCoord[0]/gapx) == su && floor(vTextureCoord[1]/gapy) == sv)
      color = cs;
      
		gl_FragColor =  texture2D(uSampler,vTextureCoord) * color;
}
