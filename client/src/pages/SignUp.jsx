import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Sign Up
      </h1>
      <form className='flex flex-col gap-4'>
        <input type = "text" placeholder = 'username' className='p-3 border border-gray-300 rounded-lg my-2' id='username'/>
        <input type = "email" placeholder = 'email' className='p-3 border border-gray-300 rounded-lg my-2' id='email'/>
        <input type = "password" placeholder = 'password' className='p-3 border border-gray-300 rounded-lg my-2' id='password'/>
        <button className='bg-green-500 text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p> Have an account?</p>
        <Link to={"/sign-in"} className='text-purple-500'>Sign In</Link>
      </div>
    </div>
  )
}
