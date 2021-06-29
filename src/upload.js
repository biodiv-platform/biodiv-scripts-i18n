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

    let update = false;

    const sheet = await getSheet(doc, sheetName);

    const sheetRows = await sheet.getRows();
    const sheetKeys = sheetRows.map((row) => row.key);

    const localRows = getLocalData(sheetName);
    const localKeys = localRows.map((row) => row.key);

    // check for new rows
    let newRows = [];
    localRows.forEach((localRow) => {
      if (!sheetKeys.includes(localRow.key)) {
        update = true;
        newRows.push(localRow);
        console.log(`adding row ${sheetName} -> ${localRow.key}`);
      }
    });
    await sheet.addRows(newRows);

    // check for deleted ones
    await sheetRows.forEach(async (sheetRow) => {
      if (!localKeys.includes(sheetRow.key)) {
        update = true;
        sheetRow.delete();
        await wait();
        console.log(`deleting row ${sheetName} -> ${sheetRow.key}`);
      }
    });

    if (update) {
      console.log(`partial updated ${sheetName}`);
    }
  }
};

init();
