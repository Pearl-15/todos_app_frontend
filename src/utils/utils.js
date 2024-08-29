import { message } from "antd";

export const handleExportData = (data, fileName) => {
    let csv_data = convertObjectsToCSV({data});
    if(!csv_data){
        message.error("no data find")
        return
    }
    let csvContent = "data:text/csv;charset=utf-8;base64," + utf8_to_b64(csv_data)
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName+".csv" || "my_data.csv");
    document.body.appendChild(link);

    link.click();
}


/**
 * Convert Object List to Array List
 *
 * @export convertObjectsToCSV
 * @param {objects} args
 * @return {array}
 */
export function convertObjectsToCSV(args) {
    let result;
    let ctr;
    let keys;
  
    const data = args.data || null;
    if (data == null || !data.length) {
      return null;
    }
  
    const columnDelimiter = args.columnDelimiter || ",";
    const lineDelimiter = args.lineDelimiter || "\n";
  
    if (!keys) {
      keys = new Set();
      data.forEach((row) => {
        Object.keys(row).forEach((key) => {
          keys.add(key);
        });
      });
      keys = [...keys];
    }
  
    console.log("keys", keys);
  
    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
  
    data.forEach(function (item) {
      ctr = 0;
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter;
  
        // console.log("key type", typeof item[key]);
        // result += JSON.stringify(item[key]);
        if (Array.isArray(item[key])) {
          console.log("key is array ", key);
          result += item[key]
            .map((it) => "\"" + JSON.stringify(it) + "\"")
            .join("|");
        } else if (typeof item[key] === "object") {
          if (key !== "public_db") {
            result += "\"" + JSON.stringify(item[key]) + "\"";
          }
        } else {
          result += item[key];
        }
  
        ctr++;
      });
      result += lineDelimiter;
    });
  
    return result;
  }

function utf8_to_b64( str ) {
return window.btoa(unescape(encodeURIComponent(str)));
}