import * as figlet from "figlet";
import * as shelljs from "shelljs";
import { Command } from "commander";
import { mkdir } from "fs";

const program = new Command();

console.log(figlet.textSync("STRG"));

program
  .description(
    "📦 A persistent storage solution that syncs database files located in a Docker container under your GitHub account"
  )
  .option("-i, --init", "Setup")
  .option("-s, --sync [db]", "Sync Database files")
  .parse(process.argv);

const options = program.opts();

if (options.init) {
  shelljs
    .exec(`git config --global user.name "Botway App"`)
    .exec(
      `git config --global user.email "132448299+botway-app@users.noreply.github.com"`
    )
    .exec(
      `wget https://raw.githubusercontent.com/botwayorg/strg/main/package-core.json -o package.json`
    )
    .exec(
      `wget https://raw.githubusercontent.com/botwayorg/strg/main/turbo.json`
    );

  mkdir("./runner", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Directory 'runner' created successfully!`);

      shelljs.exec(
        "wget https://raw.githubusercontent.com/botwayorg/strg/main/runner/package.json -o ./runner/package.json"
      );

      mkdir("./runner/cmd", (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Directory 'runner/cmd' created successfully!`);

          shelljs.exec(
            "wget https://raw.githubusercontent.com/botwayorg/strg/main/runner/cmd/package.json -o ./runner/cmd/package.json"
          );
        }
      });
    }
  });
}
