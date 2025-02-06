import {useState} from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {Chart} from "react-google-charts";
import "./ReportsAndGraphs.css";
import ReportTable from "./ReportTable.jsx";

function ReportsAndGraphs({costsDB}) {
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

        if (isAnnualReport && costsDB) {
            const filteredYears = await costsDB.getCostsByYear(year);
            setDataFiltered(filteredYears);
            pieDataFunction(filteredYears);

        } else if (!isAnnualReport && costsDB) {
            const filteredMonths = await costsDB.getCostsByYearAndMonth(year, month);
            setDataFiltered(filteredMonths);
            pieDataFunction(filteredMonths);
        }
    };


    // Process filtered data for the pie chart
    const pieDataFunction = (filteredData) => {
        const aggregatedData = filteredData.reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {category: item.category, sum: 0};
            }
            acc[item.category].sum += item.sum;
            return acc;
        }, {});
        const chartData = [["Category", "Sum"], ...Object.values(aggregatedData)
            .map(({category, sum}) => [category, sum])];
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
                <div className="inputFields">
                    <TextField
                        label="Year"
                        variant="outlined"
                        value={year}
                        type="number"
                        onChange={handleYearChange}
                        fullWidth
                    />
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
            <div className="reportTable">
                <ReportTable props={dataFiltered}/>
            </div>
        </div>
    );
}

export default ReportsAndGraphs;
