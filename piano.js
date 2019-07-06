let finished = true;

function newNote(note, octave, length) {
  return {
    note: note,
    octave: octave,
    length: length,
    finished: false
  }
}

function playSong() {
  if (!finished) {
    return;
  }
  finished = false;
  Synth.setVolume(1.00);
  var piano = Synth.createInstrument('piano');
  // piano.play('C', 4, 2);

  // create some notes ('<Note Name> <Beat Length>')
  // q = quarter note, h = half note (more on that later)
  const notes = [];
  const baseOctave = 4;
  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('D', baseOctave, 0.25));
  notes.push(newNote('E', baseOctave, 0.25));

  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('E', baseOctave, 0.25));
  notes.push(newNote('D', baseOctave, 0.5));

  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('D', baseOctave, 0.25));
  notes.push(newNote('E', baseOctave, 0.25));
  notes.push(newNote('C', baseOctave, 0.5));
  notes.push(newNote('B', baseOctave - 1, 0.5));

  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('D', baseOctave, 0.25));
  notes.push(newNote('E', baseOctave, 0.25));
  notes.push(newNote('F', baseOctave, 0.25));
  notes.push(newNote('E', baseOctave, 0.25));
  notes.push(newNote('D', baseOctave, 0.25));
  notes.push(newNote('C', baseOctave, 0.25));
  notes.push(newNote('B', baseOctave - 1, 0.25));
  notes.push(newNote('G', baseOctave - 1, 0.25));
  notes.push(newNote('A', baseOctave - 1, 0.25));
  notes.push(newNote('B', baseOctave - 1, 0.25));
  notes.push(newNote('C', baseOctave, 0.5));
  notes.push(newNote('C', baseOctave, 0.5));

  const startTime = +new Date();
  const maxDiff = 1000;
  let lastFrame = startTime;
  let waiter = 0;
  function playFrame() {
    const newFrameTime = +new Date();
    const diff = newFrameTime - lastFrame;
    if (diff < maxDiff) {
      waiter -= diff / 1000;

      for (x = 0; x < notes.length; x++) {
        if (notes[x].played !== true && waiter <= 0) {
          piano.play(notes[x].note, notes[x].octave, notes[x].length);
          waiter += notes[x].length;
          notes[x].played = true;
        }
      }
    }
    lastFrame = newFrameTime;
    if (notes[notes.length - 1].played) {
      finished = true;
    } else {
      requestAnimationFrame(playFrame);
    }
  }
  requestAnimationFrame(playFrame);
}

document.body.addEventListener('click', function() {
  playSong();
});