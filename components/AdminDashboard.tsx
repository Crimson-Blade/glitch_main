'use client';
import { Search, Edit, Delete, Refresh } from '@mui/icons-material'; // Import Refresh Icon
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation

const Dashboard = () => {
  const [data, setData] = useState([]);

  const fetchData = () => {
    // Fetch data from the backend
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registrations/today/`)
      .then((response) => response.json())
      .then((fetchedData) => {
        if (fetchedData) {
          console.log("Data:", fetchedData);
          setData(fetchedData); // Update state with the fetched data
        } else {
          console.log("Data Not Found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array to only run on mount

  return (
    <div className="p-8 min-h-screen bg-cover bg-center bg-repeat" style={{ backgroundImage: 'url(/images/bg3.jpeg)' }}>
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-purple-400 mb-8 text-center font-heading pb-5">Dashboard</h1>
        
        <div className="flex justify-around gap-4 mb-14">
          <Button variant="contained" className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm">
            Add Entry
          </Button>
          <Button variant="contained" className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm">
            Edit Menu
          </Button>
          <Button variant="contained" className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm">
            Edit User
          </Button>
          {/* Refresh Button */}
       
          <div className="flex items-center border-2 border-purple-600 rounded-md bg-transparent overflow-hidden">
            <TextField
              variant="outlined"
              placeholder="Search..."
              className="flex-grow px-2 text-sm"
              InputProps={{
                endAdornment: <Search className="text-purple-600" />,
                style: { color: '#C085FC' },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "transparent" },
                  "&.Mui-focused fieldset": { borderColor: "transparent" },
                },
                "& .MuiInputBase-input": { color: "#C085FC" },
              }}
            />
          </div>
          
        </div>
        <div className="flex items-center justify-between">
        <label className="flex items-center text-xl text-blue-100">
    <input 
      type="checkbox" 
      className="mr-5 ml-5 transform scale-150 " 
      defaultChecked 
    />
    Show active users
  </label>
  
  <Button
    variant="contained"
    className="bg-blue-500 text-white hover:bg-blue-700 rounded-3xl py-3 px-5 text-sm mr-5"
    onClick={fetchData} // Call fetchData when the button is clicked
    startIcon={<Refresh />}
  >
    Refresh
  </Button>
</div>

        
        <div className="overflow-x-auto pt-10">
          <table className="min-w-full border bg-opacity-40 backdrop-blur-md rounded-md border-purple-600">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3 border-r border-purple-500 text-center">ID</th>
                <th className="p-3 border-r border-purple-500 text-center">Name</th>
                <th className="p-3 border-r border-purple-500 text-center">Phone No</th>
                <th className="p-3 border-r border-purple-500 text-center">Entry</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {data && data.length > 0 ? (
                data.map((entry, index) => (
                  <tr key={entry.user_id}>
                    <td className="p-3 border-r border-b border-purple-300 text-center">{index + 1}</td>
                    <td className="p-3 border-r border-b border-purple-300 text-center">{entry.name}</td>
                    <td className="p-3 border-r border-b border-purple-300 text-center">{entry.phone_number}</td>
                    <td className="p-3 border-r border-b border-purple-300 text-center">
                      {new Date(entry.date).toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-b border-purple-300 text-center flex justify-around gap-2">
                      {/* Use Link instead of useRouter for navigation */}
                      <Link href={`/user/${entry.user_id}`} passHref>
                        <Button variant="outlined" className="text-purple-500 border-purple-500 hover:bg-purple-100">
                          <Edit />
                        </Button>
                      </Link>
                      <Button variant="outlined" className="text-red-500 border-red-500 hover:bg-red-100">
                        <Delete />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;