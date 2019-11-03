const theExpress = require('express');
const theApp = theExpress();
const thePort = 12345;
var im = require('simple-imagemagick');
var sizeOf = require('image-size');

// get size of image
var dimensions = sizeOf('87.jpg');
console.log(dimensions.width, dimensions.height);

// convert -size 100x100 canvas:khaki  canvas_khaki.gif
im.convert(['-size', dimensions.width + 'x' + dimensions.height, 'canvas:khaki', 'canvas.jpg'],
  function(err, stdout) {
    if (err) throw err;
    console.log('canvas created: ', stdout);
  }
);

// chop up image
im.convert(['87.jpg', '-crop', '160x80@', '+repage', '+adjoin', 'images/87_tiles_%08d.jpg'],
function(err, stdout) {
  if (err) throw err;
  else {
    // if successful, alert user and get avg color of each image
    console.log('step 1: ', stdout);
    // resize each image to 1x1px so that each smaller image is the average color of each original image
    im.convert(['images/87_tiles_*.jpg', '-resize', '1x1', 'images/87_tiles_%08d.jpg'],
    function(err, stdout){
      if (err) throw err;
      else {
        // if successful, resize to 100x100
        console.log('step 2: ', stdout);
        im.convert(['images/87_tiles_*.jpg', '-resize', '5x5', 'images/87_tiles_%08d.jpg'],
        function(err, stdout){
          if (err) throw err;
          else {
            // finally, recompile
            console.log('step 3: ', stdout);
            console.log('shrunk');
            im.montage(['-tile', '160x80', '-geometry', '5x5', '-mode', 'concatenate', 'images/87_tiles_*.jpg', '87_rejoined.jpg'],
            function(err, stdout) {
              if (err) throw err;
              console.log('step 4: ', stdout);
            });
          }
        });
      }
    });
  }
});
