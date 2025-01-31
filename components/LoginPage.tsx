'use client';

import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Autocomplete, TextField, CircularProgress, Snackbar } from '@mui/material';
import Link from 'next/link';
import { format } from 'date-fns';
import debounce from 'lodash.debounce';
import apiClient from '@/lib/apiClient';

const Home = () => {
  const [formValues, setFormValues] = useState({ name: '', phone_number: '' });
  const [dateTime, setDateTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [nameOptions, setNameOptions] = useState([]);
  const [phoneOptions, setPhoneOptions] = useState([]);
  const [nameLoading, setNameLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  // Close toast
  const handleToastClose = () => setToastOpen(false);

  // Submit form
  const handleSubmission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name,
          phone_number: formValues.phone_number,
          entry_time: dateTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage("Registration Successful");
      } else {
        setToastMessage(data.detail || "Registration Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage("Error Occurred");
    } finally {
      setToastOpen(true);
    }
  };

  // Debounced fetch for name suggestions
  const fetchNameSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) return;
      setNameLoading(true);
      try {
        const response = await apiClient.get(`/identities/suggest?query=${query}&type=name`);
        setNameOptions(response.data || []);
      } catch (error) {
        console.error('Failed to fetch name suggestions:', error);
      } finally {
        setNameLoading(false);
      }
    }, 300),
    []
  );

  // Debounced fetch for phone suggestions
  const fetchPhoneSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query) return;
      setPhoneLoading(true);
      try {
        const response = await apiClient.get(`/identities/suggest?query=${query}&type=phone`);
        setPhoneOptions(response.data || []);
      } catch (error) {
        console.error('Failed to fetch phone suggestions:', error);
      } finally {
        setPhoneLoading(false);
      }
    }, 300),
    []
  );
  // log form values when they change
  useEffect(() => {
    console.log(formValues);
  }, [formValues]);


  // Handle Name Input Change
  const handleNameInputChange = (_event: any, newValue: string) => {
    setFormValues((prev) => ({ ...prev, name: newValue }));
    if (newValue) fetchNameSuggestions(newValue);
    else setNameOptions([]);
  };

  // Handle Phone Input Change
  const handlePhoneInputChange = (_event: any, newValue: string) => {
    setFormValues((prev) => ({ ...prev, phone_number: newValue }));
    if (newValue) fetchPhoneSuggestions(newValue);
    else setPhoneOptions([]);
  };

  const handleNameSelection = (_event: any, selected: any) => {
    if (selected) {
      setFormValues((prev) => ({
        // ...prev,
        name: selected.name || '',
        phone_number: selected.phone_number || prev.phone_number,
      }));
    }
  };

  const handlePhoneSelection = (_event: any, selected: any) => {
    if (selected) {
      setFormValues((prev) => ({
        // ...prev,
        phone_number: selected.phone_number || '',
        name: selected.name || prev.name,
      }));
    }
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
        <div className="inset-0 flex items-center justify-center pt-5">
          <div className="flex bg-white bg-opacity-10 backdrop-blur-sm border border-purple-500 rounded-lg p-8 max-w-4xl mx-4 md:mx-auto">
            <div className="w-full md:w-1/2 pr-4">
              <form onSubmit={handleSubmission}>
                <div className="relative mb-8 ">
                  <Autocomplete
                    freeSolo
                    options={phoneOptions}
                    getOptionLabel={(option: any) => option.phone_number}
                    loading={phoneLoading}
                    inputValue={formValues.phone_number}
                    onInputChange={handlePhoneInputChange}
                    onChange={handlePhoneSelection}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Phone"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderTop: '0 !important',
                              borderLeft: '0 !important',
                              borderRight: '0 !important',
                              borderBottom: '1px solid #a855f7 !important',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              outline: 'none',
                              borderBottom: '2px solid #a855f7 !important',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#93c5fd',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'white !important',
                          },
                          '& .MuiInputBase-input::placeholder': {
                            color: 'transparent',
                          },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="relative mb-8 mt-6">
                  <Autocomplete
                    freeSolo
                    options={nameOptions}
                    getOptionLabel={(option: any) => option.name}
                    loading={nameLoading}
                    inputValue={formValues.name}
                    onInputChange={handleNameInputChange}
                    onChange={handleNameSelection}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Name"
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderTop: '0 !important',
                              borderLeft: '0 !important',
                              borderRight: '0 !important',
                              borderBottom: '1px solid #a855f7 !important',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              outline: 'none',
                              borderBottom: '2px solid #a855f7 !important',
                            },
                          },
                          '& .MuiInputBase-input': {
                            color: '#93c5fd',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'white !important', // Changed label color to white
                          },
                          '& .MuiInputBase-input::placeholder': {
                            color: 'transparent',
                          },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="relative mb-12">
                  <input
                    type="datetime-local"
                    id="entry-time"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
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

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-purple-500 text-white font-semibold rounded-md shadow-sm hover:bg-purple-600"
                >
                  Submit
                </button>
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