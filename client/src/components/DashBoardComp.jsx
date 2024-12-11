import { useEffect, useState } from 'react';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
} from 'react-icons/hi';
import { FaEye } from "react-icons/fa";

import { Button, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [totalViews, setTotalViews] = useState(0);
  const [lastMonthViews, setLastMonthViews] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [lastMonthFeedbacks, setLastMonthFeedbacks] = useState(0);


  useEffect(() => {
    const fetchPostStats = async () => {
      try {
        const res = await fetch('/api/post/stats');
        const data = await res.json();
        if (res.ok) {
          setTotalPosts(data.data.totalPosts)
          setLastMonthPosts(data.data.lastMonthPosts)
          setTopViewedPosts(data.data.topViewedPosts)
          setTotalViews(data.data.totalViews)
          setLastMonthViews(data.data.lastMonthViews)
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch('/api/rate/getfeedbacks?limit=5');
        const data = await res.json();
        if (res.ok) {
          setFeedbacks(data);
        }

        const countRes = await fetch('/api/rate/getfeedbacks?format=count')
        const countData = await countRes.json();
        if (countRes.ok) {
          setTotalFeedbacks(countData.data.totalFeedbacks);
          setLastMonthFeedbacks(countData.data.lastMonthCount);

        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPostStats();
    fetchFeedbacks();

  }, []);

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
      <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Views</h3>
              <p className='text-2xl'>{totalViews}</p>
            </div>
            <FaEye className='bg-yellow-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthViews}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>
                Total Feedbacks
              </h3>
              <p className='text-2xl'>{totalFeedbacks}</p>
            </div>
            <HiAnnotation className='bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthFeedbacks}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

      </div>
      <div className='flex flex-wrap py-3 mx-auto justify-evenly gap-2'>
        <div className='flex flex-col w-full lg:max-w-96 shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Top viewed posts</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Thumbnail</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Views</Table.HeadCell>

            </Table.Head>
            {topViewedPosts &&
              topViewedPosts.map((post) => (
                <Table.Body key={post.postId} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      <img
                        src={post.thumbnailUrl}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell>{post.views}</Table.Cell>

                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
        <div className='flex flex-col w-full lg:max-w-96 md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent feedbacks</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link to={'/dashboard?tab=contacts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User IP</Table.HeadCell>
              <Table.HeadCell>Feedback</Table.HeadCell>
            </Table.Head>
            {feedbacks &&
              feedbacks.map((feedback) => (
                <Table.Body key={feedback.feedbackId} className='divide-y'>
                  <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <Table.Cell>
                      {feedback.userIp}
                    </Table.Cell>
                    <Table.Cell className='line-clamp-1'>{feedback.feedback}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

      </div>
    </div>
  );
}