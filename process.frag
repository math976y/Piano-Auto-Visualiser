#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.141592

varying vec2 vTexCoord;

uniform float aktivitet;
uniform float oktav;
uniform float rotationsFart;
uniform float skarphed;
uniform float takker;
uniform float tid;

// Den kantede funktion som bruges til omdannelse til hue
float hueClamp( float x ){
    return clamp( abs( mod( x * 6. , 6.) - 3.) - 1. , 0. , 1.);
}

// hue omdanner funktionen
vec3 hue( float h ){

    float red =   hueClamp(h);
    float green = hueClamp(h - 1. / 3.);
    float blue =  hueClamp(h - 2. / 3.);
    
    return vec3(red , green , blue);

}

// Linær interpolation bruges til at tage et vægtet gennemsnit af to værdier
float lerp( float a , float b , float x ){

    return a + (b - a) * x;

}

// Det vægtede gennemsnit af sinus kurven og den takkede kurve
float waveLerp( float x , float lerpVal , float t ){

    // Takket kurve
    float spikeWave = 1. - 2. * abs(cos(x/2. + PI/4.));
    
    // Vægtet gennemsnit imellem den bløde sinuskurve og den hårde takkede kurve
    return lerp( sin(x) , spikeWave , lerpVal);

} 

void main() {

    // Lærredets origo sættes til lærredets midtpunkt
    vec2 uv = vTexCoord - 0.5;

    float t = tid;

    // Blomstens rotation forgår som rotation af pixelens vektor omkring origo for blomsten flyttes
    // Dette gøres med det todimensionælle rotationsmatrix
    uv *= mat2( cos(t*rotationsFart) , sin(t*rotationsFart) , -sin(t*rotationsFart) , cos(t*rotationsFart) );
    
    // Bevægelsen af blomsten svinger omkring origo i et mønster som virker tilfældigt
    uv -= vec2( cos(t * 2.) , sin(t * 1.8) ) * 0.05;
    
    // Indre og ydre radius
    float ri = 0.2;
    float ro = ri / 2. * (skarphed + 0.1);

    // Hvad markeres som inden for blomsten er bestemt af pixel-vektorens længde
    // Den førnævnte bølge tilføjes og trækkes fra denne længde
    float waveOffset = waveLerp( asin( uv.y / length(uv) ) * takker , max(skarphed , 0.) , t) * ro;
    
    // mask, betyder i denne forstand skabelon. inden for blomsten vil skabelonen være lig med 0, udenfor 1
    float mask = ( sign( length(uv) - waveOffset - ri) + 1. ) / 2.;

    // Baggrundsfarven ganges med skabelonen
    gl_FragColor =  vec4( vec3(255. , 145. , 96.) / 255. , 1. ) * mask;

    // Blomstens givne farve ganges med skabelonens invers, og farven tilføjes for at udfylde skabelonens hul
    gl_FragColor += vec4( aktivitet * hue(oktav / 3.)    , 1. ) * (1. - mask);

}