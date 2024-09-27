'use client';

import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import an arrow icon

const Home = () => {
  const [dateTime, setDateTime] = useState<string>('');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          <h1 className='font-heading text-purple-400 text-5xl'>Entry</h1>
          <button
            className="flex items-center bg-purple-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-purple-600 cursor-pointer"
            onClick={() => {/* Handle navigation to dashboard */}}
          >
            <ArrowBackIcon className="mr-2" />
            Back to Dashboard
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pt-5">
          <div className="flex bg-white bg-opacity-10 backdrop-blur-sm border border-purple-500 rounded-lg p-8 max-w-4xl mx-4 md:mx-auto">
            {/* Login Form Container */}
            <div className="w-full md:w-1/2 pr-4">
              <form>
                {/* Name Field */}
                <div className="relative mb-8 mt-6">
                  <input
                    type="text"
                    id="name"
                    className="peer block w-full pl-3 pb-2 pt-5 pr-12 border border-purple-500 border-t-0 border-l-0 border-r-0 shadow-sm bg-transparent placeholder-transparent focus:outline-none text-blue-300"
                    placeholder=" "
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

                {/* Phone Number Field */}
                <div className="relative mb-8">
                  <input
                    type="tel"
                    id="phone"
                    className="peer block w-full pl-3 pb-2 pt-5 pr-12 border border-purple-500 border-t-0 border-l-0 border-r-0 shadow-sm bg-transparent placeholder-transparent focus:outline-none text-blue-300"
                    placeholder=" "
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

                {/* Date Time Field */}
                <div className="relative mb-12">
                  <input
                    type="datetime-local"
                    id="entry-time"
                    value={dateTime}
                    onChange={handleDateChange}
                    className="peer block w-full pl-3 pb-2 pt-5 pr-3 border border-purple-500 border-t-0 border-l-0 border-r-0 shadow-sm bg-transparent placeholder-transparent focus:outline-none text-blue-300"
                    placeholder=" "
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

            {/* Divider */}
            <div className="hidden md:block w-px bg-gray-300 mx-4"></div>

            {/* Image Container */}
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
      </div>
    </>
  );
};

export default Home;
