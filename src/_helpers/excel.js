// excel.js

import * as XLSX from 'xlsx';

/**
 * Export data to an Excel file.
 * @param {Array} data - Array of data to be exported.
 * @param {string} filename - Name of the Excel file.
 */
export function exportExcel(data, filename) {
  // Create a new workbook and add a worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Checkups');

  // Write the workbook to a binary Excel file
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  // Convert the binary Excel data to a Blob
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  // Create a download link and trigger a click event to download the file
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename + '.xlsx';
  link.click();
}


/**
 * Convert a string to an ArrayBuffer.
 * @param {string} s - Input string.
 * @returns {ArrayBuffer} - ArrayBuffer containing the string data.
 */
function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}
