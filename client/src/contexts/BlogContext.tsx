import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BlogContextType {
  posts: BlogPost[];
  isLoading: boolean;
  createPost: (title: string, content: string) => Promise<void>;
  updatePost: (id: string, title: string, content: string) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  getPostById: (id: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load posts from localStorage or use initial posts if none exist
    
    const storedPosts = localStorage.getItem('blogPosts');
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    } 
    setIsLoading(false);
  }, []);

  const createPost = async (title: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a post.",
        variant: "destructive",
      });
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    try {

      const newPost = await axios.post(
        import.meta.env.VITE_POST_BLOG, 
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      


      console.log("newPost", newPost.data);

   
      const updatedPosts = [newPost.data, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      });
      
      return newPost.data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePost = async (id: string, title: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update a post.",
        variant: "destructive",
      });
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    try {
      const post = await axios.patch(
        `${import.meta.env.VITE_UPDATE_BLOG}/${id}`, 
        {
          title,
          content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      console.log("post updated", post.data);
      
      const postToUpdate = posts.find(post => post._id === id);
      
      if (!postToUpdate) {
        throw new Error('Post not found');
      }
      
      if (postToUpdate.author._id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only edit your own posts.",
          variant: "destructive",
        });
        throw new Error('Permission denied');
      }
      
      const excerpt = content.length > 150 
        ? content.substring(0, 150).replace(/#/g, '').trim() + '...'
        : content.replace(/#/g, '').trim();
      
      const updatedPost: BlogPost = {
        ...postToUpdate,
        title,
        content,
        excerpt,
        updatedAt: new Date().toISOString(),
      };
      
      const updatedPosts = posts.map(post => 
        post._id === id ? updatedPost : post
      );
      
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete a post.",
        variant: "destructive",
      });
      throw new Error('Authentication required');
    }

    setIsLoading(true);
    try {

      const post = await axios.delete(
        `${import.meta.env.VITE_DELETE_BLOG}/${id}`, 
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      

      console.log("post deleted", post);

      
      // const postToDelete = posts.find(post => post._id === id);
      
      // if (!postToDelete) {
      //   throw new Error('Post not found');
      // }
      
      // if (postToDelete.author._id !== user.id) {
      //   toast({
      //     title: "Permission denied",
      //     description: "You can only delete your own posts.",
      //     variant: "destructive",
      //   });
      //   throw new Error('Permission denied');
      // }
      
      const updatedPosts = posts.filter(post => post._id !== id);
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPostById = async (id: string) => {

    const post = await axios.get(
      `${import.meta.env.VITE_GET_BLOG_BY_ID}/${id}`, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    console.log("post by id", post.data);

    return post.data;

    
    // return posts.find(post => post._id === id);
  };

  return (
    <BlogContext.Provider value={{ 
      posts, 
      isLoading, 
      createPost, 
      updatePost, 
      deletePost,
      getPostById
    }}>
      {children}
    </BlogContext.Provider>
  );
};
