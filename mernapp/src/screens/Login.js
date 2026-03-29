import React, { useState, useEffect } from 'react'
import API_BASE_URL from '../config'

export default function Login() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [touched, setTouched] = useState({
        email: false,
        password: false
    });

    // Check for success message from signup
    useEffect(() => {
        // In real app, this would come from navigation state
        const message = sessionStorage.getItem('signupSuccess');
        if (message) {
            setSuccessMessage(message);
            sessionStorage.removeItem('signupSuccess');
            // Clear message after 5 seconds
            setTimeout(() => setSuccessMessage(""), 5000);
        }
    }, []);

    // Real-time validation
    const getFieldError = (field) => {
        if (!touched[field]) return null;

        switch (field) {
            case 'email':
                if (credentials.email.length === 0) return "Email is required";
                if (!credentials.email.includes("@")) return "Please enter a valid email";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) return "Invalid email format";
                return null;
            case 'password':
                if (credentials.password.length === 0) return "Password is required";
                if (credentials.password.length < 5) return "Password must be at least 5 characters";
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
            email: true,
            password: true
        });

        // Frontend validation
        const frontendErrors = [];
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email)) {
            frontendErrors.push("Please enter a valid email");
        }
        if (credentials.password.length < 5) {
            frontendErrors.push("Password must be at least 5 characters");
        }

        if (frontendErrors.length > 0) {
            setErrors(frontendErrors);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/loginuser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: credentials.email.trim().toLowerCase(),
                    password: credentials.password
                })
            });

            const json = await response.json();
            console.log("Login response:", json);

            if (!json.success) {
                // Show specific error from backend
                if (json.errors && Array.isArray(json.errors)) {
                    const errorMessages = json.errors.map(err =>
                        err.msg || err.message || JSON.stringify(err)
                    );
                    setErrors(errorMessages);
                } else if (json.message) {
                    setErrors([json.message]);
                } else {
                    setErrors(["Invalid email or password. Please try again."]);
                }
            } else {
                // Success - store auth data
                localStorage.setItem("userEmail", credentials.email);
                localStorage.setItem("authToken", json.authToken);
                localStorage.setItem("userName", json.userName || credentials.email.split("@")[0]);

                // Show success message
                setSuccessMessage("Login successful! Redirecting...");

                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = "/";
                }, 1000);
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
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.email) &&
            credentials.password.length >= 5;
    };

    return (
        <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: 'white' }}>
            <div style={{ padding: '80px 20px 60px' }}>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                    <div style={{
                        backgroundColor: '#1a1a1a',
                        padding: '40px',
                        borderRadius: '12px',
                        border: '1px solid #333',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
                    }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '8px', fontWeight: '600' }}>
                            Welcome Back
                        </h2>
                        <p style={{ textAlign: 'center', marginBottom: '32px', color: '#999', fontSize: '0.95rem' }}>
                            Sign in to continue to your account
                        </p>

                        {/* Success message */}
                        {successMessage && (
                            <div
                                role="alert"
                                style={{
                                    backgroundColor: '#1a3a1a',
                                    border: '1px solid #2d5a2d',
                                    borderRadius: '8px',
                                    padding: '16px',
                                    marginBottom: '24px',
                                    color: '#4ade80',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>✅</span>
                                <span>{successMessage}</span>
                            </div>
                        )}

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
                                    ⚠️ Login Failed
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
                                    autoComplete="email"
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
                                        Enter the email you used to sign up
                                    </small>
                                )}
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <label htmlFor="password" style={{ fontWeight: '500' }}>
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => alert("Password reset functionality would go here")}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#4a9eff',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name='password'
                                        value={credentials.password}
                                        onChange={onChange}
                                        onBlur={() => onBlur('password')}
                                        id="password"
                                        placeholder="Enter your password"
                                        aria-label="Password"
                                        aria-invalid={getFieldError('password') ? 'true' : 'false'}
                                        autoComplete="current-password"
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
                                {getFieldError('password') && (
                                    <small style={{ color: '#ff6b6b', display: 'block', marginTop: '4px', fontSize: '0.875rem' }}>
                                        {getFieldError('password')}
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
                                        marginBottom: '12px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {loading ? (
                                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                            <span>Signing in...</span>
                                        </span>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>

                                <div style={{ textAlign: 'center', margin: '16px 0' }}>
                                    <span style={{ color: '#999', fontSize: '0.9rem' }}>Don't have an account?</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => window.location.href = '/createuser'}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '2px solid #444',
                                        color: 'white',
                                        borderRadius: '8px',
                                        backgroundColor: 'transparent',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Create New Account
                                </button>

                                <div style={{
                                    marginTop: '24px',
                                    paddingTop: '24px',
                                    borderTop: '1px solid #333',
                                    textAlign: 'center'
                                }}>
                                    <small style={{ color: '#666', fontSize: '0.85rem' }}>
                                        By signing in, you agree to our Terms of Service and Privacy Policy
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}