import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Creates a structured row data object
function createData(category, sum, details) {
    return {
        category,
        sum,
        details
    };
}

// Aggregates expenses by category and formats them for display
function createReportTable(props) {
    const aggregatedData = props.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = { category: item.category, sum: 0, objectArray: [] };
        }
        acc[item.category].sum += item.sum;
        acc[item.category].objectArray.push(item);
        return acc;
    }, {});

    return Object.keys(aggregatedData).map(category => {
        const categoryData = aggregatedData[category];
        return createData(categoryData.category, categoryData.sum, categoryData.objectArray);
    });
}

// Represents a single row in the report table with collapsible transaction details
function Row({row}) {
    const [open, setOpen] = React.useState(false);
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.category}
                </TableCell>
                <TableCell align="right">{row.sum}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Details
                            </Typography>
                            <Table size="small" aria-label="details">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.details.map((detailRow, index) => (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {detailRow.description}
                                            </TableCell>
                                            <TableCell align="right">{detailRow.sum}</TableCell>
                                            <TableCell align="right">{detailRow.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        category: PropTypes.string.isRequired,
        sum: PropTypes.number.isRequired,
        details: PropTypes.arrayOf(
            PropTypes.shape({
                description: PropTypes.string.isRequired,
                sum : PropTypes.number.isRequired,
                date: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
};


export default function CollapsibleTable({props}) {
    const rows = createReportTable(props);
    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TableContainer
                component={Paper}
                sx={{
                    width: '60%',
                    minWidth: '400px'
                }}
            >
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Sum</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <Row key={row.category} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

