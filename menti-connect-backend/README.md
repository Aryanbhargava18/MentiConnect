# MentiConnect Backend

A mentorship matching platform backend built with Node.js, Express, and MongoDB.

## Features

- 🔐 GitHub OAuth Authentication
- 👥 User profile management
- 🎯 Smart mentorship matching algorithm
- 📧 Email notifications for matches
- 🔗 GitHub integration (PR tracking)
- 🛡️ JWT-based authentication

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file with the following variables:
   ```env
   # Database
   MONGO_URI=mongodb://localhost:27017/menti-connect
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   
   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   GITHUB_CALLBACK_URL=http://localhost:5001/auth/github/callback
   
   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   
   # Email Configuration
   EMAIL_HOST=smtp.ethereal.email
   EMAIL_PORT=587
   EMAIL_USER=your-ethereal-email
   EMAIL_PASS=your-ethereal-password
   
   # Environment
   NODE_ENV=development
   PORT=5001
   ```

3. **Start the server:**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `GET /auth/github` - Initiate GitHub OAuth
- `GET /auth/github/callback` - GitHub OAuth callback

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Matches
- `GET /api/matches` - Get potential matches
- `POST /api/matches/accept/:id` - Accept a match
- `POST /api/matches/reject/:id` - Reject a match

### GitHub Integration
- `GET /api/github/prs` - Get user's pull requests

### Health Check
- `GET /health` - Server health status

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** Passport.js (GitHub OAuth) + JWT
- **Email:** Nodemailer
- **HTTP Client:** Axios

## Development

The server runs on `http://localhost:5001` by default.

### Environment Setup

1. Set up a MongoDB database (local or cloud)
2. Create a GitHub OAuth app
3. Configure email settings (Ethereal for testing)
4. Update the `.env` file with your credentials

## Project Structure

```
menti-connect-backend/
├── config/          # Database and Passport configuration
├── controllers/     # Route handlers
├── middleware/      # Authentication and error handling
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # External service integrations
└── server.js        # Main application file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
