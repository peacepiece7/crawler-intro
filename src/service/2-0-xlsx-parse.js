const xlsx = require("xlsx");
const xl = require("excel4node");

const path = require("path");
const fs = require("fs");

const dir = path.join("..", "..", "..");

fs.readdir(`${dir}/pdfToExcel.xlsx`, (err) => {
  if (err) {
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet("작업 목록");
    var ws2 = wb.addWorksheet("Sheet 2");

    // Create a reusable style
    var style = wb.createStyle({
      font: {
        color: "#FF0800",
        size: 12,
      },
      numberFormat: "$#,##0.00; ($#,##0.00); -",
    });

    // Set value of cell A1 to 100 as a number type styled with paramaters of style
    ws.cell(1, 1).number(100).style(style);

    // Set value of cell B1 to 200 as a number type styled with paramaters of style
    ws.cell(1, 2).number(200).style(style);

    // Set value of cell C1 to a formula styled with paramaters of style
    ws.cell(1, 3).formula("A1 + B1").style(style);

    // Set value of cell A2 to 'string' styled with paramaters of style
    ws.cell(2, 1).string("string").style(style);

    // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
    ws.cell(3, 1)
      .bool(true)
      .style(style)
      .style({ font: { size: 14 } });

    ws.cell(1, 4).string("제조사들");
    ws.column(3).setWidth(50);
    ws.column(3);
    wb.write("Excel.xlsx");
  }
});
