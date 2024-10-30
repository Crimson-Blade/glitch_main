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
} from "@mui/material";
import { useEffect, useState } from "react";
import Link from "next/link"; // Import Link for navigation

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
  const [toastOpen, setToastOpen] = useState(false); // Toast visibility

  const fetchData = () => {
    // Fetch data from the backend
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registrations/today/`)
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
      return { ...prevQuantities, [item]: newQuantity };
    });
  };

  const handleOrder = () => {
    const orderedItems = Object.entries(foodQuantities).flatMap(
      ([item, quantity]) => Array(quantity).fill(item)
    );
    console.log("Ordered Items:", orderedItems); // Log ordered items to console
    setOpen(false); // Close the modal
    setToastOpen(true); // Show toast notification
  };

  const handleToastClose = () => {
    setToastOpen(false); // Close the toast
  };

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
                      >
                        <Delete />
                      </Button>
                      <Button
                        variant="outlined"
                        className="text-blue-500 border-blue-500 hover:bg-blue-100"
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
            onClick={handleOrder}
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
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Top center position
        ContentProps={{
          style: {
            backgroundColor: "#fff", // White background
            color: "#000", // Black text
            borderLeft: "5px solid #4caf50", // Thick green left border
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Optional shadow
          },
        }}
        message="Order placed successfully!"
      />
    </div>
  );
};

export default Dashboard;
