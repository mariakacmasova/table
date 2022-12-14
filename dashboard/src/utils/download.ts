import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function downloadCSV(id: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv' });
  saveAs(blob, `${id}.csv`);
}

export function downloadJSON(name: string, json: string) {
  const blob = new Blob([json], { type: 'application/json' });
  saveAs(blob, `${name}.json`);
}

export function downloadDataListAsZip(idDataList: Array<{ id: string; data: $TSFixMe[] }>) {
  const zip = new JSZip();
  idDataList.forEach(({ id, data }) => {
    zip.file(`${id}.csv`, makeCSV(data));
  });
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, 'dashboard_data.zip');
  });
}

export function makeCSV(data: $TSFixMe | $TSFixMe[]) {
  if (!Array.isArray(data) || data.length === 0) {
    // Not dealing with object-typed data for now
    return '';
  }

  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  data.forEach((row) => {
    const values = Object.values(row).join(',');
    csvRows.push(values);
  });

  return csvRows.join('\n');
}
