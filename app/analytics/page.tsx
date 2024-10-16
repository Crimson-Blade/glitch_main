"use client";

import { useState } from "react";
import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const Home = () => {
  const [toastOpen, setToastOpen] = useState(false);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <>
      <Head>
        <title>Analytics</title>
        <meta name="description" content="UI with glassmorphism theme" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background Image */}
      <div
        className="relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('./images/bg.jpg')" }}
      >
        <div className="flex justify-between items-center flex-wrap py-10 px-6 md:px-20">
          {/* Title for Analytics */}
          <h1 className="font-heading text-white text-3xl md:text-5xl mb-4 md:mb-0">
            Analytics
          </h1>

          {/* Back Button */}
          <Link href="/dashboard" passHref>
            <Button className="flex items-center bg-purple-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-600 cursor-pointer">
              <ArrowBackIcon className="mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Full Height and Width Glass Container */}
        <div className="flex items-center justify-center pt-5">
          <div className="w-full h-full bg-white bg-opacity-10 backdrop-blur-md border border-purple-500 rounded-lg p-8 mx-4 md:mx-auto">
            {/* Content (e.g., charts, graphs) can be placed here */}
            <div className="h-full flex items-center justify-center">
              <p className="text-white">Add your charts and graphs here</p>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <Snackbar
          open={toastOpen}
          autoHideDuration={3000}
          onClose={handleToastClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            style: {
              backgroundColor: "#fff",
              color: "#000",
              borderLeft: "5px solid #4caf50",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            },
          }}
          message="Action completed successfully!"
        />
      </div>
    </>
  );
};

export default Home;
