import React, { useState } from 'react';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    menu: '',
    name: '',
    description: '',
    image: null,
    price: ''
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };


  return (
    <div className="flex items-center justify-center bg-gray-900 text-white h-screen">
      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md shadow-lg overflow-y-auto">
        <h2 className="text-2xl font-bold text-green-400 mb-6 text-center">Add Product</h2>

        <form encType="multipart/form-data" className="flex flex-col gap-y-4">

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Select Category</label>
            <select
              name="menu"
              onChange={handleChange}
              className="p-2 rounded bg-white text-black"
              required
            >
              <option value="" disabled>Select Category</option>
              <option value="Electronics">Electronics</option>
              <option value="Beauty">Beauty</option>
              <option value="Books">Books</option>
              <option value="Grocery Items">Grocery Items</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter product name"
              onChange={handleChange}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              name="description"
              placeholder="Enter description"
              onChange={handleChange}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Price</label>
            <input
              type="text"
              name="price"
              placeholder="Enter price"
              onChange={handleChange}
              className="p-2 rounded bg-white text-black"
              required
            />
          </div>

          <button
            type="submit"
            className="py-2 px-4 bg-green-500 hover:bg-green-600 rounded text-white font-bold mt-2"
          >
            Add Product
          </button>

        </form>
      </div>
   
    </div>
  );
};

export default AddProduct;