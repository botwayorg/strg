#! /usr/bin/env node

import * as figlet from "figlet";
import { Command } from "commander";
import { CheckDir } from "./strg";
import { removeSync } from "fs-extra";
import { HOMEDIR } from "./constants";
import { join } from "path";
import { Watch } from "./watch";
import * as shelljs from "shelljs";
import concurrently from "concurrently";

const program = new Command();

program
  .description(
    "📦 A persistent storage solution that syncs database files located in a Docker container under your GitHub account"
  )
  .option("-c, --check", "Check DB Dir")
  .option("-m, --cmd", "Run Database Command")
  .option("-w, --watch", "Watch Database changes")
  .option("-s, --sync", "Sync Database files")
  .option("-r, --remove", "Remove Database files")
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

const options = program.opts();

if (options.check) {
  CheckDir();
}

if (options.remove) {
  removeSync(join(HOMEDIR, "." + options.remove));
}

if (options.cmd) {
  shelljs.exec(process.env.CMD!);
}

if (options.watch) {
  console.log(figlet.textSync("STRG"));

  Watch();
}

if (options.sync) {
  CheckDir().then(async () => {
    const { result } = concurrently(
      ["npm:watch-*", { command: "strg --cmd" }, { command: "strg --watch" }],
      {
        prefix: "strg",
        killOthers: ["failure", "success"],
      }
    );

    result.then(
      () => {},
      (e) => {
        console.log(e);
      }
    );
  });
}
