# 🚀 Blog Application - Omnify Assessment

A full-stack blog application built with React and Django, featuring user authentication, CRUD operations, and responsive design.

## 🌟 Live Demo

- **Frontend**: https://omnifyblogss.netlify.app
- **Backend API**: Supabase (PostgreSQL)

## ✨ Features

### 🔐 User Management
- User registration and login with email/password
- Protected routes for authenticated users
- User profile management

### 📝 Blog Management
- Create, read, update, and delete blog posts
- Rich text content with title and body
- Blog categorization and search
- Author-only edit/delete permissions

### 🌐 Public Access
- Public blog listing with pagination
- Search functionality
- Responsive design for all devices
- Blog detail pages with full content

### 🎨 User Experience
- Modern, responsive UI with Tailwind CSS
- Mobile-first design
- Loading states and error handling
- Intuitive navigation

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: React Context API
- **HTTP Client**: Axios

### Backend
- **Framework**: Django REST Framework
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Custom JWT-based auth
- **API**: RESTful endpoints
- **CORS**: Configured for cross-origin requests

### Deployment
- **Frontend**: Netlify
- **Backend**: Supabase
- **Database**: Supabase PostgreSQL
- **Version Control**: Git/GitHub

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Python 3.8+
- Git

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/iamsahal77/blog-app_Omnify.git
cd blog-app_Omnify/frontend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env with your API URL

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd ../backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

## 📁 Project Structure

```
blog-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── backend/                # Django application
│   ├── api/               # API endpoints
│   ├── blog_backend/      # Django settings
│   └── requirements.txt   # Python dependencies
└── README.md              # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `GET /api/auth/profile/` - Get user profile

### Blog Posts
- `GET /api/posts/` - List all posts (with pagination)
- `POST /api/posts/` - Create new post (authenticated)
- `GET /api/posts/{id}/` - Get single post
- `PUT /api/posts/{id}/` - Update post (author only)
- `DELETE /api/posts/{id}/` - Delete post (author only)

## 🎯 Key Features Implementation

### ✅ User Authentication
- Email/password registration and login
- JWT token-based authentication
- Protected routes and components
- User session management

### ✅ Blog CRUD Operations
- Create new blog posts with title and content
- View all published posts with pagination
- Edit and delete posts (author only)
- Search functionality

### ✅ Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Responsive navigation
- Optimized for all screen sizes

### ✅ Database Integration
- PostgreSQL database via Supabase
- Proper data relationships
- Row-level security policies
- Efficient queries with pagination

## 🔒 Security Features

- JWT token authentication
- Protected API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🚀 Deployment

### Frontend (Netlify)
- Automatic deployment from GitHub
- Environment variables configured
- Custom domain setup
- SSL certificate enabled

### Backend (Supabase)
- PostgreSQL database
- REST API endpoints
- Authentication services
- Real-time capabilities

## 🧪 Testing

The application includes:
- Error boundary components
- Loading states
- Form validation
- API error handling
- Responsive testing

## 📈 Performance

- Optimized bundle size with Vite
- Lazy loading of components
- Efficient database queries
- CDN for static assets
- Caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for the Omnify assessment.

## 👨‍💻 Author

**Sahal KV** - 

## 📞 Support

For any questions or issues, please contact:
- Email: sahalwc4@mail.com
- GitHub: https://github.com/iamsahal77

---

**Note**: This application was built as part of the Omnify Full Stack Intern Assessment. It demonstrates proficiency in modern web development technologies and best practices. 
