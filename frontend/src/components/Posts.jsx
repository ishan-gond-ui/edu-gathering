import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import axios from 'axios';
import CommentDialog from './CommentDialog';
import { Badge } from './ui/badge';

const Posts = ({ posts }) => {
  const videoRefs = useRef([]);
  const { user } = useSelector((store) => store.auth); // Make sure `user` is valid
  const { posts: postStore } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.95 }
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, []);

  const handleLikeOrDislike = async (post, liked, postLike, setLiked, setPostLike) => {
    try {
      const action = liked ? 'dislike' : 'like';
      const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true });
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = postStore.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      {posts.map((post, index) => {
        if (!post.author || !user) return <div key={post.id}>Error: Missing user or author data</div>;

        const [liked, setLiked] = useState(post.likes.includes(user._id) || false);
        const [postLike, setPostLike] = useState(post.likes.length);
        const [comment, setComment] = useState(post.comments || []);
        const [text, setText] = useState('');
        const [open, setOpen] = useState(false);

        const handleComment = async () => {
          try {
            const res = await axios.post(
              `http://localhost:8000/api/v1/post/${post._id}/comment`,
              { text },
              { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
            );
            if (res.data.success) {
              const updatedCommentData = [...comment, res.data.comment];
              setComment(updatedCommentData);

              const updatedPostData = postStore.map((p) =>
                p._id === post._id ? { ...p, comments: updatedCommentData } : p
              );

              dispatch(setPosts(updatedPostData));
              toast.success(res.data.message);
              setText('');
            }
          } catch (error) {
            console.error(error);
          }
        };

        const handleBookmark = async () => {
          try {
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
              toast.success(res.data.message);
            }
          } catch (error) {
            console.error(error);
          }
        };

        return (
          <div key={post.id}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={post.author.profilePicture} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-3">
                  <h1>{post.author.username}</h1>
                  {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  {post.author._id !== user?._id && (
                    <Button variant="ghost" className="cursor-pointer w-fit text-[#ED4956] font-bold">
                      Unfollow
                    </Button>
                  )}
                  <Button variant="ghost" className="cursor-pointer w-fit">
                    Add to favorites
                  </Button>
                </DialogContent>
              </Dialog>
            </div>

            {post.media ? (
              post.media.endsWith('.mp4') || post.media.endsWith('.webm') || post.media.endsWith('.ogg') ? (
                <video
                  ref={(el) => (videoRefs.current[index] = el)}
                  className={`rounded-sm my-2 w-full object-cover ${post.mediaWidth / post.mediaHeight > 16 / 9 ? 'aspect-video' : 'object-contain'}`}
                  preload="metadata"
                  src={post.media}
                  loop
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  className="rounded-sm my-2 w-full object-cover"
                  src={post.media}
                  alt="Post media"
                />
              )
            ) : (
              <p className="text-center text-gray-500">No media available</p>
            )}

            <div className="flex items-center justify-between my-2">
              <div className="flex items-center gap-3">
                {liked ? (
                  <FaHeart
                    onClick={() => handleLikeOrDislike(post, liked, postLike, setLiked, setPostLike)}
                    size={24}
                    className="cursor-pointer text-red-600"
                  />
                ) : (
                  <FaRegHeart
                    onClick={() => handleLikeOrDislike(post, liked, postLike, setLiked, setPostLike)}
                    size={22}
                    className="cursor-pointer hover:text-gray-600"
                  />
                )}
                <MessageCircle
                  onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                  }}
                  className="cursor-pointer hover:text-gray-600"
                />
                <Send className="cursor-pointer hover:text-gray-600" />
              </div>
              <Bookmark onClick={handleBookmark} className="cursor-pointer hover:text-gray-600" />
            </div>
            <span className="font-medium block mb-2">{postLike} likes</span>
            <p>
              <span className="font-medium mr-2">{post.author.username}</span>
              {post.caption}
            </p>
            {comment.length > 0 && (
              <span
                onClick={() => {
                  dispatch(setSelectedPost(post));
                  setOpen(true);
                }}
                className="cursor-pointer text-sm text-gray-400"
              >
                View all {comment.length} comments
              </span>
            )}
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Add a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="outline-none text-sm w-full"
              />
              {text && (
                <span onClick={handleComment} className="text-[#3BADF8] cursor-pointer">
                  Post
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
