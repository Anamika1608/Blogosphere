import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { UserDocument } from '../models/User';

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      blog?: {
        author: string;
      };
      
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as DecodedToken;
      
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  }
  
  if (!token) {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

export const isAuthor = (req: Request, res: Response, next: NextFunction): void => {
  if (req?.blog && req.user && req.blog.author.toString() === req.user._id.toString()) {
    next();
  } else {
    res.status(403);
    next(new Error('Not authorized, you are not the author of this blog'));
  }
};