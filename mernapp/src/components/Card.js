import React, { useState } from 'react';
import { useDispatchCart } from './ContextReducer';

export default function Card(props) {
    let dispatch = useDispatchCart();
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState('');
    
    // Get options from props
    const optionsData = props.options && props.options.length > 0 ? props.options[0] : {};
    const priceOptions = Object.keys(optionsData);
    
    const handleAddToCart = async () => {
        const itemId = props._id || props.id || `${props.name}-${Date.now()}`;
        const finalPrice = calculatePrice();
        
        console.log('Added to cart:', {
            id: itemId,
            foodName: props.name,
            categoryName: props.CategoryName,
            quantity,
            size,
            price: finalPrice,
            img: finalImageUrl
        });

        await dispatch({
            type: "ADD",
            id: itemId,
            name: props.name,
            price: finalPrice,
            qty: quantity,
            size: size,
            img: finalImageUrl
        });
        
        alert(`${props.name} added to cart!`);
    };

    const isPizza = (props.CategoryName && props.CategoryName.toLowerCase().includes('pizza'));

    React.useEffect(() => {
        if (priceOptions.length > 0) {
            setSize(priceOptions[0]);
        } else if (isPizza) {
            setSize('medium');
        } else {
            setSize('half');
        }
    }, [isPizza, priceOptions]);

    // Simple fallback image function
    const getDefaultImage = (foodName) => {
        if (!foodName) return "https://via.placeholder.com/400x300/28a745/ffffff?text=Food+Item";
        
        const name = foodName.toLowerCase().trim();
        
        // Use Pixabay/direct CDN links (more reliable)
        if (name === 'mix veg pizza') {
            return 'https://cdn.pixabay.com/photo/2017/12/10/14/47/pizza-3010062_640.jpg';
        }
        if (name.includes('pizza')) {
            return 'https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg';
        }
        if (name.includes('biryani')) {
            return 'https://cdn.pixabay.com/photo/2019/11/04/12/16/rice-4601049_640.jpg';
        }
        if (name.includes('paneer')) {
            return 'https://cdn.pixabay.com/photo/2022/06/10/05/32/paneer-7253300_640.jpg';
        }
        
        // Default food image
        return 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg';
    };

    const calculatePrice = () => {
        if (priceOptions.length > 0 && size && optionsData[size]) {
            const priceValue = parseInt(optionsData[size]) || 299;
            return priceValue * quantity;
        }
        
        const basePrice = props.price || 299;
        let multiplier = 1;
        
        if (isPizza) {
            switch(size) {
                case 'regular': multiplier = 0.8; break;
                case 'medium': multiplier = 1; break;
                case 'large': multiplier = 1.5; break;
                default: multiplier = 1;
            }
        } else {
            multiplier = size === 'full' ? 1 : 0.6;
        }
        
        return Math.round(basePrice * multiplier * quantity);
    };

    // ALWAYS use fallback if MongoDB image fails
    const finalImageUrl = props.img || getDefaultImage(props.name);

    return (
        <div className="d-flex justify-content-center mb-4">
            <div 
                className="card shadow-sm border-0" 
                style={{ 
                    width: "20rem", 
                    borderRadius: "12px",
                    overflow: "hidden"
                }}
            >
                <div style={{ position: "relative", overflow: "hidden", height: "200px", backgroundColor: "#f0f0f0" }}>
                    <img
                        src={finalImageUrl}
                        className="card-img-top"
                        alt={props.name || "Food item"}
                        style={{ 
                            width: "100%",
                            height: "100%", 
                            objectFit: "cover"
                        }}
                        onError={(e) => {
                            // If image fails, use absolute fallback
                            e.target.src = 'https://cdn.pixabay.com/photo/2016/03/05/19/02/hamburger-1238246_960_720.jpg';
                        }}
                    />
                    {props.CategoryName && (
                        <div 
                            className="position-absolute top-0 start-0 m-2 px-3 py-1 rounded-pill text-white fw-bold"
                            style={{ 
                                backgroundColor: "rgba(40, 167, 69, 0.95)", 
                                fontSize: "0.75rem",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                            }}
                        >
                            {props.CategoryName}
                        </div>
                    )}
                </div>

                <div className="card-body p-3">
                    <h5 className="card-title mb-2 text-center fw-bold" style={{ color: "#2c3e50", fontSize: "1.2rem" }}>
                        {props.name || "Delicious Food Item"}
                    </h5>
                    
                    <p className="card-text text-muted text-center mb-3" style={{ fontSize: "0.85rem", minHeight: "2.8rem" }}>
                        {props.description || "Delicious and freshly prepared"}
                    </p>

                    <div className="mb-3">
                        <div className="row g-2">
                            <div className="col-6">
                                <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "0.8rem" }}>
                                    Quantity
                                </label>
                                <select 
                                    className="form-select form-select-sm border-0 shadow-sm"
                                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                >
                                    {Array.from(Array(10), (e, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-6">
                                <label className="form-label text-muted fw-semibold mb-1" style={{ fontSize: "0.8rem" }}>
                                    Size
                                </label>
                                <select 
                                    className="form-select form-select-sm border-0 shadow-sm"
                                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                >
                                    {priceOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option.charAt(0).toUpperCase() + option.slice(1)} - Rs. {optionsData[option]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between align-items-center p-2 mb-3 rounded" style={{ backgroundColor: "#f8f9fa" }}>
                        <span className="text-muted fw-semibold" style={{ fontSize: "0.9rem" }}>Total Price:</span>
                        <span className="fw-bold" style={{ fontSize: "1.2rem", color: "#28a745" }}>
                            Rs. {calculatePrice()}
                        </span>
                    </div>

                    <button 
                        className="btn w-100 fw-semibold text-white border-0 shadow-sm"
                        style={{ 
                            backgroundColor: "#28a745", 
                            borderRadius: "8px", 
                            padding: "10px",
                            transition: "all 0.2s ease"
                        }}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}