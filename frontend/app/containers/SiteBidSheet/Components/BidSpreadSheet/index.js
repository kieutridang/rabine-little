import ExcelJS from 'exceljs/dist/es5/exceljs.browser';
import { getBlobFromBlobURL, getBase64FromBlob } from '../../../../utils/files/fileUtils';

const FONT_FAMILY = 'Helvetica Neue Light';

export async function generateXLS(repairs, toggledYears, fileName, siteAddress, clientLogo) {
  const blobLogo = await getBlobFromBlobURL(clientLogo.blobUrl);
  const base64logo = await getBase64FromBlob(blobLogo);

  const wb = new ExcelJS.Workbook();

  // setting spreadsheet general properties
  wb.creator = 'Site Inc.';
  wb.lastModifiedBy = 'Site Inc';
  wb.created = new Date();
  wb.modified = new Date();

  const ws = wb.addWorksheet('Bid Sheet');
  ws.views = [{ showGridLines: false }];

  ws.mergeCells('B8:H9');

  setCellsWidth();

  createInfoCells();

  createTables();

  setImage();

  downloadXLS();

  function setImage() {
    const imageLogo = wb.addImage({
      base64: base64logo,
      extension: 'png',
    });

    ws.addImage(imageLogo, 'B2:D7');
  }

  function createTables() {
    let currentRow = 10; // initial row cursor for repairs

    Object.keys(repairs).forEach((year) => {
      // initialize individual total address array ( will contain all cell which going to be used for the summation formula )
      const individualTotalAddress = [];

      if (toggledYears.includes(year)) {
        // adding repair table headers
        ws.getRow(currentRow - 1).values = ['', `${year} Repairs`];
        ws.getRow(currentRow - 1).font = { bold: true, size: 12, name: FONT_FAMILY };
        const repairsRowHeader = ws.getRow(currentRow);
        // repair header table titles
        repairsRowHeader.values = ['', 'Zone Name', 'Type of Repair', 'Repair Scope', 'QTY', 'Units', 'Unit Price', 'Total'];
        // repair header table styles
        repairsRowHeader.alignment = { horizontal: 'center', wrapText: true };
        repairsRowHeader.font = { bold: true, name: FONT_FAMILY };

        // setting borders to repair table hader
        repairsRowHeader.eachCell({ includeEmpty: false }, (cell, colNumber) => {
          if (cell && colNumber > 1) {
            setCellBorders(cell);
          }
        });
        currentRow += 1; // increments cursor by one
        repairs[year].forEach((repair) => {
          const repairRow = ws.getRow(currentRow);
          repairRow.values = ['', repair.zone, repair.type, repair.title, repair.qty, repair.unit, 0, 0];
          repairRow.alignment = { horizontal: 'center', wrapText: true };
          repairRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            if (cell && colNumber > 1) {
              setCellBorders(cell);
            }
          });
          // getting cell address for unit price repair
          const unitPriceCell = repairRow._cells[repairRow._cells.length - 2]._address;
          // getting cell address for qty repair
          const qtyCell = repairRow._cells[4]._address;
          // getting cell address for total repair
          const cellRef = repairRow._cells[repairRow._cells.length - 1]._address;

          ws.getCell(unitPriceCell).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // eslint-disable-line
          ws.getCell(cellRef).numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // eslint-disable-line

          // adding formula for total repair (qty * unit price)
          ws.getCell(cellRef).value = { formula: `${qtyCell}*${unitPriceCell}`, result: 0 }; //

          individualTotalAddress.push(cellRef); // adding the address of the individual total cell to arr
          currentRow += 1;
        });

        const total$Row = ws.getRow(currentRow);
        total$Row.values = ['', '', '', '', '', '', '$', ''];

        // merging two final cells from the total row
        ws.mergeCells(`${total$Row._cells[total$Row._cells.length - 2]._address}:${total$Row._cells[total$Row._cells.length - 1]._address}`);

        // getting the grand total cell to apply formula;
        const totalGrandCell = ws.getCell(total$Row._cells[total$Row._cells.length - 1]._address);

        // apply formula
        totalGrandCell.value = { formula: individualTotalAddress.join('+'), result: 0 };

        // format grand total cell
        totalGrandCell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00'; // eslint-disable-line

        // total row styles
        total$Row.height = 20;
        total$Row.font = { size: 16, name: FONT_FAMILY };
        total$Row.alignment = { vertical: 'middle' };

        // total row borders addition
        total$Row.eachCell((cell, colNumber) => {
          if (colNumber > 1 && colNumber !== 7 && colNumber !== 8) setCellBorders(cell);
          /* eslint-disable no-param-reassign */
          if (colNumber === 7) cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' } };
          if (colNumber === 8) cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          /* eslint-disable no-param-reassign */
        });

        // move the cursos to start with a new table
        currentRow += 3;
      }
    });
  }

  function createInfoCells() {
    const INFO_KEYS_CELLS = ['F2', 'F3', 'F4', 'F5', 'F6', 'F7'];
    const INFO_VALUES_CELLS = ['G2:H2', 'G3:H3', 'G4:H4', 'G5:H5', 'G6:H6', 'G7:H7'];

    ws.getColumn(6).values = ['', 'Date: ', 'Project Location: ', 'Name of Bidder: ', 'Company Bidding: ', '# of Phases: ', 'Project Duration: '];

    INFO_VALUES_CELLS.forEach((cell) => {
      ws.mergeCells(cell);
      ws.getCell(cell).alignment = { horizontal: 'center', wrapText: true };
      ws.getCell(cell).font = { size: 12, name: FONT_FAMILY };
      if (cell === 'G3:H3') ws.getCell(cell).value = siteAddress;
      setCellBorders(ws.getCell(cell));
    });

    INFO_KEYS_CELLS.forEach((cell) => {
      ws.getCell(cell).alignment = { horizontal: 'right' };
      ws.getCell(cell).font = { size: 12, name: FONT_FAMILY };
      setCellBorders(ws.getCell(cell));
    });
  }

  function downloadXLS() {
    wb.xlsx.writeBuffer()
        .then((buffer) => {
          const blob = new Blob([new Uint8Array(buffer)]);
          const element = document.createElement('a');
          element.setAttribute('href', window.URL.createObjectURL(blob));
          element.setAttribute('download', `${fileName}.xlsx`);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        })
        .catch((err) => console.log(err)); // eslint-disable-line no-console
  }

  function setCellBorders(cell) {
    const currentCell = cell;
    currentCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
  }

  function setCellsWidth() {
    ws.getColumn(1).width = 5;

    ws.getColumn(2).width = 13;
    ws.getColumn(3).width = 18;
    ws.getColumn(4).width = 23;
    ws.getColumn(5).width = 13;
    ws.getColumn(6).width = 23;
    ws.getColumn(7).width = 23;
    ws.getColumn(8).width = 15;
  }
}
