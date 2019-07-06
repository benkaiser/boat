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

const sea = new Konva.Rect({
  x: 0,
  y: h/2,
  width: w,
  height: h/2,
  fill: rgbToHex(hslToRgb(0.7, 1, 0.5))
});
layer.add(sea);
sea.zIndex(4);

const sky = new Konva.Rect({
  x: 0,
  y: 0,
  width: w,
  height: h/2,
  fillLinearGradientStartPoint: { x: w/2, y: 0 },
  fillLinearGradientEndPoint: { x: w/2, y: h/2 },
  fillLinearGradientColorStops: [0, rgbToHex(hslToRgb(0.1, 1, 0.5)), 1, rgbToHex(hslToRgb(0.0, 1, 0.5))]
});
layer.add(sky);
sky.zIndex(1);

var image;
var imageWidth;
var imageHeight;
var initalSunHeight = 100;

var imageObj = new Image();
imageObj.onload = function() {
  imageWidth = imageObj.width;
  imageHeight = imageObj.height;
  image = new Konva.Image({
    x: w/2 - imageWidth/2,
    y: h/2 - imageHeight/2 - initalSunHeight,
    image: imageObj,
    width: imageWidth,
    height: imageHeight
  });
  layer.add(image);
  image.zIndex(2);
  image.getAbsoluteZIndex();
};
imageObj.src = './images/joelle_koala.png';

const joelle = new Konva.Image

const fade = new Konva.Rect({
  x: 0,
  y: 0,
  width: w,
  height: h,
  fill: 'rgba(0, 0, 0, 0.2)'
});
layer.add(fade);
fade.zIndex(6);

stage.draw();

var velocity = 500;
var timePassed = 0;

var anim = new Konva.Animation(function(frame) {
  if (image) {
    timePassed += frame.timeDiff;
    fade.fill('rgba(0, 0, 0, ' + Math.min(1, timePassed / 10000) + ')');
    image.y(h/2 - imageHeight/2 - (initalSunHeight - timePassed / 30));

    if (timePassed > 13000) {
      timePassed = 0;
    }
  }
}, layer);
anim.start();

window.onfocus = function() {
  anim.start();
};

window.onblur = function() {
  anim.stop();
}

document.body.onclick = function() {
  timePassed = 0;
  anim.start();
}