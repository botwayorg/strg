#! /usr/bin/env node

import * as figlet from "figlet";
import { Command } from "commander";
import { Init } from "./init";
import { Watch } from "./watch";

const program = new Command();

console.log(figlet.textSync("STRG"));

program
  .description(
    "📦 A persistent storage solution that syncs database files located in a Docker container under your GitHub account"
  )
  .option("-i, --init", "Setup")
  .option("-s, --sync [db]", "Sync Database files")
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

const options = program.opts();

if (options.init) {
  Init();
}

if (options.sync) {
  Watch(options.sync);
}
