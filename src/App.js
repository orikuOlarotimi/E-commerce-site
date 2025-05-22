import React from 'react';
import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import OurStore from './pages/OurStore';
import Blog from './pages/Blog';
import CompareProduct from './pages/CompareProduct';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Forgotpassword from './pages/Forgotpassword';
import Signup from './pages/Signup'
import Resetpassword from './pages/Resetpassword';
import Cart from "./pages/Cart";
import SingleBlog from './pages/SingleBlog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import SingleProduct from './pages/SingleProduct';
import { Toaster } from 'react-hot-toast';
import Checkout from "./pages/Checkout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster position='buttom-right' toastOptions={{duration : 2000}} />
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Home></Home>}></Route>
            <Route path="about" element={<About></About>}></Route>
            <Route path="contact" element={<Contact></Contact>}></Route>
            <Route path="product" element={<OurStore></OurStore>}></Route>
            <Route path="product/:id" element={<SingleProduct />}></Route>
            <Route path="blogs" element={<Blog />}></Route>
            <Route path="blog/:id" element={<SingleBlog />}></Route>
            <Route path="cart" element={<Cart />} />
            <Route path="compare-product" element={<CompareProduct />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="login" element={<Login />} />
            <Route path="forgot-password" element={<Forgotpassword />} />
            <Route path="signup" element={<Signup />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
            <Route path="term-conditions" element={<TermsAndConditions />} />
            <Route path="/category/:categoryName" element={<OurStore />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
