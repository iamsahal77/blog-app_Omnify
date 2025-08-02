#!/usr/bin/env python
"""
Script to create sample blog posts for testing
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_backend.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import BlogPost, UserProfile

def create_sample_data():
    """Create sample users and blog posts"""
    
    # Create sample users
    user1, created = User.objects.get_or_create(
        username='johndoe',
        defaults={
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe'
        }
    )
    if created:
        user1.set_password('password123')
        user1.save()
        UserProfile.objects.create(user=user1)
        print(f"Created user: {user1.username}")
    
    user2, created = User.objects.get_or_create(
        username='janesmith',
        defaults={
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith'
        }
    )
    if created:
        user2.set_password('password123')
        user2.save()
        UserProfile.objects.create(user=user2)
        print(f"Created user: {user2.username}")
    
    # Sample blog posts
    sample_posts = [
        {
            'title': 'Getting Started with React and Tailwind CSS',
            'content': '''React and Tailwind CSS are two powerful tools that have revolutionized modern web development. In this comprehensive guide, we'll explore how to combine these technologies to create beautiful, responsive web applications.

## Why React and Tailwind CSS?

React provides a component-based architecture that makes building user interfaces efficient and maintainable. When combined with Tailwind CSS, you get a utility-first CSS framework that allows for rapid UI development without leaving your HTML.

## Setting Up Your Project

First, let's create a new React project using Vite:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
```

Next, install Tailwind CSS:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Configuration

Update your `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Building Your First Component

Here's a simple example of a React component using Tailwind CSS:

```jsx
function Card({ title, description }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
```

## Best Practices

1. **Component Structure**: Keep your components small and focused
2. **Utility Classes**: Use Tailwind's utility classes for consistent styling
3. **Responsive Design**: Leverage Tailwind's responsive prefixes
4. **Custom Components**: Create reusable components for common patterns

## Conclusion

React and Tailwind CSS work together seamlessly to create modern, maintainable web applications. The combination of React's component system and Tailwind's utility-first approach provides developers with a powerful toolkit for building user interfaces.

Start experimenting with these technologies today and see how they can improve your development workflow!''',
            'category': 'Technology',
            'author': user1
        },
        {
            'title': 'The Future of Web Development in 2025',
            'content': '''The web development landscape is constantly evolving, and 2025 promises to bring exciting new technologies and methodologies. Let's explore what the future holds for developers.

## Emerging Technologies

### AI-Powered Development
Artificial Intelligence is transforming how we write code. From intelligent code completion to automated testing, AI tools are becoming an integral part of the development workflow.

### WebAssembly (WASM)
WebAssembly continues to gain traction, enabling high-performance applications to run in the browser. This technology bridges the gap between web and native performance.

### Edge Computing
With the rise of edge computing, applications are moving closer to users, reducing latency and improving performance. This shift is changing how we architect web applications.

## Framework Evolution

Modern frameworks are focusing on:
- **Performance**: Faster rendering and smaller bundle sizes
- **Developer Experience**: Better tooling and debugging capabilities
- **Accessibility**: Built-in accessibility features
- **SEO**: Improved search engine optimization

## The Rise of JAMstack

JAMstack (JavaScript, APIs, and Markup) continues to grow in popularity due to its:
- **Performance**: Pre-built static assets
- **Security**: Reduced attack surface
- **Scalability**: CDN-based delivery
- **Developer Experience**: Modern development workflow

## Conclusion

The future of web development is bright, with new technologies making it easier to build fast, secure, and user-friendly applications. Stay curious and keep learning!''',
            'category': 'Technology',
            'author': user2
        },
        {
            'title': '10 Productivity Tips for Developers',
            'content': '''Being productive as a developer is crucial for delivering high-quality code on time. Here are 10 proven tips that can significantly improve your development workflow.

## 1. Use Version Control Effectively

Git is your best friend. Commit frequently, write meaningful commit messages, and use branches for feature development. This keeps your code organized and makes collaboration easier.

## 2. Master Your IDE

Learn keyboard shortcuts and use productivity plugins. A well-configured IDE can save you hours of work. Popular choices include VS Code, IntelliJ IDEA, and Sublime Text.

## 3. Write Clean, Readable Code

Follow coding standards and conventions. Clean code is easier to maintain, debug, and understand. Use meaningful variable names and add comments when necessary.

## 4. Automate Repetitive Tasks

Use scripts, build tools, and automation to handle repetitive tasks. This frees up time for more important work and reduces the chance of human error.

## 5. Practice Test-Driven Development

Write tests before writing code. This approach helps you think through your design and ensures your code works as expected.

## 6. Take Regular Breaks

The Pomodoro Technique (25 minutes of work, 5 minutes of break) can help maintain focus and prevent burnout. Regular breaks improve overall productivity.

## 7. Learn Keyboard Shortcuts

Mastering keyboard shortcuts can significantly speed up your workflow. Focus on the most commonly used shortcuts in your tools.

## 8. Use Code Snippets and Templates

Create reusable code snippets for common patterns. This saves time and ensures consistency across your projects.

## 9. Stay Organized

Keep your workspace clean and organized. Use project management tools to track tasks and deadlines.

## 10. Continuous Learning

Stay updated with the latest technologies and best practices. The tech industry evolves rapidly, and continuous learning is essential for long-term success.

## Conclusion

Productivity is a skill that can be developed and improved over time. Start implementing these tips gradually, and you'll notice a significant improvement in your development workflow.''',
            'category': 'Lifestyle',
            'author': user1
        },
        {
            'title': 'Building Responsive Websites with CSS Grid',
            'content': '''CSS Grid is a powerful layout system that makes creating responsive websites easier than ever. In this guide, we'll explore how to use CSS Grid effectively.

## Understanding CSS Grid

CSS Grid is a two-dimensional layout system that allows you to create complex layouts with rows and columns. It's perfect for creating responsive designs that work on all devices.

## Basic Grid Setup

Here's a simple example of a CSS Grid layout:

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
```

## Responsive Design with Grid

CSS Grid makes responsive design straightforward:

```css
.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid-layout {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## Advanced Grid Features

### Grid Areas
Grid areas allow you to create complex layouts with named areas:

```css
.layout {
  display: grid;
  grid-template-areas: 
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 1fr auto;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

### Auto-Fit and Auto-Fill
These keywords make responsive grids even more powerful:

```css
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

## Best Practices

1. **Start Mobile First**: Design for mobile devices first, then enhance for larger screens
2. **Use Meaningful Names**: Name your grid areas and lines for better maintainability
3. **Combine with Flexbox**: Use CSS Grid for layout and Flexbox for alignment
4. **Test on Multiple Devices**: Always test your responsive designs on various screen sizes

## Conclusion

CSS Grid is a game-changer for web layout. It provides the flexibility and power needed to create modern, responsive websites. Start experimenting with CSS Grid today and see how it can improve your web development workflow.''',
            'category': 'Technology',
            'author': user2
        }
    ]
    
    # Create blog posts
    for post_data in sample_posts:
        post, created = BlogPost.objects.get_or_create(
            title=post_data['title'],
            defaults=post_data
        )
        if created:
            print(f"Created blog post: {post.title}")
        else:
            print(f"Blog post already exists: {post.title}")

if __name__ == '__main__':
    create_sample_data()
    print("Sample data creation completed!") 