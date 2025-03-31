// src/controllers/blogController.ts
import { Request, Response } from 'express';
import Blog, { BlogDocument } from '../models/Blog';

// Extend Request to include blog
declare global {
  namespace Express {
    interface Request {
      blog?: {author: string};
    }
  }
}

// @desc    Create a new blog
// @route   POST /api/v1/blogs
// @access  Private
export const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json(blog);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Get all blogs with pagination
// @route   GET /api/v1/blogs?page=1&limit=10
// @access  Public
export const getBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name email');

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    res.json({
      blogs,
      page,
      pages: totalPages,
      total: totalBlogs,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Get blog by ID
// @route   GET /api/v1/blogs/:id
// @access  Public
export const getBlogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id).populate('author', 'name email');

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.json(blog);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private (only author)
export const updateBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("req.body", req.body);
    console.log("req.params.id", req.params.id);
    const { title, content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    // Check if user is the author of the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized, you are not the author of this blog' });
      return;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private (only author)
export const deleteBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    // Check if user is the author of the blog
    if (blog.author.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'Not authorized, you are not the author of this blog' });
      return;
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Blog removed' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// Middleware to get blog by ID and add to request
export const getBlog = async (req: Request, res: Response, next: Function): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      res.status(404);
      throw new Error('Blog not found');
    }
    
    req.blog = blog;
    next();
  } catch (error) {
    next(error);
  }
};