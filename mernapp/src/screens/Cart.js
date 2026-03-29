import React, { useState } from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';

export default function Cart() {
  const cartItems = useCart();
  const dispatch = useDispatchCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  const handleCheckOut = async () => {
    if (cartItems.length === 0) {
      setShowEmptyMessage(true);
      setTimeout(() => setShowEmptyMessage(false), 3000);
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please login first!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/orderData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_data: cartItems,
          email: userEmail,
          order_date: new Date().toDateString(),
        }),
      });

      const responseData = await response.json();
      setIsLoading(false);

      if (response.ok && responseData.success) {
        alert("✅ Order placed successfully!");
        dispatch({ type: "DROP" }); // 🧹 clear cart
        setShowEmptyMessage(true);
        setTimeout(() => setShowEmptyMessage(false), 3000);
      } else {
        alert("❌ Failed: " + (responseData.message || "Unknown error"));
      }
    } catch (error) {
      setIsLoading(false);
      alert("⚠️ Network error: " + error.message);
    }
  };

  const handleRemove = (index) => {
    dispatch({ type: "REMOVE", index });
  };

  const totalPrice = cartItems.reduce((total, food) => total + food.price, 0);

  return (
    <div>
      {showEmptyMessage && (
        <div style={{
          margin: '20px',
          padding: '15px',
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          borderRadius: '5px',
          color: '#0c5460',
          fontSize: '1.1rem',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          🛒 Your Cart is Empty!
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="m-5 w-100 text-center fs-3">
          Your Cart is Empty!
        </div>
      ) : (
        <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
          <table className="table table-hover">
            <thead className="text-success fs-4">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Option</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((food, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{food.name}</td>
                  <td>{food.qty}</td>
                  <td>{food.size}</td>
                  <td>Rs. {food.price}</td>
                  <td>
                    <button
                      type="button"
                      className="btn p-0 text-danger"
                      onClick={() => handleRemove(index)}
                      disabled={isLoading}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <h1 className="fs-2">Total Price: Rs. {totalPrice}/-</h1>
          </div>

          <div>
            <button
              className="btn bg-success mt-5 text-white"
              onClick={handleCheckOut}
              disabled={isLoading}
            >
              {isLoading ? "⏳ Processing..." : "✓ Check Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
