w = window.innerWidth;
h = window.innerHeight;

var cnt = 0;

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
const density = densityInUrl || 100;
const baseHeight = -(h / 4);

var lines = [];
for (x = 0; x < density; x++) {
  lines.push(new Konva.Line({
    y: h,
    x: w / (density / 3) * (x - density / 3),
    stroke: rgbToHex(hslToRgb(Math.random() > 0.5 ? 0.9 : 0.5, 1, 0.5)),
    points: [0, 0, 0, baseHeight],
    strokeWidth: w / (density / 2),
    lineCap: 'round'
  }));
}
lines.forEach(line => layer.add(line));

stage.draw();

var velocity = 500;
let waveWidth = w / 10;
let endWavePosition = w + waveWidth;
let startWavePosition = -waveWidth;
let wavePosition = startWavePosition;
let headedUp = true;
let yOffset = 0;
let moveFrames = false;

var anim = new Konva.Animation(function(frame) {
  wavePosition += frame.timeDiff / 4;
  if (wavePosition > endWavePosition) {
    wavePosition = startWavePosition;
  }

  lines.forEach((line, index) => {
    const points = [0, 0];
    const position = line.x();
    if (Math.abs(wavePosition - position) < waveWidth) {
      let height = waveWidth - (position - wavePosition);
      height = waveWidth - Math.abs(height - waveWidth);
      height = Math.min(height, waveWidth * 0.7);
      height *= 2;
      points.push(0, baseHeight - (height));
    } else {
      points.push(0, baseHeight);
    }
    line.points(points);
  });
}, layer);
anim.start();

window.onfocus = function() {
  anim.start();
};

window.onblur = function() {
  anim.stop();
}

// document.body.onclick = function() {
//   lines.forEach(line => {
//     line.points([]);
//   })
//   frameTime = 0;
//   yOffset = 0;
//   moveFrames = false;
//   anim.start();
// }