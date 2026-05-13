let reverb = 0 // 0 ->
let trackAntal = 5

let klaverBillede
let animShader

let musik

function preload(){

  //musik = loadJSON('hisaishi-2t.json')
  musik = loadJSON('crankThat-5t.json')

  klaver = {
    
    "C2" : "klaver2/C2.wav",
    "E2": "klaver2/E2.wav",
    "G#2" : "klaver2/Gs2.wav",
    "C3" : "klaver2/C3.wav",
    "E3": "klaver2/E3.wav",
    "G#3" : "klaver2/Gs3.wav",
    "C4" : "klaver2/C4.wav",
    "E4": "klaver2/E4.wav",
    "G#4" : "klaver2/Gs4.wav",
    "C5" : "klaver2/C5.wav",
    "E5": "klaver2/E5.wav",
    "G#5" : "klaver2/Gs5.wav",
    "C6" : "klaver2/C6.wav",
    "E6": "klaver2/E6.wav",
    "G#6" : "klaver2/Gs6.wav",
    "C7" : "klaver2/C7.wav",
    "E7": "klaver2/E7.wav",
    "G#7" : "klaver2/Gs7.wav",
    "C8" : "klaver2/C8.wav",
    "E8": "klaver2/E8.wav",
    "G#8" : "klaver2/Gs8.wav",
    "C9" : "klaver2/C9.wav",
    
  }
  
  funny = {
    "C5" : "ghetto.mp3"
  }

  klaverBillede = loadImage("pindeho.png");

  // Sampleren er et objekt som refererer til listen klaver
  sampler = new Tone.Sampler({
	urls: klaver
  }).toDestination();

  // Reverb tilføjes seperat
  const reverb = new Tone.Reverb(50).toDestination();
  sampler.connect(reverb);

  // I p5.js er shaderens kode ikke seperate scripts i index, men to seperate string lister
  animShader = loadShader('process.vert', 'process.frag');
  
}

// Individuelle noter findes under: musik.tracks[].notes[]

let shaderLag
let texture

function setup(){

  // Musik knappen tegnes
  let musikKnap = createButton("Spil musik").position(windowWidth/2 - 22 , 500)
  musikKnap.mousePressed(play)

  // billets højde genberegnes efter skærmens størrelse
  let nyHøjde = klaverBillede.height * windowWidth / klaverBillede.width

  createCanvas(windowWidth, windowHeight);
  background(255 , 145 , 96)

  image(klaverBillede , 0 , height - nyHøjde , windowWidth , nyHøjde)

  // Shaderlaget er et eksternt lærred som kan tegnes på det rigtige lærred som et billede
  shaderLag = createGraphics(400 , 400 , WEBGL)

  // Shaderen tilføjes til dette eksterne lærred
  shaderLag.shader(animShader)

}

// Musik bør kun spille en gang
let spilMusik = true

// Hvis i musiktilstand
function play(){

  if(!spilMusik){ return }
  spilMusik = false

  // Jason filen er indelt i tracks og notes

  // Tracks er beregnet til at flere toner kan spille samtidig
  for(let t = 0; t < trackAntal; t++){
      
    // Hvert track har en liste af noder
    for(let i = 0; i < musik.tracks[t].notes.length; i++){

      // Hver node har et tidspunkt og en varighed
      let node =      musik.tracks[t].notes[i].name
      let tidspunkt = musik.tracks[t].notes[i].time
      let varighed =  musik.tracks[t].notes[i].duration
      
      // Timeout briúges til at aktivere funktionen senere
      setTimeout(() => {

        // Egen funktion bruges til at gemme information om den afspillede node
        // Timeout er i sekunder imens midi er i milli sekunder
        triggerAttackSave( node )

        setTimeout(() => {

          sampler.triggerRelease( node )

          // (Varighed bør dog gemmes seperat da det samme gøres når klaveret bruges, da varigheden af noden der ikke kendes fra starten)
          varighedGennemsnit[varighedIndex] = varighed
          varighedIndex ++
          varighedIndex %= 10

        }, varighed * 1000);

      }, tidspunkt * 1000);

    }

  }

}

// Almindelig node afspilning
function keyPressed(){

  // Her checkes der om tasten er en gyldig lokation på klaveret
  // Her bruges keycodeMap som angiver tastens tilsvarende node, samt tidspunktet hvor tasten trykkes, hvis den er gyldig
  let node = keycodeMap(keyCode)

  if(node !== 0){
    triggerAttackSave( node )
  }

}

// En tidsvariabel bruges gentagende, og er derfor global
let tid

// Kontroltid går kun op i takt med at lyd produceres
let kontrolTid = 0

// Tegning af shader billedet foregår konstant
function draw(){

  // Tid genstartes for at ungå en for høj værdi
  tid = (millis() / 1000) % 1000000

  let oktav = 0

  let nuværendeVarighed = 0

  // gennemsnit af de sidste 10 oktaver samt varighed af de sidste 10 takter
  for(let i = 0; i < previous.length; i++){

    oktav += oktavMap( previous[i] ) / 10

    nuværendeVarighed += varighedGennemsnit[i] / 10

  }

  // kontrol tid øges bestemt
  kontrolTid += aktivitet / 10

  animShader.setUniform("aktivitet" , aktivitet)
  animShader.setUniform("oktav" , oktav)
  animShader.setUniform("speed" , 0.5)
  animShader.setUniform("points" , nuværendeNode)
  animShader.setUniform("sharpness" , (1 - min(nuværendeVarighed , 2) ) / (1 + reverb) )

  animShader.setUniform("time" , kontrolTid )

  aktivitet = min(aktivitet , 2.) // aktivitet overgår aldrig 2
  aktivitet /= aktivitetDec

  shaderLag.rect(0)

  image(shaderLag , width/2 - shaderLag.width/2 , 70)

}

