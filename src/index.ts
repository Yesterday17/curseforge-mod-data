import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import * as AdmZip from "adm-zip";
import del from "del";
import axios from "axios";
import IPlatform from "./platform/IPlatform";

export interface ModSource {
  name: string;
  type: string;
  url: string;
}

const platforms: Map<string, IPlatform> = new Map();
fs.readdirSync(path.resolve("./dist/platform")).forEach(platform => {
  if (fs.statSync(path.resolve("./dist/platform", platform)).isDirectory()) {
    platforms.set(
      platform,
      require(path.resolve("./dist/platform", platform, "entry.js")).default
    );
  }
});

fs.readdirSync(path.resolve("./mods")).forEach(async mod => {
  const data: ModSource | ModSource[] = require(path.resolve("./mods", mod));

  if (fs.existsSync(`./cache/${mod}`)) {
    await del(`./cache/${mod}`, { force: true });
  }
  fs.mkdirSync(`./cache/${mod}`);

  if (data instanceof Array) {
    // TODO: Multiple types
  } else {
    if (platforms.has(data.type)) {
      axios
        .get(platforms.get(data.type).parse(data), {
          responseType: "stream"
        })
        .then(response => {
          response.data.pipe(fs.createWriteStream(`./cache/${mod}/${mod}.jar`));
        })
        .then(() => {
          // child_process.execSync(`jar xf ./cache/${mod}/${mod}.jar `);
          new AdmZip(`./cache/${mod}/${mod}.jar`);
          // FIXME:
          // .extractAllTo(
          //   "./cache/${mod}/"
          // );
        });
    } else {
      // TODO: platform not found
    }
  }
});
