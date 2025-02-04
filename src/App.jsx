import './App.css';
import AddItem from './components/AddItem.jsx';
import TableContents from './components/TableContents.jsx';
import { useEffect, useState } from "react";
import CostsDB from "./idb.js";
import ReportsAndGraphs from "./components/ReportsAndGraphs.jsx";

function App() {
    const [costsDB, setCostsDB] = useState(null);
    const [refresh, setRefresh] = useState(false);

    // Initialize the database and set the database instance
    useEffect(() => {
        const initDB = async () => {
            const dbInstance = new CostsDB("ExpensesManagerDB", 1);
            await dbInstance.openDB();
            setCostsDB(dbInstance);
        };
        initDB();
    }, []);

    // Trigger a refresh in the table by toggling the refresh state
    const refreshTable = () => {
        setRefresh((prev) => !prev);
    };

    return (
        <div className="container">
            <div className="tableContents">
                <TableContents costsDB={costsDB} refresh={refresh} />
            </div>
            <div className="addContents">
                <AddItem costsDB={costsDB} onItemAdded={refreshTable} />
            </div>
            <div className="bottomSection">
            <ReportsAndGraphs costsDB={costsDB}/>
            </div>
        </div>
    );
}

export default App;
