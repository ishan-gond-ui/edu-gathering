import React from 'react';
import Posts from './Posts';

const Feed = () => {
  return (
    <div className="flex justify-center items-start my-8 px-4 w-full">
      <div className="flex flex-col items-center w-full max-w-2xl">
        <Posts />
      </div>
    </div>
  );
};

export default Feed;
