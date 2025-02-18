const { exec } = require('child_process');
const path = require('path');
const replace = require('replace-in-file');
const fs = require('fs');
const readline = require('readline');


async function drill(filename, print) {
    //test we are in angular directory
    let dir = process.cwd()//C:\Users\Ariel\source\My NPM\testings\bigTest1\bigTest1\AngularFront\bigTest1
    if (!fs.existsSync(dir + '\\angular.json')) {
      console.error("Must be in Angular project directory");
      return
    }
    
    let dirza = dir.split('\\')
    let pKey = dirza[dirza.length-1]
    let dirBase = dir.split(pKey)[0] + pKey + '\\' + pKey
    let dirNGModels = dir + '\\src\\app\\models'
    let dirModels = dirBase + '\\Models'
    let dirCTRL = dirBase + '\\Controllers'
    let dirSql = `${dirModels}\\scripts`


    let filePath = `${dirNGModels}\\${filename}.model.ts`
    console.log('reading .ts from models');
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
      console.error(`Cant find models\\${filename}.model.ts`);
      return
    }

    let ngModelContent = fs.readFileSync(filePath, 'utf8')
    console.log('content:', ngModelContent);

    const lines = ngModelContent.split(/\r?\n/);
    let className = lines[0].replace("export class", "").replace("{", "").trim();
    console.log('className:', className);



    let sqlFileContent = `
USE ${pKey};

CREATE TABLE [dbo].[${className}] (
    [${className}ID] INT IDENTITY(1,1) PRIMARY KEY,\n`;



    let csFileCTRLContent = `
using ${pKey}.App_Data;
using ${pKey}.Models;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace ${pKey}.Controllers
{
    public class ${className}Controller : SimpleController<${className}> 
    { 
	
    }
}`;

    let csFileContent = `
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ${pKey}.Models
{
    public class ${className} 
    {
        public int ${className}ID { get; set; }
`;
    
    function pushNewMembersToCs(mType){
      const matches = ngModelContent.match(mType.r);
      console.log(`Matching Lines for ${mType.cs}:`, matches);

      for (let i = 0; i < matches.length; i++) {
        const m = matches[i]; //'    Numen:string'
        let member = m.split(":")[0].trim()
        
        csFileContent += `        public ${mType.cs} ${member}  { get; set; }\n`

        sqlFileContent += `    [${member}] ${mType.sql},\n`
      }
    };

    let arr_mTypes = [
      { cs:'string',    r: /^.*:string.*$/gm,   sql:'NVARVHAR(150) NULL' },
      { cs:'int',       r: /^.*:number.*$/gm,   sql:'INT NULL'},
      { cs:'DateTime',  r: /^.*:Date.*$/gm,     sql:'Date NULL'},
      { cs:'bool',      r: /^.*:boolean.*$/gm,  sql:'BIT NULL'},
    ];

    for (let j = 0; j < arr_mTypes.length; j++) {
      pushNewMembersToCs(arr_mTypes[j])
    }

    csFileContent += `    }\n}`
    sqlFileContent += `);`
    console.log('.ts to .cs conversion complete.');
    console.log('.cs file content');
    console.log(csFileContent);
    console.log('.sql file content');
    console.log(csFileContent);


    if (!print) {
      let cs_filePath = `${dirModels}\\${className}.cs`
      let cs_fileCTRLPath = `${dirCTRL}\\${className}Controller.cs`
      let sql_fileCTRLPath = `${dirSql}\\${className}.sql`

      if (!fs.existsSync(dirSql)) {
        fs.mkdirSync(dirSql)
      }

      fs.writeFileSync(cs_filePath, csFileContent)
      fs.writeFileSync(cs_fileCTRLPath, csFileCTRLContent)
      fs.writeFileSync(sql_fileCTRLPath, sqlFileContent)
    }
    
    /*const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`;
*/
    console.log('Done!');
  }

module.exports = drill;
