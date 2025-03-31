import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlog, BlogPost } from '@/contexts/BlogContext';
import { useAuth } from '@/contexts/AuthContext';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';

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

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, deletePost } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const fetchedPost = await getPostById(id);
        console.log('post', fetchedPost);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, getPostById]);

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loading...</h2>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Post not found</h2>
        <p className="text-gray-600 mb-8">
          The post you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/blogs">
          <Button>Back to blogs</Button>
        </Link>
      </div>
    );
  }

  const isAuthor = user && user.id === post.author.id;

  const handleDelete = async () => {
    try {
      await deletePost(post._id);
      navigate('/blogs');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        {/* Author and date info */}
        <div className="flex justify-between items-center text-gray-600 mb-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
              {post.author.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>

          {post.updatedAt !== post.createdAt && (
            <span className="text-sm">
              Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">{post.title}</h1>

        {/* Action buttons for author */}
        {isAuthor && (
          <div className="flex space-x-4 mb-8">
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
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* Blog content */}
        <article className="bg-white shadow-sm rounded-lg p-6 md:p-8">
          <MarkdownRenderer content={post.content} />
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;