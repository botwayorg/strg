import * as shelljs from "shelljs";
import { existsSync, mkdir } from "fs";
import { join } from "path";
import { HOMEDIR } from "./constants";
import { Watch } from "./watch";
import axios from "axios";

export const CheckDir = async (db: string) => {
  console.log("Checking Directory...");

  const ghu = (
    await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    })
  ).data;

  const repo = shelljs
    .exec(`npx gh-cmd api repos/${ghu.login}/${"." + db}`)
    .toString();

  let check = existsSync(join(HOMEDIR, "." + db));

  shelljs
    .exec(`git config --global user.name "${ghu.name}"`)
    .exec(
      `git config --global user.email "${ghu.id}+${ghu.login}@users.noreply.github.com"`
    )
    .exec(
      `git config --global init.defaultBranch main`
    );

  if (!check) {
    if (repo.includes("Not Found")) {
      mkdir(join(HOMEDIR, "." + db), async (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Directory '~/.${db}' created successfully!`);

          shelljs
            .cd(join(HOMEDIR, "." + db))
            .exec("git init");

          shelljs.exec(
            `npx gh-cmd repo create ${"." + db} --private --source ${join(
              HOMEDIR,
              "." + db
            )}`
          );

          console.log(`Created on GitHub`);

          Watch(db);
        }
      });
    } else {
      shelljs.exec(
        `npx gh-cmd repo clone ${"." + db} ${join(
          HOMEDIR,
          "." + db
        )}`
      );

      console.log(`Cloned Successfully`);

      Watch(db);
    }
  } else {
    console.log(`Directory found`);

    Watch(db);
  }
};
