// ✅ Dynamic API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "" 
    : (process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`);

export default API_BASE_URL;

