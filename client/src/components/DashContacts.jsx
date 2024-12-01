import { Link } from "react-router-dom";
import { Table , Button , Modal , Alert } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Dropdown } from "flowbite-react";
import { Card } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export function DashContacts(){

    const [contacts , setContacts] = useState([]);
    const [feedbacks , setFeedbacks] = useState([]);
    const [showType , setShowType] = useState("contacts");
    const [showMore , setShowMore] = useState(true);
    const [showModal , setShowModal] = useState(false);
    const [showContactModal , setShowContactModal] = useState(false);
    const [idToDelete , setIdToDelete] = useState(null);
    const [contactMessage, setContactMessage] = useState('');
    const [contactIdToRespond , setContactIdToRespond] = useState(null);
    const [contactResponse, setContactResponse] = useState(null);
    const [error , setError] = useState(null);

    const fetchContacts = async ()=>{
        const res = await fetch("/api/contact/getcontacts?order=asc");
        const data = await res.json();
        if(res.ok){
            setContacts(data)
            if(data.length <9) setShowMore(false)
        }
    }

    const fetchFeedbacks = async ()=>{
        const res = await fetch("/api/rate/getfeedbacks");
        const data = await res.json();
        console.log(data)
        if(res.ok){
            setFeedbacks(data)
            if(data.length <9) setShowMore(false)
        } 
    }

    const handleShowType = (type)=>{
        switch(type){
            case "contacts":
                fetchContacts();
                setShowType("contacts")
            ;break;
            case "feedbacks":
                fetchFeedbacks();
                setShowType("feedbacks")
            ;break;
        }
    }

    useEffect(()=>{
        fetchContacts();
    },[])

    const handleShowMore = async ()=>{
      try{
        switch(showType){
            case 'contacts':{
                    const startIndex = contacts.length;
                    const res = await fetch(`/api/contact/getcontacts?offset=${startIndex}&order=asc`);
                    const data = await res.json();
                    
                    if(res.ok){
                      setContacts((prev)=>[...prev , ...data]);
                      if (data.length < 9) {
                        setShowMore(false);
                      }
                    }
                  
            };break;
            case 'feedbacks':{

                    const startIndex = feedbacks.length;
                    const res = await fetch(`/api/rate/getfeedbacks?offset=${startIndex}`);
                    const data = await res.json();
                    
                    if(res.ok){
                      setFeedbacks((prev)=>[...prev , ...data]);
                      if (data.length < 9) {
                        setShowMore(false);
                      }
                    }  
            };break;
        }
       
      }catch(err){
        console.log(err)
      }

      
    };

    const handleDelete = async ()=>{
        try{
        setShowModal(false);
        setShowContactModal(false);
        switch(showType){
            case "contacts":{
            const res = await fetch(
            `/api/contact/deletecontact/${idToDelete}`,
            {
                method: 'DELETE',
            }
            );
            const data = await res.json();
    
            if(!res.ok){
            console.log(data.message);
            }else{
            setContacts((prev) =>
                prev.filter((contact) => contact.contactId !== idToDelete)
            );
            }
        };break;
        case "feedbacks":{
    const res = await fetch(
        `/api/rate/deletefeedback/${idToDelete}`,
        {
            method: 'DELETE',
        }
        );
        console.log(res.text)
        const data = await res.json();


        if(!res.ok){
        console.log(data.message);
        }else{
        setFeedbacks((prev) =>
            prev.filter((feedback) => feedback.feedbackId !== idToDelete)
        );
        }
        };break;
            }

        }
        catch(err){
            console.log(err)
          }
    };

    const handleShowContactModal = async (msg,id)=>{
        setContactMessage(msg);
        setContactIdToRespond(id);
        setShowContactModal(true);
    }

    const handleContactRespond = async(e)=>{
      e.preventDefault();
      try{
        const respone = await fetch('/api/contact/respond',{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify({
            contactId: contactIdToRespond,
            response: contactResponse,
          }),
      })
      const data = await respone.json();
      console.log(data.success)
      if(data.success){
        setShowContactModal(false);
      }else{
        setError(data.message);
      }
      }catch(err){
        console.log(err)
      }
    };

    return(

        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'">
            <div className="mt-3 mb-10 ml-2">
            <Dropdown label="Type" inline>
        <Dropdown.Item onClick={()=>handleShowType("contacts")}>Contacts</Dropdown.Item>
        <Dropdown.Item onClick={()=>handleShowType("feedbacks")}>Feedbacks</Dropdown.Item>
        </Dropdown>
            </div>
            {showType === "contacts" && contacts.length >0? (
                <Card className="w-[100vh]">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">All Contacts</h5>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {
            contacts.map(contact=>(
                <li className="py-3 sm:py-4" key={contact.contactId}>
                <div className="flex items-center space-x-4">
                  <div className="shrink-0">
                  </div>
                  <div className="min-w-0 flex-1 cursor-pointer" onClick={()=>{handleShowContactModal(contact.message,contact.contactId); setIdToDelete(contact.contactId)}}>
                    <p className={`${contact.isResponded? "text-green-400":"text-red-400"} truncate text-sm font-medium`}>{contact.contactName} ({contact.contactEmail})</p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">{contact.subject}</p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">{new Date(contact.submissionDate).toISOString().split('T')[0]}</div>
                </div>
              </li>
            ))
        }
        </ul>
      </div>
      {showMore && (
            <button
              // onClick={handleShowMore}
              onClick={()=>handleShowMore("contacts")}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
    </Card>

): showType === "feedbacks" && feedbacks.length >0?(                <div>
                <Table hoverable className="shadow-md">
                    <Table.Head>
                <Table.HeadCell>Submitted at</Table.HeadCell>
                <Table.HeadCell>User IP</Table.HeadCell>
                <Table.HeadCell>Feedback</Table.HeadCell>
                <Table.HeadCell>Related post</Table.HeadCell>
                <Table.HeadCell>
                    <span>Delete</span>
                </Table.HeadCell>
                </Table.Head>
                {feedbacks.map((feedback)=>(
                // eslint-disable-next-line react/jsx-key
                <Table.Body className='divide-y'>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={feedback.feedbackId}>
                    <Table.Cell>{new Date(feedback.submissionDate).toDateString()}</Table.Cell>
                    <Table.Cell>
                    {feedback.userIp}
                  </Table.Cell>
                  <Table.Cell>
                    {feedback.feedback}
                  </Table.Cell>
                  <Link to={`/post/${feedback.slug}`}>
                  <Table.Cell>
                    {feedback.slug}
                  </Table.Cell>
                  </Link>
                  <Table.Cell>
                  <span className="font-medium text-red-500 hover:underline cursor-pointer"
                    onClick={()=>{setIdToDelete(feedback.feedbackId);setShowModal(true)}}
                    >
                        Delete
                    </span>
                    </Table.Cell>
                    </Table.Row>

            </Table.Body>
                ))}
                </Table>
                {showMore && (
            <button
              // onClick={handleShowMore}
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7'
            >
              Show more
            </button>
          )}
                </div>) : (<p>No {showType} found.</p>)}

              <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDelete}>
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal dismissible show={showContactModal} onClose={() => setShowContactModal(false)}>
        <Modal.Header>Message</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          {contactMessage}
          </div>
          
        </Modal.Body>
        <Modal.Footer className="flex flex-col items-start">
          <form onSubmit={handleContactRespond} className="w-full">
          <div className="mb-3">
          <ReactQuill
          theme='snow'
          placeholder='Write your response...'
          className='h-32 mb-12'
          required
          onChange={(value) => {
            setContactResponse(value);
          }}
        />
          </div>
          {error  && <Alert color="failure" className="min-w-full mb-2">{error}</Alert>}

          <div className="flex flex-row gap-2">
          <Button color="success" type="submit">Respond</Button>
          <Button color="failure" onClick={()=>handleDelete()}>
            Delete
          </Button>
          </div>
          </form>
        </Modal.Footer>
      </Modal>
        </div>
    );
}