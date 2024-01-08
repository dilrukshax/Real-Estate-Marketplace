import { useSelector } from "react-redux"

function Profile() {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className=' flex flex-col'>
        <img
          src={currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer  self-center mt-2'
        />
        <input
          type="text"
          placeholder='Name'
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="name"
        />
        <input
          type="email"
          placeholder='Email'
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="email"
        />
        <input
          type="contact"
          placeholder='contact'
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="contact"
        />
        <input
          type="text"
          placeholder='username'
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="username"
        />
        <input
          type="password"
          placeholder='Password'
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="password"
        />
        <button className='bg-slate-500 text-white p-3 rounded-lg my-2 uppercase hover:opacity-45 disabled:opacity-30'>
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-500 cursor-pointer">Delete Account</span>
        <span className="text-red-500 cursor-pointer">Sing out</span>
      </div>
    </div>
  )
}

export default Profile