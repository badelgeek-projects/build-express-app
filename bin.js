#!/usr/bin/env node

// TODO
// commit + publish command script
// display npm list
// common files ? submodules ?
// git repo : public ?
// test windows ?
// test if nodemon is installed ?

//-------------
// REQUIRE
//-------------
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const chalk = require('chalk');
const { exit } = require('process');

//-------------
// DECLARATIONS
//-------------
const DEBUG = false;
const NPX_JSON_PATH = path.join(__dirname, 'package.json');
const NPX_JSON_DATA = require(NPX_JSON_PATH);
const NPX_NAME = NPX_JSON_DATA.name;
const NPX_VERSION = NPX_JSON_DATA.version;
const PROJECT_NAME = process.argv[process.argv.length - 1];
const PROJECT_PATH = path.join(process.env.PWD, PROJECT_NAME);
const PROJECT_JSON = path.join(PROJECT_PATH, 'package.json');
const PROJECT_ENV_FILE = path.join(PROJECT_PATH, '.env.template');
const PROJECT_PORT = 3000;
const PROJECT_ENV_NAME = 'DEVELOPMENT';

const EXECUTABLE = process.argv[0];
const PROGRAM_NAME = process.argv[1];
const FIRST_ARGUMENT = process.argv[2];

console.log("⏩ ~ EXECUTABLE", EXECUTABLE);
process.exit(99);

const OPTIONS = {
   'help': {
      helpText: 'Print help',
   },
   '--version': {
      helpText: 'Print version',
   },

   '--struct': {
      isSet: false,
      needValue: true,
      required: true,
      value: 'basic',
      validValue: ['basic', 'mvc'],
      helpText: 'type of folder structure',
   },

   '--port': {
      isSet: false,
      needValue: true,
      required: true,
      value: PROJECT_PORT,
      validValue: 'number',
      helpText: 'Server Port number',
   },

   '--env': {
      isSet: false,
      needValue: true,
      required: true,
      value: PROJECT_ENV_NAME,
      validValue: 'string',
      helpText: 'Environment name',
   },
}

//-------------
// Functions 
//-------------
const displayHelp = () => {
   //console.clear();
   console.log('## HELP ##\n');

   // Display help
   for (let option in OPTIONS) {
      console.log('%s\t: %s,', option, OPTIONS[option].helpText, OPTIONS[option].validValue);
   }
   // Exit after displaying help
   process.exit(1);
}

const cleanNpxCache = () => {
   if (PROGRAM_NAME.includes('_npx')) {
      fs.rmSync(NPX_JSON_PATH);
   }
}

const displayVersion = () => {
   console.log(`version ${NPX_VERSION}`);
}

const runCommand = (command, message) => {
   //execSync(command, { stdio: 'inherit' });
   try {
      if(message === 'stdout') {
         execSync(command, { stdio: 'inherit'});
      } else {
         log.step(message);
         let res = execSync(command, { stdio: '', stderr: ''});
         
      }
   }
   catch (err) {
      log.error(err.stderr.toString());
      process.exit(3);
   }
   log.ok();
}

const replaceInFile = (originalRegex, newText, file) => {
   let data = fs.readFileSync(file, 'utf8').replace(originalRegex, newText);
   fs.writeFileSync(file, data, 'utf8');
}

const log = {
   c: console.log,
   debug: msg => (DEBUG) ? log.c(msg) : '',
   error: msg => log.c(chalk.bold.red(msg ? '[ERROR] ' + msg : '[ERROR] ')),
   info: msg => log.c(msg),
   ok: msg => log.c(chalk.bold.green(msg ? '[OK] ' + msg : '[OK] ')),
   program: msg => log.c(chalk.bold.blue(msg)),
   step: msg => process.stdout.write(msg + ' : '),
   warning: msg => log.c(chalk.bold.yellow(msg ? '[WARNING] ' + msg : '[WARNING] ')),
}

//-------------
// MAIN
//-------------
// Clean cahce to force last release only
cleanNpxCache();

log.program('\nCreate NODE.JS + EXPRESS boilerplate project folder');
log.program(`${NPX_NAME} : version ${NPX_VERSION}\n`);

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
if (process.argv.length <= 2 ) {
   log.error('No Project name');
   process.exit(3);
}

// Validate Project Name 
if (PROJECT_NAME[0] === '-') {
   log.error('ERROR : Bad Project name');
   process.exit(3);
}

// Test folder
if (fs.existsSync(PROJECT_PATH)) {
   log.error(`project folder ${PROJECT_NAME} already exists !!`);
   process.exit(3);
}


// Program call Parameters
log.debug("⏩ ~ process.argv", process.argv);
for (let i = 2; i < process.argv.length - 1; i++) {

   let argument = process.argv[i];

   if (argument in OPTIONS) {
      let option = OPTIONS[argument];
      let value = '';

      // if isSet => Error
      if (option.isSet) {
         log.error("Option already set");
         displayHelp();
      }

      // if value is needed
      if (option.needValue) {
         i++;
         let valueTypeOf = typeof (option.value);
         option.value = process.argv[i];

         if (option.value === PROJECT_NAME) {
            log.error('no project name !');
            process.exit(3);
         }

         // If typeof string => check valid typeof value if number
         // else (array) => check valide values
         if (typeof (option.validValue) === 'string') {
            if (option.validValue === 'number' && isNaN(+option.value)) {
               log.error(`incorrect value ${argument} ${option.value} (expected ${option.validValue})`);
               process.exit(3);
            }
         } else {
            if (option.validValue.indexOf(option.value) < 0) {
               log.error(`incorrect ${option.value} for ${argument}`);
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

// CLONNE REPO INTO PROJECT FOLDER
const gitCloneCommand = `git clone --quiet --depth 1 git@github.com:badelgeek-boilerplate/nodejs-express-${OPTIONS['--struct'].value}.git ${PROJECT_NAME}`;
runCommand(gitCloneCommand, 'Create App');

// Change Project name in package.json
const npmPkgSetCommand = `cd ${PROJECT_NAME} && npm pkg set name='${PROJECT_NAME}'`;
runCommand(npmPkgSetCommand, 'Set App name');

// Install dependencies
const npmInstallCommand = `cd ${PROJECT_NAME} && npm install`;
runCommand(npmInstallCommand, 'Npm install');

// Configure Env file
replaceInFile(/PORT=.*\b/, `PORT=${OPTIONS['--port'].value}`, PROJECT_ENV_FILE);
replaceInFile(/ENV=.*\b/, `ENV=${OPTIONS['--env'].value}`, PROJECT_ENV_FILE);
const mvEnvCommand = `cd ${PROJECT_NAME} && mv .env.template .env`;
runCommand(mvEnvCommand, 'Configure env file');

// clean repo .git
const rmGitCommand = `cd ${PROJECT_NAME} && rm -rf .git/`;
runCommand(rmGitCommand, 'clean folder');

// Start Express Server
log.program('Configuration Finished, starting server...');
const startCommand = `cd ${PROJECT_NAME} && nodemon apps.js`
runCommand(startCommand,'stdout');







