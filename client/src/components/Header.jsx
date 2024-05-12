
import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
export default function Header() {
    const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='bg-purple-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>   
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-purple-500'>Kings</span>
            <span className='text-purple-700'>Rent</span>
        </h1>
        </Link>
        <form>
            <input type='text' placeholder='Search...' className='bg-purple-100 bg-transparent border-2 border-purple-200 rounded-lg p-3 focus:outline-none' />
           
        </form>
        <ul className="flex gap-4">
            <Link to='/'>
            <li>Home</li>
            </Link>
            <Link to='/about'>
            <li>About</li>
            </Link>
            <Link to='/profile'>
           { currentUser ? (
            <img className = 'rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile' />
           ) : (<li classname= 'text-slate-700 hover: underline'> Sign in</li> 
           )}
            {/* <li>Sign in</li> */}
            </Link>
        </ul>
        </div>
    </header>
  )
}
