const idb = {
    async openCostsDB(dbName, version) {
        const costsDB = new CostsDB(dbName, version);
        await costsDB.openDB();
        return costsDB;
    }
};

class CostsDB {
    constructor(dbName, version) {
        this.dbName = dbName;
        this.version = version;
        this.db = null;
    }

    // Opens a connection to the IndexedDB database
    async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this);
            };

            // Creates the 'costs' object store if it's the first time opening the database
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("costs")) {
                    const store = db.createObjectStore("costs", {
                        keyPath: "id",
                        autoIncrement: true,
                    });
                    store.createIndex("itemID", "id", { unique: false });
                    store.createIndex("category", "category", { unique: false });
                }
            };
        });
    }

    // Adds a new cost item to the database
    async addCost(costItem) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readwrite");
            const store = transaction.objectStore("costs");
            const request = store.add({
                sum: costItem.sum,
                category: costItem.category,
                description: costItem.description,
                date: costItem.date || new Date(),
            });

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    // Retrieves all cost items from the database
    async getAllCosts() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readonly");
            const store = transaction.objectStore("costs");
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Deletes a specific cost item from the database using its ID
    async deleteCost(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readwrite");
            const store = transaction.objectStore("costs");
            const request = store.delete(id);

            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
    // Filter costs by year
    async getCostsByYear(year) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readonly");
            const store = transaction.objectStore("costs");
            const request = store.getAll();

            request.onsuccess = () => {
                const filteredData = request.result.filter((cost) => cost.date.startsWith(year));
                resolve(filteredData);
            };
            request.onerror = () => reject(request.error);
        });
    }
    // Filter costs by year and month
    async getCostsByYearAndMonth(year, month) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(["costs"], "readonly");
            const store = transaction.objectStore("costs");
            const request = store.getAll();

            request.onsuccess = () => {
                const filteredData = request.result.filter((cost) =>
                    cost.date.startsWith(`${year}-${month}`)
                );
                resolve(filteredData);
            };
            request.onerror = () => reject(request.error);
        });
    }
}

// Make idb available globally for vanilla JS
window.idb = idb;