const { serviceAccount, sheetId } = require("../config.json");
const { GoogleSpreadsheet } = require("google-spreadsheet");

const { getSheet, listSheets, getLocalData } = require("./sheet");
const { wait } = require("./utils");

const init = async () => {
  const doc = new GoogleSpreadsheet(sheetId);
  await doc.useServiceAccountAuth(serviceAccount);
  await doc.loadInfo();

  const sheets = await listSheets();

  for (const sheetName of sheets) {
    await wait();
    const sheet = await getSheet(doc, sheetName, true);
    const localData = getLocalData(sheetName);
    await sheet.addRows(localData);
    console.log(`uploaded ${sheetName}`)
  }

  // console.log(doc.sheetsByTitle["Sheet1"], doc.sheetsByTitle["Sheet2"]);
};

init();
