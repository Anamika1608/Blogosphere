import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import BlogCard from '@/components/BlogCard';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

const Landing = () => {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  
  // Fetch featured posts from database
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setLoading(true);
        // Fetch the 3 most recent posts for the featured section
        const response = await axios.get(`${import.meta.env.VITE_GET_BLOGS}?page=1&limit=3`);
        setFeaturedPosts(response.data.blogs || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured posts:', error);
        setLoading(false);
        setFeaturedPosts([]);
      }
    };

    fetchFeaturedPosts();
  }, []);
  
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-pattern py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Think, plan, and write<br />
              <span className="text-gray-500">all in one place</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Share your thoughts, ideas, and stories with the world.
              Blogosphere is a space for creative minds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isAuthenticated ? "/create" : "/signup"}>
                <Button size="lg" className="text-base">
                  {isAuthenticated ? "Write a blog" : "Get started"}
                </Button>
              </Link>
              <Link to="/blogs">
                <Button size="lg" variant="outline" className="text-base">
                  Read blogs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Blogosphere?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A modern platform for writers, thinkers, and creators to share their ideas with the world.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Our intuitive editor makes it simple to create beautiful blog posts in minutes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">
                Your content is safe with us. We use modern security practices to protect your data.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Join a growing community of writers and readers. Share ideas and get inspired.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Posts Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
            <Link to="/blogs" className="text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading featured posts...</p>
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No posts yet. Be the first to create one!</p>
              <Link to={isAuthenticated ? "/create" : "/signup"}>
                <Button className="mt-4">
                  {isAuthenticated ? "Write a blog" : "Get started"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to share your story?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of writers who are already sharing their ideas on Blogosphere. 
            It only takes a few minutes to get started.
          </p>
          <Link to={isAuthenticated ? "/create" : "/signup"}>
            <Button size="lg" variant="secondary" className="text-base">
              {isAuthenticated ? "Write a blog" : "Start writing today"}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;