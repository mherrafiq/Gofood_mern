import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Badge } from 'react-bootstrap'
import { useCart, useDispatchCart } from './ContextReducer'
import Modal from './Modal'
import API_BASE_URL from '../config'

export default function Navbar() {
  const navigate = useNavigate();
  const cartItems = useCart();
  const dispatch = useDispatchCart();
  const [cartView, setCartView] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showCheckoutMessage, setShowCheckoutMessage] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem("authToken")) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/getuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem("userEmail") })
      });
      const data = await response.json();
      if (data.success) {
        setProfileImage(data.user.profileImage);
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);
    formData.append('email', localStorage.getItem("userEmail"));

    setUploading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/uploadimage`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setProfileImage(data.profileImage);
        alert("Profile image uploaded! ✨");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!window.confirm("Delete profile picture?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/deleteimage`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: localStorage.getItem("userEmail") })
      });
      const data = await response.json();
      if (data.success) {
        setProfileImage("");
        alert("Profile image deleted! 🗑️");
      }
    } catch (error) {
      alert("Delete failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  const handleRemove = (index) => {
    dispatch({ type: "REMOVE", index: index })
  }

  let totalPrice = cartItems.reduce((total, food) => total + food.price, 0);

  const handleCheckOut = async () => {
    if (cartItems.length === 0) {
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 3000);
      return;
    }

    let userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Please login to place an order!");
      return;
    }

    console.log('Finalizing order for:', userEmail);

    try {
      let response = await fetch("http://localhost:5000/api/orderData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          order_data: cartItems,
          email: userEmail,
          order_date: new Date().toDateString()
        })
      });

      console.log("Order response status:", response.status);
      const json = await response.json();

      if (json.success) {
        dispatch({ type: "DROP" });
        setShowCheckoutMessage(true);
      } else {
        alert("Failed to place order: " + (json.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Network Error! Please check your connection.");
    }
  }

  return (
    <>
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateY(-10px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes bounceIn {
            0% {
              transform: scale(0.3);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .navbar-custom {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .navbar-brand-custom {
            font-size: clamp(1.5rem, 4vw, 2rem) !important;
            font-weight: 800 !important;
            background: linear-gradient(135deg, #fff 0%, #e8f5e9 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            letter-spacing: 1px;
            transition: all 0.3s ease;
          }

          .navbar-brand-custom:hover {
            transform: scale(1.05);
          }

          .nav-link-custom {
            color: rgba(255, 255, 255, 0.95) !important;
            font-weight: 600 !important;
            font-size: 1.05rem !important;
            padding: 8px 16px !important;
            margin: 0 4px;
            border-radius: 8px;
            transition: all 0.3s ease;
            position: relative;
          }

          .nav-link-custom::after {
            content: '';
            position: absolute;
            bottom: 5px;
            left: 16px;
            right: 16px;
            height: 2px;
            background: #fff;
            transform: scaleX(0);
            transition: transform 0.3s ease;
          }

          .nav-link-custom:hover {
            background: rgba(255, 255, 255, 0.15);
            color: #fff !important;
          }

          .nav-link-custom:hover::after {
            transform: scaleX(1);
          }

          .btn-cart {
            background: #fff !important;
            color: #28a745 !important;
            border: 2px solid transparent !important;
            padding: 8px 20px !important;
            border-radius: 10px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
          }

          .btn-cart:hover {
            background: transparent !important;
            color: #fff !important;
            border-color: #fff !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15) !important;
          }

          .btn-logout {
            background: rgba(220, 53, 69, 0.95) !important;
            color: #fff !important;
            border: 2px solid transparent !important;
            padding: 8px 20px !important;
            border-radius: 10px !important;
            font-weight: 700 !important;
            font-size: 1rem !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3) !important;
          }

          .btn-logout:hover {
            background: #c82333 !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4) !important;
          }

          .cart-badge {
            animation: bounceIn 0.5s ease;
          }

          .warning-alert {
            animation: shake 0.5s ease;
          }

          .modal-header-custom {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            border-radius: 10px 10px 0 0;
            padding: 20px 30px;
          }

          .table-custom {
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          }

          .table-custom thead {
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
          }

          .table-custom tbody tr {
            transition: all 0.3s ease;
          }

          .table-custom tbody tr:hover {
            background: rgba(40, 167, 69, 0.05);
            transform: scale(1.01);
          }

          .btn-remove {
            transition: all 0.3s ease;
          }

          .btn-remove:hover {
            transform: scale(1.2) rotate(90deg);
          }

          .success-message {
            animation: bounceIn 0.6s ease;
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            border: 3px solid #28a745;
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 10px 40px rgba(40, 167, 69, 0.2);
          }

          .success-icon {
            font-size: 5rem;
            animation: bounceIn 0.8s ease;
            display: inline-block;
            filter: drop-shadow(0 4px 10px rgba(40, 167, 69, 0.3));
          }

          .empty-cart {
            padding: 60px 20px;
            text-align: center;
            color: #6c757d;
          }

          .empty-cart-icon {
            font-size: 5rem;
            opacity: 0.3;
            margin-bottom: 20px;
          }

          @media (max-width: 768px) {
            .btn-cart,
            .btn-logout {
              margin: 5px 0 !important;
              width: 100%;
            }
          }
        `}
      </style>

      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand navbar-brand-custom" to="/">
            🍔 GoFood
          </Link>

          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            style={{ boxShadow: 'none' }}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className='nav-item'>
                <Link className="nav-link nav-link-custom" to="/">
                  🏠 Home
                </Link>
              </li>
              <li className='nav-item'>
                <Link className="nav-link nav-link-custom" to="/myorders">
                  📦 My Orders
                </Link>
              </li>
            </ul>

            <div className='d-flex align-items-center me-3'>
              {(localStorage.getItem("authToken")) ?
                <div 
                  className='d-flex align-items-center' 
                  onClick={() => setShowProfileModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '5px 15px',
                    borderRadius: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(5px)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#28a745',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                    overflow: 'hidden'
                  }}>
                    {profileImage ? (
                      <img 
                        src={`${API_BASE_URL}/uploads/${profileImage}`} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    )}
                  </div>
                  <span style={{
                    color: "#fff",
                    fontWeight: '600',
                    fontSize: '0.95rem'
                  }}>
                    {localStorage.getItem("userName") || "User"}
                  </span>
                </div>
                : ""
              }
            </div>

            <div className='d-flex flex-column flex-lg-row gap-2'>
              <button
                className='btn btn-cart'
                onClick={() => setCartView(true)}
              >
                🛒 My Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="danger" className="ms-2 cart-badge">
                    {cartItems.length}
                  </Badge>
                )}
              </button>

              <button
                className='btn btn-logout'
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav >

      {showProfileModal && (
        <Modal onClose={() => setShowProfileModal(false)}>
          <div className='p-4 text-center'>
            <div className="modal-header-custom mb-4">
              <h2 className='text-center mb-0'>👤 Manage Profile</h2>
            </div>
            
            <div className="mb-4">
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto',
                border: '4px solid #28a745',
                overflow: 'hidden',
                backgroundColor: '#f8f9fa',
                position: 'relative'
              }}>
                {profileImage ? (
                  <img 
                    src={`http://localhost:5000/uploads/${profileImage}`} 
                    alt="Current Profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <div style={{ fontSize: '3rem', marginTop: '20px' }}>👤</div>
                )}
                {uploading && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div className="spinner-border text-success" role="status"></div>
                  </div>
                )}
              </div>
            </div>

            <h4 className="fw-bold mb-4">{localStorage.getItem("userName")}</h4>

            <div className="d-flex flex-column gap-3 mx-auto" style={{ maxWidth: '300px' }}>
              <label className="btn btn-success d-block py-2 fw-bold" style={{ borderRadius: '10px', cursor: 'pointer' }}>
                {profileImage ? "Change Picture" : "Upload Picture"}
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" disabled={uploading} />
              </label>

              {profileImage && (
                <button 
                  className="btn btn-outline-danger py-2 fw-bold" 
                  style={{ borderRadius: '10px' }}
                  onClick={handleDeleteImage}
                  disabled={uploading}
                >
                  Delete Picture
                </button>
              )}
              
              <button 
                className="btn btn-secondary py-2 fw-bold" 
                style={{ borderRadius: '10px' }}
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {cartView && (
        <Modal onClose={() => setCartView(false)}>
          <div className='container m-auto mt-2 table-responsive'>

            {showMessage && (
              <div className="alert alert-warning warning-alert text-center mb-4" style={{
                borderRadius: '12px',
                border: '2px solid #ffc107',
                fontWeight: '600',
                fontSize: '1.1rem'
              }}>
                ⚠️ Your cart is empty! Please add items before checkout.
              </div>
            )}

            {showCheckoutMessage ? (
              <div className="success-message text-center">
                <div className="success-icon mb-4">✅</div>
                <h1 style={{
                  color: '#155724',
                  marginBottom: '20px',
                  fontSize: '2.5rem',
                  fontWeight: '800'
                }}>
                  Order Placed Successfully!
                </h1>
                <p style={{
                  color: '#155724',
                  fontSize: '1.3rem',
                  marginBottom: '30px',
                  fontWeight: '500'
                }}>
                  Thank you for your order! Your delicious food is on its way! 🚀
                </p>
                <button
                  className='btn btn-success btn-lg px-5 py-3'
                  onClick={() => {
                    setShowCheckoutMessage(false);
                    setCartView(false);
                  }}
                  style={{
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className='empty-cart'>
                <div className="modal-header-custom mb-4">
                  <h2 className='text-center mb-0'>🛒 My Cart</h2>
                </div>
                <div className='empty-cart-icon'>🛒</div>
                <h3 style={{ fontWeight: '700', color: '#6c757d' }}>Your Cart is Empty!</h3>
                <p style={{ fontSize: '1.1rem', color: '#6c757d' }}>
                  Looks like you haven't added any items yet.
                </p>
              </div>
            ) : (
              <>
                <div className="modal-header-custom mb-4">
                  <h2 className='text-center mb-0'>🛒 My Cart</h2>
                </div>

                <table className='table table-hover table-custom mb-4'>
                  <thead>
                    <tr>
                      <th scope='col' style={{ padding: '15px' }}>#</th>
                      <th scope='col' style={{ padding: '15px' }}>Name</th>
                      <th scope='col' style={{ padding: '15px' }}>Qty</th>
                      <th scope='col' style={{ padding: '15px' }}>Size</th>
                      <th scope='col' style={{ padding: '15px' }}>Amount</th>
                      <th scope='col' style={{ padding: '15px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((food, index) => (
                      <tr key={index}>
                        <th scope='row' style={{ padding: '15px' }}>{index + 1}</th>
                        <td style={{ padding: '15px', fontWeight: '600' }}>{food.name}</td>
                        <td style={{ padding: '15px' }}>{food.qty}</td>
                        <td style={{ padding: '15px' }}>{food.size}</td>
                        <td style={{ padding: '15px', fontWeight: '700', color: '#28a745' }}>
                          Rs. {food.price}
                        </td>
                        <td style={{ padding: '15px' }}>
                          <button
                            type="button"
                            className="btn btn-remove p-0 text-danger border-0 bg-transparent"
                            onClick={() => handleRemove(index)}
                            style={{ fontSize: '1.5rem' }}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className='text-end mb-4' style={{
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(32, 201, 151, 0.1))',
                  borderRadius: '12px',
                  border: '2px solid rgba(40, 167, 69, 0.2)'
                }}>
                  <h3 style={{
                    fontWeight: '800',
                    fontSize: '2rem',
                    color: '#28a745',
                    margin: 0
                  }}>
                    Total: Rs. {totalPrice}/-
                  </h3>
                </div>

                <div className='text-center'>
                  <button
                    className='btn btn-success btn-lg px-5 py-3'
                    onClick={handleCheckOut}
                    style={{
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '1.2rem',
                      boxShadow: '0 6px 20px rgba(40, 167, 69, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-3px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    🎉 Check Out Now
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )
      }
    </>
  )
}