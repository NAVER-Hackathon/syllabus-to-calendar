# Database Setup Guide

## Database Credentials

You have a MySQL database hosted on NAVER Cloud Platform with the following credentials:

```
Host: db-3c34ls-kr.vpc-pub-cdb.ntruss.com
User: dbadmin
Password: Hackathon@2025
Database: hackathondb
Port: 3306
```

## Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Database Configuration
DB_HOST=db-3c34ls-kr.vpc-pub-cdb.ntruss.com
DB_USER=dbadmin
DB_PASSWORD=Hackathon@2025
DB_NAME=hackathondb
DB_PORT=3306
```

**Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Database Connection

The database connection is configured in `lib/db.ts` using a connection pool for better performance.

### Usage Example

```typescript
import { query, queryOne } from "@/lib/db";

// Execute a query
const users = await query("SELECT * FROM users WHERE email = ?", [email]);

// Get a single result
const user = await queryOne("SELECT * FROM users WHERE id = ?", [userId]);
```

## Database Schema

The complete database schema is defined in `lib/db-schema.sql`. It includes:

- **users** - User accounts
- **courses** - Course information
- **assignments** - Assignment details
- **exams** - Exam information
- **milestones** - Project milestones
- **class_schedules** - Recurring class schedules
- **syllabus_uploads** - Uploaded syllabus files
- **google_calendar_sync** - Google Calendar integration
- **calendar_events** - Calendar events for syncing

## Initialize Database

To create all tables, you can:

1. **Option 1: Use the API endpoint** (Recommended for development)
   ```bash
   curl -X POST http://localhost:3000/api/db/init
   ```

2. **Option 2: Run SQL directly**
   ```bash
   mysql -h db-3c34ls-kr.vpc-pub-cdb.ntruss.com -u dbadmin -p hackathondb < lib/db-schema.sql
   ```

3. **Option 3: Test connection first**
   ```bash
   curl http://localhost:3000/api/db/init
   ```

## Testing Connection

Test the database connection:

```bash
# Start the dev server
npm run dev

# In another terminal, test the connection
curl http://localhost:3000/api/db/init
```

## Security Notes

1. **Never commit credentials** - Always use environment variables
2. **Use connection pooling** - Already configured in `lib/db.ts`
3. **Parameterized queries** - Always use placeholders (`?`) to prevent SQL injection
4. **Production** - Consider using SSL/TLS for database connections in production

## Troubleshooting

### Connection Refused
- Check if the database server is running
- Verify firewall rules allow connections from your IP
- Check if the public domain is accessible

### Authentication Failed
- Verify username and password
- Check if the user has proper permissions

### Database Not Found
- Ensure the database `hackathondb` exists
- Check database name in connection string

## Next Steps

1. Create `.env.local` with database credentials
2. Initialize database schema using one of the methods above
3. Test the connection
4. Start building your application features

