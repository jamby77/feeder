import { Feed } from "@/types";

function wrapCsvValue(
  value?: string,
  wrapper = '"',
  escapeCharacterSet: string[] = ['"', "\r", "\n", "\r\n", ",", " "],
) {
  if (!value) {
    return `${wrapper}${wrapper}`;
  }
  const shouldWrap = escapeCharacterSet.reduce((acc, char) => {
    return acc || value.includes(char);
  }, false);
  if (shouldWrap) {
    return `${wrapper}${value}${wrapper}`;
  }
  if (!value.includes(wrapper)) {
    return value;
  }
  return wrapper + value + wrapper;
}
export function buildCsvExport(
  data: Record<string, string>[],
  headers: string[],
  headersMap?: { [key: string]: string },
  wrapper = '"',
  delimiter = ",",
  lineSeparator = "\n",
) {
  const csvHeaders = headers.map(h => wrapCsvValue(h, wrapper)).join(delimiter);
  const csv = data.map(row => {
    const rowData = headers.map(h => {
      const key = headersMap ? headersMap[h] : h;
      return row[key] ?? "";
    });
    return rowData.map(h => wrapCsvValue(h, wrapper)).join(delimiter);
  });
  return csvHeaders + lineSeparator + csv.join(lineSeparator);
}

export function buildFeedsExportCSV(feeds: Feed[]) {
  const csvHeaders = ["Title", "Feed URL", "Web URL", "Categories"];
  const csvHeadersMap = {
    Title: "title",
    "Feed URL": "xmlUrl",
    "Web URL": "htmlUrl",
    Categories: "categories",
  };

  const csvData = feeds.map(({ categories, htmlUrl = "", title, xmlUrl }) => {
    return {
      title,
      xmlUrl,
      htmlUrl,
      categories: categories ? categories.join(",") : "",
    };
  });
  return buildCsvExport(csvData, csvHeaders, csvHeadersMap);
}
