import React, { useState } from 'react'
import UpdatePostApi from '../api/UpdatePostApi'
import { toast } from 'react-toastify'
import createPostApi from '../api/createPostApi'

const PostModal = ({isVisible, onClose , postID}) => {

    const [postImage,setPostImage] = useState()
    const [caption,setCaption] = useState('')

    if (!isVisible) return null

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(postID){
            try{
                onClose()
                await UpdatePostApi(postID,caption,postImage)
                toast.success('Post updated successfully',{
                position:'top-center',
                })
                setCaption('')
            }catch(error){
                toast.error('Failure , Post not update!',{
                    position:'top-center'
                })
            }
        } else {
            try {
                onClose()
                await createPostApi(caption,postImage)
                toast.success('Post Created successfully',{
                    position:'top-center',
                })
                setCaption('')
            } catch (error) {
                toast.error('Failure, Post not Created',{
                    position:'top-center',
                })
            }
        }
    }

    const handleClose = (e) =>{
        if(e.target.id === 'wrapper') onClose()
    }

    var loadFile = function(event) {
        setPostImage(event.target.files[0])
        var output = document.getElementById('preview_img')
        output.src = URL.createObjectURL(event.target.files[0])
        output.onload = function() {
            URL.revokeObjectURL(output.src)
        }
    }

  return (
    <div
      className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
      id="wrapper"
      onClick={handleClose}
    >
      <div className="m-2 w-[600px] flex flex-col">
        <button className="text-white text-xl place-self-end" onClick={onClose}>
          x
        </button>
        <div className="bg-white p-2 rounded">
          <form className="m-3" onSubmit={handleSubmit}>
            <label htmlFor="modal" className="flex justify-center font-bold ">
              {postID ? 'Update Post' : 'Add Post'}
            </label>
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                Upload Image
              </label>
              <input
                onChange={loadFile}
                className="relative my-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                type="file"
                id="formFile"
              />
            </div>
            <div className="shrink-0 flex justify-center">
                    <img id='preview_img' className=" w-36 object-cover rounded-lg my-2" src="https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png" alt="Current" />
            </div>
            <div className="relative my-5" data-te-input-wrapper-init>
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="peer block min-h-[auto] w-full rounded border-0 bg-primary-100 px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear text-dark placeholder-neutral-400 placeholder-opacity-70 focus:placeholder-opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder-opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder-opacity-0"
                    placeholder="Write Caption"
                />
                <label
                    htmlFor="exampleFormControlInpu3"
                    className="pointer-events-none text-gray-900 absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-black-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                >
                    Write Something..
                </label>
            </div>
            <button
              type="submit"
              data-te-ripple-init
              data-te-ripple-color="light"
              className="inline-flex items-center rounded bg-gray-600 px-6 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              {/* <span className="material-symbols-outlined text-sm mr-2">
                upload
              </span> */}
              <span className="flex-shrink-0 ">Done</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostModal
