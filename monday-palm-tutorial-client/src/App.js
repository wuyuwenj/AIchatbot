import React, { useState, useEffect } from 'react';  // here we import useState and useEffect hooks from React


function App() {
  const [result, setResult] = useState('');

  const [selectedBoard, setSelectedBoard] = useState('');
  const [boardOptions, setBoardOptions] = useState([]);


    useEffect(() => {
        handleBoards();
    }, [selectedBoard]);
     const handleBoards = () => {
        let query = 'query { boards { id name }}';  // GraphQL query to fetch boards

        fetch("https://api.monday.com/v2", {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'your_api_key' // replace with your actual API key
        },
        body: JSON.stringify({
            'query': query
        })
        })
        .then(res => res.json())
        .then(res => {
            const options = res.data.boards.map(board => ({
            value: board.id,
            label: board.name
            }));
            setBoardOptions(options);  // set board options > [{value: 'board_id', label: 'board_name'}]
        });
    };

    const handleBoardDropdownChange = (event) => {
        setSelectedBoard(event.target.value);
    };

    

    const [selectedItem, setSelectedItem] = useState('');
    const [itemOptions, setItemOptions] = useState([]);

    useEffect(() => {
        handleItems();
    }, [selectedBoard]);

    const handleItems = () => {
        if (selectedBoard) {
        let query = `query {
            boards (ids: ${selectedBoard}) {
            items {
                id
                name
            }
            }
        }`;

        fetch("https://api.monday.com/v2", {
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'your_api_key'
            },
            body: JSON.stringify({
            'query': query
            })
        })
            .then(res => res.json())
            .then(res => {
            const options = res.data.boards[0].items.map(item => ({
                value: item.id,
                label: item.name
            }));
            setItemOptions(options);
            });
        }
    };

    const handleItemDropdownChange = (event) => {
        setSelectedItem(event.target.value);
    };

   const [selectedFile, setSelectedFile] = useState('');
const [fileOptions, setFileOptions] = useState([]);

    useEffect(() => {
        handleFiles();
    }, [selectedBoard && selectedItem]);

    const handleFiles = () => {
        if (selectedBoard && selectedItem) {
        let query = `query {
            boards(ids: ${selectedBoard}) {
            items(ids: ${selectedItem}) {
                column_values {
                id
                title
                text
                }
            }
            }
        }`;

        fetch("https://api.monday.com/v2", {
            method: 'post',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': 'your_api_key'
            },
            body: JSON.stringify({
            'query': query
            })
        })
            .then(res => res.json())
            .then(res => {
            const options = res.data.boards[0].items[0].column_values
                .filter(column => column.id === 'files')
                .map(column => ({
                value: column.id,
                label: column.title,
                source: column.text
                }));
                setFileOptions(options);
            });
        }
    };

    const handleFileDropdownChange = (event) => {
        setSelectedFile(event.target.value);
    };

    const [prompt, setPrompt] = useState('');

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleButtonClick = () => {

        fetch("http://0.0.0.0:8000/get_response", {  // our custom API endpoint. Don't worry we will create it in the next step. You may also declare without host and port numbers for that you need to add proxy in package.json file. Open package.json file and add "proxy": "http://0.0.0.0:8000" after "private": true
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt, selectedFile }),
            })
            .then((response) => {
                if (response.ok) {
                return response.json();
                } else {
                throw new Error("Request failed with status: " + response.status);
                }
            })
            .then((data) => {
                // Handle the API response
                console.log("date:", data);
                // Update the result state
                setResult(data);
            })
            .catch((error) => {
                // Handle any errors
                console.error(error);
        });
    };
    
  
  return (
    <div className="center">
      <header className="bg-gray-100 min-h-screen flex flex-col items-center justify-center text-white"> {/* if you see inside className is we add Tailwind CSS classes */}
        <p className='mb-6 text-xl text-blue-600'>
          <a 
            href='https://monday.com'
            className='text-blue-400 hover:text-blue-300'
            target='_blank'
            rel="noopener noreferrer"
            >monday.com</a>
          {' '}
          AI Assistant
        </p>
        <div className="flex flex-col gap-4">
          <select
                value={selectedBoard}
                onChange={handleBoardDropdownChange}
                className="p-2 bg-white text-gray-800 rounded-md border-2 border-gray-400 outline-none text-sm"
            >
                <option value="">Select a board</option>
                {boardOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            <select
                value={selectedItem}
                onChange={handleItemDropdownChange}
                className="p-2 bg-white text-gray-800 rounded-md border-2 border-gray-400 outline-none text-sm"
            >
                <option value="">Select an item</option>
                {itemOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
                ))}
            </select>
            <select
                value={selectedFile}
                onChange={handleFileDropdownChange}
                className="p-2 bg-white text-gray-800 rounded-md border-2 border-gray-400 outline-none text-sm"
            >
                <option value="">Select a file</option>
                {fileOptions.map(option => (
                <option key={option.value} value={option.value}>
                    {option.source}
                </option>
                ))}
            </select>
            <textarea
                value={prompt}
                onChange={handlePromptChange}
                className="p-2 bg-white text-gray-800 rounded-md border-2 border-gray-400 outline-none text-sm"
                placeholder="Enter your text..."
            ></textarea>

            <button
                onClick={handleButtonClick}
                className="p-2 bg-blue-500 text-white rounded-md text-sm"
            >
                Get Result
            </button>
            <textarea
                value={result}
                readOnly
                className="p-2 bg-gray-100 text-gray-800 rounded-md border-2 border-gray-400 outline-none text-sm"
                placeholder="Result will appear here..."
            ></textarea>
        </div>
      </header>
    </div>
  );
}


export default App;
