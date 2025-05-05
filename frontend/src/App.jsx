import './App.css'
import Navbar from './components/navbar';
import Main from './components/main';
import AddProduct from './components/addProduct';
import Signup from './components/signup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
   
  return (

    <Router>
      <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/home" element={<><Navbar/><Main/></>} />
      </Routes>
    </Router>
  )
}

export default App
