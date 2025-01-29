'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar'; // Import Snackbar
import AddIcon from '@mui/icons-material/Add'; // Import Add icon
import EditIcon from '@mui/icons-material/Edit'; // Import Edit icon
import DeleteIcon from '@mui/icons-material/Delete'; // Import Delete icon
import Link from 'next/link';
import { format } from 'date-fns';

const Home = () => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateTime, setDateTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm")); // Set current date and time
  const [toastOpen, setToastOpen] = useState(false); // State for toast notification
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [popupOpen, setPopupOpen] = useState(false); // State for popup
  const [userName, setUserName] = useState(""); // State for user name input in popup
  const [users, setUsers] = useState<string[]>([]); // State for added users
  const [editIndex, setEditIndex] = useState<number | null>(null); // State for editing user

  const handleToastClose = () => {
    setToastOpen(false); // Function to close the toast
  };

  const handlePopupOpen = () => {
    setPopupOpen(true); // Function to open the popup
  };

  const handlePopupClose = () => {
    setPopupOpen(false); // Function to close the popup
    setEditIndex(null); // Reset edit index
    setUserName(""); // Reset user name input
  };

  const handleAddUser = () => {
    if (userName.trim()) {
      if (editIndex !== null) {
        setUsers((prevUsers) => {
          const updatedUsers = [...prevUsers];
          updatedUsers[editIndex] = userName.trim();
          return updatedUsers;
        });
        setEditIndex(null);
      } else {
        setUsers((prevUsers) => [...prevUsers, userName.trim()]);
      }
      setUserName("");
    }
  };

  const handleEditUser = (index: number) => {
    setEditIndex(index);
  };

  const handleDeleteUser = (index: number) => {
    setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
  };

  const handleUserNameChange = (index: number, newName: string) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index] = newName;
      return updatedUsers;
    });
  };

  const handleUserNameKeyPress = (index: number, event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setEditIndex(null);
    }
  };

  const handlePopupSubmit = () => {
    console.log("Added Users:", users);
    handlePopupClose();
  };

  const handleSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted");
    console.log("Name:", name);
    console.log("Phone Number:", phoneNumber);
    console.log("Entry Time:", dateTime);
    console.log("Users:", users);

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone_number: phoneNumber,
        entry_time: dateTime,
        users: users,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("Registration Successful:", data);
          setToastOpen(true); // Show toast on success
          setToastMessage("Registration Successful");
        } else {
          console.log("Registration Failed");
          setToastOpen(true);
          setToastMessage("Registration Failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setToastOpen(true);
        setToastMessage("Error Occurred");
      });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setDateTime(e.target.value);
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
        <meta name="description" content="Login page with glassmorphism effect" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('./images/bg.jpg')" }}>
        <div className="flex justify-between items-center py-10 px-20">
          <h1 className="font-heading text-purple-400 text-5xl">Entry</h1>
          <Link href="/dashboard" passHref>
            <Button className="flex items-center bg-purple-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-purple-600 cursor-pointer">
              <ArrowBackIcon className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className=" inset-0 flex items-center justify-center pt-5">
          <div className="flex bg-white bg-opacity-10 backdrop-blur-sm border border-purple-500 rounded-lg p-8 max-w-4xl mx-4 md:mx-auto">
            <div className="w-full md:w-1/2 pr-4">
              <form onSubmit={handleSubmission}>
                <div className="relative mb-8 mt-6">
                  <input
                    type="text"
                    id="name"
                    className="peer block w-full pl-3 pb-2 pt-5 pr-12 border border-purple-500 border-t-0 border-l-0 border-r-0 shadow-sm bg-transparent placeholder-transparent focus:outline-none text-blue-300"
                    placeholder="Name"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                  <PersonOutlinedIcon className="absolute top-3 right-3 text-purple-500" />
                  <label
                    htmlFor="name"
                    className="absolute top-4 left-3 text-white transition-all duration-300 transform -translate-y-5 scale-75 origin-top-left peer-placeholder-shown:top-4 peer-placeholder-shown:left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-purple-500 font-light text-xl"
                  >
                    Name
                  </label>
                </div>

                <div className="relative mb-8">
                  <input
                    type="tel"
                    id="phone"
                    className="peer block w-full pl-3 pb-2 pt-5 pr-12 border border-purple-500 border-t-0 border-l-0 border-r-0 shadow-sm bg-transparent placeholder-transparent focus:outline-none text-blue-300"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    required
                  />
                  <PhoneOutlinedIcon className="absolute top-3 right-3 text-purple-500" />
                  <label
                    htmlFor="phone"
                    className="absolute top-4 left-3 text-white transition-all duration-300 transform -translate-y-5 scale-75 origin-top-left peer-placeholder-shown:top-4 peer-placeholder-shown:left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-0 peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-purple-500 font-light text-xl"
                  >
                    Phone Number
                  </label>
                </div>

                <div className="relative mb-12">
                  <input
                    type="datetime-local"
                    id="entry-time"
                    value={dateTime}
                    onChange={handleDateChange}
                    className="peer block w-full pl-3 pb-2 pt-5 pr-3 border border-purple-500 border-t-0 border-l-0 border-r-0 shadow-sm bg-transparent placeholder-transparent focus:outline-none text-blue-300"
                    required
                  />
                  <label
                    htmlFor="entry-time"
                    className="absolute top-4 left-3 text-white transition-all duration-300 transform -translate-y-5 scale-75 origin-top-left peer-placeholder-shown:hidden peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:text-purple-500 font-light text-xl"
                  >
                    Entry Time
                  </label>
                </div>

                <div className="flex space-x-4 mb-4">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handlePopupOpen}
                    className="w-full border-purple-500 text-white font-semibold rounded-md shadow-sm hover:bg-[#ffffff46]"
                  >
                    Add Users
                  </Button>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-purple-500 text-white font-semibold rounded-md shadow-sm hover:bg-purple-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            <div className="w-full md:w-1/2 pl-4">
              <Image
                src="/images/QR_Code_Sample.png"
                alt="Sample Image"
                width={500}
                height={500}
                className="border-2 border-purple-500 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Popup for adding users */}
        <Dialog open={popupOpen} onClose={handlePopupClose} maxWidth="md" fullWidth>
          <div className='hidden'>
          <DialogTitle>Add User</DialogTitle>
          </div>
          
          <h1 className='p-5 text-4xl text-center text-purple-900 font-bold'>Add User</h1>
          <DialogContent>
            <div className="flex items-center mb-4 overflow-visible">
              <TextField
                label="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                fullWidth
              />
              <IconButton onClick={handleAddUser} color="primary" className="bg-purple-500 text-white hover:bg-purple-600 rounded-full ml-2">
                <AddIcon />
              </IconButton>
            </div>
            <div>
              {users.map((user, index) => (
                <div key={index} className="mb-2 flex items-center justify-around gap-3">
                  {editIndex === index ? (
                    <TextField
                      value={user}
                      onChange={(e) => handleUserNameChange(index, e.target.value)}
                      onKeyPress={(e) => handleUserNameKeyPress(index, e)}
                      fullWidth
                    />
                  ) : (
                    <span className="font-semibold text-center">{user}</span>
                  )}
                  <div className="flex space-x-2">
                    <IconButton onClick={() => handleEditUser(index)} color="primary" className="bg-blue-500 text-white hover:bg-blue-600 rounded-full">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteUser(index)} color="primary" className="bg-red-500 text-white hover:bg-red-600 rounded-full">
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
          <DialogActions>
            <button onClick={handlePopupClose} 
            className="py-2 px-4 bg-white text-purple-500 border border-purple-500 font-semibold rounded-md shadow-sm hover:bg-purple-100 w-[150px]">
              Close
            </button>
            <button
              onClick={handlePopupSubmit}
              className="py-2 px-4 bg-purple-500 text-white font-semibold rounded-md shadow-sm hover:bg-purple-600 w-[150px]"
            >
              Submit
            </button>
          </DialogActions>
        </Dialog>

        {/* Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Top center position
          ContentProps={{
            style: {
              backgroundColor: '#fff', // White background
              color: '#000', // Black text
              borderLeft: '5px solid #4caf50', // Thick green left border
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Optional shadow
            },
          }}
          message={toastMessage}
        />
      </div>
    </>
  );
};

export default Home;
