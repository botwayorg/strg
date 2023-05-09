import * as shelljs from "shelljs";
import { HOMEDIR } from "./constants";
import { join } from "path";
import { watch } from "fs";

const work = (db: string) => {
  const cmd = () =>
    shelljs
      .cd(join(HOMEDIR, "." + db))
      .exec("git add .")
      .exec(`git commit -m "New Change"`)
      .exec("git pull")
      .exec(`git push -u origin main`)
      .exec(`git push`);

  watch(join(HOMEDIR, "." + db), () => cmd());

  console.log(`Changes Saved`);
};

export const Watch = (db: string) => {
  shelljs.cd(join(HOMEDIR, "." + db)).exec("git pull");

  work(db);
};
