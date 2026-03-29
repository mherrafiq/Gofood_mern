import './App.css';
import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Login from './screens/Login';
import Signup from './screens/Signup';
import Cart from './screens/Cart';
import { CartProvider } from './components/ContextReducer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MyOrder from './screens/MyOrder';

function App() {
  return (
    <CartProvider>
      <Router>
        <div> 
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/login" element={<Login/>}/>
            <Route path="/createuser" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route exact path="/myorders" element={<MyOrder />}/>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;