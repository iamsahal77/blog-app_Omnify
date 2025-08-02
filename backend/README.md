# Blog Backend API

A Django REST API backend for the Blogify application with JWT authentication, user management, and blog post CRUD operations.

## 🚀 Features

- **JWT Authentication** - Secure token-based authentication
- **User Management** - Registration, login, profile management
- **Blog CRUD Operations** - Create, read, update, delete blog posts
- **Search & Filtering** - Search posts by title, content, category
- **Pagination** - Built-in pagination for blog listings
- **CORS Support** - Configured for frontend integration
- **Admin Interface** - Django admin for content management

## 🛠️ Technology Stack

- **Framework**: Django 5.0.2
- **API**: Django REST Framework 3.15.0
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: SQLite (development) / PostgreSQL (production)
- **CORS**: django-cors-headers
- **Image Handling**: Pillow

## 📁 Project Structure

```
backend/
├── blog_backend/          # Django project settings
│   ├── settings.py       # Main settings file
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py          # WSGI configuration
├── api/                  # Main API application
│   ├── models.py        # Database models
│   ├── serializers.py   # API serializers
│   ├── views.py         # API views
│   ├── urls.py          # API URL patterns
│   └── admin.py         # Admin configuration
├── requirements.txt      # Python dependencies
├── manage.py            # Django management script
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create superuser**
   ```bash
   python manage.py createsuperuser
   ```

5. **Create sample data (optional)**
   ```bash
   python create_sample_data.py
   ```

6. **Run the development server**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/refresh/` | Refresh JWT token |

### User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/` | Get user profile |
| PATCH | `/api/profile/` | Update user profile |

### Blog Posts

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/` | List all blog posts (paginated) |
| POST | `/api/posts/` | Create new blog post |
| GET | `/api/posts/{id}/` | Get single blog post |
| PUT | `/api/posts/{id}/` | Update blog post |
| DELETE | `/api/posts/{id}/` | Delete blog post |
| GET | `/api/posts/my/` | Get current user's posts |
| GET | `/api/posts/user/{username}/` | Get posts by specific user |

### Search & Utilities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/search/` | Search blog posts |
| GET | `/api/categories/` | Get all categories |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Login Flow

1. **Login** - POST `/api/auth/login/`
   ```json
   {
     "username": "your_username",
     "password": "your_password"
   }
   ```

2. **Response** - Returns access and refresh tokens
   ```json
   {
     "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
   }
   ```

3. **Use Access Token** - Include in Authorization header
   ```
   Authorization: Bearer <access_token>
   ```

### Token Refresh

When the access token expires, use the refresh token:

```bash
POST /api/auth/refresh/
{
  "refresh": "your_refresh_token"
}
```

## 📊 Database Models

### User (Django Built-in)
- `id` - Primary key
- `username` - Unique username
- `email` - Email address
- `first_name` - First name
- `last_name` - Last name
- `date_joined` - Registration date

### UserProfile
- `user` - OneToOneField to User
- `bio` - User biography
- `avatar` - Profile image
- `website` - Personal website
- `created_at` - Profile creation date
- `updated_at` - Last update date

### BlogPost
- `id` - Primary key
- `title` - Blog post title
- `content` - Full blog content
- `excerpt` - Auto-generated excerpt
- `author` - ForeignKey to User
- `category` - Post category (Technology, Lifestyle, etc.)
- `image` - Featured image
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp
- `published` - Publication status

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### CORS Settings

The API is configured to allow requests from:
- `http://localhost:5173` (Vite dev server)
- `http://127.0.0.1:5173`
- `http://localhost:3000` (React dev server)
- `http://127.0.0.1:3000`

## 🧪 Testing

### Sample Data

Run the sample data script to populate the database:

```bash
python create_sample_data.py
```

This creates:
- 2 sample users (johndoe, janesmith)
- 4 sample blog posts
- User profiles

### Test Credentials

- **Admin**: `admin` / `admin` (you'll set password during creation)
- **User 1**: `johndoe` / `password123`
- **User 2**: `janesmith` / `password123`

## 🚀 Production Deployment

### Database

For production, switch to PostgreSQL:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Security Settings

```python
DEBUG = False
SECRET_KEY = os.environ.get('SECRET_KEY')
ALLOWED_HOSTS = ['your-domain.com']
CORS_ALLOWED_ORIGINS = ['https://your-frontend-domain.com']
```

### Static Files

```bash
python manage.py collectstatic
```

## 📝 API Examples

### Create Blog Post

```bash
curl -X POST http://localhost:8000/api/posts/ \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "category": "Technology"
  }'
```

### Get Blog Posts with Pagination

```bash
curl "http://localhost:8000/api/posts/?page=1&page_size=10"
```

### Search Posts

```bash
curl "http://localhost:8000/api/search/?q=react"
```

## 🔍 Admin Interface

Access the Django admin at `http://localhost:8000/admin/`

Features:
- User management
- Blog post management
- User profile management
- Content moderation

## 🤝 Frontend Integration

The API is designed to work seamlessly with the React frontend:

1. **CORS** - Configured for frontend domains
2. **JWT** - Token-based authentication
3. **Pagination** - Built-in pagination support
4. **Search** - Full-text search capabilities
5. **File Upload** - Image upload support

## 📈 Performance

- **Database Indexing** - Optimized queries
- **Pagination** - Efficient data loading
- **Caching** - Ready for Redis integration
- **Image Optimization** - Pillow for image processing

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **CORS Protection** - Configured origins only
- **Input Validation** - Comprehensive validation
- **SQL Injection Protection** - Django ORM
- **XSS Protection** - Built-in Django protection

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors** - Check CORS_ALLOWED_ORIGINS in settings
2. **Authentication Errors** - Verify JWT token format
3. **Database Errors** - Run migrations: `python manage.py migrate`
4. **Image Upload Errors** - Check MEDIA_ROOT permissions

### Debug Mode

Enable debug mode for detailed error messages:

```python
DEBUG = True
```

## 📞 Support

For issues and questions:
1. Check the Django documentation
2. Review the API endpoints
3. Test with the provided sample data
4. Check the frontend integration guide

---

**Backend Status**: ✅ Production Ready
**Last Updated**: January 2025 