import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/Signup";
import axios from "axios";
import Dashboard from "./components/Dashboard/Dashboard";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import EmailVerification from "./components/EmailVerification/EmailVerification";
import "./assets/style/style.css";
import "./assets/scss/bootstrap.scss";
import "./assets/style/bootstrap.min.css";
// import the library
import { library } from "@fortawesome/fontawesome-svg-core";

// import your icons
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Home from "./components/Home/Home";

import "animate.css/animate.min.css";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Contact from "./components/Contact/Contact";
import GardenRegistration from "./components/GardenRegistration/GardenRegistration";
import GardenMaintenance from "./components/GardenMaintenance/GardenMaintenance";
import GardenMaintenanceList from "./components/GardenMaintenanceListing/GardenMaintenanceList";
import ManageMaintenance from "./components/Admin/ManageMaintenance/ManageMaintenance";
import Products from "./components/Products/Products";
import Checkout from "./components/Checkout/Checkout";
import ProductsList from "./components/Admin/ManageProducts/ProductsListing/ProductsList";
import ProductDetail from "./components/ProductDetail/ProductDetail";
import AddProducts from "./components/Admin/ManageProducts/AddProducts/AddProducts";
import CouponListing from "./components/Admin/ManageCoupons/CouponListing/CouponListing";
import AddCoupon from "./components/Admin/ManageCoupons/AddCoupon/AddCoupon";

let token = localStorage.getItem("accessToken");
axios.interceptors.request.use(
  function (config) {
    token = localStorage.getItem("accessToken");
    if (token || AuthContext.userToken) {
      config.headers.Authorization = `Bearer ${token || AuthContext.userToken}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthContextProvider>
      <div>
        <Routes>
          <Route
            path='*'
            element={
              <Navigate
                replace
                to={`${token ? "/garden/registration" : "/home"}`}
              />
            }
          />

          <Route path='home' element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='projects' element={<Projects />} />
          <Route path='contact' element={<Contact />} />
          <Route path='login' element={<Login />} />
          <Route path='admin/login' element={<Login admin={true} />} />
          <Route path='sign-up' element={<SignUp />} />
          {/* <Route path='dashboard' element={<Dashboard />} /> */}
          <Route path='email-verification' element={<EmailVerification />} />
          <Route path='garden/registration' element={<GardenRegistration />} />
          <Route
            path='garden/maintenance/list'
            element={<GardenMaintenanceList />}
          />
          <Route path='garden/maintenance' element={<GardenMaintenance />} />

          <Route path='/admin/manage-maintenance' element={<ManageMaintenance />} />
          <Route path='/admin/manage-products' element={<ProductsList />} />
          <Route path='/admin/add-products' element={<AddProducts />} />
          <Route path='/admin/edit-product/:id' element={<AddProducts />} />
          <Route path='/admin/manage-coupons' element={<CouponListing />} />
          <Route path='/admin/add-coupon' element={<AddCoupon />} />
          <Route path='/admin/edit-coupon/:id' element={<AddCoupon />} />

          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<ProductDetail />} />
          <Route path='/products/checkout' element={<Checkout />} />
        </Routes>
        <Toaster
          position='top-right'
          reverseOrder={false}
          toastOptions={{ duration: 3000 }}
        />
      </div>
    </AuthContextProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
library.add(fab, fas, far);
