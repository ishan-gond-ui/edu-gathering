import React, { useEffect, useRef } from 'react';
import Post from './Post'; // Importing the Post component

const Posts = ({ posts }) => {
  const videoRefs = useRef([]); // Array to hold references to video elements

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play(); // Play video when in view
          } else {
            video.pause(); // Pause video when out of view
          }
        });
      },
      { threshold: 0.5 } // 50% visibility required
    );

    // Observe each videocmd
    
    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    // Cleanup on component unmount
    return () => observer.disconnect();
  }, []);

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {/* Render each post */}
      {posts.map((post, index) => (
        <div key={post.id}>
          {post.media ? (
            post.media.endsWith('.mp4') || post.media.endsWith('.webm') || post.media.endsWith('.ogg') ? (
              <video
                ref={(el) => (videoRefs.current[index] = el)} // Store reference
                className={`rounded-sm my-2 w-full object-cover ${
                  post.mediaWidth / post.mediaHeight > 16 / 9 ? 'aspect-video' : 'object-contain'
                }`} 
                preload="metadata"
                src={post.media}
                loop
                onError={(e) => {
                  console.error('Video error:', e.target.src);
                  e.target.parentNode.innerHTML =
                    '<p class="text-center text-gray-500">Video failed to load.</p>';
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                className="rounded-sm my-2 w-full object-cover"
                src={post.media}
                alt="Post media"
                onError={(e) => {
                  console.error('Image error:', e.target.src);
                  e.target.parentNode.innerHTML =
                    '<p class="text-center text-gray-500">Image failed to load.</p>';
                }}
              />
            )
          ) : (
            <p className="text-center text-gray-500">No media available</p>
          )}

          {/* Render individual Post component */}
          <Post post={post} />
        </div>
      ))}
    </div>
  );
};

export default Posts;
