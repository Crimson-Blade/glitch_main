"use client";

import Head from "next/head";
import Snackbar from "@mui/material/Snackbar";
import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useState } from "react";
import CustomPieChart from "@/components/PieChart"; // Import the updated PieChart component
import dayjs, { Dayjs } from "dayjs";

const Home = () => {
  const [toastOpen, setToastOpen] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleDone = () => {
    if (startDate && endDate) {
      console.log("Start Date:", startDate.format("YYYY-MM-DD"));
      console.log("End Date:", endDate.format("YYYY-MM-DD"));
      setToastOpen(true);
    } else {
      alert("Please select both start and end dates");
    }
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
          <h1 className="font-heading text-white text-3xl md:text-5xl mb-4 md:mb-0">
            Analytics
          </h1>

          <Link href="/dashboard" passHref>
            <Button className="flex items-center bg-purple-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-purple-600 cursor-pointer">
              <ArrowBackIcon className="mr-2" />
              Back
            </Button>
          </Link>
        </div>

        {/* Main Container for Date Pickers and Pie Charts */}
        <div className="flex items-center justify-center pt-5">
          <div className="w-full md:w-3/4 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 mx-4 md:mx-auto">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="h-full flex flex-col items-center justify-center">
                {/* Date Pickers Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 w-full">
                  {/* Start Date Picker */}
                  <div className="flex flex-col items-center w-full md:w-1/2">
                    <label className="text-purple-500 mb-2">Start Date</label>
                    <DatePicker
                      value={startDate}
                      onChange={(newValue) => setStartDate(newValue)}
                      renderInput={(params) => (
                        <input
                          {...params.inputProps}
                          className="p-2 border border-purple-500 rounded-md text-purple-500 bg-transparent placeholder-purple-500 focus:outline-none"
                        />
                      )}
                    />
                  </div>
                  {/* End Date Picker */}
                  <div className="flex flex-col items-center w-full md:w-1/2">
                    <label className="text-purple-500 mb-2">End Date</label>
                    <DatePicker
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => (
                        <input
                          {...params.inputProps}
                          className="p-2 border border-purple-500 rounded-md text-purple-500 bg-transparent placeholder-purple-500 focus:outline-none"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Done Button */}
                <Button
                  onClick={handleDone}
                  className="bg-purple-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-purple-600 cursor-pointer mt-4"
                >
                  Done
                </Button>

                {/* Pie Charts Section without Borders */}
                <div className="flex items-center justify-center py-10 w-full">
                  <div className="flex justify-around w-full">
                    <div className="flex-1 mx-2">
                      {/* Flex item for the first pie chart */}
                      <CustomPieChart />
                    </div>
                    <div className="flex-1 mx-2">
                      {/* Flex item for the second pie chart */}
                      <CustomPieChart />
                    </div>
                  </div>
                </div>
              </div>
            </LocalizationProvider>
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
          message="Dates logged successfully!"
        />
      </div>
    </>
  );
};

export default Home;
