import { useState } from "react";

const Checkout = ({ totalAmount = 0 }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCardFields, setShowCardFields] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    ccNumber: "",
    ccExpiration: "",
    cvv: ""
  });

  const handlePaymentToggle = (method) => {
    setPaymentMethod(method);
    setShowCardFields(method === "credit");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log({ ...formData, paymentMethod, totalAmount });
  };

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] p-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#1a1a1a] space-y-4"
        >
          <h1 className="text-center text-3xl text-lime-400 mb-2">Checkout</h1>
          <p className="text-center text-lg">Total: <strong>${totalAmount.toFixed(2)}</strong></p>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <input
            type="text"
            name="address"
            placeholder="Street Address"
            required
            value={formData.address}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            required
            value={formData.city}
            onChange={handleChange}
            className="bg-gray-800 text-white p-2 rounded w-full"
          />

          <div className="flex gap-2">
            <button
              type="button"
              className={`flex-1 p-2 rounded ${
                paymentMethod === "credit"
                  ? "bg-lime-400 text-black"
                  : "bg-gray-800 text-white"
              }`}
              onClick={() => handlePaymentToggle("credit")}
            >
              Credit Card
            </button>

            <button
              type="button"
              className={`flex-1 p-2 rounded ${
                paymentMethod === "cash"
                  ? "bg-lime-400 text-black"
                  : "bg-gray-800 text-white"
              }`}
              onClick={() => handlePaymentToggle("cash")}
            >
              Cash on Delivery
            </button>
          </div>

          {showCardFields && (
            <div className="space-y-2">
              <input
                type="text"
                name="ccNumber"
                placeholder="Credit Card Number"
                value={formData.ccNumber}
                onChange={handleChange}
                className="bg-gray-800 text-white p-2 rounded w-full"
              />

              <div className="flex gap-2">
                <input
                  type="text"
                  name="ccExpiration"
                  placeholder="Expiration (MM/YY)"
                  value={formData.ccExpiration}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="bg-gray-800 text-white p-2 rounded w-full"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full p-2 bg-lime-400 text-black font-semibold rounded"
          >
            Proceed
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
