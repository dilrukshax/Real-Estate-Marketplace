import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage"
import { app } from "../firebase"
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,

} from "../redux/user/userSlice"
import { useDispatch } from "react-redux"



function Profile() {
  const fileRef = useRef(null)
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();



  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  // Upload file to firebase storage

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({
            ...formData,
            avatar: downloadURL
          })
        );
      }
    );
  };

  // Handle form data

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  // Handle form submit

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  // Handle delete user

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  // Handle sign out

  const handleSignOut = async () => {
    
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
      
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className=' flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          className='hidden'
          ref={fileRef}
          accept="image/*"
        />
        {/* rules_version = '2';
          *
          *         // Craft rules based on data in your Firestore database
          *          // allow write: if firestore.get(
          *          //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
          *          service firebase.storage {
          *            match / b / { bucket } / o {
          *            match / { allPaths=**} {
          *            allow read;
          *          allow write : if
          *          request.resource.size < 2 * 1024 * 1024 &&
          *          request.resource.contentType.matches('image/.*')
          *        
          *      }
          *    }}
          */}
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer  self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type="text"
          placeholder='Name'
          defaultValue={currentUser.name}
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="name"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder='Email'
          defaultValue={currentUser.email}
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="email"
          onChange={handleChange}
        />
        <input
          type="contact"
          placeholder='contact'
          defaultValue={currentUser.contact}
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="contact"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder='username'
          defaultValue={currentUser.username}
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="username"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder='Password'
          className='bg-slate-100 p-3 rounded-lg my-2'
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-500 text-white p-3 rounded-lg my-2 uppercase hover:opacity-45 disabled:opacity-30'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-500 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-500 cursor-pointer"
        >
          Sing out
        </span>
      </div>
      <p className="text-green-500 text-center mt-5">{updateSuccess ? 'Profile updated successfully' : ''}</p>
      <p className="text-red-500 text-center mt-5">{error ? error : ''}</p>
    </div>
  )
}

export default Profile