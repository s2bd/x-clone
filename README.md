# Z - Social Media Platform

A complete Twitter/X-like social media platform built with Node.js, Express, MongoDB, and React.

## Features

### Backend
- **Authentication**: JWT-based auth with bcrypt password hashing
- **User Management**: Profile creation, following/followers, user search
- **Posts**: Create, like, repost, reply, delete posts with image support
- **File Upload**: Cloudinary integration for images, avatars, and banners
- **Real-time**: Notification system for likes, follows, reposts, mentions
- **Security**: Rate limiting, CORS, helmet, input validation
- **Database**: MongoDB with Mongoose ODM

### Frontend
- **Modern React**: Hooks, Context API, React Router
- **State Management**: React Query for server state
- **UI/UX**: Tailwind CSS with responsive design
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast
- **Image Upload**: Drag & drop with preview

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image hosting)
- Multer (File upload)
- Express Rate Limit
- Helmet (Security)
- Express Validator

### Frontend
- React 18
- React Router DOM
- React Query
- Tailwind CSS
- React Hook Form
- React Hot Toast
- Axios

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account (for image uploads)

### Backend Setup

1. **Clone and install dependencies:**
```bash
npm install
```

2. **Environment Variables:**
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zing-social
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
FRONTEND_URL=http://localhost:3000
```

3. **Start the server:**
```bash
npm run dev
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server:**
```bash
npm run dev
```

## Deployment

### Backend Deployment Options

#### Option 1: GitHub + Render (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Deploy on Render:**
   - Go to [Render.com](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service
   - Set build command: `npm install`
   - Set start command: `npm start`
   - Add environment variables from your `.env` file

#### Option 2: GitHub Actions (Advanced)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Deploy to Render
      # Add your deployment script here
```

### Frontend Deployment

#### Option 1: Netlify
1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Netlify

#### Option 2: Vercel
1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/:username/follow` - Follow/unfollow user
- `GET /api/users/:username/followers` - Get followers
- `GET /api/users/:username/following` - Get following
- `GET /api/users/search/:query` - Search users

### Posts
- `POST /api/posts` - Create post
- `GET /api/posts/feed` - Get user feed
- `GET /api/posts/trending` - Get trending posts
- `GET /api/posts/:postId` - Get single post
- `POST /api/posts/:postId/like` - Like/unlike post
- `POST /api/posts/:postId/repost` - Repost
- `DELETE /api/posts/:postId` - Delete post
- `GET /api/posts/search/:query` - Search posts

### Upload
- `POST /api/upload/image` - Upload image
- `POST /api/upload/avatar` - Upload avatar
- `POST /api/upload/banner` - Upload banner

## Database Schema

### User Model
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  displayName: String,
  bio: String,
  location: String,
  website: String,
  avatar: String,
  banner: String,
  verified: Boolean,
  followers: [ObjectId],
  following: [ObjectId],
  bookmarks: [ObjectId],
  isPrivate: Boolean,
  joinDate: Date,
  lastActive: Date
}
```

### Post Model
```javascript
{
  author: ObjectId,
  content: String,
  images: [String],
  likes: [ObjectId],
  reposts: [{user: ObjectId, createdAt: Date}],
  replies: [ObjectId],
  replyTo: ObjectId,
  hashtags: [String],
  mentions: [ObjectId],
  isRepost: Boolean,
  originalPost: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure authentication with 7-day expiry
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Express validator for all inputs
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **File Upload**: Size limits and type validation

## Performance Optimizations

- **Database Indexing**: Optimized queries for posts and users
- **Image Optimization**: Cloudinary transformations
- **Lazy Loading**: React Query with pagination
- **Caching**: React Query caching strategy
- **Code Splitting**: Dynamic imports for routes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email your-email@example.com or create an issue on GitHub.