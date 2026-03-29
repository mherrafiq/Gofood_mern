import React, { useState } from 'react'
import API_BASE_URL from '../config'

export default function Signup() {
    const [credentials, setCredentials] = useState({ 
        name: "", 
        email: "", 
        password: "", 
        geolocation: "" 
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        geolocation: false
    });

    // Real-time validation
    const getFieldError = (field) => {
        if (!touched[field]) return null;
        
        switch(field) {
            case 'name':
                if (credentials.name.length === 0) return "Name is required";
                if (credentials.name.length < 5) return "Name must be at least 5 characters";
                return null;
            case 'email':
                if (credentials.email.length === 0) return "Email is required";
                if (!credentials.email.includes("@")) return "Please enter a valid email";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) return "Invalid email format";
                return null;
            case 'password':
                if (credentials.password.length === 0) return "Password is required";
                if (credentials.password.length < 5) return "Password must be at least 5 characters";
                if (credentials.password.length < 8) return "Consider using at least 8 characters for better security";
                return null;
            case 'geolocation':
                if (credentials.geolocation.length === 0) return "Address is required";
                if (credentials.geolocation.length < 3) return "Please enter a valid address";
                return null;
            default:
                return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setLoading(true);

        // Mark all fields as touched
        setTouched({
            name: true,
            email: true,
            password: true,
            geolocation: true
        });

        // Frontend validation
        const frontendErrors = [];
        if (credentials.name.length < 5) {
            frontendErrors.push("Name must be at least 5 characters");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            frontendErrors.push("Please enter a valid email");
        }
        if (credentials.password.length < 5) {
            frontendErrors.push("Password must be at least 5 characters");
        }
        if (credentials.geolocation.length < 3) {
            frontendErrors.push("Please enter a valid address");
        }

        if (frontendErrors.length > 0) {
            setErrors(frontendErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/createuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: credentials.name.trim(),
                    email: credentials.email.trim().toLowerCase(),
                    password: credentials.password,
                    location: credentials.geolocation.trim()
                })
            });

            const json = await response.json();

            if (!json.success) {
                if (json.errors && Array.isArray(json.errors)) {
                    const errorMessages = json.errors.map(err => 
                        err.msg || err.message || JSON.stringify(err)
                    );
                    setErrors(errorMessages);
                } else if (json.message) {
                    setErrors([json.message]);
                } else {
                    setErrors(["Failed to create account. Please try again."]);
                }
            } else {
                // Success
                setSuccess(true);
                setCredentials({ name: "", email: "", password: "", geolocation: "" });
            }

        } catch (error) {
            console.error("Error:", error);
            setErrors(["Network error. Please check your connection and try again."]);
        } finally {
            setLoading(false);
        }
    }

    const onChange = (event) => {
        setCredentials({ ...credentials, [event.target.name]: event.target.value });
    }

    const onBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    }

    const isFormValid = () => {
        return credentials.name.length >= 5 &&
               /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email) &&
               credentials.password.length >= 5 &&
               credentials.geolocation.length >= 3;
    };

    if (success) {
        return (
            <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1a1a1a', borderRadius: '12px', maxWidth: '500px', border: '1px solid #333' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✅</div>
                    <h2 style={{ marginBottom: '16px', color: '#28a745' }}>Account Created Successfully!</h2>
                    <p style={{ color: '#999', marginBottom: '24px' }}>
                        Your account has been created. You can now log in with your credentials.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        style={{
                            backgroundColor: '#28a745',
                            border: 'none',
                            color: 'white',
                            padding: '12px 32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600'
                        }}
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white' }}>
            <div style={{ padding: '60px 20px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ 
                        backgroundColor: '#1a1a1a', 
                        padding: '40px', 
                        borderRadius: '12px',
                        border: '1px solid #333',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontWeight: '600' }}>
                            Create Account
                        </h2>
                        <p style={{ textAlign: 'center', marginBottom: '32px', color: '#999', fontSize: '0.95rem' }}>
                            Join us to get started with your food delivery experience
                        </p>
                        
                        {/* Display errors */}
                        {errors.length > 0 && (
                            <div 
                                role="alert"
                                style={{
                                    backgroundColor: '#2a1315',
                                    border: '1px solid #5a1f1f',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '24px',
                                    color: '#ff6b6b'
                                }}
                            >
                                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                                    ⚠️ Please fix the following:
                                </div>
                                {errors.map((error, index) => (
                                    <div key={index} style={{ marginLeft: '24px', marginTop: '4px' }}>
                                        • {error}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <div onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    name='name' 
                                    value={credentials.name} 
                                    onChange={onChange}
                                    onBlur={() => onBlur('name')}
                                    placeholder="Enter your full name"
                                    aria-label="Full name"
                                    aria-invalid={getFieldError('name') ? 'true' : 'false'}
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#2a2a2a',
                                        border: getFieldError('name') ? '2px solid #ff6b6b' : '1px solid #444',
                                        color: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                {getFieldError('name') ? (
                                    <small style={{ color: '#ff6b6b', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {getFieldError('name')}
                                    </small>
                                ) : (
                                    <small style={{ color: '#999', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {credentials.name.length}/5 characters minimum
                                    </small>
                                )}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    name='email' 
                                    value={credentials.email} 
                                    onChange={onChange}
                                    onBlur={() => onBlur('email')}
                                    id="email"
                                    placeholder="your@email.com"
                                    aria-label="Email address"
                                    aria-invalid={getFieldError('email') ? 'true' : 'false'}
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#2a2a2a',
                                        border: getFieldError('email') ? '2px solid #ff6b6b' : '1px solid #444',
                                        color: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                {getFieldError('email') ? (
                                    <small style={{ color: '#ff6b6b', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {getFieldError('email')}
                                    </small>
                                ) : (
                                    <small style={{ color: '#999', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        We'll never share your email with anyone else.
                                    </small>
                                )}
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Password
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"}
                                        name='password' 
                                        value={credentials.password} 
                                        onChange={onChange}
                                        onBlur={() => onBlur('password')}
                                        id="password"
                                        placeholder="Enter a strong password"
                                        aria-label="Password"
                                        aria-invalid={getFieldError('password') ? 'true' : 'false'}
                                        required
                                        style={{
                                            width: '100%',
                                            backgroundColor: '#2a2a2a',
                                            border: getFieldError('password') ? '2px solid #ff6b6b' : '1px solid #444',
                                            color: 'white',
                                            padding: '12px',
                                            paddingRight: '45px',
                                            borderRadius: '6px',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        style={{
                                            position: 'absolute',
                                            right: '12px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            background: 'none',
                                            border: 'none',
                                            color: '#999',
                                            cursor: 'pointer',
                                            padding: '4px',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                                {getFieldError('password') ? (
                                    <small style={{ color: '#ff6b6b', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {getFieldError('password')}
                                    </small>
                                ) : (
                                    <small style={{ color: '#999', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {credentials.password.length}/5 characters minimum (8+ recommended)
                                    </small>
                                )}
                            </div>

                            <div style={{ marginBottom: '28px' }}>
                                <label htmlFor="geolocation" style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                                    Delivery Address
                                </label>
                                <input 
                                    type="text" 
                                    name='geolocation' 
                                    value={credentials.geolocation} 
                                    onChange={onChange}
                                    onBlur={() => onBlur('geolocation')}
                                    id="geolocation"
                                    placeholder="Enter your delivery address"
                                    aria-label="Delivery address"
                                    aria-invalid={getFieldError('geolocation') ? 'true' : 'false'}
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#2a2a2a',
                                        border: getFieldError('geolocation') ? '2px solid #ff6b6b' : '1px solid #444',
                                        color: 'white',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                                {getFieldError('geolocation') && (
                                    <small style={{ color: '#ff6b6b', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {getFieldError('geolocation')}
                                    </small>
                                )}
                            </div>

                            <div>
                                <button 
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading || !isFormValid()}
                                    style={{
                                        width: '100%',
                                        backgroundColor: (loading || !isFormValid()) ? '#1a5928' : '#28a745',
                                        border: 'none',
                                        color: 'white',
                                        padding: '14px',
                                        fontSize: '1.05rem',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        cursor: (loading || !isFormValid()) ? 'not-allowed' : 'pointer',
                                        opacity: (loading || !isFormValid()) ? 0.6 : 1,
                                        marginBottom: '12px'
                                    }}
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                                
                                <div style={{ textAlign: 'center', margin: '12px 0' }}>
                                    <span style={{ color: '#999', fontSize: '0.9rem' }}>Already have an account?</span>
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/login'}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #444',
                                        color: 'white',
                                        borderRadius: '8px',
                                        backgroundColor: 'transparent',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                >
                                    Sign In Instead
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}