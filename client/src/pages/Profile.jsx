import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'

export default function Profile() {
  const fileRef = useRef(null);
  const currentUser = useSelector((state) => state.user.currentUser);
  const [file, setFile] = useState(null);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError , setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

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
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
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
        <input type='text' placeholder='username' id='username' 
        className='border p-3 rounded-lg' />
        <input type='email' placeholder='email' id='email' 
        className='border p-3 rounded-lg'  />
        <input type='password' placeholder='password' id='password' 
        className='border p-3 rounded-lg'  />
        <button className='bg-green-800 text-white rounded-lg
        p-3 uppercase hover:opacity-95 disabled:opacity-80'>update</button>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out account</span>
      </div>
    </div>
  )
}
