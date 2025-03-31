
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { BlogPost } from '@/contexts/BlogContext';
import { formatDistanceToNow } from 'date-fns';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <Link to={`/blog/${post._id}`} className="hover:underline">
          <h3 className="text-xl font-semibold line-clamp-2">{post.title}</h3>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center text-sm text-gray-500">
        <span>{post.author.name}</span>
        <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
      </CardFooter>
    </Card>
  );
};

export default BlogCard;
