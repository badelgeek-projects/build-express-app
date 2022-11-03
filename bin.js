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
const exit = require('process').exit;

//-------------
// DECLARATIONS
//-------------
const NPX_PATH = __dirname;
const NPX_TEMPLATES_PATH = path.join(NPX_PATH, 'templates');
const NPX_JSON_PATH = path.join(NPX_PATH, 'package.json');
const NPX_JSON_DATA = require(NPX_JSON_PATH);
const NPX_NAME = NPX_JSON_DATA.name;
const NPX_VERSION = NPX_JSON_DATA.version;
const APP_NAME = process.argv[process.argv.length - 1];
const APP_PATH = path.join(process.cwd(), APP_NAME);
const APP_JSON = path.join(APP_PATH, 'package.json');
const APP_ENV_FILE = path.join(APP_PATH, '.env.template');
const APP_PORT = 3000;
const APP_ENV_NAME = 'DEVELOPMENT';
const PROGRAM_NAME = process.argv[1];
const FIRST_ARGUMENT = process.argv[2];

const NPX_INDEX_EJS = path.join(NPX_TEMPLATES_PATH, 'views/index.ejs');
const APP_INDEX_EJS = path.join(APP_PATH, 'views/index.ejs');

const NPX_README = path.join(NPX_TEMPLATES_PATH, 'README.md');
const APP_README = path.join(APP_PATH, 'README.md');



const OPTIONS = {
   'help': {
      helpText: 'Print help',
   },
   '--version': {
      helpText: 'Print version',
   },

   '--folder': {
      isSet: false,
      needValue: true,
      required: true,
      value: 'basic',
      validValue: ['basic', 'middleware'],
      helpText: 'type of folder structure',
   },

   '--port': {
      isSet: false,
      needValue: true,
      required: true,
      value: APP_PORT,
      validValue: 'number',
      helpText: 'Server Port number',
   },

   '--env': {
      isSet: false,
      needValue: true,
      required: true,
      value: APP_ENV_NAME,
      validValue: 'string',
      helpText: 'Environment name',
   },
}

//-------------
// Functions 
//-------------
const displayHelp = () => {
   //console.clear();
   log.program(`default : ${NPX_NAME} app-name`);
   log.program(`options : ${NPX_NAME} options app-name`);

   // Display help
   for (let option in OPTIONS) {
      let required = OPTIONS[option].required ? '<value>' : '';
      let validValue = OPTIONS[option].validValue ? OPTIONS[option].validValue : '';
      let defaultValue = OPTIONS[option].value ? `(default: ${OPTIONS[option].value})` : '';

      console.log('\t%s %s\t: %s %s', option, required, OPTIONS[option].helpText, validValue, defaultValue );
   }
   log.c();
   // Exit after displaying help
   exit(1);
}

const checkOS = (os) => {
   if (os === 'win32' && process.env.USER !== 'abdelkarimo') {
      log.program('OS not supported yet : coming soon...');
      exit(0);
   }
}

const cleanNpxCache = () => {
   if (PROGRAM_NAME.includes('_npx')) {
      fs.rmSync(NPX_JSON_PATH);
   }
}

const displayVersion = () => {
   console.log(`version ${NPX_VERSION}`);
}

const runCommand = ({ command, message = false, stdout = false }) => {
   //execSync(command, { stdio: 'inherit' });
   try {
      if (message) {
         log.step(message);
      }

      if (stdout) {
         execSync(command, { stdio: 'inherit' });
      } else {
         let res = execSync(command);
      }
   }
   catch (err) {
      log.error(err.stderr.toString());
      exit(3);
   }

   if (message) {
      log.ok();
   }
}

const replaceInFile = ({ file, originalRegex, newText, outputFile = file }) => {
   let data = fs.readFileSync(file, 'utf8').replace(originalRegex, newText);
   fs.writeFileSync(outputFile, data, 'utf8');
}

