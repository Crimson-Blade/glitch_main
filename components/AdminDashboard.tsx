"use client";
import {
  Search,
  Edit,
  Delete,
  Refresh,
  PlusOne,
  SportsEsports,
  Fastfood,
  Add,
  Remove,
} from "@mui/icons-material";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  ButtonBase,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for navigation
import { set } from "date-fns";

// Define the type for the registration data
interface Registration {
  user_id: string;
  name: string;
  phone_number: string;
  date: string; // Date is typically returned as a string from APIs
}
type FoodCategories = {
  [key: string]: string[];
};

const foodCategories: FoodCategories = {
  Maggi: ["Classic", "Masala", "Cheese", "Vegetable", "Peanut"],
  Fries: [
    "Classic Fries",
    "Cheese Fries",
    "Spicy Fries",
    "Sweet Fries",
    "Loaded Fries",
  ],
  Pasta: ["Spaghetti", "Penne", "Fusilli", "Mac and Cheese"],
  Beverages: ["Water", "Juice", "Lemonade", "Tea", "Coffee"],
  Mojito: ["Mint Mojito", "Strawberry Mojito", "Classic Mojito"],
  SoftDrinks: ["Coke", "Sprite", "Fanta", "Pepsi"],
  Snacks: ["Chips", "Nachos"],
  Milkshakes: ["Chocolate", "Vanilla", "Strawberry"],
  Sandwich: ["Veg Sandwich", "Club Sandwich"],
};

