'use client';
import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';
import { getFormattedUTCDate } from '@/utils';

interface UserProfileProps {
  uuid: string;
}

interface System {
  id: number;
  user_id: string;
  name: string;
  amount: number;
  start_time: string; // ISO string
  end_time: string | null; // ISO string or null
}

interface Order {
  id: number;
  user_id: string;
  item_name: string;
  quantity: number;
  price: number;
}
type SystemNameType = 'lounge'|'console'|'other'

const UserProfile: React.FC<UserProfileProps> = ({ uuid }) => {
  

  const [user, setUser] = useState<any>(null);
  const [systems, setSystems] = useState<System[]>([]);
  const [loungePrice, setLoungePrice] = useState<number>(50);
  const [consolePrice, setConsolePrice] = useState<number>(50);
  const [otherPrice, setOtherPrice] = useState<number>(50);
  const [foodItems, setFoodItems] = useState<Order[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [loungeTime, setLoungeTime] = useState<string>('00:00');
  const [consoleTime, setConsoleTime] = useState<string>('00:00');
  const [otherTime, setOtherTime] = useState<string>('00:00');
  const [showToast, setShowToast] = useState<boolean>(false); 

  const loungeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const consoleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const otherIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [activeSystems, setActiveSystems] = useState<{ [key: string]: System | null }>({
    lounge: null,
    console: null,
    other: null,
  });

  useEffect(() => {
    // Fetch user data
    if (uuid) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/registrations/${uuid}`)
        .then((response) => response.json())
        .then((data) => setUser(data))
        .catch((error) => console.error('Error fetching user data:', error));

      // Fetch systems data
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/systems/${uuid}/`)
        .then((response) => response.json())
        .then((data) => {
          setSystems(data);
          initializeTimers(data);
        })
        .catch((error) => console.error('Error fetching systems data:', error));

      // Fetch orders data
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/orders/${uuid}/`)
        .then((response) => response.json())
        .then((data) => {
          setFoodItems(data);
        })
        .catch((error) => console.error('Error fetching orders data:', error));
    }

    // Cleanup intervals on unmount
    return () => {
      if (loungeIntervalRef.current) clearInterval(loungeIntervalRef.current);
      if (consoleIntervalRef.current) clearInterval(consoleIntervalRef.current);
      if (otherIntervalRef.current) clearInterval(otherIntervalRef.current);
    };
  }, [uuid]);

  const initializeTimers = (systemsData: System[]) => {
    systemsData.forEach((system) => {
      if (!system.end_time) {
        // System is active
        switch (system.name.toLowerCase()) {
          case 'lounge':
            setActiveSystems((prev) => ({ ...prev, lounge: system }));
            updateTime('lounge', system.start_time);
            loungeIntervalRef.current = setInterval(() => {
              updateTime('lounge', system.start_time);
            }, 60000); // Update every minute
            break;
          case 'console':
            setActiveSystems((prev) => ({ ...prev, console: system }));
            updateTime('console', system.start_time);
            consoleIntervalRef.current = setInterval(() => {
              updateTime('console', system.start_time);
            }, 60000);
            break;
          case 'other':
            setActiveSystems((prev) => ({ ...prev, other: system }));
            updateTime('other', system.start_time);
            otherIntervalRef.current = setInterval(() => {
              updateTime('other', system.start_time);
            }, 60000);
            break;
          default:
            break;
        }
      } else {
        // System has ended
        const duration = calculateDuration(system.start_time, system.end_time);
        const formattedDuration = formatDuration(duration);
        switch (system.name.toLowerCase()) {
          case 'lounge':
            setLoungeTime(formattedDuration);
            break;
          case 'console':
            setConsoleTime(formattedDuration);
            break;
          case 'other':
            setOtherTime(formattedDuration);
            break;
          default:
            break;
        }
      }
    });
  };

  const updateTime = (systemName: SystemNameType, startTime: string) => {
    const now = getFormattedUTCDate(new Date());
    const duration = calculateDuration(startTime, now);
    const formattedDuration = formatDuration(duration);
    switch (systemName) {
      case 'lounge':
        setLoungeTime(formattedDuration);
        break;
      case 'console':
        setConsoleTime(formattedDuration);
        break;
      case 'other':
        setOtherTime(formattedDuration);
        break;
      default:
        break;
    }
  };

  const calculateDuration = (start: string, end: string): number => {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    return durationMs;
  };

  const formatDuration = (durationMs: number): string => {
    const totalMinutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const handlePriceChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setter(numberValue);
    }
  };

  const handleFoodChange = (index: number, field: 'price' | 'quantity', value: string) => {
    const numberValue = parseInt(value);
    setFoodItems((prev) => {
      const updatedItems = [...prev];
      if (!isNaN(numberValue)) {
        updatedItems[index] = { ...updatedItems[index], [field]: numberValue };
      }
      return updatedItems;
    });
  };

  const handleGenerateBill = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/billing/${uuid}/`, {
        method: 'GET',
      });
      if (response.ok) {
        const billData = await response.json();
        console.log('Bill generated:', billData);
  
        // Update the systems and orders state with the latest data
        setSystems(billData.systems);
        setFoodItems(billData.orders); // Update food items if necessary
        stopTimerAndResetSystem("lounge");
        stopTimerAndResetSystem("console");
        stopTimerAndResetSystem("other");
        // Recalculate totals if your calculations depend on state variables
        // (You may need to recalculate totalSystemCost, totalFoodCost, totalCost, etc.)
      } else {
        console.error('Failed to generate bill');
      }
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };

  const handleGenerateBillButton = async () => {
    setShowToast(true); // Show toast notification
    setTimeout(() => setShowToast(false), 3000); // Hide after 3 seconds

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/billing/${uuid}/`, {
        method: 'GET',
      });
      if (response.ok) {
        const billData = await response.json();
        console.log('Bill generated:', billData);

        setSystems(billData.systems);
        setFoodItems(billData.orders); // Update food items if necessary
        stopTimerAndResetSystem('lounge');
        stopTimerAndResetSystem('console');
        stopTimerAndResetSystem('other');
      } else {
        console.error('Failed to generate bill');
      }
    } catch (error) {
      console.error('Error generating bill:', error);
    }
  };

  const totalSystemCost = systems.reduce((acc, system) => {
    const startTime = new Date(system.start_time).getTime();
    const endTime = system.end_time ? new Date(system.end_time).getTime() : Date.now();
    const durationHours = (endTime - startTime) / (1000 * 60 * 60);
    return acc + system.amount * durationHours;
  }, 0);

  const totalFoodCost = foodItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalCost = totalSystemCost + totalFoodCost;
  const finalCost = totalCost - totalCost * (discount / 100);

  const handleStartSystem = async (systemName: SystemNameType, amount: number) => {
    // Create a new system entry via API
    const systemData = {
      name: systemName,
      amount: amount,
      start_time: getFormattedUTCDate(new Date()),
    };
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/systems/${uuid}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(systemData),
      });
      if (response.ok) {
        const newSystem = await response.json();
        setSystems((prev) => [...prev, newSystem]);
        // Start the timer for the system
        initializeTimers([newSystem]);
      } else {
        console.error('Failed to start system');
      }
    } catch (error) {
      console.error('Error starting system:', error);
    }
  };
 
  const stopTimerAndResetSystem = (systemName: SystemNameType) => {
    switch (systemName) {
      case 'lounge':
        if (loungeIntervalRef.current) clearInterval(loungeIntervalRef.current);
        setActiveSystems((prev) => ({ ...prev, lounge: null }));
        break;
      case 'console':
        if (consoleIntervalRef.current) clearInterval(consoleIntervalRef.current);
        setActiveSystems((prev) => ({ ...prev, console: null }));
        break;
      case 'other':
        if (otherIntervalRef.current) clearInterval(otherIntervalRef.current);
        setActiveSystems((prev) => ({ ...prev, other: null }));
        break;
      default:
        break;
    }
  };
  
  const updateTimeDisplay = (systemName: SystemNameType, startTime: string, endTime: string) => {
    const duration = calculateDuration(startTime, endTime);
    const formattedDuration = formatDuration(duration);
    switch (systemName) {
      case 'lounge':
        setLoungeTime(formattedDuration);
        break;
      case 'console':
        setConsoleTime(formattedDuration);
        break;
      case 'other':
        setOtherTime(formattedDuration);
        break;
      default:
        break;
    }
  };
  
  const updateSystemState = (updatedSystem: System) => {
    setSystems((prev) =>
      prev.map((sys) => (sys.id === updatedSystem.id ? updatedSystem : sys))
    );
  };
  
  const handleEndSystem = async (systemName: SystemNameType) => {
    let activeSystem: System | null = null;
    
    // Find the active system
    switch (systemName) {
      case 'lounge':
        activeSystem = activeSystems.lounge;
        break;
      case 'console':
        activeSystem = activeSystems.console;
        break;
      case 'other':
        activeSystem = activeSystems.other;
        break;
      default:
        break;
    }
  
    if (activeSystem) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/systems/${activeSystem.id}/end/`, {
          method: 'PUT',
        });
  
        if (response.ok) {
          const updatedSystem = await response.json();
  
          // Update system state
          updateSystemState(updatedSystem);
  
          // Stop the timer and reset the active system
          stopTimerAndResetSystem(systemName);
  
          // Update the time display
          updateTimeDisplay(systemName, activeSystem.start_time, updatedSystem.end_time!);
        } else {
          console.error('Failed to end system');
        }
      } catch (error) {
        console.error('Error ending system:', error);
      }
    } else {
      console.warn('No active system to end');
    }
  };

  const handleEndSession = async () => {
    try {
      // Finalize the bill
      const finalizeResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/billing/${uuid}/finalize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ discount_percentage: discount }), // Include discount if applicable
      });
      if (finalizeResponse.ok) {
        const finalizeData = await finalizeResponse.json();
        console.log('Bill finalized:', finalizeData);
  
        // End the session
        const endSessionResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sessions/${uuid}/end/`, {
          method: 'POST',
        });
        if (endSessionResponse.ok) {
          const endSessionData = await endSessionResponse.json();
          console.log('Session ended:', endSessionData);
          // Optionally, navigate back to the dashboard or disable further actions
        } else {
          console.error('Failed to end session');
        }
      } else {
        console.error('Failed to finalize bill');
      }
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-cover bg-center"
      style={{ backgroundImage: 'url("/images/bg5.jpg")' }}
    >
      <div className="flex flex-col items-center justify-center p-10">
        <div className="flex justify-between w-full max-w-4xl mb-8">
          <h1 className="text-5xl font-heading text-purple-400">Edit User: {user.name}</h1>
          <Link href="/dashboard" passHref>
            <div className="flex items-center bg-purple-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-purple-600 cursor-pointer">
              <ArrowBackIcon className="mr-2" />
              Back to Dashboard
            </div>
          </Link>
        </div>

        {/* User Details */}
        <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg w-full max-w-4xl border border-purple-400 mt-10">
          <h2 className="text-3xl mb-5 font-heading text-blue-300 ml-16">User Details</h2>
          <div className="grid grid-cols-2 gap-2 text-white text-2xl mb-4 ml-16">
            <span className="font-light text-2xl mb-2">Name:</span>
            <span>{user.name}</span>
            <span className="font-light text-2xl mb-2">Phone No:</span>
            <span>{user.phone_number}</span>
            <span className="font-light text-2xl">Entry Time:</span>
            <span>{new Date(user.date).toLocaleString()}</span>
          </div>
        </div>

        {/* Systems Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 w-full max-w-4xl">
          {/* Lounge Card */}
          <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-400">
            <h3 className="text-2xl mb-5 font-heading text-blue-300">Lounge</h3>
            <div className="text-white text-2xl flex items-center mb-2">
              <span className="mr-1">
                <input
                  type="number"
                  value={loungePrice}
                  onChange={(e) => handlePriceChange(setLoungePrice, e.target.value)}
                  className="bg-transparent text-white font-bold text-3xl w-16 mb-3 border-b border-white focus:outline-none"
                  placeholder="Price"
                />
              </span>
              <span className="text-lg">/hr</span>
            </div>
            <div className="text-white text-xl mb-2">Time: {loungeTime}</div>
            {/* Lounge Card Buttons */}
            <div className="flex justify-between mt-4">
              {!activeSystems.lounge ? (
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
                  onClick={() => handleStartSystem('lounge', loungePrice)}
                >
                  Start
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
                  onClick={() => handleEndSystem('lounge')}
                >
                  End
                </button>
              )}
            </div>
          </div>

          {/* Console Card */}
          <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-400">
            <h3 className="text-2xl mb-5 font-heading text-blue-300">Console</h3>
            <div className="text-white text-2xl flex items-center mb-2">
              <span className="mr-1">
                <input
                  type="number"
                  value={consolePrice}
                  onChange={(e) => handlePriceChange(setConsolePrice, e.target.value)}
                  className="bg-transparent text-white font-bold text-3xl w-16 mb-3 border-b border-white focus:outline-none"
                  placeholder="Price"
                />
              </span>
              <span className="text-lg">/hr</span>
            </div>
            <div className="text-white text-xl mb-2">Time: {consoleTime}</div>
            {/* Console Card Buttons */}
            <div className="flex justify-between mt-4">
              {!activeSystems.console ? (
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
                  onClick={() => handleStartSystem('console', consolePrice)}
                >
                  Start
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
                  onClick={() => handleEndSystem('console')}
                >
                  End
                </button>
              )}
            </div>
          </div>

          {/* Other Card */}
          <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-400">
            <h3 className="text-2xl mb-5 font-heading text-blue-300">Other</h3>
            <div className="text-white text-2xl flex items-center mb-2">
              <span className="mr-1">
                <input
                  type="number"
                  value={otherPrice}
                  onChange={(e) => handlePriceChange(setOtherPrice, e.target.value)}
                  className="bg-transparent text-white font-bold text-3xl w-16 mb-3 border-b border-white focus:outline-none"
                  placeholder="Price"
                />
              </span>
              <span className="text-lg">/hr</span>
            </div>
            <div className="text-white text-xl mb-2">Time: {otherTime}</div>
            {/* Other Card Buttons */}
            <div className="flex justify-between mt-4">
              {!activeSystems.other ? (
                <button
                  className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
                  onClick={() => handleStartSystem('other', otherPrice)}
                >
                  Start
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500"
                  onClick={() => handleEndSystem('other')}
                >
                  End
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Food Orders */}
        <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg w-full max-w-4xl border border-purple-400 mt-14">
          <h2 className="text-2xl font-heading mb-10 text-blue-300">Food Bill</h2>
          <table className="min-w-full text-left text-sm text-purple-700 bg-transparent border">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-2 w-1/2 text-xl text-center">Food</th>
                <th className="px-4 py-2 w-1/4 text-xl text-center">Price</th>
                <th className="px-4 py-2 w-1/4 text-xl text-center">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {foodItems.map((item, index) => (
                <tr key={index} className="border-l border-purple-300 border-r border-b">
                  <td className="px-4 py-4 text-white text-lg text-center">{item.item_name}</td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleFoodChange(index, 'price', e.target.value)}
                      className="bg-transparent focus:outline-none text-lg text-white font-bold text-center"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleFoodChange(index, 'quantity', e.target.value)}
                      className="bg-transparent focus:outline-none text-lg text-white font-bold text-center"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between mt-10">
            <button
              className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-500"
              aria-label="add food"
            >
              <EditIcon />
              Add Food
            </button>
          </div>
        </div>

        {/* Total Bill */}
        <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg w-full max-w-4xl border border-purple-400 mt-8">
          <h2 className="t text-2xl font-heading mb-10 text-blue-300">Total Bill</h2>
          {/* Generate Bill Button */}
         
          <table className="min-w-full text-left text-sm text-purple-700">
            <thead>
              <tr className="bg-purple-600 text-white border border-purple-300">
                <th className="px-4 py-2 text-xl text-center">Item</th>
                <th className="px-4 py-2 text-xl text-center">Quantity</th>
                <th className="px-4 py-2 text-xl text-center">Cost</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((system) => (
                <tr key={system.id} className="border-l border-purple-300 border-r border-b">
                  <td className="px-4 py-4 text-white text-lg text-center">{system.name}</td>
                  <td className="px-4 py-4 text-white text-lg font-bold text-center">1</td>
                  <td className="px-4 py-4 text-white text-lg font-bold text-center">
                    {/* Calculate cost */}
                    {(
                      system.amount *
                      ((system.end_time
                        ? new Date(system.end_time).getTime()
                        : Date.now()) -
                        new Date(system.start_time).getTime()) /
                      (1000 * 60 * 60)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
              {foodItems.map((item, index) => (
                <tr key={index} className="border-l border-purple-300 border-r border-b">
                  <td className="px-4 py-4 text-white text-lg text-center">{item.item_name}</td>
                  <td className="px-4 py-4 text-white text-lg font-bold text-center">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4 text-white text-lg font-bold text-center">
                    {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
          <div className="flex items-center justify-between mb-8">
          <button
  className="bg-green-600 text-white py-3 px-7 font-bold text-xl rounded hover:bg-green-500 transition mt-8"
  onClick={handleGenerateBillButton}
>
  Generate Bill
</button>

{/* Toast Notification */}
{showToast && (
  <div className="fixed left-1/2 transform -translate-x-1/2 w-[50%] bg-white text-black py-4 mt-5 px-6 rounded-lg shadow-lg border-l-8 border-green-600">
    Your bill is being generated...
  </div>
)}

  <div className="flex items-center justify-center mt-4">
    <p className="text-white text-2xl font-light text-right mr-2">
      Total Cost:{' '}
      <span className="font-bold font-sans">{totalCost.toFixed(2)}</span>
    </p>
  </div>
</div>

<div className="mt-2 flex mb-10">
  <label className="text-white text-xl font-bold mt-2 mr-6">Discount:</label>
  <div className="flex space-x-10 mt-2">
    <button
      onClick={() => setDiscount(0)}
      className={`px-5 py-1 rounded ${
        discount === 0 ? 'bg-green-600' : 'bg-purple-600'
      } text-white`}
    >
      0%
    </button>
    <button
      onClick={() => setDiscount(5)}
      className={`px-5 py-1 rounded ${
        discount === 5 ? 'bg-green-600' : 'bg-purple-600'
      } text-white ml-5`}
    >
      5%
    </button>
    <button
      onClick={() => setDiscount(10)}
      className={`px-5 py-1 rounded ${
        discount === 10 ? 'bg-green-600' : 'bg-purple-600'
      } text-white ml-5`}
    >
      10%
    </button>
    <button
      onClick={() => setDiscount(15)}
      className={`px-5 py-1 rounded ${
        discount === 15 ? 'bg-green-600' : 'bg-purple-600'
      } text-white ml-5`}
    >
      15%
    </button>
  </div>
</div>

            <p className="text-white mt-2 text-3xl font-light">
              Final Bill:{' '}
              <span className="font-bold font-sans ml-5">{finalCost.toFixed(2)}</span>
            </p>
          </div>
        </div>



        {/* End Session Button */}
        <button
          className="bg-red-600 text-white py-3 px-7 font-bold text-xl rounded hover:bg-red-500 transition mt-8"
          onClick={handleEndSession}
        >
          End Session
        </button>
      </div>
    </div>
  );
};

export default UserProfile;