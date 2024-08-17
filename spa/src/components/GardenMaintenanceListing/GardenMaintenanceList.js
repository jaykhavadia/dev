import toast from "react-hot-toast";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useContext, useEffect, useState } from "react";
import { getAllMaintenance, getGardenDetails } from "../../service/api_service";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import Loader from "../common/Loader/Loader";
import Dropdown from "react-dropdown";

const GardenMaintenanceList = () => {
  const navigate = useNavigate();
  const { checkAdmin } = useContext(AuthContext);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState();

  const setGardenData = async () => {
    try {
      const response = await getGardenDetails();
      if (response === null) {
        toast("Please Register a garden first", {
          icon: (
            <FontAwesomeIcon
              className='text-yellow-700'
              icon={faExclamationCircle}
            />
          ),
        });
        navigate("/garden/registration");
      }
      console.log("response", response);

      setGardenList(response);
      return response;
    } catch (error) {
      setLoading(false);
      console.error("Error setGardenData", error);
      if (error?.message === "Invalid token") {
        toast.error(error?.message);
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const isAdmin = localStorage.getItem("isAdmin");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getMaintenanceData() {
      await checkAdmin();
      if (!isAdmin) {
        setLoading(true);
        const gardeList = await setGardenData();
        await handleChange({ value: gardeList[0]._id });
        setLoading(false);
      }
    }
    getMaintenanceData();

    setTimeout(() => {
      //   setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

  const options = gardenList.map((item) => ({
    label: item.name,
    value: item._id,
  }));

  const handleChange = async (selectedOption) => {
    setLoading(true);
    const maintenanceData = await getAllMaintenance(selectedOption.value);
    localStorage.setItem("currentGardenId", selectedOption.value);
    setMaintenanceList(maintenanceData);
    setLoading(false);
  };

  return (
    <div>
      {loading ? <Loader /> : ""}

      <div>
        <Navbar />
        <div
          className='container-fluid page-header py-5 wow fadeIn'
          data-wow-delay='0.1s'
        >
          <div className='container text-center py-5'>
            <h1 className='display-3 text-white mb-4 animated slideInDown'>
              Garden Maintenance Listing
            </h1>
            <nav aria-label='breadcrumb animated slideInDown'>
              <ol className='breadcrumb justify-content-center mb-0'>
                <li className='breadcrumb-item'>Home</li>
                <li className='breadcrumb-item'>Pages</li>
                <li className='breadcrumb-item' aria-current='page'>
                  garden / Maintenance / list
                </li>
              </ol>
            </nav>
            {/* ----------------- Form ----------------------- */}
            <div>
              <div className='flex min-h-full flex-col justify-center px-6 pt-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:p-6  bg-gray-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200'>
                  <div className='sm:mx-auto sm:w-full '>
                    <div className='space-y-6'>
                      <div className='flex justify-end mt-2 sm:mt-0 '>
                        <div className='flex items-center mr-5'>
                          <label className='mr-4 font-bold price-column'>
                            Select an Garden:
                          </label>
                          <Dropdown
                            className='sm:w-40'
                            options={options}
                            onChange={handleChange}
                            value={gardenList[0]?._id}
                          />
                        </div>
                        <div className='mr-5 sm:w-auto'>
                          <button
                            disabled={
                              !(
                                maintenanceList?.length === 0 ||
                                (maintenanceList[maintenanceList.length - 1]
                                  .status !== "pending" &&
                                  maintenanceList[maintenanceList.length - 1]
                                    .status !== "Pending")
                              )
                            }
                            className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 sm:px-4 px-2 rounded inline-flex items-center'
                            onClick={() => navigate("/garden/maintenance")}
                          >
                            Create Maintenance
                          </button>
                        </div>
                      </div>
                      <table className='table table-hover'>
                        <thead>
                          <tr>
                            <th scope='col' className='price-column'>
                              #
                            </th>
                            <th scope='col'>Maintenance Name</th>
                            <th scope='col' className='price-column'>
                              Date
                            </th>
                            <th scope='col' className='price-column'>
                              Status
                            </th>
                            <th scope='col'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {maintenanceList?.length ? (
                            maintenanceList?.map((maintenanceData, index) => (
                              <tr key={index}>
                                <th scope='row' className='price-column'>
                                  {index + 1}
                                </th>
                                <td>{maintenanceData.maintenanceName}</td>
                                <td className='price-column'>
                                  <Moment
                                    className='py-2 px-4'
                                    format='DD/MM/YYYY'
                                    data={maintenanceData.createdAt}
                                  />
                                </td>
                                <td className='price-column'>
                                  <span
                                    className={`py-2 px-4 badge ${
                                      maintenanceData.status === "Completed"
                                        ? "bg-success"
                                        : maintenanceData.status === "Canalled"
                                        ? "bg-red-500"
                                        : "bg-warning"
                                    }`}
                                  >
                                    {maintenanceData.status}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center'
                                    onClick={() => {
                                      setSelectedList(maintenanceData);
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
                    <h2 className='text-xl mb-4'>Maintenance Data</h2>
                    <div className='flex flex-col justify-start items-start'>
                      <span>
                        <strong>Maintenance Name:</strong>{" "}
                        {selectedList.maintenanceName}
                      </span>
                      <span>
                        <strong>Design Change:</strong>{" "}
                        {selectedList.designChange ? "Yes" : "No"}
                      </span>
                      <span>
                        <strong>Garden:</strong> {selectedList.garden}
                      </span>
                      <span>
                        <strong>Pot Change:</strong>{" "}
                        {selectedList.potChange ? "Yes" : "No"}
                      </span>
                      <span>
                        <strong>Status:</strong> {selectedList.status}
                      </span>
                      <span>
                        <strong>Water Supply:</strong>{" "}
                        {selectedList.waterSupply ? "Yes" : "No"}
                      </span>
                      <span>
                        <strong>Description:</strong> {selectedList.description}
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
      </div>
    </div>
  );
};

export default GardenMaintenanceList;
