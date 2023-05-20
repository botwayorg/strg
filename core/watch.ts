import shelljs from "shelljs";
import { watch } from "fs";

export const Watch = () => {
  watch(process.env.SG_DIR!, () => {
    shelljs
      .cd(process.env.SG_DIR!)
      .exec("git add .")
      .exec("git pull", { silent: true });

    const check = shelljs
      .cd(process.env.SG_DIR!)
      .exec("git push --dry-run", { silent: true });

    if (!check.toString().includes("Everything up-to-date")) {
      shelljs
        .cd(process.env.SG_DIR!)
        .exec(`git commit -m "New Change"`, { silent: true })
        .exec(`git push -u origin main`, { silent: true });
    }
  });

  console.log(`📦 Syncing [Watching '${process.env.SG_DIR!}']`);
};
