# Database Migration Guide: Add User Foreign Key to Complaints

## Overview
This migration adds a foreign key constraint to the `complaints` table, linking each complaint to a user in the `users` table. It also updates existing complaints to be owned by user ID 1.

## Prerequisites
- Backend server must be stopped before running migration
- Ensure you have at least one user in the database (user with ID 1)
- Database connection configured in `backend/.env`

## Migration Steps

### Step 1: Stop the Backend Server
If your backend is running, stop it first:
```bash
# Press Ctrl+C in the terminal where backend is running
```

### Step 2: Run the Migration Script
```bash
cd backend
npm run migrate
```

### Step 3: Verify Migration
The migration script will:
1. ✓ Ensure `user_id` column exists in complaints table
2. ✓ Update all existing complaints (with NULL user_id) to user_id = 1
3. ✓ Add foreign key constraint `fk_complaints_user`
4. ✓ Display first 5 complaints with their user information

Expected output:
```
Starting migration...
Step 1: Ensuring user_id column exists...
✓ user_id column ready
Step 2: Updating existing complaints to user_id = 1...
✓ Updated 3 complaints to user_id = 1
Step 3: Adding foreign key constraint...
✓ Foreign key constraint added
Step 4: Verifying changes...
✅ Migration completed successfully!
```

### Step 4: Restart Backend Server
```bash
npm run dev
```

## What Changed

### Database Schema
```sql
-- Before
complaints (
    id, image_url, notes, phone, latitude, longitude, 
    progress, resolved_text, created_at, user_id
)

-- After (with constraint)
complaints (
    id, image_url, notes, phone, latitude, longitude, 
    progress, resolved_text, created_at, 
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL
)
```

### Behavior Changes
1. **New Complaints**: Must include a valid `user_id` from the `users` table
2. **Existing Complaints**: All assigned to user ID 1
3. **User Deletion**: If a user is deleted, their complaints' `user_id` will be set to NULL
4. **Data Integrity**: Cannot create complaints with invalid user_id

## Application Flow

### Creating a Complaint
The frontend (`client/src/app/complaint/page.tsx`) automatically includes the logged-in user's ID:

```javascript
const currentUser = localStorage.getItem('currentUser');
if (currentUser) {
    const user = JSON.parse(currentUser);
    formData.append('user_id', user.id);
}
```

### Backend Validation
The backend (`backend/index.js`) accepts and stores the user_id:

```javascript
const { notes, phone, latitude, longitude, user_id } = req.body;
// ... stores in database with user_id
```

## Troubleshooting

### Error: "user_id violates foreign key constraint"
**Cause**: Trying to create a complaint with a user_id that doesn't exist in the users table.

**Solution**: Ensure the user is logged in and their ID exists in the database.

### Error: "Cannot add foreign key constraint"
**Cause**: Existing complaints have user_id values that don't exist in users table.

**Solution**: 
1. Check for orphaned user_ids:
```sql
SELECT DISTINCT user_id FROM complaints 
WHERE user_id NOT IN (SELECT id FROM users) AND user_id IS NOT NULL;
```

2. Update them to NULL or a valid user_id:
```sql
UPDATE complaints SET user_id = 1 WHERE user_id NOT IN (SELECT id FROM users);
```

### Migration Already Run
If you run the migration multiple times, it's safe. The script checks for existing constraints and columns before making changes.

## Rollback (if needed)

To remove the foreign key constraint:
```sql
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS fk_complaints_user;
```

To remove user_id column (WARNING: This will delete all user associations):
```sql
ALTER TABLE complaints DROP COLUMN IF EXISTS user_id;
```

## Testing

After migration, test the following:

1. **Create a new complaint** as a logged-in user
2. **View complaints** in the citizen dashboard
3. **Filter "My Complaints"** to see only user's own complaints
4. **Verify foreign key** by trying to insert a complaint with invalid user_id (should fail)

## Support

If you encounter issues:
1. Check backend logs for detailed error messages
2. Verify database connection in `.env`
3. Ensure users table has at least one record
4. Check that the backend server is stopped before migration
