const { serviceAccount, sheetId } = require("../config.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const { getSheet, listSheets, setLocalData } = require("./sheet");
const { wait } = require("./utils");

const init = async () => {
  const doc = new GoogleSpreadsheet(sheetId);
  await doc.useServiceAccountAuth(serviceAccount);
  await doc.loadInfo();

  const sheets = await listSheets();

  for (const sheetName of sheets) {
    await wait();

    const sheet = doc.sheetsByTitle[sheetName];
    if (sheet) {
      await sheet.delete();
      console.log(`deleted ${sheetName}`);
    }
  }
};

init();
