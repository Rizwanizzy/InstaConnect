import axiosInstance from '../utils/axiosInstance'

const postListApi = async () =>{
    try{
        const response = await axiosInstance({
            url:'/post/home/',
            method:'GET',
        })
        if(response.status === 200){
            console.log('homepage',response.data)
            return response.data
        }else{
            console.error('Error:', response.status, response.statusText);
            return { posts: [], users_not_following: [] };
        }
    } catch(error){
        console.error('API Error:', error);
        return { posts: [], users_not_following: [] }
    }
}

export default postListApi