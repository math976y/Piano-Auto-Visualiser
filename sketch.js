let music
let trackAntal = 2

let img

let playMusic = false

function preload(){

  img = loadImage("pindeho.png");
  
  //synth = new Tone.PolySynth().toDestination()
  
  piano = {
    
    "C2" : "Piano2/C2.wav",
    "E2": "Piano2/E2.wav",
    "G#2" : "Piano2/Gs2.wav",
    "C3" : "Piano2/C3.wav",
    "E3": "Piano2/E3.wav",
    "G#3" : "Piano2/Gs3.wav",
    "C4" : "Piano2/C4.wav",
    "E4": "Piano2/E4.wav",
    "G#4" : "Piano2/Gs4.wav",
    "C5" : "Piano2/C5.wav",
    "E5": "Piano2/E5.wav",
    "G#5" : "Piano2/Gs5.wav",
    "C6" : "Piano2/C6.wav",
    "E6": "Piano2/E6.wav",
    "G#6" : "Piano2/Gs6.wav",
    "C7" : "Piano2/C7.wav",
    "E7": "Piano2/E7.wav",
    "G#7" : "Piano2/Gs7.wav",
    "C8" : "Piano2/C8.wav",
    "E8": "Piano2/E8.wav",
    "G#8" : "Piano2/Gs8.wav",
    "C9" : "Piano2/C9.wav",
    
  }
  
  funny = {
    
    "C5" : "bruh.mp3"
    
  }
  
  sampler = new Tone.Sampler({
	urls: piano
    
  }).toDestination();

  const reverb = new Tone.Reverb(10).toDestination();
  sampler.connect(reverb);

  music = loadJSON('hisaishi-2t.json')
  
}

// Individuelle noter under: music.tracks[].notes[]

function setup(){

  createCanvas(img.width,img.height);
  image(img , 0 , 0)
  
}

function keycodeMap(k){
  
  switch(k){
      
      case 81:
      return "C3";
      
      case 50:
      return "C#3";
      
      case 87:
      return "D3";
      
      case 51:
      return "D#3";
      
      case 69:
      return "E3";
      
      case 82:
      return "F3";
      
      case 53:
      return "F#3";
      
      case 84:
      return "G3";
      
      case 54:
      return "G#3";
      
      case 89:
      return "A3";
      
      case 55:
      return "A#3";
      
      case 85:
      return "B3";
      
      case 73:
      return "C4";
      
      case 57:
      return "C#4";
      
      case 79:
      return "D4";
      
      case 48:
      return "D#4";
      
      case 80:
      return "E4";
      
      case 83:
      return "F#4";

      case 90:
      return "F4";
      
      case 88:
      return "G4";
      
      case 68:
      return "G#4";
      
      case 67:
      return "A4";
      
      case 70:
      return "A#4";
      
      case 86:
      return "B4";
      
      case 66:
      return "C5";
      
      case 72:
      return "C#5";
      
      case 78:
      return "D5";
      
      case 74:
      return "D#5";
      
      case 77:
      return "E5";
      
      case 188:
      return "F5";
      
      case 76:
      return "F#5";
      
      case 190:
      return "G5";
      
      case 192:
      return "G#5";
      
      case 189:
      return "A5";
      
      case 222:
      return "A#5";
      
      default:
      return 0;
      
  }
  
}
  
function keyPressed(){
  
  now = Tone.now()
  
  let note = keycodeMap(keyCode)
  
  if(note !== 0){
    sampler.triggerAttack( note , now )
  }

}

function keyReleased(){

  let note = keycodeMap(keyCode)
  sampler.triggerRelease(note)
  
}

function mousePressed(){

  if(!playMusic){
    return
  }

  let now = Tone.now()

  Tone.loaded().then(() => {
    
      for(let t = 0; t < trackAntal; t++){
    
        for(let i = 0; i < music.tracks[t].notes.length; i++){

          let name =      music.tracks[t].notes[i].name
          let velocity =  music.tracks[t].notes[i].velocity
          let times =     music.tracks[t].notes[i].time
          let durations = music.tracks[t].notes[i].duration

          sampler.triggerAttackRelease( name , durations , now + times )

        }

    }
    
  });

}

