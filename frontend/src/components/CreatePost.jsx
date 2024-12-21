import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

const CreatePost = ({ open, setOpen }) => {
  const dialogRef = useRef(null); // Ref for the dialog box
  const imageRef = useRef();
  const videoRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = await readFileAsDataURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("media", file);

    try {
      setLoading(true);
      const res = await axios.post('https://edu-gathering.onrender.com//api/v1/post/addpost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, setOpen]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent ref={dialogRef}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="User Avatar" />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>Bio here...</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
        {
          filePreview && (
            file.type.startsWith('image/') ? (
              <img src={filePreview} alt="File preview" className='object-cover h-64 w-full rounded-md' />
            ) : (
              <video controls src={filePreview} className='object-cover h-64 w-full rounded-md' />
            )
          )
        }
        <input ref={imageRef} type='file' className='hidden' accept="image/*" onChange={fileChangeHandler} />
        <input ref={videoRef} type='file' className='hidden' accept="video/*" onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]'>Select Image</Button>
        <Button onClick={() => videoRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf] mt-2'>Select Video</Button>
        {
          filePreview && (
            loading ? (
              <Button>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </Button>
            ) : (
              <Button onClick={createPostHandler} className="w-full">Post</Button>
            )
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
