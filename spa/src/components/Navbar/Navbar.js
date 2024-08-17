import React, { useState } from "react";
import "./Navbar.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const token = localStorage.getItem("accessToken");
  
  const Logout = () => {
    toast.success("Logout Successful!");
    localStorage.clear();
    navigate("/home");
  };

  const Login = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className='container-fluid bg-dark text-light px-0 py-2'>
        <div className='row gx-0 d-none d-lg-flex'>
          <div className='h-100 d-inline-flex justify-center align-items-center me-4'>
            <span>Register Free your Garden with us !</span>
          </div>
        </div>
      </div>
      <nav className='sticky-component navbar navbar-expand-lg bg-white navbar-light sticky top-0 z-10 p-0'>
        <a
          href='/home'
          className='navbar-brand d-flex align-items-center px-4 px-lg-5'
        >
          <h1 className='m-0'>Gardener</h1>
        </a>
        <button
          type='button'
          className='navbar-toggler me-4'
          data-bs-toggle='collapse'
          // data-bs-target='#navbarCollapse'
          onClick={toggleDropdown}
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div
          className={`navbar-collapse ${isOpen ? "block" : "hidden"}`}
          id='navbarCollapse'
        >
          <div className='navbar-nav ms-auto p-4 p-lg-0'>
            <a href='/home' className='nav-item nav-link active'>
              Home
            </a>
            {/* <a href='/about' className='nav-item nav-link'>
            About
          </a> */}
            <a
              href={token ? "/garden/registration" : "/login"}
              className='nav-item nav-link'
            >
              Garden Registration
            </a>
            {/* <a href='/projects' className='nav-item nav-link'>
            Projects
          </a> */}
            <div className='nav-item dropdown'>
              <div
                className='nav-link dropdown-toggle'
                data-bs-toggle='dropdown'
              >
                Services
              </div>
              <div className='dropdown-menu bg-light m-0'>
                <a
                  href={token ? "/garden/maintenance/list" : "/login"}
                  className='dropdown-item'
                >
                  Garden Maintenance
                </a>
                <a className='dropdown-item' href='/service/landscaping'>
                  Landscaping
                </a>
                <a className='dropdown-item' href='/service/pruning-plants'>
                  Pruning plants
                </a>
                <a className='dropdown-item' href='/service/urban-gardening'>
                  Urban Gardening
                </a>
                <a className='dropdown-item' href='/service/green-technology'>
                  Green Technology
                </a>
                <a
                  className='dropdown-item'
                  href='/service/irrigation-drainage'
                >
                  Irrigation & Drainage
                </a>
              </div>
            </div>
            <div className='nav-item dropdown'>
              <div
                className='nav-link dropdown-toggle'
                data-bs-toggle='dropdown'
              >
                Products
              </div>
              <div className='dropdown-menu bg-light m-0'>
                <a href={"/products"} className='dropdown-item'>
                  View Products
                </a>
                {token && (
                  <a href={"/products/checkout"} className='dropdown-item'>
                    View Cart
                  </a>
                )}
              </div>
            </div>

            <a href='/contact' className='nav-item nav-link'>
              Contact
            </a>
            {token ? (
              <a onClick={Logout} className='nav-item nav-link cursor-pointer'>
                Logout
              </a>
            ): (
              <a onClick={Login} className='nav-item nav-link cursor-pointer'>
                Login
              </a>
            )}
          </div>
          {/* <a
            href=''
            className='btn btn-primary py-4 px-lg-4 rounded-0 d-none d-lg-block'
          >
            Get A Quote<i className='fa fa-arrow-right ms-3'></i>
          </a> */}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
