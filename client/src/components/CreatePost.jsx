import { FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill, {  } from 'react-quill'; // Import Quill here
import 'react-quill/dist/quill.snow.css';

export function CreatePost() {
    const [editorValue, setEditorValue] = useState('');
    const [category , setCategory] = useState('');

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="text-center text-4xl my-7 font-bold">Create a post</h1>
            <form className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row justify-between">
                    <TextInput type="text" placeholder="Title" id="title" className="flex-1" required />
                    <Select required onChange={(e)=>{setCategory(e.target.value)}}>
                        <option value="">Select a category</option>
                        <option value="maps">Maps</option>
                        <option value="scripts">Scripts</option>
                        <option value="articles">Articles</option>
                    </Select>
                </div>
                <TextInput type="text" placeholder="Slug" id="slug" required />

                <div className="flex gap-4 items-center justify-between border-4 border-custom-dark-orange border-dotted p-3">
                    <FileInput type="file" accept="images/*" />
                    <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">
                        Upload image
                    </button>
                </div>

                {/* Quill Editor */}
                <ReactQuill 
                    theme="snow" 
                    placeholder="Enter something..." 
                    className="h-72 mb-12" 
                    value={editorValue} 
                    onChange={setEditorValue}
                />

                {/* Downloadables */}

                {category === "maps" || category ==="scripts"?                 <><TextInput type="text" placeholder="Supported Minecraft version" id="supported-version" required /><FileInput type="file" accept="images/*" /></>
                : <></>}

                    <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">
                        Create
                    </button>
            </form>
        </div>
    );
}
