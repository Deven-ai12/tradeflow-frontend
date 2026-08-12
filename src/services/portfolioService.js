import axios from "axios";

const API_URL = "http://localhost:8080/api/portfolio";

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const getPortfolio = async () => {
  const response = await axios.get(
    API_URL,
    getConfig()
  );

  return response.data;
};

export default {
  getPortfolio,
};