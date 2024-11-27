import './App.css';
import Topbar from './component/Topbar';
import Home from './page/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './page/Signup';
import Login from './page/Login';
import { ToastContainer } from 'react-toastify';
import Otpverification from './page/Otpvarificatioon';
import Updatenumber from './page/Updatenumber';

function App() {
  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/home" element={<Home />} /> {/* Default route */}
        <Route path="/signup" element={< Signup/>} /> {/* Singup  page */}
        <Route path="/" element={<Login />} /> {/* Login page */}
        <Route path="/otp-verification" element={<Otpverification />} />
        <Route path="/update-phone" element={<Updatenumber />} />
      </Routes>
    </Router>
    <ToastContainer />
    </div>
  );
}

export default App;
