const globby = require("globby");
const path = require("path");
const { readJSON, writeJSON } = require("./utils");

const { jsonPath, defaultLanguage, languages } = require("../config.json");

const listSheets = async () => {
  try {
    const files = await globby(`*.json`, {
      cwd: path.join(jsonPath, defaultLanguage),
      absolute: false,
    });
    return files.map((file) => file.replace(".json", ""));
  } catch (e) {
    console.error(e);
  }
  return [];
};

const getSheet = async (doc, title, forceRecreate) => {
  let sheet = doc.sheetsByTitle[title];

  if (sheet && forceRecreate) {
    await sheet.delete();
    sheet = undefined;
  }

  if (sheet) {
    console.log(`sheet ${title} found`);
  } else {
    console.log(`sheet ${title} not found creating one`);
    sheet = await doc.addSheet({ title });

    // update sheet headers
    await sheet.loadCells(`A1:Z1`);
    await setCell(sheet, 0, 0, "key", true);
    for (let i = 0; i < languages.length; i++) {
      await setCell(sheet, 0, i + 1, languages[i], true);
    }

    await sheet.saveUpdatedCells();
  }
  return sheet;
};

const setCell = async (sheet, x, y, value, bold) => {
  const cell = await sheet.getCell(x, y);
  cell.value = value;
  if (bold) {
    cell.textFormat = { bold: true };
  }
};

const getLocalData = (sheetName) => {
  const data = readJSON(sheetName);
  const keys = Object.keys(data[defaultLanguage]);
  const rows = [];

  for (const key of keys) {
    const row = { key };
    for (const language of languages) {
      row[language] = data[language][key] || "";
    }
    rows.push(row);
  }

  return rows;
};

const setLocalData = (sheetName, rows) => {
  const data = languages.reduce(
    (acc, language) => ({ ...acc, [language]: {} }),
    {}
  );

  rows.forEach((row) => {
    for (const language of languages) {
      data[language][row.key] = row[language];
    }
  });

  writeJSON(sheetName, data);
};

module.exports = { getSheet, listSheets, getLocalData, setLocalData };
