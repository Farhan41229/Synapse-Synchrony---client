import { useAuthStore } from '@/store/authStore';
import React from 'react';

const AddBlog = () => {
  const { user } = useAuthStore();
  console.log(user);
  return (
    <div>
      <h1>This is the Create Blogs Page</h1>
    </div>
  );
};

export default AddBlog;
