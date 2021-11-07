const fs = require('fs')

/*********************************************************/
//Reference: Slippy map tilenames
//https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
tile2long = (x,z) => {
  return (x/Math.pow(2,z)*360-180);
}

tile2lat = (y,z) => {
  const n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}
//until here

xyz2lonlat = (x, y, z) => {
  const lon = tile2long(x, z);
  const lat = tile2lat(y, z);
  return [lon, lat];
}
/*********************************************************/

const checkTiles = (dir) => {
  const files = fs.readdirSync(dir, {});
  //console.log(files);
  for(i in files){
    const f = files[i];
    if( f.match(/\.pbf$/) ){
      const fullf = dir + f;
      const m = fullf.match(/.*\/(\d+)\/(\d+)\/(\d+)\.pbf/);
      //const nw = xyz2lonlat(+m[2], + m[3], +m[1]);
      //const se = xyz2lonlat(+m[2]+1, + m[3]+1, +m[1]);
      const center = xyz2lonlat(+m[2]+0.5, +m[3]+0.5, +m[1]);

      const stat = fs.statSync(fullf);
      
      console.log(`${+m[1]},${+m[2]},${+m[3]},${stat.size},${center[0]},${center[1]}`);
      
      
    }else{
      const nextdir = dir + f + "/";
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