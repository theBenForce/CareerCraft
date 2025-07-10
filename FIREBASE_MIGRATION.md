# Firebase Migration Guide for CareerCraft

This guide explains how to configure and use Firebase as the database and storage backend for CareerCraft.

## Overview

The CareerCraft application has been enhanced to support Firebase as an alternative to the current Prisma/SQLite setup. The migration includes:

- **Firestore Database**: Replaces SQLite/PostgreSQL for data storage
- **Firebase Storage**: Replaces local file system for uploads
- **Feature Flag Support**: Gradual migration with fallback to Prisma
- **Backward Compatibility**: Existing APIs work with both backends

## Firebase Project Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter your project name (e.g., "careercraft-prod")
4. Enable/disable Google Analytics as needed
5. Create the project

### 2. Enable Required Services

#### Firestore Database
1. In the Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" (recommended)
4. Select a location for your database

#### Firebase Storage
1. Go to "Storage" in the Firebase Console
2. Click "Get started"
3. Keep the default security rules for now
4. Choose a location (should match your Firestore location)

#### Authentication (Optional)
1. Go to "Authentication" in the Firebase Console
2. Click "Get started"
3. Configure sign-in methods if you plan to use Firebase Auth

### 3. Generate Service Account Credentials

1. Go to "Project settings" (gear icon)
2. Click on the "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Keep this file secure - it contains sensitive credentials

## Environment Configuration

### Required Environment Variables

Add these variables to your `.env.local` file:

```bash
# Enable Firebase (set to 'true' to use Firebase instead of Prisma)
USE_FIREBASE=true

# Firebase Project Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com

# Firebase Admin SDK (Server-side) - Service Account JSON as string
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

# Firebase Client SDK (Client-side)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Finding Configuration Values

**From the Service Account JSON:**
- `FIREBASE_PROJECT_ID`: `project_id` field
- `FIREBASE_SERVICE_ACCOUNT`: The entire JSON file as a string (escape quotes)

**From Firebase Console > Project Settings > General:**
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Web API Key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Project ID + ".firebaseapp.com"
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: App ID

## Firestore Security Rules

### Basic Security Rules

Replace the default Firestore rules with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /{collection}/{document} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Allow user document access
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

### Storage Security Rules

Replace the default Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{category}/{fileName} {
      allow read: if true; // Public read for uploaded files
      allow write: if request.auth != null; // Only authenticated users can upload
    }
  }
}
```

## Migration Process

### 1. Test Configuration

First, verify your Firebase setup:

```bash
# Run the test script
node test-firebase.js

# Check if the app builds with Firebase enabled
USE_FIREBASE=true npm run build
```

### 2. Gradual Migration

Start with `USE_FIREBASE=false` to test the setup, then gradually enable Firebase:

```bash
# Step 1: Test with Prisma (existing functionality)
USE_FIREBASE=false npm run dev

# Step 2: Enable Firebase for new features
USE_FIREBASE=true npm run dev

# Step 3: Test file uploads with Firebase Storage
# Upload a file and verify it appears in Firebase Console > Storage
```

### 3. Data Migration (Optional)

If you have existing data in SQLite/PostgreSQL, you can migrate it to Firestore:

```bash
# Export existing data
npx prisma db push
node prisma/export-data.js  # Create this script to export data

# Import to Firestore
node scripts/import-to-firestore.js  # Create this script to import data
```

## Development with Emulators

For local development, you can use Firebase Emulators:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase in your project
firebase init

# Start emulators
firebase emulators:start
```

The app will automatically connect to emulators when `NODE_ENV=development`.

## API Usage Examples

### Database Operations

```typescript
import { prisma } from '@/lib/db'

// This works with both Prisma and Firebase!
const companies = await prisma.company.findMany({
  where: { userId: 'user-id' },
  include: { contacts: true }
})
```

### File Upload

```typescript
// The upload API automatically uses Firebase Storage when enabled
const formData = new FormData()
formData.append('file', file)
formData.append('category', 'logos')

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})
```

## Monitoring and Debugging

### Firebase Console

Monitor your application through the Firebase Console:

- **Firestore**: View data, queries, and usage
- **Storage**: View uploaded files and usage
- **Authentication**: Monitor user activity
- **Functions**: View logs and performance (if using Cloud Functions)

### Application Logs

The application logs Firebase operations:

```bash
# View logs in development
npm run dev

# Check logs for Firebase operations
grep "Firebase" logs/app.log
```

## Performance Optimization

### Firestore Indexes

Create indexes for common queries:

```bash
# The app will suggest indexes in the console
# Or create them manually in Firebase Console > Firestore > Indexes
```

### Caching

Consider implementing caching for frequently accessed data:

```typescript
// Example: Cache company data
const companies = await redis.get('companies:' + userId) || 
  await prisma.company.findMany({ where: { userId } })
```

## Troubleshooting

### Common Issues

**1. Service Account Authentication**
```
Error: Firebase Admin configuration missing
```
- Verify `FIREBASE_SERVICE_ACCOUNT` is properly formatted JSON
- Check that the service account has required permissions

**2. Client Configuration**
```
Error: Firebase client configuration incomplete
```
- Verify all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Check that the API key is valid

**3. Permission Denied**
```
FirebaseError: Permission denied
```
- Check Firestore security rules
- Verify user authentication
- Ensure proper document ownership

### Testing Firebase Connection

```bash
# Test Firebase Admin connection
node -e "
const { firebaseDb } = require('./src/lib/firebase-admin.ts');
console.log('Firebase connected:', !!firebaseDb);
"

# Test file upload
curl -X POST -F "file=@test.jpg" -F "category=logos" \
  http://localhost:3000/api/upload
```

## Production Deployment

### Environment Variables

Ensure all Firebase environment variables are set in your production environment:

- Vercel: Add to Environment Variables in dashboard
- Netlify: Add to Site Settings > Environment Variables
- Docker: Include in docker-compose.yml or Dockerfile

### Security Checklist

- [ ] Firestore security rules configured
- [ ] Storage security rules configured
- [ ] Service account credentials secured
- [ ] Client configuration variables set
- [ ] CORS configured for your domain
- [ ] Backup strategy implemented

## Cost Considerations

Monitor Firebase usage to manage costs:

- **Firestore**: Charged per read/write/delete operation
- **Storage**: Charged per GB stored and transferred
- **Authentication**: Free tier available

Set up budget alerts in Google Cloud Console to monitor costs.

## Migration Checklist

- [ ] Firebase project created and configured
- [ ] Service account generated and configured
- [ ] Environment variables set
- [ ] Security rules configured
- [ ] Test uploads working
- [ ] Test database operations working
- [ ] Data migrated (if applicable)
- [ ] Production deployment verified
- [ ] Monitoring and alerts configured

## Support

For issues specific to this migration:

1. Check the application logs for Firebase-related errors
2. Verify environment configuration with `test-firebase.js`
3. Test individual components (database, storage) separately
4. Check Firebase Console for service-specific errors