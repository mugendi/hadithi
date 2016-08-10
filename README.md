# Hadithi (Swahili for story)
When you need your logs to tell a story...

'Hadithi' is Swahili for 'Story'. Often, my son loves when I tell him stories at night. As with any story, he often wants to know:

- How it happened
- Where it happened
- When it happened
- Who did it

Hadithi (the module) arose from the need to have my logs tell me a story. A story that is easy to follow with metadata on where, how and who dunnit!

I also happen to be fussy about how my logs are presented so I had to chalk them over :-)

## Don't use this if...
You want machine readable (saved to file/db) logs. This is and will remain a debugging tool for the most part where a developer wants to read a story of what the code is doing. While I have entertained the thought of building in such capability a couple of times, there are better tools like ```bunyan``` for that.

## Sample Hadithi
A hadithi looks somewhat like this...


```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                                              ┃
┃  SERVER STARTUP                              ┃
┃⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻⁻┃
┃  Loading necessary modules                   ┃
┃  ₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋  ┃
┃  Setting up routes                           ┃
┃  ₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋  ┃
┃  Starting Up Server...                       ┃
┃  ₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋  ┃
┃  Server started                              ┃
┃                                              ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  WHEN:    Tue, 09 Aug 2016 18:50:57 GMT      ┃
┃  ₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋  ┃
┃  CALLER:  E:\projects\Node\_MY MODULES\...   ┃
┃          ..hadithi\test.js                   ┃
┃  ₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋  ┃
┃  LINE:    22                                 ┃
┃  ₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋₋  ┃
┃  AT CHAR: 9                                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

```
See ```test.js``` for sample Hadithis.

## Start with

Install with ```npm install --save hadithi;```

```javascript

const hadithi = require('hadithi');

//start hadithi (story) using an array
var storyline = [
  {
    hadithiStyle: 'bold', //style with chalk.bold()
    hadithiColor:'blue', //style with chalk.color()
    hadithiType:"title",  // treat this as a title
    hadithiContent:'SERVER STARTUP', //here id the title content
    hadithiNumbered: true //ok we want this numbered. Note, this option is applied to all other items other than the title itself! Putting it here is a shortcut to putting it elswhere in the items
  }
];

//Now Let us develop this story...
//somewhere else in your code
storyline.push('Loading necessary modules at line ' + hadithi.lineTrace().lineArr[0]);

//somewhere else in your code
storyline.push('Setting up routes at line ' + hadithi.lineTrace().lineArr[0]);

//somewhere else in your code, might be another file
storyline.push('Starting Up Server...')
storyline.push(hadithi.lineTrace().string);

var server_details = {
    port : 1335,
    started : new Date().toUTCString(),
    clients : 2,
    version : '1.0.0'
};

//somewhere else in your code
storyline.push('Server started at line ' + hadithi.lineTrace().lineArr[0] );

storyline.push(server_details);

//OK, Now Print Story
hadithi.log(storyline);


//lets do a quick story
hadithi.log(
   "Hadithi is awesome!",
   "But hey, heard of the inbuilt function .lineTrace()",
   "It helps you get data of the line in question like this: ",
   {hadithiColor:"green", hadithiContent : hadithi.lineTrace().string},
   "So you can use your Hadithi to tell WHERE & WHO DUNNIT!",
   "And somewhere in the middle of the code, you can number your story items...",
   {hadithiNumbered:true , hadithiContent: "This is the first numbered item :-)"},
   {hadithiColor:"red", hadithiNumbered:true , hadithiContent: "A second numbered item with color styling :-)"},
   {hadithiNumbered:false , hadithiContent: "Oh. We don't want any more numbering..."},
   {hadithiNumbered:true , hadithiContent: "Let's resume numbering, this time with some indentation...", hadithiIndent: 2 },
   {hadithiNumbered:true , hadithiContent: "Another Indented item", hadithiIndent: 3 },
   {hadithiNumbered:true , hadithiContent: "A last Indented item", hadithiIndent: 4 },
   "",//lets skip this line
   "\n\r", // or even leave out more space right here...
   "So what is the moral of this lesson?",
   "Like console.log(), Hadithi can take multiple arguments (logs) and 'storify' them!"
 );

```
## Columns
```test.js``` is a pretty good example to start with. If you run it, you will note that it outputs objects as beautiful columns! Did you?

Well, that's because Hadithi wraps the awesome [columnify](https://www.npmjs.com/package/columnify)

## Styling
Please note that Hadithi uses [chalk](https://www.npmjs.com/package/chalk) under the hood so all color names and style names must follow Chalk color/style names or will be ignored.

Go on, tell that story!
