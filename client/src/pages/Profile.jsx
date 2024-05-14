import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, list, ref, uploadBytes, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, 
  updateUserFailure, 
  updateUserSuccess,
deleteUserFailure,
deleteUserStart,
deleteUserSuccess, 
signOutStart,
signOutFailure,
signOutSuccess} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { set } from 'mongoose'
import {Link} from 'react-router-dom'

export default function Profile() {
  const fileRef = useRef(null);
  // const currentUser = useSelector((state) => state.user.currentUser);
  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const {currentUser, loading, error} = useSelector((state)=> state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // firebase storage
  // allow read;
  //     allow write: if
  //     request.resource.size < 2 * 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePercentage(Math.round(progress));
    },
    (error)=>{
      setFileUploadError(true);

    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => 
        setFormData({...formData, avatar: downloadURL}))
    
    }
  )

  }
  const handleChange = (e)=>{
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch ('/api/user/update/'+ currentUser._id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
    setUpdateSuccess(true);
    
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async ()=>{
    try {
      dispatch(deleteUserStart());
      const res = await fetch('/api/user/delete/' + currentUser._id, {
        method: 'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async ()=>{
    try {
      dispatch(signOutStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  }

  const handleShowListings = async ()=>{
    setShowListingsError(false);
  try {
    const res = await fetch('/api/user/listings/' + currentUser._id);
    const data = await res.json();
    if(data.success === false){
      setShowListingsError(true);
      return;
    }
    setUserListings(data);
  } catch (error) {
    setShowListingsError(true);
  }
  }
  const handleListingDelete = async (listingId)=>{
  try {
    const res = await fetch('/api/listing/delete/' + listingId, {
      method: 'DELETE',
    });
    const data = await res.json();
    if(data.success === false){
      console.log(data.message);
      return;
    }
    setUserListings((prev) => prev.filter((listing) => listing._id !== listingId)); 
    
  } catch (error) {
    console.log(error.message);
  }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type='file' ref ={fileRef} hidden accept='image/*'/>
        <img onClick={()=>fileRef.current.click()} src = {formData.avatar || currentUser.avatar} alt = 'profile' 
        className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'></img>
        <p className='text-sm self-center'>
          {fileUploadError ?
          (<span className='text-red-700'>File image upload error
          (image must be less than 2 mb)</span>) :
          filePercentage > 0 && filePercentage < 100 ? 
          <span className='text-slate-700'>
            {'Uploading... ' + filePercentage + '%'}
          </span> :
          filePercentage === 100 ?
          <span className='text-green-700'>Image upload complete</span> :
          ""

        }
        </p>
        <input 
        onChange = {handleChange}
        type='text' placeholder='username' id='username' 
        className='border p-3 rounded-lg'
        defaultValue={currentUser.username} />
        <input 
        onChange={handleChange}
        type='email' placeholder='email' id='email' 
        className='border p-3 rounded-lg' 
        defaultValue={currentUser.email} />
        <input 
        onChange={handleChange}
        type='password' placeholder='password' id='password' 
        className='border p-3 rounded-lg'  />
        <button disabled={loading} className='bg-green-800 text-white rounded-lg
        p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'loading...' : 'Update'}
          </button>
          {/* <button className='bg-red-900 text-white rounded-lg
        p-3 uppercase hover:opacity-95 disabled:opacity-80'>
            Create listing
          </button> */}
          <Link className='bg-slate-900 text-white p-3
          rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>
            Create listing 
          </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span 
        onClick={handleDeleteUser}
        className='text-red-700 cursor-pointer'>Delete account</span>
        <span 
        onClick={handleSignOut}
        className='text-red-700 cursor-pointer'>Sign out account</span>
      </div>
      <p className='text-red-700 mt-5'>
        {error ? error : ""}
      </p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'Profile updated successfully' : ""}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full '>
        Show Listings
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Error showing listings' : ""}
        </p>
        {userListings && userListings.length > 0 && 
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold text-center mt-7'>Your Listings</h1>

        {userListings.map((listing) => (
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link to={'/listing/' + listing._id}>
              <img src={listing.imageUrls[0]} alt="listing cover" className='h-16 w-16 object-contain' />
            </Link>
            <Link className='text-green-700 font-semibold flex-1 hover:underline truncate' to={'/listing/' + listing._id}>
              <p>{listing.name}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleListingDelete(listing._id)} className='text-red-900  rounded-lg'>Delete</button>
              <button className='text-green-900 rounded-lg'>Edit</button>
            </div>
          </div>

        ))
        }
        </div>}
      
    </div>
  )
}
