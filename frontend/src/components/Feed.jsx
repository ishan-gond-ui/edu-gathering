import React from 'react';
import { useSelector } from 'react-redux';
import Posts from './Posts';

const Feed = () => {
  const { posts } = useSelector((store) => store.post); // Fetch posts from Redux

  console.log("Feed component is rendering");
  console.log("Posts fetched from Redux:", posts);

  return (
    <div className="flex justify-center items-start my-8 px-4 w-full">
      <div className="flex flex-col items-center w-full max-w-2xl">
        {posts.length > 0 ? (
          <Posts posts={posts} />
        ) : (
          <p>No Posts Available</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
