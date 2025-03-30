
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: {
    id: string;
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

// Sample blog posts
const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    content: `
      # Getting Started with React
      
      React is a popular JavaScript library for building user interfaces, particularly single-page applications. It's used for handling the view layer for web and mobile apps. React allows us to create reusable UI components.

      ## Creating a React App
      
      The easiest way to start with React is to use Create React App:
      
      \`\`\`bash
      npx create-react-app my-app
      cd my-app
      npm start
      \`\`\`
      
      This sets up a new React project with a good default configuration.
      
      ## Components
      
      React is all about components. Components are the building blocks of a React application. A component is a JavaScript class or function that optionally accepts inputs, called props, and returns a React element that describes how a section of the UI should appear.
      
      Here's a simple component:
      
      \`\`\`jsx
      function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
      }
      \`\`\`
      
      ## State and Lifecycle
      
      Components can also maintain internal state data. When a component's state data changes, the rendered markup will be updated by re-invoking render().
      
      \`\`\`jsx
      class Clock extends React.Component {
        constructor(props) {
          super(props);
          this.state = {date: new Date()};
        }
      
        componentDidMount() {
          this.timerID = setInterval(
            () => this.tick(),
            1000
          );
        }
      
        componentWillUnmount() {
          clearInterval(this.timerID);
        }
      
        tick() {
          this.setState({
            date: new Date()
          });
        }
      
        render() {
          return (
            <div>
              <h1>Hello, world!</h1>
              <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            </div>
          );
        }
      }
      \`\`\`
      
      ## Hooks
      
      Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class.
      
      \`\`\`jsx
      import React, { useState, useEffect } from 'react';
      
      function Example() {
        // Declare a new state variable, which we'll call "count"
        const [count, setCount] = useState(0);
      
        // Similar to componentDidMount and componentDidUpdate:
        useEffect(() => {
          // Update the document title using the browser API
          document.title = \`You clicked \${count} times\`;
        });
      
        return (
          <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
              Click me
            </button>
          </div>
        );
      }
      \`\`\`
      
      That's a brief introduction to React. Happy coding!
    `,
    excerpt: 'Learn the basics of React, a popular JavaScript library for building user interfaces. This post covers components, state, props, and hooks.',
    author: {
      id: 'admin',
      name: 'Admin User',
    },
    createdAt: '2023-01-15T12:00:00Z',
    updatedAt: '2023-01-15T12:00:00Z',
  },
  {
    id: '2',
    title: 'Understanding TypeScript with React',
    content: `
      # Understanding TypeScript with React
      
      TypeScript is a statically typed superset of JavaScript that adds optional types to the language. When used with React, it provides enhanced developer experience with features like autocompletion, type checking, and better refactoring tools.
      
      ## Setting Up
      
      To start a new React project with TypeScript, you can use:
      
      \`\`\`bash
      npx create-react-app my-app --template typescript
      \`\`\`
      
      Or to add TypeScript to an existing React project:
      
      \`\`\`bash
      npm install --save typescript @types/node @types/react @types/react-dom @types/jest
      \`\`\`
      
      Then rename your .js files to .tsx.
      
      ## Typing Props
      
      One of the main benefits of TypeScript is the ability to type props:
      
      \`\`\`tsx
      type UserProps = {
        name: string;
        age: number;
        isAdmin?: boolean; // Optional prop
      };
      
      const User = ({ name, age, isAdmin = false }: UserProps) => {
        return (
          <div>
            <h1>{name}</h1>
            <p>Age: {age}</p>
            {isAdmin && <p>Admin User</p>}
          </div>
        );
      };
      \`\`\`
      
      ## Typing State
      
      You can also type your state:
      
      \`\`\`tsx
      interface State {
        count: number;
        text: string;
      }
      
      const [state, setState] = useState<State>({
        count: 0,
        text: '',
      });
      \`\`\`
      
      ## Event Handling
      
      TypeScript helps with correctly typing event handlers:
      
      \`\`\`tsx
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
          ...state,
          text: event.target.value,
        });
      };
      
      const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setState({
          ...state,
          count: state.count + 1,
        });
      };
      \`\`\`
      
      ## Generic Components
      
      You can create reusable components with generics:
      
      \`\`\`tsx
      interface ListProps<T> {
        items: T[];
        renderItem: (item: T) => React.ReactNode;
      }
      
      function List<T>({ items, renderItem }: ListProps<T>) {
        return (
          <ul>
            {items.map((item, index) => (
              <li key={index}>{renderItem(item)}</li>
            ))}
          </ul>
        );
      }
      
      // Usage
      <List
        items={[1, 2, 3]}
        renderItem={(item) => <span>{item}</span>}
      />
      \`\`\`
      
      ## Benefits of TypeScript with React
      
      - Catch errors during development
      - Better IDE support with autocomplete
      - Easier refactoring
      - Self-documenting code
      - Better team collaboration with explicit contracts
      
      TypeScript significantly improves the developer experience when working with React, especially for larger applications. The initial setup might require a bit more work, but the long-term benefits for maintainability are substantial.
    `,
    excerpt: 'Learn how to leverage TypeScript in your React applications to write more robust code with static type checking, improved IDE support, and better developer experience.',
    author: {
      id: 'admin',
      name: 'Admin User',
    },
    createdAt: '2023-02-20T15:30:00Z',
    updatedAt: '2023-02-21T10:15:00Z',
  },
  {
    id: '3',
    title: 'CSS-in-JS vs CSS Modules',
    content: `
      # CSS-in-JS vs CSS Modules
      
      When it comes to styling React applications, developers have many options. Two popular approaches are CSS-in-JS libraries and CSS Modules. Both have their advantages and trade-offs, and the choice often comes down to team preferences and project requirements.
      
      ## CSS-in-JS
      
      CSS-in-JS refers to a pattern where CSS is written directly in JavaScript files. This approach offers several benefits:
      
      ### Pros
      
      - **Scoped styles**: Styles are automatically scoped to components, eliminating global namespace issues.
      - **Dynamic styling**: You can easily create styles based on props or state.
      - **No additional build configuration**: Many CSS-in-JS libraries work out of the box with React.
      - **Colocation**: Styles live alongside the components they style.
      
      ### Popular Libraries
      
      1. **Styled Components**
      
      \`\`\`jsx
      import styled from 'styled-components';
      
      const Button = styled.button\`
        background-color: \${props => props.primary ? 'blue' : 'white'};
        color: \${props => props.primary ? 'white' : 'blue'};
        font-size: 1em;
        padding: 0.25em 1em;
        border: 2px solid blue;
        border-radius: 3px;
      \`;
      
      function App() {
        return <Button primary>Primary Button</Button>;
      }
      \`\`\`
      
      2. **Emotion**
      
      \`\`\`jsx
      /** @jsx jsx */
      import { css, jsx } from '@emotion/react';
      
      const button = css\`
        background-color: hotpink;
        &:hover {
          background-color: lightgreen;
        }
      \`;
      
      function App() {
        return <button css={button}>This is hotpink</button>;
      }
      \`\`\`
      
      ### Cons
      
      - **Runtime overhead**: Some CSS-in-JS libraries add a small runtime cost.
      - **Learning curve**: Developers need to learn the library's API.
      - **Tooling**: Some developer tools might not work as well with generated CSS.
      
      ## CSS Modules
      
      CSS Modules allow you to write traditional CSS files that are locally scoped by default.
      
      ### Pros
      
      - **Local scoping**: Class names are automatically made unique.
      - **Use of standard CSS**: No need to learn new syntax.
      - **Better performance**: No runtime cost as styles are extracted at build time.
      - **Better tooling support**: Works well with existing CSS tools.
      
      ### Example Usage
      
      \`\`\`css
      /* Button.module.css */
      .button {
        background-color: blue;
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
      }
      
      .primary {
        background-color: green;
      }
      \`\`\`
      
      \`\`\`jsx
      import React from 'react';
      import styles from './Button.module.css';
      
      function Button({ primary, children }) {
        return (
          <button className={\`\${styles.button} \${primary ? styles.primary : ''}\`}>
            {children}
          </button>
        );
      }
      \`\`\`
      
      ### Cons
      
      - **Dynamic styling**: Less convenient for dynamic styles based on props.
      - **Additional configuration**: Requires specific webpack configuration.
      - **Context switching**: Requires switching between CSS and JS files.
      
      ## Which One to Choose?
      
      The decision between CSS-in-JS and CSS Modules depends on your specific needs:
      
      - **Choose CSS-in-JS if**:
        - You need highly dynamic styling
        - You prefer having all component code in one place
        - You value the developer experience of colocated styles
      
      - **Choose CSS Modules if**:
        - Performance is a critical concern
        - You have team members more comfortable with traditional CSS
        - You want to use existing CSS tooling
        - You prefer separation of concerns
      
      Many projects also use a combination of approaches, such as CSS Modules for static layouts and CSS-in-JS for interactive components.
      
      ## Conclusion
      
      Both CSS-in-JS and CSS Modules are valid approaches to styling React applications. The best choice depends on your team's preferences, project requirements, and the specific trade-offs you're willing to make between developer experience, performance, and maintainability.
    `,
    excerpt: 'Explore the differences between CSS-in-JS libraries and CSS Modules for styling React applications, understanding the pros and cons of each approach.',
    author: {
      id: 'admin',
      name: 'Admin User',
    },
    createdAt: '2023-03-10T09:45:00Z',
    updatedAt: '2023-03-11T14:20:00Z',
  }
];

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
    } else {
      setPosts(initialPosts);
      localStorage.setItem('blogPosts', JSON.stringify(initialPosts));
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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const excerpt = content.length > 150 
        ? content.substring(0, 150).replace(/#/g, '').trim() + '...'
        : content.replace(/#/g, '').trim();
        
      const newPost: BlogPost = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        content,
        excerpt,
        author: {
          id: user.id,
          name: user.name,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
      });
      
      return newPost;
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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const postToUpdate = posts.find(post => post.id === id);
      
      if (!postToUpdate) {
        throw new Error('Post not found');
      }
      
      if (postToUpdate.author.id !== user.id) {
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
        post.id === id ? updatedPost : post
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
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const postToDelete = posts.find(post => post.id === id);
      
      if (!postToDelete) {
        throw new Error('Post not found');
      }
      
      if (postToDelete.author.id !== user.id) {
        toast({
          title: "Permission denied",
          description: "You can only delete your own posts.",
          variant: "destructive",
        });
        throw new Error('Permission denied');
      }
      
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
      
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
    } catch (error) {
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

  const getPostById = (id: string) => {
    return posts.find(post => post.id === id);
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
