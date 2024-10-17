/* eslint-disable react/prop-types */
import { Label , TextInput , Alert } from "flowbite-react"
import { useState } from "react";

function Login({onLoginSuccess}){
    const [formData , setFormData] = useState({});
    const [error , seterror] = useState(null);

    function handleChange(e){
        setFormData({...formData, [e.target.id]:e.target.value})
    }

    async function handleSubmit(e){
        e.preventDefault();
        try{
            const respone = await fetch('/api/login',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await respone.json();
            if(data.success){
                onLoginSuccess();
            }else{
                seterror(data.message)
            }

        }catch(err){
            seterror(err.response?.data?.message || 'Login failed.');
        }
    }

    return(
        <div className="min-h-screen mt-20">
            <div className="flex flex-col items-center">
            <h1 className="font-bold text-5xl text-center">Login</h1>

            <form className="flex flex-col gap-4 py-7 w-80" onSubmit={handleSubmit}>
                <div className="">
                <Label value="Your email"/>
                <TextInput 
                type="email"
                placeholder="example@email.com"
                id="email"
                onChange={handleChange}
                required
                
                />
                </div>
                <div className="">
                <Label value="Your Password"/>
                <TextInput 
                type="password"
                placeholder="**********"
                id="password"
                onChange={handleChange}
                required
                />
                </div>
                <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">Login</button>
                {error  && <Alert color="failure" className="min-w-full">{error}</Alert>}
            </form>
            
            </div>

        </div>
    );
}

export default Login;