#!/usr/bin/env node

const inquirer = require('inquirer')
const fuzzy = require('fuzzy')
const slugify = require('slugify')
const exec = require('child_process').exec
const chalk = require('chalk')
const sh = require('shelljs')

function execute(command, callback) {
  exec(command, function (error, stdout, stderr) {
    callback(stdout)
  })
}

const {cosmiconfigSync} = require('cosmiconfig')
const explorerSync = cosmiconfigSync("standard-commit")
inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
let results = explorerSync.search()
if (!results) {
  throw new Error("Config file not found!")
}
const config = results.config
const branchDescriptionFormatter = input => {
  let suffix = ''
  if (input.slice(-1) === "-" || input.slice(-1) === " ") {
    suffix = "-"
  }
  return slugify(input) + suffix
}
const jiraTicketFormatter = input => {
  if (input.indexOf("-") === -1) {
    let suffix = ''
    if (input.slice(-1) === "-" || input.slice(-1) === " ") {
      suffix = "-"
    }

    return slugify(input).toUpperCase() + suffix
  }

  const pieces = slugify(input).split("-")
  return pieces[0].toUpperCase() + "-" + pieces[1]
}
execute("git rev-parse --abbrev-ref HEAD", branchNameOutput => {

  const branchName = branchNameOutput.replace(/\s+/g, '')

  inquirer
    .prompt([
      {
        name: 'confirm',
        message: 'You are on branch ' + chalk.yellow(branchName) + '. \n ' + chalk.cyan("Are you sure you want to branch from here?"),
        default: "Yes"
      },
    ])
    .then(userResponse => {
      if (userResponse.confirm.toLowerCase() === "yes" || userResponse.confirm.toLowerCase() === "y") {
        inquirer
          .prompt([
            {
              type: 'autocomplete',
              name: 'type',
              message: 'Branch type',
              pageSize: 10,
              source: (answersSoFar, input) => new Promise((resolve, reject) => {
                if (input) {
                  resolve(fuzzy.filter(input, config.types).map(el => el.string))
                } else {
                  resolve(config.types)
                }
              }).catch((e) => {
              })
            },
            {
              name: 'name',
              message: 'Branch description',
              validate: input => (!input.length) ? "Please describe the work you will do on this branch!" : true,
              filter: branchDescriptionFormatter,
              transformer: branchDescriptionFormatter
            },
            {
              name: 'ticket',
              message: 'JIRA Ticket',
              filter: jiraTicketFormatter,
              transformer: jiraTicketFormatter,
              validate(input) {
                if (!input.length) {
                  return true
                }
                if (!input.match(/((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/)) {
                  return "Invalid JIRA Ticket!"
                }
                return true
              }
            },
          ])
          .then(({name, ticket, type}) => {
              let branchName = `${type}/${name}`
              if (ticket) {
                branchName = `${type}/${name}/${ticket}`;
                if (config.issueFirst) {
                  branchName = `${ticket}/${type}/${name}`
                }
              }

              const command = `git checkout -b ${branchName}`;

              inquirer
                .prompt([
                  {
                    name: 'confirm',
                    message: chalk.yellow(command) + '\nIs this correct?',
                    default: "Yes"
                  },
                ])
                .then(response => {
                  if (response.confirm.toLowerCase() === "yes" || response.confirm.toLowerCase() === "y") {
                    sh.exec(command)
                  }
                })
            }
          )
      }
    })
})
