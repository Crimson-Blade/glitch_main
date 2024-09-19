import React from 'react';

const FoodMenu: React.FC = () => {
  const menuItems = [
    { id: 1, name: 'Red Pasta', price: 100, image: '/images/pasta.png' }, // Adjust image paths accordingly
    { id: 2, name: 'Red Pasta', price: 100, image: '/images/pasta.png' },
    { id: 3, name: 'Red Pasta', price: 100, image: '/images/pasta.png' },
    { id: 4, name: 'Red Pasta', price: 100, image: '/images/pasta.png' },
    { id: 5, name: 'Red Pasta', price: 100, image: '/images/pasta.png' },
  ];

  return (
    <div className="bg-[#111111] min-h-screen p-10 text-center">
      {/* MENU TITLE */}
      <h1 className="text-purple-400 text-6xl font-bold mb-3 font-heading">
        MENU
      </h1>
      <div className="w-full flex justify-center mb-8">
        <div className="border-t-2 border-white w-64"></div>
      </div>

      {/* STARTERS SECTION */}
      <h2 className="text-cyan-500 mt-16 text-3xl font-bold mb-2">
        STARTERS
      </h2>
      <div className="border-t-2 border-gray-500 w-16 mx-auto mb-10"></div>

      {/* MENU CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-center items-center">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#202020] p-5 rounded-lg border border-purple-500 hover:border-purple-300 hover:bg-[#2b2b2b] transition-colors-duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="rounded-full mx-auto mb-5 w-24 h-24 object-cover"
            />
            <h3 className="text-purple-300 text-md font-bold">{item.name}</h3>
            <p className="text-white text-lg font-semibold mt-2">
              ₹{item.price}
            </p>
            <button className="bg-purple-500 text-white font-bold py-2 px-6 rounded-full mt-4 w-full hover:bg-purple-600">
              ADD
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodMenu;
