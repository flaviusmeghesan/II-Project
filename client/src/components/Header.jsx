
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaSearch } from 'react-icons/fa';
export default function Header() {
    const { currentUser } = useSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('search', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('search');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    },[location.search])
  return (
    <header className='bg-purple-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>   
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-purple-500'>Kings</span>
            <span className='text-purple-700'>Rent</span>
        </h1>
        </Link>
        <form onSubmit={handleSubmit} className="bg-purple-100 p-3 rounded-lg flex items-center">
            <input type='text' placeholder='Search...' 
            className='bg-transparent focus:outline-none w-24 sm:w-64' 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
                <FaSearch className='text-purple-500' />
            </button>
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
