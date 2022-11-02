#!/usr/bin/env node
//-------------
// REQUIRE
//-------------
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

//-------------
// DECLARATIONS
//-------------
const NPX_JSON_PATH = path.join(__dirname, 'package.json');
const NPX_JSON_DATA = require(NPX_JSON_PATH);
const NPX_VERSION = NPX_JSON_DATA.version;
const PROJECT_NAME = process.argv[process.argv.length - 1];
const PROJECT_PATH = path.join(process.env.PWD, PROJECT_NAME);
const PROJECT_JSON = path.join(PROJECT_PATH, 'package.json');

const PROGRAM_NAME = process.argv[1];
const FIRST_ARGUMENT = process.argv[2];

if (PROGRAM_NAME.includes('_npx')) {
   console.log('---- NPX ---');
   console.log("⏩ ~ DELETE NPX_JSON_PATH", NPX_JSON_PATH);
   fs.rmSync(NPX_JSON_PATH);
}


//process.exit(99);

const options = {
   'help': {
      helpText: 'Print help',
   },
   '--version': {
      helpText: 'Print version',
   },

   '--type': {
      isSet: false,
      needValue: true,
      required: true,
      value: 'basic',
      validValue: ['basic', 'mvc'],
      helpText: 'type of architecture',
   },

   '--port': {
      isSet: false,
      needValue: true,
      required: true,
      value: 3000,
      validValue: 'number',
      helpText: 'Server Port number',
   },
}

//-------------
// Functions 
//-------------
function displayHelp() {
   //console.clear();
   console.log('## HELP ##\n');

   // Display help
   for (let option in options) {
      console.log('%s\t: %s,', option, options[option].helpText, options[option].validValue);
   }
   // Exit after displaying help
   process.exit(1);
}


function displayMenu() {
   console.log('menu');
   // Exit after displaying help
   process.exit(1);
}

function displayVersion() {
   console.log(`version ${NPX_VERSION}`);
}

function runCommand(command) {
   execSync(command, {stdio: 'inherit'});
}

//-------------
// MAIN
//-------------

// HELP
if (FIRST_ARGUMENT === 'help') {
   displayHelp();
}

// VERSION
if (FIRST_ARGUMENT === '--version' || FIRST_ARGUMENT === '-v') {
   displayVersion();
   process.exit(0);
}


// Validate Project Name 
if (PROJECT_NAME[0] === '-') {
   console.error('ERROR : Bad Project name');
   process.exit(3);
}


// console.debug("⏩ ~ process.argv", process.argv);

console.log('\n%s', '[SKAPP : Starter Kit APP]');
console.log('Create NODE.JS + EXPRESS boilerplate project folder\n');

for (let i = 2; i < process.argv.length - 1; i++) {

   let argument = process.argv[i];

   if (argument in options) {
      let option = options[argument];
      let value = '';

      // if isSet => Error
      if (option.isSet) {
         console.log("Option already set");
         displayHelp();
      }

      // if value is needed
      if (option.needValue) {
         i++;
         let valueTypeOf = typeof (option.value);
         option.value = process.argv[i];

         if (option.value === PROJECT_NAME) {
            console.error('ERROR : no project name !');
            process.exit(3);
         }

         // If typeof string => check valid typeof value if number
         // else (array) => check valide values
         if (typeof (option.validValue) === 'string') {
            if (option.validValue === 'number' && isNaN(+option.value)) {
               console.error(`ERROR : incorrect value ${argument} ${option.value} (expected ${option.validValue})`);
               process.exit(3);
            }
         } else {
            if (option.validValue.indexOf(option.value) < 0) {
               console.error(`ERROR : incorrect ${option.value} for ${argument}`);
               process.exit(3);
            }

         }
         option.isSet = true;

      }
      // console.debug("⏩ ~ option.value", option.value);
   } else {
      displayHelp();
   }
}

console.log("⏩ ~ PROJECT_NAME", PROJECT_NAME);

// Test folder
if (fs.existsSync(PROJECT_PATH)) {
   console.error(`ERROR : project folder ${PROJECT_NAME} already exists !!`);
   process.exit(3);
}

console.log("⏩ ~ process.argv", process.argv);



console.log("⏩ ~ mkdir PROJECT_PATH", PROJECT_PATH);



// Create Folder 
// deprecated : created with git clone
// fs.mkdirSync(PROJECT_PATH, (err) => {
//    console.error(`ERROR : can't create folder ${PROJECT_NAME} !!`);
//    process.exit(3);
// });


// CLONNE REPO INTO PROJECT FOLDER
const gitCloneCommand = `git clone --depth 1 git@github.com:badelgeek-boilerplate/nodejs-express-${options['--type'].value}.git ${PROJECT_NAME}`
runCommand(gitCloneCommand);

const npmInitCommand = `cd ${PROJECT_NAME} && npm init`;
runCommand(npmInitCommand);

const npmInstallCommand = `cd ${PROJECT_NAME} && npm install`;
runCommand(npmInstallCommand);

const mvEnvCommand = `cd ${PROJECT_NAME} && mv .env.template .env`
runCommand(mvEnvCommand);

setTimeout(() => {
   console.log('START');
   runCommand(`cd ${PROJECT_NAME} && nodemon apps.js`);
},1000);







