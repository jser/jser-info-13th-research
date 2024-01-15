import fs from "node:fs";
import { fetchItems } from "./fetch-items.js";
// 2015年のGitHubリポジトリ別のアイテム数を集計
const year = 2023
const items = await fetchItems();
const itemsInYear = items.filter((item) => item.date.startsWith(`${year}-`));
const itemsGitHub = itemsInYear.filter((item) => new URL(item.url).hostname === "github.com");
const itemsGroupByGitHubRepo = Object.groupBy(itemsGitHub, (item) => {
    // https://github.com/azu/test/.*
    // => azu/test
    const pattern = /^https:\/\/github.com\/([^/]+\/[^/]+)(\/.*)?/;
    const match = item.url.match(pattern);
    if (!match) {
        throw new Error(`Not Match: ${item.url}`);
    }
    return match[1];
});
const itemsGroupByDomainArray = Object.entries(itemsGroupByGitHubRepo);
const itemsGroupByDomainArraySorted = itemsGroupByDomainArray.sort((a, b) => b[1].length - a[1].length);
// csv
const csv = itemsGroupByDomainArraySorted.map(([domain, items]) => `${domain},${items.length}`).join("\n");
fs.writeFileSync(`github-${year}.csv`, csv, "utf8");
// json
const json = JSON.stringify(itemsGroupByDomainArraySorted, null, 2);
fs.writeFileSync(`github-${year}.json`, json, "utf8");