const Dashboard = () => {
  // Define the state with the Registration[] type
  const [data, setData] = useState<Registration[]>([]);
  const [open, setOpen] = useState(false); // Modal visibility
  const [currentUser, setCurrentUser] = useState<Registration | null>(null); // Current user for the modal
  const [foodQuantities, setFoodQuantities] = useState<{
    [key: string]: number;
  }>({}); // Track food item quantities
  const [foodToastOpen, setFoodToastOpen] = useState(false); // Food Toast visibility
  const [endToastOpen, setEndToastOpen] = useState(false); // End Toast visibility
  const [loading, setLoading] = useState(false); // Add loading state
  const [onlyActive, setOnlyActive] = useState(true); // Add state for active users
  const [error, setError] = useState("An Error has Occured"); // Add error state
  const [errorToastOpen, setErrorToastOpen] = useState(false); // Error Toast visibility


  const fetchData = () => {
    // Fetch data from the backend
    setLoading(true); // Set loading to true
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/registrations/today/?onlyActive=${onlyActive}`;
    
    fetch(url)
      .then((response) => response.json())
      .then((fetchedData: Registration[]) => {
        if (fetchedData) {
          console.log("Data:", fetchedData);
          setData(fetchedData); // Update state with the fetched data
        } else {
          console.log("Data Not Found");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setLoading(false); // Set loading to false
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts
  }, []); // Empty dependency array to only run on mount

  const handleFastfoodClick = (user: Registration) => {
    setCurrentUser(user); // Set the current user for the modal
    setFoodQuantities({}); // Reset quantities when opening the modal
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
    setCurrentUser(null); // Reset current user
  };

  const handleQuantityChange = (item: string, change: number) => {
    setFoodQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[item] || 0;
      const newQuantity = Math.max(currentQuantity + change, 0); // Ensure quantity does not go below 0
  
      // Return new state with only positive quantities
      if (newQuantity > 0) {
        return { ...prevQuantities, [item]: newQuantity };
      } else {
        const { [item]: _, ...rest } = prevQuantities;
        return rest;
      }
    });
  };

  const handleOrder = async (userId: string) => {
    const orderedItems = Object.entries(foodQuantities).map(([item, quantity]) => ({
      item_name: item,
      quantity,
      // price: getPriceForItem(item), // Assumes a function to get the price of each item
      price: 0,
    }));
  
    console.log("Ordered Items:", orderedItems); // Log ordered items to console
  
    try {
      for (const order of orderedItems) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${userId}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        });
  
        if (!response.ok) {
          throw new Error(`Failed to place order for item: ${order.item_name}`);
        }
  
        const data = await response.json();
        console.log('Order Success:', data); // Log success for each item
      }
  
      setOpen(false); // Close the modal
      setFoodToastOpen(true); // Show toast notification
    } catch (error:any) {
      console.error('Order Error:', error.message);
      setError(error.message); // Set error state
      setErrorToastOpen(true); // Show error toast
    }
  };

  const handleEndSession = async (uuid: string) => {
    try {
      // Finalize bill
      const finalizeResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/billing/${uuid}/finalize/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!finalizeResponse.ok) {
        throw new Error(`Finalize request failed with status: ${finalizeResponse.status}`);
      }
  
      const finalizeData = await finalizeResponse.json();
      console.log('Finalized bill Successfully:', finalizeData);
  
      // Close the session (only runs if the above succeeds)
      const endSessionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${uuid}/end/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (!endSessionResponse.ok) {
        throw new Error(`End session request failed with status: ${endSessionResponse.status}`);
      }
  
      const endSessionData = await endSessionResponse.json();
      console.log('Ended Session Succesfully:', endSessionData);
      setEndToastOpen(true); // Show success toast
      fetchData(); // Fetch data after ending session
    } catch (error: any) {
      console.error('Error:', error.message);
      setError(error.message); // Set error state
      setErrorToastOpen(true); // Show error toast
    }
  };
  

  function handleStartSession(uuid:string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div
      className="p-8 min-h-screen bg-cover bg-center bg-repeat"
      style={{ backgroundImage: "url(/images/bg3.jpeg)" }}
    >
      <div className="container mx-auto">
        <h1 className="text-5xl font-bold text-purple-400 mb-8 text-center font-heading pb-5">
          Dashboard
        </h1>

        <div className="flex justify-around gap-4 mb-14">
          <Link href="/" className="flex items-center cursor-pointer bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm rounded-md" passHref>
            <Button
            startIcon={<PlusOne />}
            className="text-white"
            >
              ADD ENTRY
            </Button>
          </Link>
          
          {/* <Link href="/" className="flex items-center cursor-pointer bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm rounded-md" passHref>
            <ButtonBase
            >
              EDIT MENU
            </ButtonBase>
          </Link> */}
          {/* <Button
            variant="contained"
            className="bg-purple-600 text-white hover:bg-purple-700 py-1.5 px-4 text-sm"
          >
            Edit User
          </Button> */}

          {/* Refresh Button */}
          <div className="flex items-center border-2 border-purple-600 rounded-md bg-transparent overflow-hidden">
            <TextField
              variant="outlined"
              placeholder="Search..."
              className="flex-grow px-2 text-sm"
              InputProps={{
                endAdornment: <Search className="text-purple-600" />,
                style: { color: "#C085FC" },
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
              onChange={(e) => setOnlyActive(e.target.checked)}
            />
            Show active users
          </label>

          <Button
            variant="contained"
            className="bg-blue-500 text-white hover:bg-blue-700 rounded-3xl py-3 px-5 text-sm mr-5"
            onClick={fetchData}
            disabled={loading} // Disable button while loading
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Refresh />} // Show spinner or refresh icon
          >
            Refresh
          </Button>
        </div>

        <div className="overflow-x-auto pt-10">
          <table className="min-w-full border bg-opacity-40 backdrop-blur-md rounded-md border-purple-600">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="p-3 border-r border-purple-500 text-center">
                  ID
                </th>
                <th className="p-3 border-r border-purple-500 text-center">
                  Name
                </th>
                <th className="p-3 border-r border-purple-500 text-center">
                  Phone No
                </th>
                <th className="p-3 border-r border-purple-500 text-center">
                  Entry
                </th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-white">
              {data && data.length > 0 ? (
                data.map((entry, index) => (
                  <tr key={entry.user_id}>
                    <td className="p-3 border-r border-b border-purple-300 text-center">
                      {index + 1}
                    </td>
                    <td className="p-3 border-r border-b border-purple-300 text-center">
                      {entry.name}
                    </td>
                    <td className="p-3 border-r border-b border-purple-300 text-center">
                      {entry.phone_number}
                    </td>
                    <td className="p-3 border-r border-b border-purple-300 text-center">
                      {new Date(entry.date).toLocaleString()}
                    </td>
                    <td className="p-3 border-r border-b border-purple-300 text-center flex justify-around">
                      {/* Use Link instead of useRouter for navigation */}
                      <Link href={`/user/${entry.user_id}`} passHref>
                        <Button
                          variant="outlined"
                          className="text-purple-500 border-purple-500 hover:bg-purple-100"
                        >
                          <Edit />
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        className="text-red-500 border-red-500 hover:bg-red-100"
                        onClick={()=>handleEndSession(entry.user_id)}
                      >
                        <Delete />
                      </Button>
                      <Button
                        variant="outlined"
                        className="text-blue-500 border-blue-500 hover:bg-blue-100"
                        onClick={() => handleStartSession(entry.user_id)}
                      >
                        <SportsEsports />
                      </Button>

                      {/* Fastfood Icon */}
                      <Button
                        variant="outlined"
                        className="text-green-500 border-green-500 hover:bg-green-100"
                        onClick={() => handleFastfoodClick(entry)} // Open modal for ordering
                      >
                        <Fastfood />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-400">
                    No entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Food Order Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { width: "80%", maxWidth: "1200px" } }} // Increase modal width
      >
        <DialogTitle className="text-4xl mb-5 mt-2 text-center font-serif font-bold text-purple-700">
          Order Food for {currentUser?.name}
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-3 gap-6">
            {" "}
            {/* Changed to 3 columns */}
            {Object.keys(foodCategories).map((foodCategory) => (
              <div key={foodCategory}>
                <h3 className="font-bold text-lg mb-2">{foodCategory}</h3>
                <div className="flex flex-col">
                  {foodCategories[foodCategory].map((item) => (
                    <div
                      key={item}
                      className="grid grid-cols-3 items-center gap-4"
                    >
                      <span className="col-span-2 break-words">{item}</span>{" "}
                      {/* 2/3 of the space for the name */}
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleQuantityChange(item, -1)}
                          disabled={!foodQuantities[item]}
                        >
                          <Remove />
                        </Button>
                        <span className="mx-2">
                          {foodQuantities[item] || 0}
                        </span>
                        <Button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="text-purple-500 " // Set background to purple-500 and text color to white
                        >
                          <Add />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            className="bg-red-500 text-white px-8 mr-4 py-2" // Set background to red-500 and text color to white
          >
            Cancel
          </Button>

          {/* Disable the order button if no items are ordered */}
          <Button
            onClick={() => handleOrder(currentUser!.user_id)}
            className="bg-purple-500 text-white px-8 ml-4 py-2" // Set background to purple-500 and text color to white
            disabled={Object.values(foodQuantities).every(
              (quantity) => quantity === 0
            )}
          >
            Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}

      <ToastMessage isOpen={foodToastOpen} message="Food ordered successfully!" type="success" onClose={() => setFoodToastOpen(false)} />
      <ToastMessage isOpen={endToastOpen} message="Session ended successfully!" type="success" onClose={() => setEndToastOpen(false)} />
      <ToastMessage isOpen={errorToastOpen} message={error} type="error" onClose={() => setErrorToastOpen(false)} />
      
    </div>
  );
};

function ToastMessage({isOpen, message,type = 'success', onClose} : {isOpen: boolean, message: string,type: 'success'|'warning'|'error', onClose: () => void}) {
  const borderColors = {
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
  };
  
  return (
    <Snackbar
        open={isOpen}
        autoHideDuration={3000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Top center position
        ContentProps={{
          style: {
            backgroundColor: "#fff", // White background
            color: "#000", // Black text
            borderLeft: `5px solid ${borderColors[type]}`, // Thick green left border
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
          },
        }}
        message={message}
      />
  );
}

export default Dashboard;
