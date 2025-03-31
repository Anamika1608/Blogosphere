import React, { useState, useEffect } from 'react';
import { useBlog } from '@/contexts/BlogContext';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import axios from 'axios';

const BlogList = () => {
  const { posts} = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const [blogData, setBlogData] = useState({
    blogs: [],
    page: 1,
    pages: 1,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  
  const postsPerPage = 9;

   const fetchPostsFromAPI = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_GET_BLOGS}?page=${page}&limit=${postsPerPage}`);
      const data = response.data;
      console.log("data", data);
      setBlogData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPostsFromAPI(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Blog Posts</h1>
      
      {loading ? (
        <div className="text-center py-12">
          <p>Loading blog posts...</p>
        </div>
      ) : blogData.blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogData.blogs.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination 
            currentPage={blogData.page}
            totalPages={blogData.pages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No posts found</h2>
          <p className="text-gray-600">There are no blog posts yet</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;