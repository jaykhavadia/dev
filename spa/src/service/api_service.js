import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_KEY;

export const ME = async () => {
  try {
    const apiURL = `${BASE_URL}/me`;
    const response = await axios.post(apiURL);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};
export const login = async (payload) => {
  try {
    const apiURL = `${BASE_URL}/login`;
    const response = await axios.post(apiURL, payload);
    localStorage.setItem("accessToken", response.data.token);
    return response.data;
    // return {token: 'response.data'};
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};

export const registerUser = async (payload) => {
  try {
    const apiURL = `${BASE_URL}/register`;
    const response = await axios.post(apiURL, payload);
    localStorage.setItem("verifyEmail", true);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};

export const resendVerificationEmail = async (userEmail) => {
  try {
    const apiURL = `${BASE_URL}/resend-verfication`;
    const response = await axios.post(apiURL, {
      email: userEmail,
    });
    localStorage.setItem("verifyEmail", true);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};

export const verifyEmail = async (token) => {
  try {
    const apiURL = `${BASE_URL}/verifyemail/${token}`;
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data.message;
  }
};

export const registerGarden = async (payload) => {
  try {
    const apiURL = `${BASE_URL}/garden/register`;
    const response = await axios.post(apiURL, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};
export const createMaintenance = async (payload) => {
  try {
    const apiURL = `${BASE_URL}/garden/maintenance`;
    const response = await axios.post(apiURL, payload);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};
export const getAllMaintenance = async () => {
  try {
    const apiURL = `${BASE_URL}/garden/maintenance`;
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};
export const updateGarden = async (payload) => {
  try {
    const apiURL = `${BASE_URL}/garden/update`;
    const response = await axios.patch(apiURL, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};

export const getGardenDetails = async () => {
  try {
    const apiURL = `${BASE_URL}/garden/details`;
    const response = await axios.get(apiURL);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};

export const contact = async (payload) => {
  try {
    const apiURL = `${BASE_URL}/contact-us`;
    const response = await axios.post(apiURL, payload);
    return response.data;
  } catch (error) {
    // Handle errors
    console.error("Error posting data:", error);
    throw error.response.data;
  }
};
