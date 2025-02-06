import { useState } from "react";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import "./AddItem.css";

function AddItem({ costsDB, onItemAdded }) {
    // State variables for input fields and messages
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Clears a given message after a timeout
    const clearMessageAfterDelay = (setter) => {
        setTimeout(() => setter(null), 3000);
    };

    // Validates user input
    const validateInput = () => {
        if (!category || !description || !price) {
            setErrorMessage("Please fill in all fields");
            clearMessageAfterDelay(setErrorMessage);
            throw new Error("Missing required fields");
        }
    };

    // Handles adding a new cost item
    const handleAddItem = async () => {
        if (!costsDB) {
            console.error("Database is not initialized");
            return;
        }

        const newCostItem = {
            sum: parseFloat(price),
            category: category.toUpperCase(),
            description: description.toLowerCase(),
            date,
        };

        try {
            validateInput();
            await costsDB.addCost(newCostItem);

            // Reset form fields after successful addition
            setCategory("");
            setDescription("");
            setPrice("");
            setDate(new Date().toISOString().split("T")[0]);

            onItemAdded();

            // Display success message
            setSuccessMessage("Item added successfully!");
            clearMessageAfterDelay(setSuccessMessage);
        } catch (error) {
            console.error("Error adding item:", error);
        }
    };

    return (
        <div className="addItemContainer">
            <div className="inputFields">
                <TextField
                    id="category"
                    label="Category"
                    variant="outlined"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <TextField
                    id="description"
                    label="Product Description"
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    id="price"
                    label="Price"
                    variant="outlined"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                    id="date"
                    type="date"
                    variant="outlined"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="buttonContainer">
                <Button variant="contained" endIcon={<AddIcon />} onClick={handleAddItem}>
                    Add Item
                </Button>
            </div>
            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </div>
    );
}

export default AddItem;
