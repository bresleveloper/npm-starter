const simpleGit = require('simple-git');
const { exec } = require('child_process');
const path = require('path');
const replace = require('replace-in-file');
const fs = require('fs');




async function createNewProject(projectName) {
  const git = simpleGit();

  try {
    const repoUrl = 'https://github.com/bresleveloper/Starter-.NET-4.8-NG-18'
    const targetDir = projectName
    console.log(`Cloning ${repoUrl} into ${targetDir}`);
    await git.clone(repoUrl, targetDir);

    const fullPath = path.resolve(targetDir);
    console.log(`Navigating to ${fullPath}`);
    process.chdir(fullPath);

    fs.rmdirSync(`${fullPath}\\.git`, {recursive: true});


    const files = [];
    const getAllFiles = dir => {
      //console.log(`getAllFiles `);
      fs.readdirSync(dir).forEach(file => {
        const absolute = path.join(dir, file);
        if (fs.statSync(absolute).isDirectory()) {
          return getAllFiles(absolute);
        } else {
          return files.push(absolute.replaceAll("\\", "/"));
        }
      });
    };
    getAllFiles(fullPath);

    const searchStringArray = [
      'Starter_.NET_4._8_NG_18',
      'Starter-.NET-4.8-NG-18',
      'starter-.net-4.8-ng-18',
      'StarterNET48NG18',
    ];


    console.log(`for Replacements`);

    for (let i = 0; i < searchStringArray.length; i++) {
      const searchString = searchStringArray[i];
      const options = {
        files: files,
        from: new RegExp(searchString, 'g'),
        to: projectName,
        allowEmptyPaths:true
      };

      try {
        const results = await replace(options);
        console.log(`Replacement results ${i+1}:`, results.filter(f=>f.hasChanged).length); //results.filter(f=>f.hasChanged));
      } catch (error) {
        console.error(`Error occurred during string replacement ${i+1}:`, error);
      }
    }


    try {
      console.log(`rename files csproj and sln`);

      const file1 = `${fullPath}\\Starter-.NET-4.8-NG-18\\Starter-.NET-4.8-NG-18.csproj`
      const file2 = `${fullPath}\\Starter-.NET-4.8-NG-18.sln`
      const newfile1 = `${fullPath}\\Starter-.NET-4.8-NG-18\\${projectName}.csproj`
      const newfile2 = `${fullPath}\\${projectName}.sln`

      fs.renameSync(file1, newfile1);
      fs.renameSync(file2, newfile2);

      console.log(`rename files csproj and sln done`);

    } catch (error) {
      console.error('Error occurred during file names replacement:', error);
    }
    

    try {
      console.log(`Renaming dirs: start`);

      const dir1 = `${fullPath}\\Starter-.NET-4.8-NG-18`
      const dir2 = `${dir1}\\AngularFront\\Starter-.NET-4.8-NG-18`

      const newDir1 = `${fullPath}\\${projectName}`
      const newDir2 = `${dir1}\\AngularFront\\${projectName}`

      //important to rename dir2 before dir1
      fs.renameSync(dir2, newDir2);
      fs.renameSync(dir1, newDir1);

      console.log(`Renaming dirs: end`);

    } catch (error) {
      console.error('Error occurred during dir name replacement:', error);
    }

    console.log('Installing npm dependencies for angular...');
    //console.warn('WARNING SKIP Installing npm dependencies for angular...');

    await new Promise((resolve, reject) => {
      const fullPath = path.resolve(`${targetDir}/AngularFront/${projectName}`);
      console.log(`Navigating to ${fullPath}...`);
      process.chdir(fullPath);

      exec('npm install', (error, stdout) => {
        if (error) {
          console.error(`Error during npm install: ${error.message}`);
          reject(error);
          return;
        }
        console.log(`npm install output: ${stdout}`);
        resolve();
      });
    });
    
    console.log('Done!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

module.exports = createNewProject;
