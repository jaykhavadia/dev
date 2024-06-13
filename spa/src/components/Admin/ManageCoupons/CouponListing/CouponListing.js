import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Footer/Footer";
import { AuthContext } from "../../../../context/AuthContext";
import {
  deleteCoupon,
  getAllCoupon,
  ME,
  updateCoupon,
  updateDelete,
} from "../../../../service/api_service";
import Sidebar from "../../../Sidebar/Sidebar";
import Dropdown from "react-dropdown";
import "./CouponListing.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "../../../common/confirmationModal";

const CouponListing = () => {
  const navigate = useNavigate();
  const { checkAdmin, Logout } = useContext(AuthContext);
  // const [maintenanceList, setMaintenanceList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState();

  const [sampleCoupon, setCoupon] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getCouponListing() {
      const isAdmin = await me();
      if (!isAdmin) {
        toast.error("You are not a admin");
        Logout();
        return;
      }
      await checkAdmin("/admin/manage-coupons");
      try {
        const couponData = await getAllCoupon();
        console.log("CouponData", couponData);
        setCoupon(couponData.allCoupons);
      } catch (error) {
        console.log("error getCouponListing", error);
      }
    }
    getCouponListing();

    setTimeout(() => {
      //   setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  const me = async () => {
    try {
      const user = await ME();
      localStorage.setItem("currentUser", JSON.stringify(user));
      return user?.user?.isAdmin || false;
    } catch (error) {
      if (error.message === "jwt expired") {
        Logout();
      }
      throw new Error(error);
    }
  };

  const editCoupon = (coupon) => {
    navigate(`/admin/edit-coupon/${coupon.title}`);
  };

  // const selected = async (event, data) => {
  //   try {
  //     console.log("event", event, data);
  //     const results = await updateCoupon(
  //       { ...data, status: event.value },
  //       data._id
  //     );
  //     if (results) {
  //       toast.success(results.message);
  //       try {
  //         const couponData = await getAllCoupon();
  //         setCoupon(couponData.allCoupons);
  //       } catch (error) {
  //         console.log("Error in getting coupon [select]", error);
  //       }
  //     }
  //   } catch (error) {}
  // };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${text} Copied to clipboard!`);
      })
      .catch((err) => {
        toast.error("Failed to copy: ", err);
      });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [showModal, setShowModal] = useState(false);
  const [field, setField] = useState("");
  const [text, setText] = useState("");
  const [currentEvent, setCurrentEvent] = useState(null);
  const [currentData, setCurrentData] = useState(null);

  const selected = async (event, data) => {
    setCurrentEvent(event);
    setCurrentData(data);
    setText("Are you sure you want to update this Coupon ?");
    setField("coupon");
    setShowModal(true);
  };

  const handleDelete = async (event, data) => {
    setCurrentEvent(event);
    setCurrentData(data);
    setText("Are you sure you want to delete this Coupon ?");
    setField("delete");
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (field === "coupon") {
      try {
        console.log("event", currentEvent, currentData);
        const results = await updateCoupon(
          { ...currentData, status: currentEvent.value === "Activated" ? 'Active' : "Expire" },
          currentData._id
        );
        if (results) {
          toast.success(results.message || "Coupon Updated");
          try {
            const couponData = await getAllCoupon();
            setCoupon(couponData.allCoupons);
          } catch (error) {
            console.log("Error in getting coupon [handleConfirm]", error);
          }
        }
      } catch (error) {
        console.error("Error in updating coupon", error);
      } finally {
        setShowModal(false);
      }
    } else if (field === 'delete') {
      try {
        console.log("event", currentEvent, currentData);
        const results = await deleteCoupon(currentData._id);
        if (results) {
          toast.success(results.message || "Coupon Deleted");
          try {
            const couponData = await getAllCoupon();
            setCoupon(couponData.allCoupons);
          } catch (error) {
            console.log("Error in getting coupon [handleConfirm]", error);
          }
        }
      } catch (error) {
        console.error("Error in deleting coupon", error);
      } finally {
        setShowModal(false);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Sidebar />
      <div
        className='container-fluid page-header py-5 wow fadeIn'
        data-wow-delay='0.1s'
      >
        <div className='container text-center py-5'>
          <h1 className='display-3 text-white mb-4 animated slideInDown'>
            Coupons Listing
          </h1>
          <nav aria-label='breadcrumb animated slideInDown'>
            <ol className='breadcrumb justify-content-center mb-0'>
              <li className='breadcrumb-item'>Home</li>
              <li className='breadcrumb-item'>Pages</li>
              <li className='breadcrumb-item' aria-current='page'>
                garden / Coupons / list
              </li>
            </ol>
          </nav>
          {/* ----------------- Form ----------------------- */}
          <div>
            <div className='flex min-h-full flex-col justify-center px-6 pt-12 lg:px-8'>
              <div className='sm:mx-auto sm:w-full sm:p-6 py-3 px-2  bg-gray-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200'>
                <div className='sm:mx-auto sm:w-full '>
                  <div className='space-y-6'>
                    <div className='flex justify-end mr-5 '>
                      <button
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
                        onClick={() => navigate("/admin/add-coupon")}
                      >
                        Add Coupon
                      </button>
                    </div>
                    <table className='table table-hover'>
                      <thead>
                        <tr>
                          <th scope='col' className='price-column'>
                            #
                          </th>
                          <th scope='col'>Coupon CODE</th>
                          <th scope='col' className='price-column'>
                            Value
                          </th>
                          <th scope='col' className='price-column'>
                            Starting Date
                          </th>
                          <th scope='col' className='price-column'>
                            Ending Date
                          </th>
                          <th scope='col' className=''>
                            Status
                          </th>
                          <th scope='col'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sampleCoupon?.length ? (
                          sampleCoupon?.map((couponData, index) => (
                            <tr key={index}>
                              <th className='price-column' scope='row'>
                                {index + 1}
                              </th>
                              <td
                                className='cursor-pointer  hover:text-green-600 hover:text-bold active:text-yellow-500'
                                onClick={() => {
                                  copyToClipboard(
                                    couponData.title.toUpperCase()
                                  );
                                }}
                              >
                                {couponData.title.toUpperCase()}
                                <FontAwesomeIcon
                                  className='ml-2'
                                  icon='fa-regular fa-copy'
                                />
                              </td>
                              <td className='price-column'>
                                <span className='py-2 px-4'>
                                  {couponData.type !== "Percentage"
                                    ? "Rs."
                                    : ""}
                                  {couponData.value}
                                  {couponData.type === "Percentage" ? "%" : ""}
                                </span>
                              </td>
                              <td className='price-column'>
                                <span className='py-2 px-4'>
                                  {formatDate(couponData.startingDate)}
                                </span>
                              </td>
                              <td className='price-column'>
                                <span className='py-2 px-4'>
                                  {formatDate(couponData.endingDate)}
                                </span>
                              </td>
                              <td className=''>
                                <div className='flex justify-center'>
                                  <Dropdown
                                    className='w-[90px]'
                                    options={["Deactivated", "Activated"]}
                                    onChange={(e) => selected(e, couponData)}
                                    value={couponData.status === 'Active' ? "Activated": "Deactivated"}
                                    placeholder={couponData.status}
                                  />
                                </div>
                              </td>
                              <td>
                                <button
                                  className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center mr-2'
                                  onClick={() => {
                                    setSelectedList(couponData);
                                    setIsOpen(true);
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className='bg-yellow-500 hover:bg-yellow-700 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center mr-2'
                                  onClick={() => {
                                    editCoupon(couponData);
                                  }}
                                >
                                  Update
                                </button>
                                {/* Uncomment if Delete functionality is needed */}
                                <button
                                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded inline-flex items-center'
                                  onClick={(e) => {
                                    handleDelete(e, couponData);
                                  }}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan='8'>No Coupon Found</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ----------------- Form ----------------------- */}
          <>
            {isOpen && (
              <div className='fixed inset-0 flex items-center justify-center z-50'>
                <div className='fixed inset-0 bg-black opacity-50'></div>
                <div className='bg-white p-8 rounded-lg shadow-lg z-10'>
                  <h2 className='text-xl mb-4'>Maintenance Data</h2>
                  <div className='flex flex-col justify-start items-start mb-3'>
                    <span>
                      <strong className='mr-2'>Coupon CODE:</strong>
                      <span
                        className='cursor-pointer hover:text-green-600 hover:text-bold active:text-yellow-500'
                        onClick={() =>
                          copyToClipboard(selectedList.title.toUpperCase())
                        }
                      >
                        {selectedList.title.toUpperCase()}
                        <FontAwesomeIcon
                          className='ml-2'
                          icon='fa-regular fa-copy'
                        />
                      </span>
                    </span>
                    <span>
                      <strong className='mr-2'>Value:</strong>{" "}
                      {selectedList.type !== "Percentage" ? "Rs." : ""}
                      {selectedList.value}
                      {selectedList.type === "Percentage" ? "%" : ""}
                    </span>
                    <span>
                      <strong className='mr-2'>Start Date:</strong>{" "}
                      {formatDate(selectedList.startingDate)}
                    </span>
                    <span>
                      <strong className='mr-2'>End Date:</strong>{" "}
                      {formatDate(selectedList.endingDate)}
                    </span>
                    <span>
                      <strong className='mr-2'>Status:</strong>{" "}
                      {selectedList.status}
                    </span>
                    <span>
                      <strong className='mr-2'>Max Discount Price:</strong>{" "}
                      {selectedList.maximumDiscountPrice}
                    </span>
                    <span>
                      <strong className='mr-2'>Min Purchasing Price:</strong>{" "}
                      {selectedList.minimumPurchasingPrice}
                    </span>
                  </div>

                  <button
                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
      <Footer />
      <ConfirmationModal
        show={showModal}
        onClose={handleClose}
        onConfirm={handleConfirm}
        text={text}
      />
    </div>
  );
};

export default CouponListing;
