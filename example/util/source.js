// Module for generation source list [ css, scss, stylus ]

var fs            = require('fs');
var path          = require('path');
var glob          = require('glob');
var sass          = require('node-sass');
var autoprefixer  = require('autoprefixer');
var postcss       = require('postcss');


var cwdPath       = process.cwd();
var basePath      = path.join(cwdPath, '../');
var inputPath     = path.join(basePath, './src');
var pattern       = path.join(inputPath, '*/spinners/*');
var extPattern    = path.join(inputPath, '*');
var outputPath    = path.join(cwdPath, './build/source.js');


var additionals = {};

var types = glob.sync(extPattern).map(function(filePath) {
  return {
    path: filePath,
    ext: filePath.match(/[^\/]+$/)[0]
  };
});

types.forEach(function(type) {
	var filePaths = glob.sync(type.path + '/modules/_*');
  
  additionals[type.ext] = '';

  for (var i = 0; i < filePaths.length; i++) {
    var filePath    = filePaths[i];
    var source      = fs.readFileSync(filePath, 'utf8');

    additionals[type.ext] += source + '\n';
  }
});


var filePaths = glob.sync(pattern);

var output = {};

var promises = filePaths.map(function(filePath) {
  return new Promise(function(fulfill) {
    var sourceNum   = '' + filePath.match(/\d+/)[0];
    var sourceExt   = filePath.match(/[^\.]+$/)[0];
    var source      = fs.readFileSync(filePath, 'utf8');

    source = source.replace(/\@import "..\/_?modules";?\n{1,2}/, '');

    if (!output[sourceNum]) {
      output[sourceNum] = {}
    }

    output[sourceNum][sourceExt] = additionals[sourceExt] + source;

    if (sourceExt == 'scss') {
      var sassRenderResult = sass.renderSync({
        file: filePath,
        outputStyle: 'expanded'
      });
      
      postcss([ autoprefixer ]).process(sassRenderResult.css).then(function (result) {
        result.warnings().forEach(function (warn) {
          console.warn(warn.toString());
        });

        output[sourceNum].css = result.css;

        fulfill();
      });
    } else {
      fulfill();
    }
  })
});

Promise.all(promises).then(function() {
  var result = `var source = ${JSON.stringify(output, null, 2).replace(/\n$/, '')};\n`;

  fs.writeFile(outputPath, result, function(err) {
    if (err) return console.log(err);

    console.log(`File ${outputPath} created`);
  });
});
