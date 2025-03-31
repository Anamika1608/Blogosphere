import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import MarkdownRenderer from '@/components/MarkdownRenderer';

const EditBlog = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById } = useBlog();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You must be logged in to edit a post.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }

      try {
        const post = await getPostById(id);
        
        if (!post) {
          toast({
            title: "Post not found",
            description: "The post you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate('/myblogs');
          return;
        }

        console.log('user id ', user.id);
        console.log('post author id ', post.author);

        if (post.author._id !== user.id) {
          toast({
            title: "Permission denied",
            description: "You can only edit your own posts.",
            variant: "destructive",
          });
          navigate('/blogs');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
      } catch (error) {
        console.error('Error fetching post:', error);
        toast({
          title: "Error",
          description: "Failed to load the post. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, getPostById, navigate, toast]);

  const updatePost = async (id, title, content) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update a post.",
        variant: "destructive",
      });
      throw new Error('Authentication required');
    }

    setSubmitting(true);
    try {
      const post = await axios.put(
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
      
      toast({
        title: "Post updated",
        description: "Your post has been successfully updated.",
      });
      
      navigate(`/my-blogs`);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post.",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your blog post.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await updatePost(id, title, content);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  if (loading) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to={`/blogs/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to post
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog Post</h1>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="mb-6 flex justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={togglePreview}
            >
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
          </div>

          {previewMode ? (
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">{title}</h2>
              <div className="prose max-w-none">
                <MarkdownRenderer content={content} />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <Label htmlFor="title" className="text-gray-700 font-medium mb-2 block">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  className="w-full"
                  disabled={submitting}
                />
              </div>

              <div className="mb-6">
                <Label htmlFor="content" className="text-gray-700 font-medium mb-2 block">
                  Content (Markdown Supported)
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog content here... Markdown is supported."
                  className="w-full min-h-[400px] font-mono"
                  disabled={submitting}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="flex items-center"
                  disabled={submitting}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {submitting ? 'Saving...' : 'Update Post'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlog;