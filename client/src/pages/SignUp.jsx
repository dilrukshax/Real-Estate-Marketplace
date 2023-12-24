import React from 'react'
import { Link } from 'react-router-dom'

function SignUp() {
  return (
    <div className='p-5 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-bold my-10'>Sign Up</h1>
      <from className='flex flex-col gap-5'>
        <input type="text" placeholder='Your Name'
          className='border p-3 rounded-lg ' id='name' />

        <input type="email" placeholder='Your email'
          className='border p-3 rounded-lg ' id='email' />

        <input type="contact" placeholder='Your contact'
          className='border p-3 rounded-lg ' id='contact' />

        <div class="flex items-center">
          <input type="radio" id="male" name="gender" value="male" class="mr-2 text-blue-500"  />
            <label for="male" class="text-gray-700">Male</label>
        </div>

        <div class="flex items-center">
          <input type="radio" id="female" name="gender" value="female" class="mr-2 text-pink-500" />
            <label for="female" class="text-gray-700">Female</label>
        </div>

        <input type="text" placeholder='username'
          className='border p-3 rounded-lg ' id='username' />

        <input type="password" placeholder=' password'
          className='border p-3 rounded-lg ' id='password' />

        <button className='bg-blue-500 text-white p-3 rounded-lg uppercase hover:opacity-70'>Sign Up</button>

      </from>
      <div className='flex justify-center gap-2 mt-5'>
        <p>Already have an account? </p>
        <Link to= {"/sign-in"} >
          <span className='text-blue-500'>Sign In</span>
          </Link>
      </div>
    </div>
  )
}

export default SignUp