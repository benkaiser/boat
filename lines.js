w = window.innerWidth;
h = window.innerHeight;

var cnt = 0;
var piano = Synth.createInstrument('piano');

var stage = new Konva.Stage({
  width: w,
  height: h,
  container: '#canvas'
});

var layer = new Konva.Layer();
stage.add(layer);

var backgroundRect = new Konva.Rect({
  width: w,
  height: h,
  fill: '#fefefe'
});
layer.add(backgroundRect);

console.info('Customize density of lines with ?density=x where x/3 is roughly the number of lines on the screen at a time');
let densityInUrl;
try {
  densityInUrl = Number(new URL(window.location.href).searchParams.get('density'));
} catch (error) {
  /* no-op */
}
const density = densityInUrl || 10;

var lines = [];
for (x = 0; x < density; x++) {
  lines.push(new Konva.Line({
    y: (h / (density / 3)) * (x - density/3),
    x: 0,
    stroke: rgbToHex(hslToRgb(x % Math.floor(density/3) * (1 / (density/3)), 0.8, 0.8)),
    points: [0, 0],
    strokeWidth: h / (density / 3),
    lineCap: 'round',
    tension: 0.1
  }));
}
lines.forEach(line => layer.add(line));

stage.draw();

var velocity = 500;
let frameTime = 0;
let headedUp = true;
let lastChanged = 0;
let yOffset = 0;
let moveFrames = false;
const farRight = w * 0.95;

var anim = new Konva.Animation(function(frame) {
  frameTime += frame.timeDiff;
  lastChanged += frame.timeDiff;
  if (Math.random() < 0.1 && lastChanged > 500 || (yOffset > h / 2 && headedUp) || (yOffset < -(h / 2) && !headedUp)) {
    headedUp = !headedUp;
    lastChanged = 0;
    const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    piano.play(notes[
      Math.max(0,
        Math.min(notes.length - 1,
          notes.length - 1 -
          Math.floor(
            (yOffset + h/2) / h * (notes.length - 1)
          )
        )
      )
    ], 2, 1);
  }
  if (headedUp) {
    yOffset += frame.timeDiff / 2;
  } else {
    yOffset += -(frame.timeDiff / 2);
  }
  const newFrame = [Math.min(frameTime / 2, farRight), yOffset];
  lines.forEach((line) => {
    let previousPoints = line.points();
    if (lastChanged !== 0 && previousPoints.length > 2) {
      previousPoints.splice(-2);
    }
    if (moveFrames) {
      previousPoints = previousPoints.map((point, index) => {
        if (index % 2 == 1) {
          return point;
        } else {
          return point - frame.timeDiff / 2;
        }
      });
      if (previousPoints[2] < 0) {
        previousPoints.splice(0, 2);
      }
    }
    line.points(previousPoints.concat(newFrame));
    if (newFrame[0] >= farRight) {
      // anim.stop();
      moveFrames = true;
    }
  });
}, layer);
anim.start();

window.onfocus = function() {
  anim.start();
};

window.onblur = function() {
  anim.stop();
}

document.body.onclick = function() {
  lines.forEach(line => {
    line.points([]);
  })
  frameTime = 0;
  yOffset = 0;
  moveFrames = false;
  anim.start();
}

window.onresize = function() {
	// w = window.innerWidth;
	// h = window.innerHeight;
};
