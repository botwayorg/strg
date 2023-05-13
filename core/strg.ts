import shelljs from "shelljs";
import { existsSync, mkdir } from "fs";
import { join } from "path";
import { HOMEDIR } from "./constants";
import axios from "axios";

export const CheckDir = async () => {
  const db = process.env.DB!;

  console.log("Checking Directory...");

  const ghu = (
    await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    })
  ).data;

  const repo = shelljs
    .exec(`npx gh-cmd api repos/${ghu.login}/${"." + db}`, { silent: true })
    .toString();

  let check = existsSync(join(HOMEDIR, "." + db));

  shelljs
    .exec(`npx gh-cmd auth setup-git`)
    .exec(`git config --global user.name "${ghu.name}"`)
    .exec(
      `git config --global user.email "${ghu.id}+${ghu.login}@users.noreply.github.com"`
    )
    .exec(`git config --global init.defaultBranch main`)
    .exec(`git config --global pull.ff only`);

  if (!check) {
    if (repo.includes("Not Found")) {
      mkdir(join(HOMEDIR, "." + db), async (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`'~/.${db}' created successfully!`);

          shelljs.exec(`npx gh-cmd repo create ${"." + db} --private`);
          shelljs.exec(
            `npx gh-cmd repo clone ${"." + db} ${join(HOMEDIR, "." + db)}`
          );
          shelljs
            .cd(join(HOMEDIR, "." + db))
            .exec(`git lfs install`)
            .exec("git lfs track *");

          shelljs.rm(".gitattributes");

          console.log(`Created on GitHub `);
        }
      });
    } else {
      shelljs.exec(
        `npx gh-cmd repo clone ${"." + db} ${join(HOMEDIR, "." + db)}`
      );

      shelljs
        .cd(join(HOMEDIR, "." + db))
        .exec(`git lfs install`)
        .exec("git lfs track *");

      shelljs.rm(".gitattributes");

      console.log(`Cloned Successfully 📦`);
    }
  } else {
    shelljs.cd(join(HOMEDIR, "." + db)).exec(`git pull`);

    console.log(`Directory found 👍`);
  }
};
