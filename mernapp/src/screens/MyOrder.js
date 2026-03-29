import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        const userEmail = localStorage.getItem("userEmail");

        if (!userEmail) {
            alert("Please login first!");
            setLoading(false);
            return;
        }

        try {
            console.log("Fetching orders for:", userEmail);
            setLoading(true);

            const response = await fetch("http://localhost:5000/api/myorderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userEmail
                })
            });

            const data = await response.json();
            console.log("Orders received:", data);

            if (data.success && data.orderData && data.orderData.order_data) {
                setOrderData(data.orderData.order_data);
            } else {
                setOrderData([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            alert("Failed to load orders. Please try again.");
            setOrderData([]);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white'
                }}>
                    <div className="text-center">
                        <div className="spinner-border text-success" role="status" style={{ width: '4rem', height: '4rem', borderWidth: '0.4rem' }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <h3 className="mt-4" style={{ fontWeight: '600', fontSize: '1.5rem' }}>Loading your orders...</h3>
                        <p style={{ color: '#999', marginTop: '10px' }}>Please wait while we fetch your order history</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (orderData.length === 0) {
        return (
            <>
                <Navbar />
                <div style={{
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                    minHeight: '100vh',
                    padding: '80px 20px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'linear-gradient(145deg, #1a1a1a, #252525)',
                        padding: '70px 50px',
                        borderRadius: '20px',
                        maxWidth: '650px',
                        margin: '0 auto',
                        border: '1px solid #2a2a2a',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            margin: '0 auto 30px',
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3.5rem',
                            boxShadow: '0 10px 30px rgba(40, 167, 69, 0.3)'
                        }}>
                            🍽️
                        </div>
                        <h2 style={{
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '20px',
                            fontSize: '2rem',
                            fontWeight: '700'
                        }}>
                            No Orders Yet!
                        </h2>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#aaa',
                            lineHeight: '1.6',
                            marginBottom: '35px'
                        }}>
                            Looks like you haven't placed any orders yet.<br />
                            Start exploring our delicious menu and place your first order!
                        </p>
                        <a href="/" className="btn btn-success" style={{
                            padding: '15px 50px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            boxShadow: '0 10px 30px rgba(40, 167, 69, 0.4)',
                            transition: 'all 0.3s ease',
                            textDecoration: 'none'
                        }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px)';
                                e.target.style.boxShadow = '0 15px 40px rgba(40, 167, 69, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 10px 30px rgba(40, 167, 69, 0.4)';
                            }}>
                            Browse Menu
                        </a>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div style={{
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                minHeight: '100vh',
                color: 'white',
                padding: '50px 20px'
            }}>
                <div className='container'>
                    <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                        <h1 style={{
                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '800',
                            fontSize: '3rem',
                            letterSpacing: '1px',
                            marginBottom: '10px'
                        }}>
                            My Orders
                        </h1>
                        <p style={{ color: '#999', fontSize: '1.1rem' }}>
                            Track and review your order history
                        </p>
                        <div style={{
                            width: '80px',
                            height: '4px',
                            background: 'linear-gradient(90deg, #28a745, #20c997)',
                            margin: '20px auto 0',
                            borderRadius: '2px'
                        }}></div>
                    </div>

                    <div className="row">
                        {orderData.slice(0).reverse().map((orderGroup, groupIndex) => {
                            const orderDate = orderGroup[0]?.Order_date;
                            const items = orderGroup.slice(1);
                            const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);

                            return (
                                <div key={groupIndex} className="col-12 mb-4">
                                    <div style={{
                                        background: 'linear-gradient(145deg, #1a1a1a, #252525)',
                                        borderRadius: '16px',
                                        padding: '30px',
                                        border: '1px solid #2a2a2a',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-8px)';
                                            e.currentTarget.style.boxShadow = '0 15px 50px rgba(40, 167, 69, 0.2)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.4)';
                                        }}>
                                        {/* Decorative corner accent */}
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            width: '100px',
                                            height: '100px',
                                            background: 'linear-gradient(135deg, transparent, rgba(40, 167, 69, 0.1))',
                                            borderRadius: '0 16px 0 100%'
                                        }}></div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: '25px',
                                            paddingBottom: '20px',
                                            borderBottom: '2px solid #2a2a2a',
                                            flexWrap: 'wrap',
                                            gap: '15px'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <div style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.5rem',
                                                    boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)'
                                                }}>
                                                    📅
                                                </div>
                                                <div>
                                                    <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: '#fff' }}>
                                                        {orderDate || 'N/A'}
                                                    </h4>
                                                    <p style={{ margin: '5px 0 0', fontSize: '0.85rem', color: '#999' }}>
                                                        Order #{groupIndex + 1}
                                                    </p>
                                                </div>
                                            </div>
                                            <span style={{
                                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                color: 'white',
                                                padding: '10px 25px',
                                                borderRadius: '50px',
                                                fontSize: '0.95rem',
                                                fontWeight: '700',
                                                boxShadow: '0 5px 15px rgba(40, 167, 69, 0.3)',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {items.length} {items.length === 1 ? 'Item' : 'Items'}
                                            </span>
                                        </div>

                                        <div className='row'>
                                            {items.map((item, itemIndex) => (
                                                <div key={itemIndex} className='col-12 col-md-6 col-lg-4 mb-3'>
                                                    <div style={{
                                                        background: 'linear-gradient(145deg, #222, #2a2a2a)',
                                                        borderRadius: '12px',
                                                        padding: '20px',
                                                        border: '1px solid #333',
                                                        height: '100%',
                                                        transition: 'all 0.3s ease',
                                                        position: 'relative'
                                                    }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1.03)';
                                                            e.currentTarget.style.borderColor = '#28a745';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform = 'scale(1)';
                                                            e.currentTarget.style.borderColor = '#333';
                                                        }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '10px',
                                                            right: '10px',
                                                            width: '8px',
                                                            height: '8px',
                                                            background: '#28a745',
                                                            borderRadius: '50%',
                                                            boxShadow: '0 0 10px #28a745'
                                                        }}></div>

                                                        <h5 style={{
                                                            color: '#fff',
                                                            marginBottom: '15px',
                                                            fontSize: '1.15rem',
                                                            fontWeight: '700',
                                                            letterSpacing: '0.3px'
                                                        }}>
                                                            {item.name}
                                                        </h5>
                                                        <div style={{ fontSize: '0.95rem', color: '#bbb' }}>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                marginBottom: '10px',
                                                                padding: '8px 0'
                                                            }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ fontSize: '1.1rem' }}>📦</span>
                                                                    Quantity
                                                                </span>
                                                                <strong style={{
                                                                    color: '#fff',
                                                                    fontSize: '1.05rem',
                                                                    background: 'rgba(40, 167, 69, 0.1)',
                                                                    padding: '2px 12px',
                                                                    borderRadius: '12px'
                                                                }}>
                                                                    {item.qty}
                                                                </strong>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                marginBottom: '12px',
                                                                padding: '8px 0'
                                                            }}>
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                    <span style={{ fontSize: '1.1rem' }}>📏</span>
                                                                    Size
                                                                </span>
                                                                <strong style={{ color: '#fff', fontSize: '1.05rem' }}>
                                                                    {item.size}
                                                                </strong>
                                                            </div>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                paddingTop: '12px',
                                                                borderTop: '2px solid #333',
                                                                marginTop: '12px'
                                                            }}>
                                                                <span style={{
                                                                    fontSize: '1rem',
                                                                    fontWeight: '600',
                                                                    color: '#ccc'
                                                                }}>
                                                                    Price
                                                                </span>
                                                                <strong style={{
                                                                    background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                                    WebkitBackgroundClip: 'text',
                                                                    WebkitTextFillColor: 'transparent',
                                                                    fontSize: '1.35rem',
                                                                    fontWeight: '800'
                                                                }}>
                                                                    Rs. {item.price}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{
                                            borderTop: '2px solid #2a2a2a',
                                            paddingTop: '25px',
                                            marginTop: '25px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '15px',
                                            background: 'linear-gradient(90deg, rgba(40, 167, 69, 0.05), transparent)'
                                        }}>
                                            <h5 style={{
                                                color: '#fff',
                                                margin: 0,
                                                fontSize: '1.3rem',
                                                fontWeight: '700',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Order Total
                                            </h5>
                                            <h3 style={{
                                                background: 'linear-gradient(135deg, #28a745, #20c997)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                margin: 0,
                                                fontSize: '2.2rem',
                                                fontWeight: '900',
                                                letterSpacing: '1px'
                                            }}>
                                                Rs. {totalPrice}/-
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}