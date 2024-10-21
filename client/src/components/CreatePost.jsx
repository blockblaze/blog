import { Alert, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import CKEditorCom from "./CKEditor";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";


export function CreatePost() {
  const [files, setFiles] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState("");
  const [publishError,setPublishError] = useState(null);

  console.log(formData)

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    if (!files.image) {
      setImageUploadError("Please, select an Image.");
      return;
    }

    const image = files.image;
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + image.name;
    const storageRef = ref(storage, `images/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setImageUploadError('Image upload failed');
        setImageUploadProgress(null);
      },
      () => {
        // Get download URL after successful upload
        setImageUploadError(null);
        setImageUploadProgress(null);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFormData({ ...formData, imageUrl: url });
        });
      }
    );
  };

  const handleUploadFile = async () => {
    if (!files.file) {
      setImageUploadError("Please, select a File.");
      return;
    }

    const file = files.file;
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, `files/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileUploadProgress(progress.toFixed(0));
      },
      // eslint-disable-next-line no-unused-vars
      (error) => {
        setFileUploadError('Image upload failed');
        setFileUploadProgress(null);
      },
      () => {
        // Get download URL after successful upload
        setFileUploadError(null);
        setFileUploadProgress(null);
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setFormData({ ...formData, fileUrl: url });
        });
      }
    );
  };
  const handleEditorChange = (data) => {
    setFormData({ ...formData, content: data });
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const respone = await fetch('/api/post/create',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
    const data = await respone.json();
    console.log(data)
    if(data.success){
      navigate(`/post/${formData.slug}`);
    }else{
      setPublishError(data.message);
    }
    }catch(err){
      setPublishError(err.response?.data?.message || 'Login failed.');

    }


  

  }



  return (
    <div className="p-3 w-full max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl my-7 font-bold">Create a post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            required

            onChange={(e)=>{setFormData({...formData , title:e.target.value})}}
          />
          <Select
            
            onChange={(e) => {
              setCategory(e.target.value);
              setFormData({...formData , category:e.target.value})
            }}
            id="category"
            required
          >
            <option value="">Select a category</option>
            <option value="articles">Articles</option>
            <option value="scripts">Scripts</option>
            <option value="maps">Maps</option>
          </Select>
        </div>
        <TextInput type="text" placeholder="Slug" id="slug"  required onChange={(e)=>{setFormData({...formData , slug:e.target.value})}}/>

        <div className="flex gap-4 items-center justify-between border-4 border-custom-dark-orange border-dotted p-3">
          <FileInput
            type="file"
            accept="images/*"
            onChange={(e) => {
              setFiles({ ...files, image: e.target.files[0] });
            }}
            required
          />
            <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium" type="button" onClick={handleUploadImage}>
            {
                imageUploadProgress?<div className="w-16 h-16">
                     <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
                </div>:'Upload Image'
            }
          </button>



        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}

        {/* Quill Editor */}
        {/* <ReactQuill 
                        theme="snow" 
                        placeholder="Enter something..." 
                        className="h-72 mb-12" 
                        value={editorValue} 
                        onChange={setEditorValue}
                    /> */}
        <CKEditorCom setEditorValue={handleEditorChange} />

        {/* Downloadables */}

        {category === "maps" || category === "scripts" ? (
          <>
            <TextInput
              type="text"
              placeholder="Supported Minecraft version"
              id="supported-version"
              required
              onChange={(e)=>{setFormData({...formData , supporedVersion:e.target.value})}}
            />
            <div className="flex gap-4 items-center justify-between border-4 border-custom-dark-orange border-dotted p-3">
            <FileInput type="file"
            onChange={(e) => {
              setFiles({ ...files, file: e.target.files[0] });
            }} required/>

            <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium" type="button" onClick={handleUploadFile}>
            {
                fileUploadProgress?<div className="w-16 h-16">
                     <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
                </div>:'Upload File'
            }
          </button>
            </div>
            {fileUploadError && <Alert color='failure'>{fileUploadError}</Alert>}
          </>
        ) : null}

        <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">
          Create
        </button>
        {publishError && (
  <Alert color="failure">
    {publishError}
  </Alert>
)}
      </form>
    </div>
  );
}
