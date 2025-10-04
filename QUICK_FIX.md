# 🚀 QUICK FIX - MentiConnect Setup

## **Step 1: Backend Setup**
```bash
cd menti-connect-backend
npm install
npm start
```
*Backend will run on http://localhost:5001*

## **Step 2: Frontend Setup (in new terminal)**
```bash
cd menti-connect-frontend
npm install
npm run dev
```
*Frontend will run on http://localhost:3000*

## **Step 3: Test Everything**
1. Open http://localhost:3000
2. Click "Login with GitHub"
3. Complete GitHub OAuth
4. You'll be redirected to dashboard

## **If you get "vite: command not found":**
```bash
cd menti-connect-frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## **If backend fails:**
```bash
cd menti-connect-backend
rm -rf node_modules package-lock.json
npm install
npm start
```

## **Environment Files:**
- Backend: Already has `.env` file
- Frontend: Create `.env` with `VITE_API_URL=http://localhost:5001`

## **That's it! Everything should work now! 🎉**
