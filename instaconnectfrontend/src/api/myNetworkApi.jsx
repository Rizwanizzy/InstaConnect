
import axiosInstance from "../utils/axiosInstance";

const myNetworkApi = async (userId) => {
    try {
      const response = await axiosInstance({
        url: '/post/network/',
        method: "GET",
      });
      if (response.status === 200) {
        console.log("networks", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

export default myNetworkApi
