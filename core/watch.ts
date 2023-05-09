import * as shelljs from "shelljs";
import * as chokidar from "chokidar";
import { HOMEDIR } from "./constants";
import { join } from "path";
import { existsSync } from "fs";
import { CheckDir } from "./strg";

const work = (db: string) => {
  const watcher = chokidar.watch(join(HOMEDIR, "." + db), {
    persistent: true,
  });

  watcher.on("all", () => {
    shelljs
      .cd(join(HOMEDIR, "." + db))
      // .exec("git pull")
      .exec("git add .")
      .exec(`git commit -m "New Change"`)
      .exec(`git push -u origin main`);
  });

  console.log(`Changes Saved`);
};

export const Watch = (db: string) => {
  let check = existsSync(join(HOMEDIR, "." + db));

  if (check) {
    CheckDir(db, false);

    work(db);
  } else {
    CheckDir(db, false);

    work(db);
  }
};
