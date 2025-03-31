import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { useBlog } from '@/contexts/BlogContext';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Author {
  id: string;
  _id: string;
  name: string;
  email: string;
}

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

const MyBlogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { deletePost } = useBlog();

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        // Fetch posts from the API endpoint
        const response = await axios.get(import.meta.env.VITE_GET_BLOGS);

        if (response.data && Array.isArray(response.data.blogs)) {
          // Filter posts by the current user
          const myPosts = response.data.blogs.filter((post: BlogPost) =>
            post.author._id === user.id || post.author.id === user.id
          );
          setUserPosts(myPosts);
        } else {
          setError('Invalid response format from the server');
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to fetch your blog posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, navigate]);

  const handleDeletePost = async (postId: string) => {
    try {
      deletePost(postId);
      // Show confirmation dialog before deleting

      setUserPosts(userPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete the blog post');
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loading your blogs...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
        <Link to="/create">
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" /> Create New Blog
          </Button>
        </Link>
      </div>

      {userPosts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">You haven't created any blogs yet</h2>
          <p className="text-gray-600 mb-6">Start sharing your thoughts with the world!</p>
          <Link to="/create">
            <Button size="lg" className="flex items-center mx-auto">
              <Plus className="h-4 w-4 mr-2" /> Create Your First Blog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userPosts.map((post) => (
            <Card key={post._id} className="flex flex-col h-full">
              <CardHeader>
                <CardTitle className="line-clamp-2 hover:text-blue-600">
                  <Link to={`/blog/${post._id}`}>{post.title}</Link>
                </CardTitle>
                <CardDescription>
                  {format(new Date(post.createdAt), 'MMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">
                  {post.content.substring(0, 150)}
                  {post.content.length > 150 ? '...' : ''}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 mt-auto">
                <Link to={`/edit/${post._id}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" /> Edit
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your blog post.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeletePost(post._id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;