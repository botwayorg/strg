import shelljs from "shelljs";
import { existsSync, mkdir } from "fs";
import axios from "axios";
import { join } from "path";
import { exit } from "process";

export const CheckDir = async () => {
  console.log("Checking Directory...");

  const ghu = (
    await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
    })
  ).data;

  if (!ghu) {
    console.error("No User");

    exit(0);
  }

  const repo = shelljs
    .exec(
      `npx gh-cmd api repos/${ghu.login}/${process.env
        .SG_DIR!.split("/")
        .join("_")}`,
      { silent: true }
    )
    .toString();

  let check = existsSync(process.env.SG_DIR!);

  shelljs
    .exec(`npx gh-cmd auth setup-git`)
    .exec(`git config --global user.name "${ghu.name}"`)
    .exec(
      `git config --global user.email "${ghu.id}+${ghu.login}@users.noreply.github.com"`
    )
    .exec(`git config --global init.defaultBranch main`)
    .exec(`git config --global pull.ff only`);

  if (repo.includes("Not Found")) {
    shelljs.exec(
      `npx gh-cmd repo create ${process.env
        .SG_DIR!.split("/")
        .join("_")} --private`
    );
  }

  if (!check) {
    if (repo.includes("Not Found")) {
      mkdir(process.env.SG_DIR!, async (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`'${process.env.SG_DIR!}' created successfully!`);

          shelljs.exec(
            `npx gh-cmd repo clone ${process.env
              .SG_DIR!.split("/")
              .join("_")} ${process.env.SG_DIR!}`
          );

          shelljs
            .cd(process.env.SG_DIR!)
            .exec(`git lfs install`)
            .exec("git lfs track *");

          shelljs.rm(".gitattributes");

          console.log(`Created on GitHub `);
        }
      });
    } else {
      shelljs.exec(
        `npx gh-cmd repo clone ${process.env
          .SG_DIR!.split("/")
          .join("_")} ${process.env.SG_DIR!}`
      );

      shelljs
        .cd(process.env.SG_DIR!)
        .exec(`git lfs install`)
        .exec("git lfs track *");

      shelljs.rm(".gitattributes");

      console.log(`Cloned Successfully 📦`);
    }
  } else {
    if (!existsSync(join(process.env.SG_DIR!, ".git"))) {
      shelljs.cd(process.env.SG_DIR!).exec("rm -rf *");

      shelljs.exec(
        `npx gh-cmd repo clone ${process.env
          .SG_DIR!.split("/")
          .join("_")} ${process.env.SG_DIR!}`
      );

      shelljs
        .cd(process.env.SG_DIR!)
        .exec(`git lfs install`)
        .exec("git lfs track *");

      shelljs.rm(".gitattributes");
    }

    shelljs.cd(process.env.SG_DIR!).exec(`git pull`);

    console.log(`Directory found 👍`);
  }
};
