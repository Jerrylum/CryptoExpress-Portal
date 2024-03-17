"use server";

import fs from "fs";
import { parse } from "csv-parse";

export async function readCSV<T>(fileName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const parser = parse(fs.readFileSync(fileName), {
      delimiter: ",",
      columns: true,
      skip_empty_lines: true,
    });
    const records: any[] = [];
    parser.on("readable", function () {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
      }
    });
    parser.on("end", function () {
      resolve(records);
    });
  });
}
