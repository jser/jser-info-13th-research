export const fetchItems = () => {
    return fetch("https://jser.info/source-data/items.json")
        .then((res) => {
            if (!res.ok) {
                return Promise.reject(new Error(`items.json: ${res.statusText}`));
            }
            return res;
        })
        .then((res) => res.json());
};
