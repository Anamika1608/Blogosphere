
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBlog } from '@/contexts/BlogContext';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { useToast } from '@/components/ui/use-toast';

const BlogCreate = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createPost } = useBlog();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your blog post",
        variant: "destructive",
      });
      return;
    }
    
    if (!content.trim()) {
      toast({
        title: "Content required",
        description: "Please enter content for your blog post",
        variant: "destructive",
      }); 
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await createPost(title, content);
      navigate('/blogs');
      toast({
        title: "Success!",
        description: "Your blog post has been published",
      });
    } catch (error) {
      console.error('Create post error:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Blog Post</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <div className="border rounded-lg overflow-hidden">
              <Tabs defaultValue="write">
                <TabsList className="w-full bg-muted/50">
                  <TabsTrigger value="write" className="flex-1">Write</TabsTrigger>
                  <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write" className="p-0">
                  <Textarea
                    id="content"
                    placeholder="Write your blog content here... (Markdown supported)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] p-4 rounded-none border-0"
                  />
                </TabsContent>
                <TabsContent value="preview" className="p-6 min-h-[400px] border-t">
                  {content ? (
                    <MarkdownRenderer content={content} />
                  ) : (
                    <div className="text-gray-500 italic">
                      Preview will appear here when you start writing...
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <p className="text-sm text-gray-500">
              Supports Markdown formatting
            </p>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/blogs')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreate;
