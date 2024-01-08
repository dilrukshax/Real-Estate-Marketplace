import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage"
import { app } from "../firebase"



function Profile() {
  const fileRef = useRef(null)
  const { currentUser } = useSelector(state => state.user)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload =  (file) => {
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


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className=' flex flex-col'>
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