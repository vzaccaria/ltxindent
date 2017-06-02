#!/usr/bin/env node

const prog = require("caporal");
const _ = require("lodash");
const fs = require("fs");
const read = require("read-input");
const debug = require("debug")("ltxindent");
let Promise = require("bluebird");
const tmp = require("tmp");

let execP = command => {
  return new Promise((resolve, reject) => {
    require("child_process").exec(command, (error, stdout, stderr) => {
      debug({ error, stdout, stderr });
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ error, stdout, stderr });
      }
    });
  });
};

prog
  .version("1.0.0")
  .description("Beautifies latex")
  .argument("[target]", "file or stdin")
  .action(function(args) {
    if (!_.isUndefined(args.target)) {
        execP(`latexindent ${args.target}`).then(({ stdout }) => {
            console.log(stdout)});
    } else {
      read().then(res => {
        tmp.file((err, file, fd, cb) => {
          fs.writeFile(file, res.data, () => {
            execP(`latexindent ${file}`).then(({ stdout }) => {
              console.log(stdout);
              cb();
            });
          });
        });
      });
    }
  });

prog.parse(process.argv);
