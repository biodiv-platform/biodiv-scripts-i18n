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
    const sheet = await getSheet(doc, sheetName);

    const rows = await sheet.getRows();
    await setLocalData(sheetName, rows);

    console.log(`downloaded ${sheetName}`);
  }
};

init();
