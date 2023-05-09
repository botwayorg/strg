import * as shelljs from "shelljs";
import { mkdir } from "fs";

export const Init = () => {
  shelljs
    .exec(
      `wget https://raw.githubusercontent.com/botwayorg/strg/main/runner/package-core.json -O package.json`
    )
    .exec(
      `wget https://raw.githubusercontent.com/botwayorg/strg/main/turbo-file.json -O turbo.json`
    );

  mkdir("./runner", (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Directory 'runner' created successfully!`);

      shelljs.exec(
        "wget https://raw.githubusercontent.com/botwayorg/strg/main/runner/package.json -O ./runner/package.json"
      );

      mkdir("./runner/cmd", (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Directory 'runner/cmd' created successfully!`);

          shelljs.exec(
            "wget https://raw.githubusercontent.com/botwayorg/strg/main/runner/cmd/package.json -O ./runner/cmd/package.json"
          );
        }
      });
    }
  });
};
