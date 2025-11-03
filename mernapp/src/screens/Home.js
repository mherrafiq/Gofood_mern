import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function Home() {
  const [search, setSearch] = useState('');
  const [foodCat, setFoodCat] = useState([]);
  const [foodItem, setFoodItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      let response = await fetch("http://localhost:5000/api/foodData", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const foodItems = data[0] || [];
      setFoodItem(foodItems);

      const uniqueCategories = [...new Set(foodItems.map(item => item.CategoryName))]
        .map(categoryName => ({ CategoryName: categoryName }));
      
      setFoodCat(uniqueCategories);
      setError(null);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load food data. Please try again later.");
      setFoodItem([]);
      setFoodCat([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />
        <CarouselSection search={search} setSearch={setSearch} />
        <div className='container py-5'>
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-4 text-light fs-5">Loading delicious food...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
        <Navbar />
        <CarouselSection search={search} setSearch={setSearch} />
        <div className='container py-5'>
          <div className="error-container text-center">
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😔</div>
            <h3 className="text-white mb-3">Oops! Something went wrong</h3>
            <p className="text-light mb-4">{error}</p>
            <button 
              className="btn btn-success btn-lg px-5"
              onClick={() => loadData()}
              style={{ borderRadius: '10px', fontWeight: '600' }}
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
      <Navbar />
      <CarouselSection search={search} setSearch={setSearch} />

      <div className='container' style={{ padding: '60px 20px' }}>
        {foodCat && foodCat.length > 0 ? (
          foodCat.map((data, index) => {
            const filteredItems = foodItem.filter(
              (item) => item.CategoryName === data.CategoryName && 
              item.name.toLowerCase().includes(search.toLowerCase())
            );

            if (filteredItems.length === 0 && search) return null;

            return (
              <div key={data._id || index} className="mb-5">
                <div className="mb-4">
                  <h2 className="category-title fs-2">
                    {data.CategoryName}
                  </h2>
                </div>
                <hr className="category-divider" />
                
                <div className="row g-4">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(filterItems => (
                      <div key={filterItems._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                        <Card 
                          name={filterItems.name}
                          CategoryName={filterItems.CategoryName}
                          img={filterItems.img}
                          description={filterItems.description}
                          options={filterItems.options}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <div className="text-center py-4" style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <p className="text-light mb-0">No items found in this category</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3 className="text-white mb-3">No Menu Available</h3>
            <p className="text-light mb-4">Please check back later for our delicious offerings</p>
            <button 
              className="btn btn-success btn-lg px-5"
              onClick={() => loadData()}
              style={{ borderRadius: '10px', fontWeight: '600' }}
            >
              Refresh Menu
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// CarouselSection component defined outside to prevent re-renders
const CarouselSection = React.memo(({ search, setSearch }) => {
  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .hero-section {
            position: relative;
            overflow: hidden;
          }

          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              180deg,
              rgba(0, 0, 0, 0.3) 0%,
              rgba(0, 0, 0, 0.5) 50%,
              rgba(0, 0, 0, 0.7) 100%
            );
            z-index: 1;
          }

          .search-container {
            animation: fadeInUp 0.8s ease-out 0.3s both;
          }

          input::placeholder {
            color: #cbd5e0 !important;
            opacity: 1;
          }

          input:focus::placeholder {
            color: #a0aec0 !important;
          }

          .search-input {
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(20px);
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .search-input:focus {
            background: rgba(255, 255, 255, 1) !important;
            border-color: #28a745 !important;
            box-shadow: 0 20px 60px rgba(40, 167, 69, 0.3), 0 0 0 4px rgba(40, 167, 69, 0.1) !important;
            transform: translateY(-2px);
          }

          .search-button {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%) !important;
            border: none !important;
            box-shadow: 0 10px 30px rgba(40, 167, 69, 0.4) !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }

          .search-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            transition: left 0.5s;
          }

          .search-button:hover::before {
            left: 100%;
          }

          .search-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(40, 167, 69, 0.5) !important;
          }

          .search-button:active {
            transform: translateY(-1px);
          }

          .carousel-control-prev,
          .carousel-control-next {
            width: 60px;
            height: 60px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.15);
            backdrop-filter: blur(10px);
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0.9;
          }

          .carousel-control-prev:hover,
          .carousel-control-next:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateY(-50%) scale(1.1);
            opacity: 1;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          }

          .carousel-indicators {
            bottom: 30px;
            gap: 12px;
          }

          .carousel-indicators button {
            width: 12px !important;
            height: 12px !important;
            border-radius: 50% !important;
            background: rgba(255, 255, 255, 0.5) !important;
            border: 2px solid rgba(255, 255, 255, 0.8) !important;
            transition: all 0.3s ease !important;
            opacity: 1 !important;
          }

          .carousel-indicators button:hover {
            background: rgba(255, 255, 255, 0.8) !important;
            transform: scale(1.3) !important;
          }

          .carousel-indicators button.active {
            width: 40px !important;
            border-radius: 6px !important;
            background: rgba(255, 255, 255, 0.95) !important;
          }

          .carousel-item img {
            transition: transform 8s ease-out;
          }

          .carousel-item.active img {
            transform: scale(1.1);
          }

          .category-title {
            position: relative;
            display: inline-block;
            padding-bottom: 12px;
            color: #fff;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .category-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 2px;
          }

          .category-divider {
            background: linear-gradient(90deg, transparent, rgba(40, 167, 69, 0.3), transparent);
            height: 1px;
            border: none;
            margin: 20px 0 30px 0;
          }

          @media (max-width: 768px) {
            .carousel-control-prev,
            .carousel-control-next {
              width: 45px;
              height: 45px;
            }

            .search-input,
            .search-button {
              font-size: 15px !important;
            }
          }

          .loading-shimmer {
            background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }

          .error-container {
            background: linear-gradient(135deg, rgba(220, 53, 69, 0.1), rgba(220, 53, 69, 0.05));
            border: 2px solid rgba(220, 53, 69, 0.3);
            border-radius: 16px;
            padding: 40px;
            backdrop-filter: blur(10px);
          }

          .empty-state {
            padding: 80px 20px;
            text-align: center;
          }

          .empty-state-icon {
            font-size: 80px;
            margin-bottom: 20px;
            opacity: 0.5;
            animation: pulse 2s infinite;
          }

          @media (min-width: 768px) {
            .carousel-control-prev {
              left: 30px !important;
            }
            .carousel-control-next {
              right: 30px !important;
            }
          }
        `}
      </style>
      
      <div className="hero-section">
        <div
          id="carouselExample"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="5000"
          data-bs-pause="hover"
        >
          <div className="carousel-inner position-relative">
            <div className="hero-overlay"></div>
            
            <div className="carousel-item active">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&q=80"
                className="d-block w-100"
                alt="Gourmet Burger"
                style={{ 
                  height: 'clamp(500px, 80vh, 850px)', 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
            
            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&q=80"
                className="d-block w-100"
                alt="Italian Pizza"
                style={{ 
                  height: 'clamp(500px, 80vh, 850px)', 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>
            
            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1920&q=80"
                className="d-block w-100"
                alt="Healthy Bowl"
                style={{ 
                  height: 'clamp(500px, 80vh, 850px)', 
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            </div>

            <div
              className="position-absolute start-50 translate-middle-x search-container"
              style={{ 
                zIndex: 20, 
                width: '100%', 
                maxWidth: '800px', 
                bottom: '20%',
                padding: '0 20px'
              }}
            >
              <div className="text-center mb-4">
                <h1 className="text-white mb-2" style={{ 
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  fontWeight: '800',
                  textShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  letterSpacing: '-1px'
                }}>
                  Delicious Food, Delivered
                </h1>
                <p className="text-white" style={{ 
                  fontSize: 'clamp(1rem, 2vw, 1.3rem)',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                  opacity: 0.95
                }}>
                  Order your favorite meals in minutes
                </p>
              </div>
              
              <div className="d-flex gap-3">
                <input
                  className="form-control search-input"
                  type="search"
                  placeholder="Search for dishes, cuisines, restaurants..."
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    fontSize: 'clamp(15px, 2vw, 17px)',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    fontWeight: '500'
                  }}
                />
                <button
                  type="button"
                  className="btn search-button text-white fw-bold"
                  style={{
                    padding: '16px 40px',
                    borderRadius: '12px',
                    fontSize: 'clamp(15px, 2vw, 17px)',
                    minWidth: '130px',
                    whiteSpace: 'nowrap',
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                    border: 'none'
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>
    </>
  );
});