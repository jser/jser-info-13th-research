
// 2018年から2023年までのトップ10を集計
import fs from "node:fs";
import { fetchItems } from "./fetch-items.js";

const years = [2018, 2019, 2020, 2021, 2022, 2023];
const items = await fetchItems();
const itemsFiltered = items.filter((item) => years.includes(Number(item.date.slice(0, 4))));
const itemsGroupByYear = Object.groupBy(itemsFiltered, (item) => item.date.slice(0, 4));
const itemsGroupByYearArray = Object.entries(itemsGroupByYear);
const itemsGroupByYearArraySorted = itemsGroupByYearArray.sort((a, b) => Number(a[0]) - Number(b[0]));

const itemsGroupByYearArraySortedTop10 = itemsGroupByYearArraySorted.map(([year, items]) => {
        
        const itemsGroupByDomain = Object.groupBy(items, (item) => new URL(item.url).hostname);
        const itemsGroupByDomainArray = Object.entries(itemsGroupByDomain);
        const itemsGroupByDomainArraySorted = itemsGroupByDomainArray.sort((a, b) => b[1].length - a[1].length);
        const itemsGroupByDomainArraySortedTop10 = itemsGroupByDomainArraySorted.slice(0, 10);
        return [year, itemsGroupByDomainArraySortedTop10];
    }
);
// add rank
const itemsGroupByYearArraySortedTop10WithRank = itemsGroupByYearArraySortedTop10.map(([year, items]) => {
        const itemsWithRank = items.map(([domain, items], index) => {
            return [index + 1, domain, items.length];
        });
        return [year, itemsWithRank];
    }
);
// csv
const csv = itemsGroupByYearArraySortedTop10WithRank.map(([year, items]) => {
        const csv = items.map(([rank, domain, count]) => {
            return `${year},${rank},${domain},${count}`;
        });
        return csv.join("\n");
    }
).join("\n");

fs.writeFileSync("top-7--2018-2023.csv", csv);
// json
const json = JSON.stringify(itemsGroupByYearArraySortedTop10WithRank, null, 4);
fs.writeFileSync("top-7--2018-2023.json", json);
