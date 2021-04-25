const fs = require('fs')

/*********************************************************/
//Reference: Slippy map tilenames
//https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
tile2long = (x,z) => {
  return (x/Math.pow(2,z)*360-180);
}

tile2lat = (y,z) => {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}
//until here

xyz2lonlat = (x, y, z) => {
  var lon = tile2long(x, z);
  var lat = tile2lat(y, z);
  return [lon, lat];
}
/*********************************************************/

var checkTiles = (dir) => {
  var files = fs.readdirSync(dir, {});
  //console.log(files);
  for(i in files){
    var f = files[i];
    if( f.match(/\.pbf$/) ){
      var fullf = dir + f;
      var m = fullf.match(/.*\/(\d+)\/(\d+)\/(\d+)\.pbf/);
      //var nw = xyz2lonlat(+m[2], + m[3], +m[1]);
      //var se = xyz2lonlat(+m[2]+1, + m[3]+1, +m[1]);
      var center = xyz2lonlat(+m[2]+0.5, +m[3]+0.5, +m[1]);

      var stat = fs.statSync(fullf);
      
      console.log(+m[1] +","+ +m[2] +","+ +m[3] +","+ stat.size +","+ center[0] +","+ center[1]);
      
      
    }else{
      var nextdir = dir + f + "/";
      //console.log(nextdir);
      try {
        checkTiles(nextdir);
      }catch(err){
        //console.log(err);
        //console.log("Error: ディレクトリ\"" + nextdir + "\"を開けませんでした。")
      }
    }
  }
}


const target = process.argv[2];

checkTiles(target + "/");

