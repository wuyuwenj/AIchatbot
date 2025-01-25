import React, { useState, useEffect } from "react";

const ItemSelector = () => {
    const [selectedBoard, setSelectedBoard] = useState('');
    const [selectedItem, setSelectedItem] = useState('');
    const [itemOptions, setItemOptions] = useState([]);

    useEffect(() => {
        if (selectedBoard) {
            handleItems();
        }
    }, [selectedBoard]);

    const handleItems = async () => {
        const query = `
            query {
                boards (ids: ${selectedBoard}) {
                    items {
                        id
                        name
                    }
                }
            }
        `;

        try {
            const response = await fetch("https://api.monday.com/v2", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.REACT_APP_MONDAY_API_KEY,
                },
                body: JSON.stringify({ query }),
            });

            const data = await response.json();

            if (data.data.boards.length > 0) {
                const options = data.data.boards[0].items.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setItemOptions(options);
            } else {
                setItemOptions([]);
            }
        } catch (error) {
            console.error("Error fetching items:", error);
            setItemOptions([]);
        }
    };

    const handleItemDropdownChange = (event) => {
        setSelectedItem(event.target.value);
    };

    return (
        <div>
            <select onChange={(e) => setSelectedBoard(e.target.value)} value={selectedBoard}>
                <option value="">Select a Board</option>
                <option value="12345">Board 1</option>
                <option value="67890">Board 2</option>
            </select>

            <select onChange={handleItemDropdownChange} value={selectedItem} disabled={!itemOptions.length}>
                <option value="">Select an Item</option>
                {itemOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ItemSelector;
