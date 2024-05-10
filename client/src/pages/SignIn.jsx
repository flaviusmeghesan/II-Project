import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';


export default function SignIn() {
  const [formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
    // setLoading(true);
    const res = await fetch('/api/auth/signin',
  {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  console.log(data);
  if(data.success === false) {
    // setLoading(false);
    // setError(data.message);
    dispatch(signInFailure(data.message));
    return;
  }
  // setLoading(false);
  // setError(null);
  dispatch(signInSuccess(data));
  navigate('/');
} catch(error) {
  // setLoading(false);
  dispatch(signInFail(error.message));
  // setError(error.message);

}
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type = "email" placeholder = 'email' className='p-3 border border-gray-300 rounded-lg my-2' id='email' onChange={handleChange}/>
        <input type = "password" placeholder = 'password' className='p-3 border border-gray-300 rounded-lg my-2' id='password' onChange={handleChange}/>
        <button disabled = {loading} className='bg-green-500 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' : 'Sign In'}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account?</p>
        <Link to={"/sign-un"} className='text-purple-500'>Sign Up</Link>
      </div>
      {error && <p className='text-red-500 mt-3'>{error}</p>}
    </div>
  )
}
