// npm excel4node docs
// https://www.npmjs.com/package/excel4node

// Require library
const xl = require('excel4node');

// Create a new instance of a Workbook class
const wb = new xl.Workbook({
  jszip: {
    compression: 'DEFLATE',
  },
  defaultFont: {
    size: 12,
    name: 'Calibri',
    color: 'FFFFFFFF',
  },
});

// Add Worksheets to the workbook
const ws = wb.addWorksheet('Sheet 1');
const ws2 = wb.addWorksheet('Sheet 2');

// Create a reusable style
const style = wb.createStyle({
  font: {
    color: '#FF0800',
    size: 12,
  },
  numberFormat: '$#,##0.00; ($#,##0.00); -',
});

// Set value of cell A1 to 100 as a number type styled with paramaters of style
ws.cell(1, 1).number(100).style(style);

// Set value of cell B1 to 200 as a number type styled with paramaters of style
ws.cell(1, 2).number(200).style(style);

// Set value of cell C1 to a formula styled with paramaters of style
ws.cell(1, 3).formula('A1 + B1').style(style);

// Set value of cell A2 to 'string' styled with paramaters of style
ws.cell(2, 1).string('string').style(style);

// Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
ws.cell(3, 1)
  .bool(true)
  .style(style)
  .style({ font: { size: 14 } });

// Create groupings of rows or columns and optionally state to collapse the grouping
ws.row(6).group(1, true);
ws.row(7).group(1, true);

// Cells
// ws.cell(startRow, startColumn, [[endRow, endColumn], isMerged]);

ws.cell(8, 1).string('my first cell');
ws.cell(9, 1).number(10).style(style);

// Set custom widths and heights of columns/rows
ws.column(3).setWidth(50);
ws.row(1).setHeight(20);

wb.write('Excel.xlsx');
