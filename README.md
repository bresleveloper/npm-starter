

# Bresleveloper Digital Starter

see at npm `https://www.npmjs.com/package/@bresleveloper/starter`


## Commands

`bresleveloper new <projectName>` - dups `https://github.com/bresleveloper/Starter-.NET-4.8-NG-18` and changes all files and dirs to new projectName


`bresleveloper drill <modelName> [optional] -p`
1. Must run inside NG project folder
2. Must have `\models\<my-class>.model.ts` file
3. Run as `bresleveloper drill <my-class>`, without `.model.ts`
4. `-p` for print in terminal only, not creating files, useful in you have not created project template with my template

#### added working drill with local dir
`-l` will search file at local working dir like this `bresleveloper drill -p -l myThing` will search at CWD for `myThing.model.ts`


will create the following:
1. matching `.cs` in `\Models\<className>.cs`  
2. matching web-api-controller in `\Controllers\<className>Controller.cs` as `SimpleController<className>`
3. matching `.sql` in `\Models\scripts\<className>.sql` for `CREATE TABLE` script
4. make the proj props of the .Net to make default page `http://localhost:4200`


## Roadmap (maybe)

1. make it so it adds the new `.cs` to the `.csproj`
2. create a new angular comp with the simple-table and service ect.


### debug

If you want to make cli.js executable directly -> `#!/usr/bin/env node`

To make this tool globally available, you can link it `npm link`

`npm unlink bresleveloper-starter`

`ng g class models/big-item --type=model --skip-tests`


### upload

after git push

npm version patch    # 1.0.2 -> 1.0.3
npm version minor    # 1.0.0 -> 1.1.0
npm version major    # 1.0.0 -> 2.0.0


npm publish --access public
