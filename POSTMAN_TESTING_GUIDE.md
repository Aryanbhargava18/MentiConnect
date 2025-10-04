# 🚀 MentiConnect Backend API Testing Guide

## 📋 Prerequisites

1. **Start the Backend Server:**
   ```bash
   cd menti-connect-backend
   npm start
   ```
   Server runs on: `http://localhost:5001`

2. **Setup Database:**
   ```bash
   ./setup-database.sh
   ```

3. **Install Postman** (if not already installed)

---

## 🔐 Authentication Flow

### 1. GitHub OAuth Login
**Method:** `GET`  
**URL:** `http://localhost:5001/auth/github`  
**Description:** Redirects to GitHub OAuth

**Expected Response:** Redirect to GitHub login page

---

### 2. GitHub OAuth Callback
**Method:** `GET`  
**URL:** `http://localhost:5001/auth/github/callback`  
**Description:** GitHub OAuth callback (handled automatically)

**Expected Response:** Redirect to frontend with token

---

### 3. Logout
**Method:** `POST`  
**URL:** `http://localhost:5001/auth/logout`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

## 👤 User Management

### 1. Get Current User Profile
**Method:** `GET`  
**URL:** `http://localhost:5001/api/users/me`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "_id": "user_id",
  "githubId": "12345678",
  "username": "johndoe",
  "email": "john@example.com",
  "avatarUrl": "https://avatars.githubusercontent.com/u/12345678?v=4",
  "role": "mentor",
  "skills": ["JavaScript", "React", "Node.js"],
  "mentoringCapacity": 3,
  "availability": ["Mon 6-8pm", "Wed 7-9pm"],
  "acceptedMatches": [],
  "rejectedMatches": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Update User Profile
