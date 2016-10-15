// Module for generation source list 

var fs      = require('fs');
var path    = require('path');
var glob    = require('glob');


var cwdPath     = process.cwd();
var basePath    = path.join(cwdPath, '../');
var inputPath   = path.join(basePath, './src');
var pattern     = path.join(inputPath, '*/spinners/*');
var outputPath  = path.join(cwdPath, './build/source.js');


glob(pattern, {}, function(err, filePaths) {
  if (err) return console.log(err);

  var output = {};

  for (var i = 0; i < filePaths.length; i++) {
    var filePath    = filePaths[i];
    var sourceNum   = filePath.match(/\d+/)[0];
    var sourceExt   = filePath.match(/[^\.]+$/)[0];
  
    var source      = fs.readFileSync(filePath, 'utf8');
    
    if (!output[`${sourceNum}`]) {
      output[`${sourceNum}`] = {}
    }
  
    output[`${sourceNum}`][sourceExt] = source;
  }
  
  var result = `var source = ${JSON.stringify(output, null, 2).replace(/\n$/, '')};\n`;
  
  fs.writeFile(outputPath, result, function(err) {
    if (err) return console.log(err);
  
    console.log(`File ${outputPath} created`);
  });
});
