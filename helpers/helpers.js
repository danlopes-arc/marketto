const chalk = require("chalk")

/**
 * Trims the string or make it '' if falsy
 */
module.exports.stringfyAndTrim = string => {
  return (string || '').trim()
}

module.exports.logServerError = (err, msg, file) => {
  console.error(chalk.red('[server][error]', msg))
  console.error(chalk.red('[at]', file))
  console.error(err)
}