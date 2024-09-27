// app/components/UserProfile.tsx
'use client';
import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 

const UserProfile: React.FC = () => {
  const [loungePrice, setLoungePrice] = useState<number>(50);
  const [psPrice, setPsPrice] = useState<number>(50);
  const [otherPrice, setOtherPrice] = useState<number>(50);
  
  const [foodItems, setFoodItems] = useState([
    { food: 'Pizza', price: 10, quantity: 1 },
    { food: 'Burger', price: 8, quantity: 2 }
  ]);
  const [discount, setDiscount] = useState<number>(0);

  const handlePriceChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string) => {
    const numberValue = parseInt(value);
    if (!isNaN(numberValue)) {
      setter(numberValue);
    }
  };

  const handleFoodChange = (index: number, field: 'price' | 'quantity', value: string) => {
    const numberValue = parseInt(value);
    setFoodItems(prev => {
      const updatedItems = [...prev];
      if (!isNaN(numberValue)) {
        updatedItems[index] = { ...updatedItems[index], [field]: numberValue };
      }
      return updatedItems;
    });
  };

  const totalCost = foodItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalCost = totalCost - (totalCost * (discount / 100));

  return (
    <div className="min-h-screen bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("/images/bg5.jpg")' }}>
      <div className="flex flex-col items-center justify-center p-10">
        <div className="flex justify-between w-full max-w-4xl mb-8">
          <h1 className="text-5xl font-heading text-purple-400">Edit User</h1>
          <button
            className="flex items-center bg-purple-500 text-white font-semibold py-3 px-4 rounded-full hover:bg-purple-600 cursor-pointer"
            onClick={() => {/* Handle navigation to dashboard */}}
          >
            <ArrowBackIcon className="mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className=" bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg w-full max-w-4xl border border-purple-400 mt-10">
          <h2 className="text-3xl mb-5 font-heading text-blue-300 ml-16">User Details</h2>
          <div className="grid grid-cols-2 gap-2 text-white text-2xl mb-4 ml-16">
            <span className='font-light text-2xl mb-2'>Name:</span>
            <span>Adam</span>
            <span className='font-light text-2xl mb-2'>Phone No:</span>
            <span>9843453543</span>
            <span className='font-light text-2xl'>Entry Time:</span>
            <span>12-2-2024 14:20</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 w-full max-w-4xl">
          {/* Lounge Card */}
          <div className=" bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-400">
            <h3 className="text-2xl mb-5 font-heading text-blue-300">Lounge</h3>
            <div className="text-white text-2xl flex items-center">
              <span className="mr-1">
                <input
                  type="number"
                  value={loungePrice}
                  onChange={(e) => handlePriceChange(setLoungePrice, e.target.value)}
                  className="bg-transparent text-white font-bold text-3xl w-16 mb-3 border-b border-white focus:outline-none "
                  placeholder="Price"
                />
              </span>
              <span className="text-lg">/hr</span>
            </div>
            <div className="flex justify-between mt-7">
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500">Start</button>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500">End</button>
            </div>
          </div>

          {/* PS4/5 Card */}
          <div className=" bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-400">
          <h3 className="text-2xl mb-5 font-heading text-blue-300">Ps4 / Ps5</h3>
            <div className="text-white text-2xl flex items-center">
              <span className="mr-1">
                <input
                  type="number"
                  value={psPrice}
                  onChange={(e) => handlePriceChange(setPsPrice, e.target.value)}
                  className="bg-transparent text-white font-bold text-3xl w-16 mb-3 border-b border-white focus:outline-none"
                  placeholder="Price"
                />
              </span>
              <span className="text-lg">/hr</span>
            </div>
            <div className="flex justify-between mt-7">
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500">Start</button>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500">End</button>
            </div>
          </div>

          {/* Other Card */}
          <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg border border-purple-400">
          <h3 className="text-2xl mb-5 font-heading text-blue-300">Other</h3>
            <div className="text-white text-2xl flex items-center">
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
            <div className="flex justify-between mt-7">
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500">Start</button>
              <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-500">End</button>
            </div>
          </div>
        </div>

        {/* Food Container */}
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
                  <td className="px-4 py-4 text-white text-lg text-center">{item.food}</td>
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
            <button className="bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-500" aria-label="add food">
              <EditIcon />
              Add Food
            </button>
          </div>
        </div>

        {/* Bill Container */}
        <div className="bg-opacity-20 backdrop-blur-md rounded-lg p-6 shadow-lg w-full max-w-4xl border border-purple-400 mt-8">
          <h2 className="t text-2xl font-heading mb-10 text-blue-300">Total Bill</h2>
          <table className="min-w-full text-left text-sm text-purple-700">
            <thead>
              <tr className="bg-purple-600 text-white border border-purple-300">
                <th className="px-4 py-2 text-xl text-center">Item</th>
                <th className="px-4 py-2 text-xl text-center">Quantity</th>
                <th className="px-4 py-2 text-xl text-center">Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-l border-purple-300 border-r border-b">
                <td className="px-4 py-4 text-white text-lg text-center">Lounge</td>
                <td className="px-4 py-4 text-white text-lg font-bold text-center">1</td>
                <td className="px-4 py-4 text-white text-lg font-bold text-center">{loungePrice}</td>
              </tr>
              <tr className="border-l border-purple-300 border-r border-b">
                <td className="px-4 py-4 text-white text-lg text-center">PS4/5</td>
                <td className="px-4 py-4 text-white text-lg font-bold text-center">1</td>
                <td className="px-4 py-4 text-white text-lg font-bold text-center">{psPrice}</td>
              </tr>
            </tbody>
          </table>
          <div className="mt-4">
            <p className="text-white text-2xl font-light text-right mr-2">Total Cost: <span className="font-bold font-sans">{totalCost}</span></p>
            <div className="mt-2 flex mb-10">
              <label className="text-white text-xl font-bold mt-2 mr-6">Discount:</label>
              <div className="flex space-x-10 mt-2">
                <button onClick={() => setDiscount(5)} className="bg-purple-600 text-white px-5 py-1 rounded">5%</button>
                <button onClick={() => setDiscount(10)} className="bg-purple-600 text-white ml-5 px-5 py-1 rounded">10%</button>
                <button onClick={() => setDiscount(15)} className="bg-purple-600 text-white px-5 py-1 rounded">15%</button>
              </div>
            </div>
              <p className="text-white mt-2 text-3xl font-light">Final Bill: <span className="font-bold font-sans ml-5">{finalCost.toFixed(2)}</span></p>
          </div>
        </div>

        {/* End Session Button */}
        <button className="bg-red-600 text-white py-3 px-7 font-bold text-xl rounded hover:bg-red-500 transition mt-8">End Session</button>
      </div>
    </div>
  );
};

export default UserProfile;
