import { Label , TextInput } from "flowbite-react"

function Login(){
    return(
        <div className="min-h-screen mt-20">
            <div className="flex flex-col items-center">
            <h1 className="font-bold text-5xl text-center">Login</h1>

            <form className="flex flex-col gap-4 py-7 w-80">
                <div className="">
                <Label value="Your email"/>
                <TextInput 
                type="text"
                placeholder="example@email.com"
                id="email"
                />
                </div>
                <div className="">
                <Label value="Your Password"/>
                <TextInput 
                type="text"
                placeholder="**********"
                id="email"
                />
                </div>
                <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">Login</button>

            </form>
            </div>

        </div>
    );
}

export default Login;