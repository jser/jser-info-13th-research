import fs from "node:fs";
import { fetchItems } from "./fetch-items.js";
// 2015年のドメイン別の集計
const year = 2015;
const items = await fetchItems();
const itemsInYear = items.filter((item) => item.date.startsWith(`${year}-`));
const itemsGroupByDomain = Object.groupBy(itemsInYear, (item) => new URL(item.url).hostname);
const itemsGroupByDomainArray = Object.entries(itemsGroupByDomain);
const itemsGroupByDomainArraySorted = itemsGroupByDomainArray.sort((a, b) => b[1].length - a[1].length);
// csv
const csv = itemsGroupByDomainArraySorted.map(([domain, items]) => `${domain},${items.length}`).join("\n");
fs.writeFileSync(`domain-${year}.csv`, csv, "utf8");
// json
const json = JSON.stringify(itemsGroupByDomainArraySorted, null, 2);
fs.writeFileSync(`domain-${year}.json`, json, "utf8");
