const columnify = require('columnify');
const arrify = require('arrify');
const chalk = require('chalk');
const util = require('util');

var borderColor = 'yellow';

function log(argsArray){

  //get arguments passed as an array...
  var args = Array.isArray(argsArray)
              ? argsArray
              : Object.keys(arguments).map(key => arguments[key]);

  var hadithiNumbered = [];
  var allNumbered = false;

  //build hadithi objects
  args = args.map( v => {
    //if user has defined own values...
    var color = 'white',
        type = 'text',
        style,
        indent = 0,
        isNumbered = false;

    if(typeof v == 'object'){
      color = v.hadithiColor || color ;
      type = v.hadithiType || type ;
      style = v.hadithiStyle || style ;
      indent = v.hadithiIndent || 0 ;
      isNumbered = ( v.hadithiNumbered || allNumbered ) ;
      // console.log(v.hadithiType, allNumbered)
      if(isNumbered && v.hadithiType == 'title' ){  allNumbered =true;   }
      v = v.hadithiContent || v;

      //dont output options...
      delete v.hadithiColor;
      delete v.hadithiType;
      delete v.hadithiStyle;
      delete v.hadithiContent;

    }

    hadithiNumbered.push(allNumbered ? true : isNumbered );

    return { color:color, style:style, indent:indent,  type:type, content:v };

  });

  // console.log(hadithiNumbered)


  var lineLength = maxLineLength(args, hadithiNumbered);

  // ─ ━ ┏ ₋ ⁻
  //make border line...
  var lines ={
    upper : '┏' + '━'.repeat(lineLength + 4 ) + '┓',
    mid_lower : '┣' + '━'.repeat(lineLength + 4 ) + '┫',
    lower : '┗' + '━'.repeat(lineLength + 4 ) + '┛'
  } ;

  var innerLine = '₋'.repeat(lineLength);
  innerLine = chalk.gray(innerLine);

  var innerLineTop = '⁻'.repeat(lineLength);
  innerLineTop = chalk.gray(innerLineTop);

  var headerLine = '⁻'.repeat(lineLength + 4);
  headerLine = chalk.gray(headerLine);

  //output upper line


  var out ='';
  var outputs = [];
  var isTitle = false;
  var numbering = 1;


  args.forEach(function(arg, i){

    isTitle = (arg.type == 'title');

    if(typeof arg.content == 'object'){
      out = (Array.isArray(arg.content))
              ? arg.content.join(', ')
              : columnify( arrify(arg.content), { preserveNewLines: true, columnSplitter: ' | '} )
                    .split(/[\n\r]/)
                    .join( "\n"+ (hadithiNumbered[i] ? " ".repeat(i.toString().length+2)+ " " : "")  );

    }
    else{
      out = arg.content;
    }

    //if numbered
    if(hadithiNumbered[i] && !isTitle){
      out = `(${numbering}) ` + out;
      numbering++;
    }
    else{
      numbering=1;
    }

    if(arg.indent){
      out=" ".repeat(arg.indent) + out;
    }


    //pad out
    out = padMultiline(out.toString(), lineLength);



    //if Title
    if(isTitle){
      // out = out.toUpperCase();
      //add line below
      out+="\n"+ padMultiline(headerLine, lineLength, true);
    }
    else if(i < argsArray.length-1){
      out+="\n"+ padMultiline(innerLine, lineLength );
    }


    //apply colors & boldening
    if(arg.color && chalk[arg.color]){

      if(arg.style && chalk[arg.style]){ out = chalk[arg.color][arg.style](out); }
      else{ out = chalk[arg.color](out); }

    }

    outputs.push(out);

  });


  //Now Draw
  console.log( chalk[borderColor]( lines.upper) );
  console.log(pad('',lineLength));
  console.log(outputs.join("\n"));
  console.log(pad('',lineLength));
  console.log(chalk[borderColor]( lines.mid_lower ) );

  //get caller for tracing
  var caller = lineTrace(3);

  //write meta data
  var metaArray = [
    "WHEN:    " + new Date().toUTCString(),
    "CALLER:  " + wrapline(caller.caller, lineLength-13, 8 ),
    "LINE:    " + caller.lineArr[0],
    "AT CHAR: " + caller.lineArr[1]
  ];

  // console.log(pad('',lineLength));
  console.log(chalk.gray( padMultiline( metaArray.join( "\n" + innerLine+"\n"  ), lineLength) ) );
  // console.log(pad('',lineLength));
  //lowest border
  console.log(chalk[borderColor]( lines.lower ) );

}

function lineTrace(index){
  index = index || 2;

  var err = new Error();
  Error.captureStackTrace(err);
  // console.log(err.stack);

  // Throw away the first line of the trace
  var caller = err.stack
                  .split('\n')[index]
                  .replace(/[^\(]+/,'')
                  .replace(/[\(\)]/g,'');
  var lineArr = caller.split(':').slice(-2);
  var pat = new RegExp(':'+lineArr.join(':')+'$');
  // console.log(pat);
  caller = caller.replace(pat, '');

  var string = `File: ${caller} on Line: ${lineArr[0]} at Char: ${lineArr[1]}`;

  return {caller , lineArr, string};
}

function wrapline(str, lineLength, joinSpaces){
  joinBy = joinSpaces ? "...\r"+" ".repeat(joinSpaces)+".." : "\r";

  var arr = str.split('')
               .chunk(lineLength)
               .map(a => a.join(''));


  return arr.join(joinBy);
}

function padMultiline(str, lineLength, small){

  return str.split(/[\n\r]/)
  .map((v,i) => {
    // console.log(v, v.length)
    v = pad(v, lineLength, small)
    return v;
  })
  .join("\n");

}

function pad(out, lineLength, small ){
  if(out.length < lineLength){
    // console.log(out)
    var diff = lineLength - out.length;
    // console.log(out.length, diff, lineLength)
    out =  out + " ".repeat(diff);
  }

  // ¦❙ ❚ ┃
  var char ='┃';
  char = chalk[borderColor](char);

  //pad out
  out = char + (small ? `${out}`:`  ${out}  ` ) + char;

  return out;
}

function maxLineLength(args, hadithiNumbered ){

  var lenArr = [ (new Date().toUTCString().length) + 13 ],
      arr = [],
      columns = [] ;

  args.forEach(function(arg){
    if(typeof arg.content == 'object'){
      if(Array.isArray(arg.content)){   arr = [arg.content.join(', ')];   }
      else{
        var columns = columnify( arrify(arg.content) );
        arr = columns.split(/[\n\r]/);
      }

      arr = arr.map(v => v.toString().length );
      lenArr = lenArr.union( arr );
    }
    else{
      lenArr.push(arg.content.toString().length);
    }
  });


  //cater for line numbering if any
  if(hadithiNumbered){
    lenArr = lenArr.map(len => {
      len+=(args.length.toString().length) + 4;
      return len;
    });
  }

  return lenArr.max();

}


//some array prototypes used...
Array.prototype.chunk = function(groupsize){
    var sets = [], chunks, i = 0;
    chunks = this.length / groupsize;

    while(i < chunks){
        sets[i] = this.splice(0,groupsize);
	i++;
    }

    return sets;
};
Array.prototype.union = function(a)
{
    var r = this.slice(0);
    a.forEach(function(i) { if (r.indexOf(i) < 0) r.push(i); });
    return r;
};
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};


//exports
module.exports = {
  log, lineTrace
}
