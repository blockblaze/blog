import { Alert, Label, Textarea, TextInput } from "flowbite-react";
import { useState } from "react";

function Contact() {
  const [formData , setFormData] = useState({});
  const [state , setState] = useState(null);

  function handleChange(e){
      setFormData({...formData, [e.target.id]:e.target.value})
  }

  async function handleSubmit(e){
      e.preventDefault();
      try{
          const respone = await fetch('/api/contact/sendcontact',{
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData),
          })
          const data = await respone.json();
          if(data.success){
            setState(data)
          }else{
              setState({success:false,message:data.message})
          }

      }catch(err){
        setState({success:false,message:err.response?.data?.message || 'Contact send failed.'});
      }
  }

  return(
      <div className="min-h-screen mt-20">
          <div className="flex flex-col items-center">
            <div className="w-96 flex flex-col gap-3">
          <h1 className="font-bold text-5xl text-center">Contact Me</h1>
    <p className="text-lg">
    If you have any questions or suggestions, you can contact me via this form or via <a href="https://twitter.com/@BlockBlazeXD" target="_blank" className="text-custom-dark-orange font-bold">my Twitter account</a>.
    </p>
    </div>
          <form className="flex flex-col gap-4 py-7 w-96" onSubmit={handleSubmit}>
          <div className="">
              <Label value="Your Name"/>
              <TextInput
              type="text"
              placeholder=""
              id="name"
              onChange={handleChange}
              required
              />
              </div>
              <div className="">
              <Label value="Your Email"/>
              <TextInput 
              type="email"
              placeholder=""
              id="email"
              onChange={handleChange}
              required
              
              />
              </div>
              <div className="">
              <Label value="Subject"/>
              <TextInput
              type="text"
              placeholder=""
              id="subject"
              onChange={handleChange}
              required
              />
              </div>
              <div className="">
              <Label value="Your Message"/>
              <Textarea
              type="text"
              placeholder=""
              id="message"
              onChange={handleChange}
              required
              />
              </div>
              <button className="bg-custom-orange text-white p-2 m:p-3 rounded hover:bg-custom-dark-orange font-medium">Send</button>
              {state  && <Alert color={state.success?"green":"red"} className="min-w-full">{state.message}</Alert>}
          </form>
          
          </div>

      </div>
  );
  }
  
  export default Contact
  