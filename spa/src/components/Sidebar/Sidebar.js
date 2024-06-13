import React, { useState } from "react";
import "./Sidebar.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const token = localStorage.getItem("accessToken");
  const isAdmin = localStorage.getItem("isAdmin");
  const Logout = () => {
    toast.success("Logout Successful!");
    localStorage.clear();
    navigate("/home");
  };

  return (
    <div className="sticky top-0 z-10 p-0 " >
      <nav className='navbar navbar-expand-lg bg-white navbar-light p-0'>
        <span
          className='navbar-brand d-flex align-items-center px-4 px-lg-5'
        >
          <h1 className='m-0'>Gardener</h1>
        </span>
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
            {/* <a href='/home' className='nav-item nav-link active'>
              Home
            </a> */}
            {/* <a href='/about' className='nav-item nav-link'>
            About
          </a> */}
            {/* <a href='/login' className='nav-item nav-link'>
            Services
          </a> */}
            {/* <a href='/projects' className='nav-item nav-link'>
            Projects
          </a> */}
            <div className='nav-item dropdown'>
              <a
                href='#'
                className='nav-link dropdown-toggle'
                data-bs-toggle='dropdown'
              >
                Services
              </a>
              <div className='dropdown-menu bg-light m-0'>
                <a
                  href={(token && isAdmin) ? "/admin/manage-maintenance" : "/login"}
                  className='dropdown-item'
                >
                  Manage Maintenance
                </a>
                <a
                  href={(token && isAdmin) ? "/admin/manage-products" : "/login"}
                  className='dropdown-item'
                >
                  Manage Products
                </a>
                <a
                  href={(token && isAdmin) ? "/admin/manage-coupons" : "/login"}
                  className='dropdown-item'
                >
                  Manage Coupons
                </a>
              </div>
            </div>
            {token && (
              <a onClick={Logout} className='nav-item nav-link'>
                Logout
              </a>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
