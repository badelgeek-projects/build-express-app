const chalk = require('chalk');

const log = {
   DEBUG: false,
   c: console.log,
   info: msg => log.c(msg),
   debug: msg => (log.DEBUG) ? log.c(msg) : '',
   ok: msg => log.c(chalk.bold.green(msg ? '[OK] ' + msg : '[OK] ')),
   warning: msg => log.c(chalk.bold.yellow(msg ? '[WARNING] ' + msg : '[WARNING] ')),
   error: msg => log.c(chalk.bold.red(msg ? '[ERROR] ' + msg : '[ERROR] ')),
   program: msg => log.c(chalk.bold.blue(msg)),
   step: msg => process.stdout.write(msg + ' : '),
}

module.exports = log;