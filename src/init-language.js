const globby = require("globby");
const path = require("path");
const { jsonPath, languages, defaultLanguage } = require("../config.json");
const mkdirp = require("mkdirp");
const fs = require("fs");

const init = async () => {
  const files = await globby(`*.json`, {
    cwd: path.join(jsonPath, defaultLanguage),
    absolute: false,
  });

  await Promise.all(
    languages.map(async (lang) => {
      // create directory if not exist
      const cwd = path.join(jsonPath, lang);
      await mkdirp(cwd);

      const jsons = await globby(`*.json`, { cwd, absolute: false });

      const emptyFiles = files.filter((file) => !jsons.includes(file));

      for (const emptyFile of emptyFiles) {
        const fp = path.join(cwd, emptyFile);
        console.info(`created empty ${fp}`);
        fs.writeFileSync(fp, "{}\n");
      }

      // create empty file if not exist
    })
  );
};

init();
