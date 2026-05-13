#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592

varying vec2 vTexCoord;

uniform float aktivitet;
uniform float oktav;
uniform float time;
uniform float ri;
uniform float ro;
uniform float points;
uniform float sharpness;
uniform float speed;

float hueClamp( float x ){
    return clamp( abs( mod( x * 6. , 6.) - 3.) - 1. , 0. , 1.);
}

vec3 hue( float h ){

    float red =   hueClamp(h);
    float green = hueClamp(h - 1. / 3.);
    float blue =  hueClamp(h - 2. / 3.);
    
    return vec3(red , green , blue);

}

float lerp( float a , float b , float x ){

    return a + (b - a) * x;

}

float waveLerp( float x , float lerpVal , float t ){

    // Wave used for spikes
    float spikeWave = 1. - 2. * abs(cos(x/2. + PI/4.));
    
    // Average between the two
    return lerp( sin(x) , spikeWave , lerpVal);

} 

void main() {

    vec2 uv = vTexCoord - 0.5;

    float t = time;

    // Rotation of the star
    uv *= mat2( cos(t*speed) , sin(t*speed) , -sin(t*speed) , cos(t*speed) );
    
    // Pseudorandom movement pattern
    uv -= vec2( cos(t * 2.) , sin(t * 1.8) ) * 0.05;
    
    float ri = 0.2;
    float ro = ri / 2. * (sharpness + 0.1);

    float waveOffset = waveLerp( asin( uv.y / length(uv) ) * points , max(sharpness , 0.) , t) * ro;
    
    float mask = ( sign( length(uv) - waveOffset - ri) + 1. ) / 2.;

    gl_FragColor =  vec4( vec3(255. , 145. , 96.) / 255. , 1. ) * mask;

    gl_FragColor += vec4( aktivitet * hue(oktav / 3.)    , 1. ) * (1. - mask);

}