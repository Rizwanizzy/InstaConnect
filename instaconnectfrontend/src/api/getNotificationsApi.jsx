import axiosInstance from "../utils/axiosInstance";

const getNotificationsApi = async () => {
    try {
      const response = await axiosInstance({
        url: '/post/notifications/',
        method: "GET",
      });
      if (response.status === 200) {
        console.log("notifications", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

export default getNotificationsApi

