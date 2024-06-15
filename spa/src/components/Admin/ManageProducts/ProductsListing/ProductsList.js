import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Footer/Footer";
import { AuthContext } from "../../../../context/AuthContext";
import { getProductDetails, ME } from "../../../../service/api_service";
import Sidebar from "../../../Sidebar/Sidebar";
import "./ProductsList.css";
import Loader from "../../../common/Loader/Loader";

const ProductsList = () => {
  const navigate = useNavigate();
  const { checkAdmin, Logout } = useContext(AuthContext);
  // const [maintenanceList, setMaintenanceList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedList, setSelectedList] = useState();
  const [loading, setLoading] = useState();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }
    async function getProductListing() {
      try {
        setLoading(true);
        const isAdmin = await me();
        if (!isAdmin) {
          toast.error("You are not a admin");
          Logout();
          return;
        }
        await checkAdmin("/admin/manage-products");
        // await setProductData();
        const productData = await getProductDetails();
        console.log("productData", productData);
        setProductList(productData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error in [ProductList] [getProductListing] :", error);
      }
    }
    getProductListing();

    setTimeout(() => {
      //   setZoom("scale-100");
    }, 500); // Adjust the delay as needed
  }, []);

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
      throw new Error(error);
    }
  };

  const editProduct = (product) => {
    navigate(`/admin/edit-product/${product._id}`);
  };

  return (
    <div>
      {loading ? <Loader /> : ""}
      <div>
        <Sidebar />
        <div
          className='container-fluid page-header py-5 wow fadeIn'
          data-wow-delay='0.1s'
        >
          <div className='container text-center py-5'>
            <h1 className='display-3 text-white mb-4 animated slideInDown'>
              Products Listing
            </h1>
            <nav aria-label='breadcrumb animated slideInDown'>
              <ol className='breadcrumb justify-content-center mb-0'>
                <li className='breadcrumb-item'>Home</li>
                <li className='breadcrumb-item'>Pages</li>
                <li className='breadcrumb-item' aria-current='page'>
                  garden / Products / list
                </li>
              </ol>
            </nav>
            {/* ----------------- Form ----------------------- */}
            <div>
              <div className='flex min-h-full flex-col justify-center px-6 pt-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full p-6  bg-gray-100 border border-gray-100 rounded-lg shadow dark:bg-gray-100 dark:border-gray-200'>
                  <div className='sm:mx-auto sm:w-full '>
                    <div className='space-y-6'>
                      <div className='flex justify-end mr-5 '>
                        <button
                          className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center'
                          onClick={() => navigate("/admin/add-products")}
                        >
                          Add Products
                        </button>
                      </div>
                      <table className='table table-hover'>
                        <thead>
                          <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Product Title</th>
                            <th scope='col' className='price-column'>
                              Category
                            </th>
                            <th scope='col' className='price-column'>
                              Price
                            </th>
                            <th scope='col'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productList?.length ? (
                            productList?.map((productData, index) => (
                              <tr key={index}>
                                <th scope='row'>{index + 1}</th>
                                <td>{productData.title}</td>
                                <td className='price-column'>
                                  {productData.category.name}
                                </td>
                                <td className='price-column'>
                                  <span className='py-2 px-4'>
                                    {productData.price}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center mr-2'
                                    onClick={() => {
                                      setSelectedList(productData);
                                      setIsOpen(true);
                                    }}
                                  >
                                    View
                                  </button>
                                  <button
                                    className='bg-yellow-500 hover:bg-yellow-700 text-gray-800 font-bold py-1 px-2 rounded inline-flex items-center mr-2'
                                    onClick={() => {
                                      editProduct(productData);
                                    }}
                                  >
                                    Update
                                  </button>
                                  {/* Uncomment if Delete functionality is needed */}
                                  {/* <button
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded inline-flex items-center'
              onClick={() => {
                setSelectedList(productData);
                setIsOpen(true);
              }}
            >
              Delete
            </button> */}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan='5'>No Data Found</td>
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
                        <strong>Title:</strong> {selectedList.title}
                      </span>
                      <span>
                        <strong>Description:</strong> {selectedList.description}
                      </span>
                      <span>
                        <strong>Price:</strong> {selectedList.price}
                      </span>
                      <span>
                        <strong>Category:</strong> {selectedList.category.name}
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

export default ProductsList;