// Egen funktion er brugt, for at gemme information om det nuværende spil

// Oktav
let previous = []
let previousIndex = 0

// Støj
let aktivitet = 0
let aktivitetInc = 0.2
let aktivitetDec = 1.01

// gennemsnit af varighed
let varighedGennemsnit = [1,1,1,1,1,1,1,1,1,1]
let varighedIndex = 0

// Nuværende node
let nuværendeNode = 0

function triggerAttackSave( node ){

  sampler.triggerAttack( node )

  // Opsamling af data

  // Oktav
  previous[previousIndex] = node
  previousIndex ++
  previousIndex %= 10

  // Støj
  aktivitet += aktivitetInc

  // Node
  nuværendeNode = noteMap(node)

}

// På aftagning bør alle mulige taster checkes
let keys = [81,50,87,51,69,82,53,84,54,89,55,85,73,57,79,48,80,83,90,88,68,67,70,86,66,72,78,74,77,188,76,190,192,189,222]

function keyReleased(){

  for(let i = 0; i < 35; i++){

    if( !keyIsDown( keys[i] ) ){

      if( varighed[i] > 0 ){

        varighedGennemsnit[varighedIndex] = tid - varighed[i]
        varighedIndex ++
        varighedIndex %= 10

      }

      let note = keycodeMap(keys[i])
      sampler.triggerRelease(note)

      varighed[i] = 0

    }

  }
  
}

// tast længde
let varighed = []

// Tasters sammenhæng med toner
function keycodeMap(k){
  
  switch(k){
      
      case 81:
      varighed[0] = tid
      return "C3";
      
      case 50:
      varighed[1] = tid
      return "C#3";
      
      case 87:
      varighed[2] = tid
      return "D3";
      
      case 51:
      varighed[3] = tid
      return "D#3";
      
      case 69:
      varighed[4] = tid
      return "E3";
      
      case 82:
      varighed[5] = tid
      return "F3";
      
      case 53:
      varighed[6] = tid
      return "F#3";
      
      case 84:
      varighed[7] = tid
      return "G3";
      
      case 54:
      varighed[8] = tid
      return "G#3";
      
      case 89:
      varighed[9] = tid
      return "A3";
      
      case 55:
      varighed[10] = tid
      return "A#3";
      
      case 85:
      varighed[11] = tid
      return "B3";
      
      case 73:
      varighed[12] = tid
      return "C4";
      
      case 57:
      varighed[13] = tid
      return "C#4";
      
      case 79:
      varighed[14] = tid
      return "D4";
      
      case 48:
      varighed[15] = tid
      return "D#4";
      
      case 80:
      varighed[16] = tid
      return "E4";
      
      case 83:
      varighed[17] = tid
      return "F#4";

      case 90:
      varighed[18] = tid
      return "F4";
      
      case 88:
      varighed[19] = tid
      return "G4";
      
      case 68:
      varighed[20] = tid
      return "G#4";
      
      case 67:
      varighed[21] = tid
      return "A4";
      
      case 70:
      varighed[22] = tid
      return "A#4";
      
      case 86:
      varighed[23] = tid
      return "B4";
      
      case 66:
      varighed[24] = tid
      return "C5";
      
      case 72:
      varighed[25] = tid
      return "C#5";
      
      case 78:
      varighed[26] = tid
      return "D5";
      
      case 74:
      varighed[27] = tid
      return "D#5";
      
      case 77:
      varighed[28] = tid
      return "E5";
      
      case 188:
      varighed[29] = tid
      return "F5";
      
      case 76:
      varighed[30] = tid
      return "F#5";
      
      case 190:
      varighed[31] = tid
      return "G5";
      
      case 192:
      varighed[32] = tid
      return "G#5";
      
      case 189:
      varighed[33] = tid
      return "A5";
      
      case 222:
      varighed[34] = tid
      return "A#5";
      
      default:
      return 0;
      
  }
  
}

// Toners oktav
function oktavMap(s){

  // Det sidste symbol i strengen
  let k = s[s.length -1]

  // 3 vil være 0
  // 4 vil være 0.5
  // 5 vil være 1

  // n vil være (n - 3) / 2

  return ( Number(k) - 3 ) / 2

}

function noteMap(s){

  let k1 = s.substring(0,2)
  let k2 = s[0]

  switch(k1){

    case "C#":
    return 5;

    case "D#":
    return 9;

    case "F#":
    return 15;

    case "G#":
    return 19;

    case "A#":
    return 23;

    case "B#":
    return 27;

  }

  switch(k2){

    case "C":
    return 3;

    case "D":
    return 7;

    case "E":
    return 11;

    case "F":
    return 13;

    case "G":
    return 17;

    case "A":
    return 21;

    case "B":
    return 25;

  }

}