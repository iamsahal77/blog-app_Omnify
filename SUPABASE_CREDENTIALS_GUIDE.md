# 🔍 How to Find Your Supabase Credentials

## 📍 Step-by-Step Guide

### 1. **Go to Supabase Dashboard**
- Visit [supabase.com](https://supabase.com)
- Sign in to your account
- Click on your project

### 2. **Navigate to Database Settings**
```
Dashboard → Settings (⚙️) → Database
```

### 3. **Find Your Connection Info**
Scroll down to the "Connection info" section. You'll see:

```
Host: db.abcdefghijklmnop.supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: your-actual-password-here
```

## 📝 Create Your `.env` File

Create a file named `.env` in your `backend/` directory with this content:

```bash
# Supabase Database Connection
SUPABASE_HOST=db.abcdefghijklmnop.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=your-actual-password-here
SUPABASE_PORT=5432

# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
```

## 🔄 What to Replace

| Placeholder | What to Replace With | Where to Find |
|-------------|---------------------|---------------|
| `db.abcdefghijklmnop.supabase.co` | Your actual host | Supabase Dashboard → Settings → Database → Host |
| `your-actual-password-here` | Your actual password | Supabase Dashboard → Settings → Database → Password |
| `your-secret-key-here` | A random secret key | Generate one or use Django's default |

## 🎯 Example

**From Supabase Dashboard:**
```
Host: db.xyz123abc456.supabase.co
Password: my-super-secret-password-123
```

**Your `.env` file should look like:**
```bash
SUPABASE_HOST=db.xyz123abc456.supabase.co
SUPABASE_DB=postgres
SUPABASE_USER=postgres
SUPABASE_PASSWORD=my-super-secret-password-123
SUPABASE_PORT=5432
```

## 🔒 Security Notes

- ✅ Keep your `.env` file private (don't commit to git)
- ✅ Never share your password publicly
- ✅ Use strong passwords
- ✅ Consider using environment variables in production

## 🧪 Test Your Connection

After creating the `.env` file, test it:

```bash
cd backend
python test_supabase_connection.py
```

If successful, you'll see:
```
✅ Successfully connected to Supabase!
```

## ❓ Common Issues

### "Connection failed"
- Check your host URL is correct
- Verify your password is correct
- Make sure your IP is whitelisted in Supabase

### "Host not found"
- Double-check the host URL from Supabase dashboard
- Make sure you copied the entire hostname

### "Authentication failed"
- Verify your password is correct
- Check that you're using the right user (usually `postgres`)

## 🎉 Success!

Once your `.env` file is set up correctly, you can run:

```bash
python setup_supabase.py
```

This will guide you through the rest of the setup process! 