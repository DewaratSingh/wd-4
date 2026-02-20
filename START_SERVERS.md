# Server Configuration

## Port Setup
- **Frontend (Next.js)**: http://localhost:5173
- **Backend (Express)**: http://localhost:3000

## Starting the Servers

### Backend Server
```bash
cd backend
npm run dev
```
The backend will start on port 3000.

### Frontend Server
```bash
cd client
npm run dev
```
The frontend will start on port 5173.

## Environment Variables

### Backend (.env)
```
PORT=3000
DATABASE_URL=your_database_url
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Access the Application
Once both servers are running:
- Open your browser to http://localhost:5173
- The frontend will communicate with the backend at http://localhost:3000

## CORS Configuration
The backend is configured to accept requests from http://localhost:5173
