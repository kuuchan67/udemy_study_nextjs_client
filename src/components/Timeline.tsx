import React, {useEffect, useState} from 'react'
import Post from './Post'
import apiClient from '@/lib/apiClient'
import {PostType} from '@/types'
import { useAuth } from '@/context/auth'

const Timeline = () => {

  const [content, setContent] = useState<string>("");
  const [latestPosts, setLatestPosts] = useState<PostType[]>([]);

  const {user} = useAuth();

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await apiClient.get("/posts/posts");
        //console.log(response.data);
        setLatestPosts(response.data.posts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLatestPosts();
  }, []);
    

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/posts/post", {content});
      setContent("");
      setLatestPosts( (prevPosts) => [response.data, ...prevPosts] );

      

    } catch(error) {
      alert("ログインしてください");
    }
  }

  return (
<div className="min-h-screen bg-gray-100">
  <main className="container mx-auto py-4">
    
      {user? (
        <div className="bg-white shadow-md rounded p-4 mb-4">
        <form onSubmit={handleSubmit}>
        <textarea
          className="w-full h-24 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="What's on your mind?"
          value={content}
          onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
        ></textarea>
        <button
          type="submit"
          className="mt-2 bg-gray-700 hover:bg-green-700 duration-200 text-white font-semibold py-2 px-4 rounded"
        >
          投稿
        </button>
      </form>
      </div>
      ) : null}
      
    {Array.isArray(latestPosts)
        ? latestPosts.map((post: PostType) => (
          <Post key={post.id} post={post} />
        )): null}
  </main>
 
</div>
  )
}

export default Timeline