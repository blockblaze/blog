import { Alert, FileInput, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
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


// eslint-disable-next-line react/prop-types
export function UpdatePost() { 
  const [postId , setPostId] = useState(null);
  const [files, setFiles] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    slug: '',
    content: '',
    supportedVersions: '',
    thumbnailUrl: '',
    fileUrl: ''
  });  

  console.log(formData)
  const [category, setCategory] = useState("");
  const [publishError,setPublishError] = useState(null);



  const navigate = useNavigate();
  useEffect(() => {
    
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('postId');
    if (tabFromUrl) {
      setPostId(tabFromUrl);
    }else return navigate("/");
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${parseInt(postId)}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);

          setFormData(data[0]);
          setCategory(data[0].category)
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [navigate, postId]);

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
          setFormData({ ...formData, thumbnailUrl: url });
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      content: data,
    }));
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const respone = await fetch('/api/post/update',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
    })
    const data = await respone.json();
    console.log(data)
    if(data.success){

      const slug  =
      formData.slug.split(' ')
      .join('-')
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, '');

      navigate(`/post/${slug}`);
    }else{
      setPublishError(data.message);
    }
    }catch(err){
      setPublishError(err.response?.data?.message || 'Updated failed.');

    }


  

  }



  return (
    <div className="p-3 w-full max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl my-7 font-bold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            required
            value={formData?.title || ""}
            onChange={(e)=>{setFormData({...formData , title:e.target.value})}}
          />

          {category === "maps" || category === "scripts" ?(
            <><Select
            
            onChange={(e) => {
              setCategory(e.target.value);
              setFormData({...formData , category:e.target.value})
            }}
            id="category"
            required
            value={formData?.category || ""}
          >
            <option value="">Select a category</option>
            <option value="scripts">Scripts</option>
            <option value="maps">Maps</option>
          </Select>
          </>
          ):(<><Select
            
            onChange={(e) => {
              setCategory(e.target.value);
              setFormData({...formData , category:e.target.value})
            }}
            id="category"
            required
            value={formData?.category || ""}
          >
            <option value="">Select a category</option>
            <option value="articles">Articles</option>
          </Select></>)}

        </div>
        <TextInput type="text" placeholder="Slug" id="slug"  required onChange={(e)=>{setFormData({...formData , slug:e.target.value})}} value={formData?.slug || ""}/>

        <div className="flex gap-4 items-center justify-between border-4 border-custom-dark-orange border-dotted p-3">
          <FileInput
            type="file"
            accept="images/*"
            onChange={(e) => {
              setFiles({ ...files, image: e.target.files[0] });
            }}
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
        {formData?.thumbnailUrl && (
          <img
            src={formData.thumbnailUrl}
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
        <CKEditorCom setEditorValue={handleEditorChange} defaultData={formData?.content || '<p>Enter something</p>'}/>

        {/* Downloadables */}

        {category === "maps" || category === "scripts" ? (
          <>
            <TextInput
              type="text"
              placeholder="Supported Minecraft version"
              id="supported-version"
              required
              onChange={(e)=>{setFormData({...formData , supportedVersions:e.target.value})}}
            value={formData?.supportedVersions || ''}
           />
            <div className="flex gap-4 items-center justify-between border-4 border-custom-dark-orange border-dotted p-3">
            <FileInput type="file"
            onChange={(e) => {
              setFiles({ ...files, file: e.target.files[0] });
            }}/>

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
          Update
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
