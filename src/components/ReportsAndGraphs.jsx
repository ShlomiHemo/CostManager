import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Chart } from "react-google-charts";
import "./ReportsAndGraphs.css";
import ReportTable from "./ReportTable.jsx";

function ReportsAndGraphs({ costsDB }) {
    // State for toggling between annual and monthly reports
    const [isAnnualReport, setIsAnnualReport] = useState(true);

    // State for year, month, chart data, filtered data, and alert messages
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("01");
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [dataFiltered, setDataFiltered] = useState([]);

    // Toggle between annual and monthly report types
    const toggleReportType = () => {
        setIsAnnualReport((prevState) => !prevState);
        setYear("");
        setMonth("01");
        setData([]);
        setDataFiltered([]);
    };

    // Update year input
    const handleYearChange = (event) => setYear(event.target.value);

    // Update month input
    const handleMonthChange = (event) => setMonth(event.target.value);

    // List of months for selection
    const months = {
        January: "01",
        February: "02",
        March: "03",
        April: "04",
        May: "05",
        June: "06",
        July: "07",
        August: "08",
        September: "09",
        October: "10",
        November: "11",
        December: "12",
    };

    // Handle generating and displaying the report
    const handleShowReportButton = async () => {
        if (!year) {
            setErrorMessage("Please fill year field!");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }
        if (isAnnualReport) {
            const filteredYears = await handleFilterByYears();
            setDataFiltered(filteredYears);
            pieDataFunction(filteredYears);
        } else {
            const filteredMonths = await handleFilterByMonths();
            setDataFiltered(filteredMonths);
            pieDataFunction(filteredMonths);
        }
    };

    // Fetch and filter data by year
    const handleFilterByYears = async () => {
        if (!costsDB) {
            console.error("Database is not initialized");
            return [];
        }
        const dataFilterByYear = await costsDB.getAllCosts();
        return dataFilterByYear.filter((cost) => cost.date.substring(0,4) === year);
    };

    // Fetch and filter data by month within the selected year
    const handleFilterByMonths = async () => {
        const filteredYears = await handleFilterByYears();
        return filteredYears.filter((cost) => cost.date.substring(5, 7) === month);
    };

    // Process filtered data for the pie chart
    const pieDataFunction = (filteredData) => {
        const aggregatedData = filteredData.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = { category: item.category, sum: 0 };
            }
            acc[item.category].sum += item.sum;
            return acc;
        }, {});
        const chartData = [["Category", "Sum"], ...Object.values(aggregatedData).map(({ category, sum }) => [category, sum])];

        setData(chartData);
    };

    const chartOptions = {
        is3D: true,
    };

    return (
        <div className="reportsContainer">
            <div className="form">
                <div className="showReportbutton">
                    <Button color="primary" onClick={toggleReportType}>
                        {isAnnualReport ? "Switch To Monthly Report" : "Switch To Annual Report"}
                    </Button>
                </div>

                {/* Input fields for year and optional month selection */}
                <div className="inputFields">
                    <TextField
                        label="Year"
                        variant="outlined"
                        value={year}
                        type="number"
                        onChange={handleYearChange}
                        fullWidth
                    />

                    {/* Show month selection only when in monthly report mode */}
                    {!isAnnualReport && (
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Month</InputLabel>
                            <Select
                                label="Month"
                                value={month}
                                onChange={handleMonthChange}
                                labelId="month-select-label"
                                variant="outlined">
                                {Object.keys(months).map((monthName, index) => (
                                    <MenuItem key={index} value={months[monthName]}>
                                        {monthName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </div>
                <div>
                    <Button variant="contained" onClick={handleShowReportButton}>
                        Show Report
                    </Button>
                </div>
                <div>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                </div>
            </div>

            {/* Display the pie chart if data is available */}
            {data.length >= 1 && (
                <div className="chartContainer">
                    <Chart
                        chartType="PieChart"
                        data={data}
                        options={chartOptions}
                        width={"587px"}
                        height={"400px"}
                    />
                </div>
            )}

            {/* Display the report table with filtered data */}
            <div className="reportTable">
                <ReportTable props={dataFiltered} />
            </div>
        </div>
    );
}

export default ReportsAndGraphs;
