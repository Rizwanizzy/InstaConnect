import axiosInstance from "../utils/axiosInstance";

const reportedPostsListApi = async () => {
    try {
        const response = await axiosInstance({
            url:'/reportedposts/',
            method:'GET',
        })
        if (response.status === 200){
            console.log('homepage',response.data)
            return response.data
        } else {
            console.log(response.error)
        }
        console.log(response.data)
    } catch (error) {
        console.error(error)
    }
}

export default reportedPostsListApi