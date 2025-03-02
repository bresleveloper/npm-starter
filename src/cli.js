#!/usr/bin/env node
const { program } = require('commander');
const createNewProject = require('./main');  // Import your main function
const drill = require('./drill');  
const readline = require('readline');


function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => rl.question(query + ":", ans => {
    rl.close();
    resolve(ans);
  }));
}


// Define the CLI command and options
program
  .command('new [name]')
  .description('creates new project')
  .action(async (name) => {
    //const name = await askQuestion('Enter your Project Name ');
    await createNewProject(name);
  });

program
  .command('drill [model]')
  .description('takes a .ts model file from models ng dir and create C# model and SQL script')
  .option('-p, --print', 'dont create files, just print to terminal')
  .option('-l, --local', 'use current local folder, for non-angular project')
  //.requiredOption('-m, --model <model fileName> (without the .ts)', 'angular model file name')
  .action(async (model, options) => {
    const print = options.print ? true : false;
    const local = options.local ? true : false;
    await drill(model, print, local);
  });

// Parse the command-line arguments
program.parse(process.argv);