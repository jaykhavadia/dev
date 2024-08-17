import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import {
  getAllGardenMaintenance,
  getAllGardenQuote,
  ME,
  updateMaintenance,
} from "../../../service/api_service";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import Sidebar from "../../Sidebar/Sidebar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Loader from "../../common/Loader/Loader";

const ManageQuote = () => {
  const navigate = useNavigate();
  const [QuoteList, setQuoteList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState();
  const [loading, setLoading] = useState();
  const { Logout } = useContext(AuthContext);

  const me = async () => {
    try {
      const user = await ME();
      localStorage.setItem("currentUser", JSON.stringify(user));
      console.log("user =>>", user.user);
      return user?.user?.isAdmin || false;
    } catch (error) {
      if (error.message === "jwt expired") {
        Logout();
      }
      console.error("[me] Error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getQuoteData() {
      try {
        setLoading(true);
        const isAdmin = await me();
        if (!isAdmin) {
          toast.error("You are not a admin");
          Logout();
          return;
        }
        const quoteData = await getAllGardenQuote();
        console.log("quoteData", quoteData);

        setQuoteList(quoteData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error in [ManageQuote] [getQuoteData]: ", error);
      }
    }
    getQuoteData();

    setTimeout(() => {
      //   setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  const selected = async (event, data) => {
    try {
      setLoading(true);
      console.log("event", event, data);
      await updateMaintenance({ status: event.value }, data._id);

      const maintenanceData = await getAllGardenMaintenance();
      setQuoteList(maintenanceData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error in [ManageQuote] [selected]: ", error);
    }
  };

  return (
    <div>
      {loading ? <Loader /> : ""}
      <div className='h-screen'>
        <Sidebar />
        <div className='page-header wow fadeIn h-full' data-wow-delay='0.1s'>
          <div className='container text-center py-5'>
            <h1 className='display-3 text-white mb-2 animated slideInDown'>
              Garden Quote Listing
            </h1>
            {/* ----------------- Form ----------------------- */}
            <div>
              <div className='flex min-h-full flex-col justify-center px-6 pt-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full p-6  bg-gray-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200'>
                  <div className='sm:mx-auto sm:w-full '>
                    <div className='sm:space-y-6'>
                      <table className='table table-hover'>
                        <thead>
                          <tr>
                            <th scope='col' className='price-column'>
                              #
                            </th>
                            <th scope='col'>Name</th>
                            <th scope='col' className='price-column'>
                              Email
                            </th>
                            <th scope='col' className=''>
                              Budget
                            </th>
                            <th scope='col' className='price-column'>
                              PinCode
                            </th>
                            <th scope='col' className='price-column'>
                              Date
                            </th>
                            <th scope='col'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {QuoteList?.length ? (
                            QuoteList?.map((quoteData, index) => (
                              <tr key={index}>
                                <th scope='row' className='price-column'>
                                  {index + 1}
                                </th>
                                <td>{quoteData.name}</td>
                                <td className='price-column'>
                                  {quoteData.email}
                                </td>

                                <td className=''>
                                  <div className='flex justify-center'>
                                    {quoteData.budget}
                                  </div>
                                </td>
                                <td className='price-column'>
                                  <div className='flex justify-center'>
                                    {quoteData.pincode}
                                  </div>
                                </td>
                                <td className='price-column'>
                                  <Moment
                                    className='py-2 px-4'
                                    format='DD/MM/YYYY'
                                    data={quoteData.createdAt}
                                  />
                                </td>
                                <td>
                                  <button
                                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center'
                                    onClick={() => {
                                      setSelectedList(quoteData);
                                      setIsOpen(true);
                                    }}
                                  >
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan='5'>No Data Found </td>
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
                    <h2 className='text-xl mb-4'>Quote Data</h2>
                    <div className='flex flex-col justify-start items-start text-start'>
                      <span>
                        <strong>Name:</strong> {selectedList.name}
                      </span>
                      <span>
                        <strong>Email:</strong> {selectedList.email}
                      </span>
                      <span>
                        <strong>Mobile no:</strong> {selectedList.mobile}
                      </span>
                      <span>
                        <strong>Budget :</strong> {selectedList.budget}
                      </span>
                      <span>
                        <strong>Pin code:</strong> {selectedList.pincode}
                      </span>
                      <span>
                        <strong>Service Type:</strong>{" "}
                        {selectedList.serviceType[0]}
                      </span>
                      <span>
                        <strong>Message:</strong> {selectedList.message}
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
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default ManageQuote;