**Method:** `PUT`  
**URL:** `http://localhost:5001/api/users/me`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "role": "mentor",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "mentoringCapacity": 5,
  "availability": ["Mon 6-8pm", "Wed 7-9pm", "Fri 5-7pm"],
  "bio": "Experienced full-stack developer",
  "location": "San Francisco, CA",
  "phone": "+1-555-123-4567",
  "timezone": "UTC-8"
}
```

**Expected Response:**
```json
{
  "_id": "user_id",
  "username": "johndoe",
  "email": "john@example.com",
  "role": "mentor",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "mentoringCapacity": 5,
  "availability": ["Mon 6-8pm", "Wed 7-9pm", "Fri 5-7pm"],
  "bio": "Experienced full-stack developer",
  "location": "San Francisco, CA",
  "phone": "+1-555-123-4567",
  "timezone": "UTC-8",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 📊 Dashboard API

### 1. Get Dashboard Data
**Method:** `GET`  
**URL:** `http://localhost:5001/api/dashboard`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "activeMatches": 2,
  "unreadMessages": 3,
  "goalsProgress": 75,
  "githubActivity": 15,
  "recentActivity": [
    {
      "type": "match",
      "title": "New Match",
      "description": "Connected with janedoe",
      "time": "2 hours ago"
    }
  ],
  "upcomingEvents": [
    {
      "title": "Weekly Mentorship Check-in",
      "time": "Tomorrow at 2:00 PM"
    }
  ],
  "recentMatches": [
    {
      "_id": "match_id",
      "username": "janedoe",
      "avatarUrl": "https://avatars.githubusercontent.com/u/87654321?v=4",
      "role": "mentee",
      "matchScore": 85
    }
  ],
  "recentMessages": [
    {
      "_id": "message_id",
      "content": "Hello! I'd love to learn React from you.",
      "sender": {
        "username": "janedoe",
        "avatarUrl": "https://avatars.githubusercontent.com/u/87654321?v=4"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "recentGoals": [
    {
      "_id": "goal_id",
      "title": "Learn React Advanced Patterns",
      "status": "in_progress",
      "progress": 65
    }
  ],
  "totalCommits": 150,
  "pullRequests": 25,
  "stars": 10,
  "languages": ["JavaScript", "Python", "React"],
  "weeklyActivity": 15,
  "monthlyActivity": 60,
  "streak": 7
}
```

---

## 🎯 Goals Management

### 1. Get All Goals
**Method:** `GET`  
**URL:** `http://localhost:5001/api/goals`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
[
  {
    "_id": "goal_id",
    "title": "Learn React Advanced Patterns",
    "description": "Master advanced React concepts including hooks, context, and performance optimization",
    "status": "in_progress",
    "priority": "high",
    "category": "skill_development",
    "progress": 65,
    "targetDate": "2024-02-01T00:00:00.000Z",
    "skills": ["React", "JavaScript", "Hooks", "Context API"],
    "milestones": [
      {
        "title": "Complete React Hooks tutorial",
        "completed": true,
        "completedAt": "2024-01-15T00:00:00.000Z"
      },
      {
        "title": "Build a custom hook",
        "completed": true,
        "completedAt": "2024-01-20T00:00:00.000Z"
      },
      {
        "title": "Implement Context API",
        "completed": false
      }
    ],
    "achievements": ["First Milestone", "Consistent Progress"],
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Create New Goal
**Method:** `POST`  
**URL:** `http://localhost:5001/api/goals`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Master TypeScript",
  "description": "Learn TypeScript from basics to advanced concepts",
  "priority": "high",
  "category": "skill_development",
  "targetDate": "2024-03-01T00:00:00.000Z",
  "skills": ["TypeScript", "JavaScript", "Type System"],
  "milestones": [
    {
      "title": "Learn basic types",
      "description": "Understand primitive types and interfaces"
    },
    {
      "title": "Master generics",
      "description": "Learn advanced generic patterns"
    }
  ]
}
```

**Expected Response:**
```json
{
  "_id": "new_goal_id",
  "title": "Master TypeScript",
  "description": "Learn TypeScript from basics to advanced concepts",
  "status": "not_started",
  "priority": "high",
  "category": "skill_development",
  "progress": 0,
  "targetDate": "2024-03-01T00:00:00.000Z",
  "skills": ["TypeScript", "JavaScript", "Type System"],
  "milestones": [
    {
      "_id": "milestone_id",
      "title": "Learn basic types",
      "description": "Understand primitive types and interfaces",
      "completed": false
    }
  ],
  "achievements": [],
  "userId": "user_id",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Update Goal
**Method:** `PUT`  
**URL:** `http://localhost:5001/api/goals/{goal_id}`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "progress": 75,
  "status": "in_progress"
}
```

### 4. Delete Goal
**Method:** `DELETE`  
**URL:** `http://localhost:5001/api/goals/{goal_id}`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "message": "Goal deleted successfully"
}
```

---

## 💬 Chat System

### 1. Get Conversations
**Method:** `GET`  
**URL:** `http://localhost:5001/api/chat/conversations`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
[
  {
    "_id": "conversation_id",
    "participants": [
      {
        "_id": "user_id_1",
        "username": "johndoe",
        "avatarUrl": "https://avatars.githubusercontent.com/u/12345678?v=4"
      },
      {
        "_id": "user_id_2",
        "username": "janedoe",
        "avatarUrl": "https://avatars.githubusercontent.com/u/87654321?v=4"
      }
    ],
    "lastMessage": {
      "_id": "message_id",
      "content": "Hello! How are you?",
      "sender": "user_id_1",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Create Conversation
**Method:** `POST`  
**URL:** `http://localhost:5001/api/chat/conversations`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "participants": ["user_id_1", "user_id_2"]
}
```

### 3. Get Messages
**Method:** `GET`  
**URL:** `http://localhost:5001/api/chat/messages/{conversation_id}`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
[
  {
    "_id": "message_id",
    "conversation": "conversation_id",
    "sender": {
      "_id": "user_id",
      "username": "johndoe",
      "avatarUrl": "https://avatars.githubusercontent.com/u/12345678?v=4"
    },
    "content": "Hello! I'd love to learn React from you.",
    "type": "text",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4. Send Message
**Method:** `POST`  
**URL:** `http://localhost:5001/api/chat/messages`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "content": "Hello! How can I help you learn React?",
  "conversationId": "conversation_id"
}
```

---

## 🔍 Matching System

### 1. Get Matches
**Method:** `GET`  
**URL:** `http://localhost:5001/api/matches`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
[
  {
    "_id": "match_id",
    "username": "janedoe",
    "email": "jane@example.com",
    "avatarUrl": "https://avatars.githubusercontent.com/u/87654321?v=4",
    "role": "mentee",
    "skills": ["Python", "Django", "PostgreSQL"],
    "availability": ["Tue 6-8pm", "Thu 7-9pm"],
    "matchScore": 85,
    "skillMatches": 3,
    "aiInsights": {
      "compatibilityScore": 85,
      "recommendedSkills": ["Python", "Django"],
      "githubActivity": {
        "activityLevel": "medium",
        "languages": ["Python", "JavaScript"],
        "recentPRs": 5,
        "openSourceContributions": 2
      }
    }
  }
]
```

### 2. Get AI Matches
**Method:** `GET`  
**URL:** `http://localhost:5001/api/matches/ai`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

### 3. Accept Match
**Method:** `POST`  
**URL:** `http://localhost:5001/api/matches/accept/{match_id}`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "message": "Match accepted!"
}
```

### 4. Reject Match
**Method:** `POST`  
**URL:** `http://localhost:5001/api/matches/reject/{match_id}`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "message": "Match rejected!"
}
```

---

## 📈 Analytics

### 1. Get GitHub Analytics
**Method:** `GET`  
**URL:** `http://localhost:5001/api/analytics/github?range=30d`  
**Headers:** 
```
Authorization: Bearer <JWT_TOKEN>
```

**Expected Response:**
```json
{
  "totalCommits": 150,
  "pullRequests": 25,
  "repositories": 12,
  "stars": 10,
  "languages": ["JavaScript", "Python", "React", "Node.js"],
  "activityLevel": "high",
  "recentPRs": 8,
  "openSourceContributions": 5,
  "skillIndicators": {
    "frontend": 85,
    "backend": 70,
    "devops": 45,
    "testing": 60
  },
  "trends": {
    "commitsTrend": 15,
    "prTrend": 8,
    "reposTrend": 5,
    "starsTrend": 12
  },
  "achievements": [
    {
      "name": "Getting Started",
      "description": "Complete your first commit",
      "unlocked": true
    },
    {
      "name": "Active Developer",
      "description": "Make 10+ commits",
      "unlocked": true
    }
  ],
  "heatmap": [[0,1,2,0,1,0,0], [1,2,3,1,2,1,1]],
  "skills": [
    { "name": "JavaScript", "level": 85 },
    { "name": "Python", "level": 70 },
    { "name": "React", "level": 80 }
  ]
}
```

---

## 🔧 Health Check

### 1. API Health Check
**Method:** `GET`  
**URL:** `http://localhost:5001/health`  

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600
}
```

### 2. API Root
**Method:** `GET`  
**URL:** `http://localhost:5001/`  

**Expected Response:**
```json
{
  "message": "Menti Connect API is running...",
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## 🚨 Error Responses

### Common Error Formats:

**401 Unauthorized:**
```json
{
  "message": "Not authorized, no token"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "message": "Server error"
}
```

---

## 📝 Testing Checklist

### ✅ Authentication Flow
- [ ] GitHub OAuth login redirects properly
- [ ] JWT token is generated and returned
- [ ] Logout clears token from database
- [ ] Protected routes require valid token

### ✅ User Management
- [ ] Get current user profile returns correct data
- [ ] Update profile saves changes to database
- [ ] Profile validation works correctly
- [ ] Skills and availability arrays update properly

### ✅ Dashboard
- [ ] Dashboard data includes all required fields
- [ ] Recent activity shows correct information
- [ ] GitHub activity data is fetched
- [ ] Stats are calculated correctly

### ✅ Goals Management
- [ ] Create goal saves to database
- [ ] Get goals returns user's goals
- [ ] Update goal modifies existing goal
- [ ] Delete goal removes from database
- [ ] Milestones and achievements work

### ✅ Chat System
- [ ] Create conversation works
- [ ] Get conversations returns user's chats
- [ ] Send message saves to database
- [ ] Get messages returns conversation history
- [ ] Message timestamps are correct

### ✅ Matching System
- [ ] Get matches returns potential matches
- [ ] AI matches include compatibility scores
- [ ] Accept match updates user's accepted matches
- [ ] Reject match updates user's rejected matches
- [ ] Match scores are calculated correctly

### ✅ Analytics
- [ ] GitHub analytics returns data structure
- [ ] Fallback data works when GitHub unavailable
- [ ] Time range parameter affects results
- [ ] Skills assessment is included

---

## 🎯 Quick Test Sequence

1. **Start Backend:** `cd menti-connect-backend && npm start`
2. **Test Health:** `GET http://localhost:5001/health`
3. **Test Auth:** `GET http://localhost:5001/auth/github`
4. **Get Dashboard:** `GET http://localhost:5001/api/dashboard` (with token)
5. **Create Goal:** `POST http://localhost:5001/api/goals` (with token)
6. **Get Matches:** `GET http://localhost:5001/api/matches` (with token)
7. **Test Analytics:** `GET http://localhost:5001/api/analytics/github` (with token)

---

## 🔍 Debugging Tips

1. **Check Console Logs:** Backend logs all requests and errors
2. **Verify Database:** Use MongoDB Compass to check data
3. **Test Token:** Use JWT.io to decode and verify tokens
4. **Check Headers:** Ensure Authorization header is correct
5. **Validate JSON:** Use JSON formatter to check request/response format

---

## 📊 Expected Performance

- **Response Time:** < 200ms for most endpoints
- **Database Queries:** Optimized with proper indexes
- **Error Handling:** Graceful fallbacks for all endpoints
- **Data Validation:** Comprehensive input validation
- **Security:** JWT token validation on all protected routes

---

This guide covers all the major API endpoints and expected responses. Use this to systematically test your backend and ensure all functionality is working correctly! 🚀
