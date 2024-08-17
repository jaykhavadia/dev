import { useContext, useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext";
import { getProductDetailsById } from "../../service/api_service";
import sampleData from "./SampleData";

const Service = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const [service, setService] = useState();
  const { checkAdmin } = useContext(AuthContext);

  useEffect(() => {
    checkAdmin();
    setServiceData();
  }, []);

  const setServiceData = async () => {
    try {
      console.log("ID", id);
      const response = await getServiceById(id);

      if (response === null) {
        return;
      }
      if (response?.message === "Invalid token") {
        toast.error(response?.message);
        localStorage.clear();
        navigate("/login");
      }
      console.log("resonse ->>", response);

      setService(response);
    } catch (error) {
      console.log("[setServiceData] Error:", error);
      throw error;
    }
  };

  const getServiceById = (key) => {
    if(key.includes('-')){
      return sampleData[key.split('-').join('_')];
    }
    return sampleData[key];
  };

  return (
    <div>
      <Navbar />
      <div
        className='container-fluid page-header py-5 mb-5 wow fadeIn'
        data-wow-delay='0.1s'
      >
        <div className='container text-center py-5'>
          <h1 className='display-3 text-white mb-4 animated slideInDown'>
            Service
          </h1>
          <nav aria-label='breadcrumb animated slideInDown'>
            <ol className='breadcrumb justify-content-center mb-0'>
              <li className='breadcrumb-item'>
                <span>Home</span>
              </li>
              <li className='breadcrumb-item'>
                <span>Pages</span>
              </li>
              <li className='breadcrumb-item'>
                <span>Service</span>
              </li>
              <li
                className='breadcrumb-item active text-white'
                aria-current='page'
              >
                {service?.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className='container-xxl'>
        <div className='container px-4 sm:px-6 lg:px-8 pb-5'>
          <div className=''>
            <div className='flex flex-col sm:flex-row border border-gray-200 rounded-md shadow-sm p-4'>
              <div className='min-w-80'>
                <img
                  className='object-cover'
                  src={service?.image}
                  alt={service?.title}
                />
              </div>
              <div className='p-4'>
                <div className='flex mb-3 items-center ' >
                  <div className=' mr-3 '>
                    <img
                      className='object-cover rounded border-gray-200'
                      src={service?.logo}
                      alt={service?.title}
                    />
                  </div>
                  <div>
                    <div className='text-xl font-semibold whitespace-nowrap overflow-hidden'>
                      {service?.title}
                    </div>
                    <div className='text-gray-600'>
                      {service?.category}
                    </div>
                  </div>
                </div>
                <div className='text-md '>{service?.description}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default Service;
