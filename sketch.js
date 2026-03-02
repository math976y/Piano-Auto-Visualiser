let music
let trackAntal = 2

function preload(){
  
  synth = new Tone.PolySynth().toDestination()
  
  piano = {
    
    "A4" : "Piano/A.mp3",
    "A#4": "Piano/As.mp3",
    "B4" : "Piano/B.mp3",
    "C4" : "Piano/C.mp3",
    "C#4": "Piano/Cs.mp3",
    "D4" : "Piano/D.mp3",
    "D#4": "Piano/Ds.mp3",
    "E4" : "Piano/E.mp3",
    "F4" : "Piano/F.mp3",
    "F#4": "Piano/Fs.mp3",
    "G4" : "Piano/G.mp3",
    "G#4": "Piano/Gs.mp3"
    
  }
  
  funny = {
    
    "C5" : "bruh.mp3"
    
  }
  
  sampler = new Tone.Sampler({
	urls: piano
    
  }).toDestination();

  const reverb = new Tone.Reverb(50).toDestination();
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

