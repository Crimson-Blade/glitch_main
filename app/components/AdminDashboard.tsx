import { Search, Edit, Delete } from '@mui/icons-material';
import { Button, TextField } from '@mui/material';

const Dashboard = () => {
  return (
    <div className="p-8 min-h-screen bg-cover bg-center bg-repeat" style={{ backgroundImage: 'url(/images/bg3.jpeg)' }}>
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-purple-400 mb-8 text-center font-heading pb-5">Dashboard</h1>
        
        <div className="flex justify-around gap-4 mb-6">
          <Button variant="contained" className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm">
            Add Entry
          </Button>
          <Button variant="contained" className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm">
            Edit Menu
          </Button>
          <Button variant="contained" className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm">
            Edit User
          </Button>
          <div className="flex items-center border-2 border-purple-600 rounded-md bg-transparent overflow-hidden">
            <TextField
              variant="outlined"
              placeholder="Search..."
              className="flex-grow px-2 text-sm"
              InputProps={{
                endAdornment: <Search className="text-purple-600" />,
                style: { color: '#C085FC' }, // Purple text color for the input
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
                "& .MuiInputBase-input": {
                  color: "#C085FC", 
                },
              }}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto pt-10">
          <table className="min-w-full border bg-opacity-40 backdrop-blur-md rounded-md border border-purple-600">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3 border-r border-purple-500 text-center">ID</th>
                <th className="p-3 border-r border-purple-500 text-center">Name</th>
                <th className="p-3 border-r border-purple-500 text-center">Phone No</th>
                <th className="p-3 border-r border-purple-500 text-center">Entry</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className='text-white'>
              <tr>
                <td className="p-3 border-r border-b border-purple-300 text-center">1</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">John Doe</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">(555) 123-4567</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">2024-09-18 17:30</td>
                <td className="p-3 border-r border-b border-purple-300 text-center flex justify-around gap-2">
                  <Button variant="outlined" className="text-purple-500 border-purple-500 hover:bg-purple-100">
                    <Edit />
                  </Button>
                  <Button variant="outlined" className="text-red-500 border-red-500 hover:bg-red-100">
                    <Delete />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="p-3 border-r border-b border-purple-300 text-center">2</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">Jane Smith</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">(555) 987-6543</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">2024-09-17 17:30</td>
                <td className="p-3 border-r border-b border-purple-300 text-center flex justify-around gap-2">
                  <Button variant="outlined" className="text-purple-500 border-purple-500 hover:bg-purple-100">
                    <Edit />
                  </Button>
                  <Button variant="outlined" className="text-red-500 border-red-500 hover:bg-red-100">
                    <Delete />
                  </Button>
                </td>
              </tr>
              <tr>
                <td className="p-3 border-r border-b border-purple-300 text-center">3</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">Alice Johnson</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">(555) 456-7890</td>
                <td className="p-3 border-r border-b border-purple-300 text-center">2024-09-16 17:30</td>
                <td className="p-3 border-r border-b border-purple-300 text-center flex justify-around gap-2">
                  <Button variant="outlined" className="text-purple-500 border-purple-500 hover:bg-purple-100">
                    <Edit />
                  </Button>
                  <Button variant="outlined" className="text-red-500 border-red-500 hover:bg-red-100">
                    <Delete />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