const log = {
   DEBUG: false,
   c: console.log,
   debug: msg => (log.DEBUG) ? log.c(msg) : '',
   error: msg => log.c(chalk.bold.red(msg ? '[ERROR] ' + msg : '[ERROR] ')),
   info: msg => log.c(msg),
   ok: msg => log.c(chalk.bold.green(msg ? '[OK] ' + msg : '[OK] ')),
   program: msg => log.c(chalk.bold.blue(msg)),
   step: msg => process.stdout.write(msg + ' : '),
   warning: msg => log.c(chalk.bold.yellow(msg ? '[WARNING] ' + msg : '[WARNING] ')),
}

const handleViews = () => {
   log.step('Views Setup');
   replaceInFile({
      file: NPX_INDEX_EJS,
      originalRegex: /APP_NAME/g,
      newText: `${APP_NAME}`,
      outputFile: APP_INDEX_EJS
   });
   log.ok();
}

//-------------
// MAIN
//-------------
// Clean cache to force last release only
cleanNpxCache();

// Check OS
//checkOS(process.platform);

log.program('\nCreate NODE.JS + EXPRESS boilerplate app');
log.program(`${NPX_NAME} : version ${NPX_VERSION}\n`);

// HELP
if (FIRST_ARGUMENT === 'help') {
   displayHelp();
}

// VERSION
if (FIRST_ARGUMENT === '--version' || FIRST_ARGUMENT === '-v') {
   displayVersion();
   exit(0);
}

// Validate Project Name 
if (process.argv.length <= 2) {
   log.error('No Project name');
   displayHelp();
   exit(3);
}

// Validate Project Name 
if (APP_NAME[0] === '-') {
   log.error('ERROR : Bad Project name');
   exit(3);
}

// Test folder
if (fs.existsSync(APP_PATH)) {
   log.error(`project folder ${APP_NAME} already exists !!`);
   exit(3);
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

         if (option.value === APP_NAME) {
            log.error('no project name !');
            exit(3);
         }

         // If typeof string => check valid typeof value if number
         // else (array) => check valide values
         if (typeof (option.validValue) === 'string') {
            if (option.validValue === 'number' && isNaN(+option.value)) {
               log.error(`incorrect value ${argument} ${option.value} (expected ${option.validValue})`);
               exit(3);
            }
         } else {
            if (option.validValue.indexOf(option.value) < 0) {
               log.error(`incorrect ${option.value} for ${argument}`);
               exit(3);
            }

         }
         option.isSet = true;

      }

   } else {
      displayHelp();
   }
}

// CLONNE REPO INTO PROJECT FOLDER
runCommand({
   command: `git clone --quiet --depth 1 git@github.com:badelgeek-boilerplate/nodejs-express-${OPTIONS['--folder'].value}.git ${APP_NAME}`,
   message: 'Create App',
});

// Change Project name in package.
// runCommand({
//    command: `cd ${APP_NAME} && npm pkg set name='${APP_NAME}'`,
//    message: 'App Setup',
// });

log.step('App Setup');
replaceInFile({
   file: APP_JSON,
   originalRegex: /"name": ".*,/,
   newText: `"name": "${APP_NAME}",`,
});
log.ok();


// Install dependencies
runCommand({
   command: `cd ${APP_NAME} && npm install`,
   message: 'Npm setup',
});

// Configure Env file
log.step('Env Setup');
replaceInFile({
   file: APP_ENV_FILE,
   originalRegex: /PORT=.*\b/,
   newText: `PORT=${OPTIONS['--port'].value}`,
});

replaceInFile({
   file: APP_ENV_FILE,
   originalRegex: /ENV=.*\b/,
   newText: `ENV=${OPTIONS['--env'].value}`
});

fs.renameSync(`${APP_PATH}/.env.template`,`${APP_PATH}/.env`);
log.ok();

// README Template
log.step('Readme Setup');
replaceInFile({
   file: NPX_README,
   originalRegex: /APP_NAME/g,
   newText: `${APP_NAME}`,
   outputFile: APP_README
});
log.ok();

// Configure Views
handleViews();

// clean repo .git
log.step('Cleaning');
fs.rmSync(`${APP_PATH}/.git/`, { recursive: true, force: true });
log.ok();

// runCommand({
//    message: 'Cleaning',
//    command: `cd ${APP_NAME} && rm -rf .git/`,
// });

// Start Express Server
log.program('Configuration Finished, starting server...');
runCommand({
   command: `cd ${APP_NAME} && node app.js`,
   stdout: true,
});

