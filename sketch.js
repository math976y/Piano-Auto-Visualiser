let music
let trackAntal = 2

function preload(){
  
  synth = new Tone.PolySynth().toDestination()
  
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

  const reverb = new Tone.Reverb(100).toDestination();
  sampler.connect(reverb);

  music = loadJSON('hisaishi.json')
  



}

// Individuelle noter under: music.tracks[].notes[]

function setup(){
  
  createCanvas(400,400);
  background(0)


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

