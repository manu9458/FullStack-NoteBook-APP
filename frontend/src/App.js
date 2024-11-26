import './App.css';
import Topbar from './component/Topbar';
import Home from './page/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './page/Signup';
import Login from './page/Login';
import { ToastContainer } from 'react-toastify';
import OtpModal from './page/OtpModal';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/home" element={<Home />} /> {/* Default route */}
        <Route path="/signup" element={< Signup/>} /> {/* Singup  page */}
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/otpmodel" element={<OtpModal />} />
      </Routes>
    </Router>
    <ToastContainer />
    </div>
  );
}

export default App;
