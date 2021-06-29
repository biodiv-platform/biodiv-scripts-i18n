const flat = require("flat");
const path = require("path");
const fs = require("fs");

const { languages, jsonPath } = require("../config.json");

const wait = async () =>
  await new Promise((resolve) => setTimeout(resolve, 1000));

const readJSON = (sheetName) => {
  const data = {};
  for (const language of languages) {
    const langPath = path.join(jsonPath, language, `${sheetName}.json`);
    data[language] = flat(JSON.parse(fs.readFileSync(langPath, "utf8")));
  }
  return data;
};

const writeJSON = (sheetName, data) => {
  for (const language of languages) {
    const langPath = path.join(jsonPath, language, `${sheetName}.json`);
    fs.writeFileSync(
      langPath,
      JSON.stringify(flat.unflatten(data[language]), null, 2) + "\n"
    );
  }
};

module.exports = { wait, readJSON, writeJSON };
