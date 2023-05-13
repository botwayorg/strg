import shelljs from "shelljs";
import { HOMEDIR } from "./constants";
import { join } from "path";
import { watch } from "fs";

export const Watch = () => {
  const db = process.env.DB!;

  watch(join(HOMEDIR, "." + db), () => {
    shelljs
      .cd(join(HOMEDIR, "." + db))
      .exec("git add .")
      .exec("git pull", { silent: true });

    const check = shelljs
      .cd(join(HOMEDIR, "." + db))
      .exec("git push --dry-run", { silent: true });

    if (!check.toString().includes("Everything up-to-date")) {
      shelljs
        .cd(join(HOMEDIR, "." + db))
        .exec(`git commit -m "New Change"`, { silent: true })
        .exec(`git push -u origin main`, { silent: true });
    }
  });

  console.log("📦 Syncing");
};
