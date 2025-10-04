# MentiConnect Frontend

A modern React frontend for the MentiConnect mentorship platform.

## Features

- 🚀 **Vite + React** - Fast development and building
- 🎨 **Tailwind CSS** - Utility-first styling
- 🔐 **GitHub OAuth** - Seamless authentication
- 📱 **Responsive Design** - Works on all devices
- 🎯 **Smart Matching** - Find mentors and mentees
- 📊 **Dashboard** - Manage your profile and connections

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5001
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
menti-connect-frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── api/
│   │   └── apiClient.js          # Axios configuration
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── ProfileCard.jsx   # User profile display
│   │   │   └── UpdateProfileForm.jsx # Profile editing
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        # Navigation bar
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   └── ui/
│   │       ├── button.jsx        # Reusable button component
│   │       └── card.jsx          # Card component
│   ├── hooks/
│   │   └── useAuth.js            # Authentication context
│   ├── lib/
│   │   └── utils.js              # Utility functions
│   ├── pages/
│   │   ├── AuthCallbackPage.jsx  # OAuth callback handler
│   │   ├── DashboardPage.jsx     # Main dashboard
│   │   └── HomePage.jsx          # Landing page
│   ├── App.jsx                   # Main app component
│   ├── index.css                 # Global styles
│   └── main.jsx                  # App entry point
├── .gitignore
├── index.html
├── jsconfig.json
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Development

The frontend runs on `http://localhost:3000` by default and proxies API requests to the backend at `http://localhost:5001`.

### Key Features

1. **Authentication Flow**
   - GitHub OAuth integration
   - JWT token management
   - Protected routes

2. **Dashboard**
   - Profile management
   - Match discovery
   - Connection management

3. **Responsive Design**
   - Mobile-first approach
   - Tailwind CSS utilities
   - Modern UI components

## API Integration

The frontend communicates with the backend through:
- `/api/users/me` - User profile management
- `/api/matches` - Match discovery
- `/auth/github` - GitHub OAuth flow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC
