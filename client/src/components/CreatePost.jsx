import { FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import CKEditorCom from "./CKEditor";
// import ReactQuill, {  } from 'react-quill'; // Import Quill here
// import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";


export function CreatePost() {
  const [files, setFiles] = useState({});
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState("");

  console.log(formData)
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

  const handleEditorChange = (data) => {
    setFormData({ ...formData, content: data });
  };

  return (
    <div className="p-3 w-full max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-4xl my-7 font-bold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            required
          />
          <Select
            
            onChange={(e) => {
              setCategory(e.target.value);
            }}
            required
          >
            <option value="">Select a category</option>
            <option value="maps">Maps</option>
            <option value="scripts">Scripts</option>
            <option value="articles">Articles</option>
          </Select>
        </div>
        <TextInput type="text" placeholder="Slug" id="slug"  required/>

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
            />
            <FileInput type="file" accept="images/*" required/>
          </>
        ) : null}

        <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">
          Create
        </button>
      </form>
    </div>
  );
}
