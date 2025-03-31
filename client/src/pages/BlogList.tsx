
import React, { useState, useEffect } from 'react';
import { useBlog } from '@/contexts/BlogContext';
import BlogCard from '@/components/BlogCard';
import Pagination from '@/components/Pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const BlogList = () => {
  const { posts } = useBlog();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  
  const postsPerPage = 9;
  
  useEffect(() => {
    // Filter posts based on search term
    if (searchTerm.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
    
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [searchTerm, posts]);
  
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Blog Posts</h1>
      
      
      
      {filteredPosts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map(post => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No posts found</h2>
          <p className="text-gray-600">
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : "There are no blog posts yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
