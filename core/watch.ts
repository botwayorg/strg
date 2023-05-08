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

  const watch = () => {
    shelljs
      .cd(join(HOMEDIR, "." + db))
      .exec("git add .")
      .exec(`git commit -m "New Change"`)
      .exec(`git push -u origin main`);
  };

  watcher.on("add", () => {
    watch();
  });

  watcher.on("addDir", () => {
    watch();
  });

  watcher.on("change", () => {
    watch();
  });

  watcher.on("unlink", () => {
    watch();
  });

  watcher.on("unlinkDir", () => {
    watch();
  });

  console.log(`Changes Saved`);
};

export const Watch = (db: string) => {
  let check = existsSync(join(HOMEDIR, "." + db));

  if (check) {
    work(db);
  } else {
    CheckDir(db);

    work(db);
  }
};
