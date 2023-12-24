import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/' >
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Real</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center w-24 sm:w-64'>
          <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none' />
          <FaSearch className='text-slate-500' />
        </form>
        <ul className='flex items-center space-x-4 text-sm sm:text-base'>
          <Link to='/' >  
          <li className='text-slate-500 hover:text-slate-700'>Home</li>
          </Link>
          <Link to='/sign-up' >
          <li className='text-slate-500 hover:text-slate-700'>Sign up</li>
          </Link>
          <Link to='/sign-in' >
          <li className='text-slate-500 hover:text-slate-700'>Sign In</li>
          </Link>
          <Link to='/about' >
          <li className='text-slate-500 hover:text-slate-700'>About us</li>
          </Link>
        </ul>
      </div>
    </header>
  )
}

export default Header