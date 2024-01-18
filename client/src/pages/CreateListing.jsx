import { useState } from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { set } from 'mongoose';


export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    console.log(formData);
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageUploadError(false);
                setUploading(false);
                                
            }).catch((err) => {
                setImageUploadError('image upload failed(2 MB max per image)');
                setUploading(false);
            });
        } else {
            setImageUploadError('you can only upload 6 images at a time');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    }

    const handleRemoveImage = (index) => {
        const newImageUrls = formData.imageUrls.filter((url, i) => i !== index);
        setFormData({ ...formData, imageUrls: newImageUrls });
    }

    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1
                className='text-3xl text-center font-semibold my-7'
            >
                Create Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>

                < div className='flex flex-col gap-4 flex-1'>
                    <input
                        type="text"
                        placeholder='title'
                        className='border p-3 rounded-lg '
                        id='title'
                        maxLength='62'
                        minLength='10'
                        required
                    />
                    <textarea
                        type="text"
                        placeholder='description'
                        className='border p-3 rounded-lg'
                        id='description'
                        required
                    />
                    <input
                        type="text"
                        placeholder='location'
                        className='border p-3 rounded-lg'
                        id='location'
                        required
                    />

                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='sale'
                                className='w-5'
                            />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='rent'
                                className='w-5'
                            />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='parking'
                                className='w-5'
                            />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='furnished'
                                className='w-5'
                            />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input
                                type="checkbox"
                                id='offer'
                                className='w-5'
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex items-center gap-2'>
                            <input
                                type="number"
                                id='bedrooms'
                                min="1"
                                max="10"
                                required
                                className='p-3 border border-gray-300 rounded-lg'
                            />
                            <p>Beds</p>
                        </div>
                        <div className='flex item-center gap-2'>
                            <input
                                type="number"
                                id='bathrooms'
                                min="1"
                                max="10"
                                required
                                className='p-3  border border-gray-300 rounded-lg '
                            />
                            <p>Baths</p>
                        </div>
                        <div className='flex item-center gap-2'>
                            <input
                                type="number"
                                id='regularPrice'
                                min="50"
                                max="10000000"
                                required
                                className='p-3  border border-gray-300 rounded-lg '
                            />
                            <div className='flex flex-col items-center'>
                                <p>regularPrice</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex item-center gap-2'>
                            <input
                                type="number"
                                id='discountPrice'
                                min="50"
                                max="10000000"
                                required
                                className='p-3  border border-gray-300 rounded-lg '
                            />
                            <div className='flex flex-col items-center'>
                                <p>discountPrice</p>
                                <span className='text-xs'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                </div>



                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600 ml-2'                        >
                            The first image will be cover(max 6)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className='p-3 border border-gray-300 rounded w-full'
                            type="file"
                            id='image'
                            accept='image/*'
                            multiple
                        />
                        <button
                            type='button'
                            onClick={handleImageSubmit}
                            disabled={uploading}
                            className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </button>
                    </div>
                    <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                    <p className='text-green-500 text-sm'></p>
                    {
                        formData.imageUrls.length > 0 && (
                            <div className='flex gap-4 flex-wrap'>
                                {



                                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                                        <div className='relative' key={index}>
                                            <img
                                                src={url}
                                                alt="uploaded image"
                                                className='w-40 h-40 object-cover rounded-lg'
                                            />
                                            <button
                                                type='button'
                                                onClick={() => handleRemoveImage(index)}
                                                className='absolute top-0 right-0 bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center'>
                                                <span className='text-sm'>X</span>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    );
}
