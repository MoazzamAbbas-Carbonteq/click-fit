# Click-Fit

Web store to buy fitness equipment built with NestJS, Express, and TypeORM.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL database

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/click-fit.git
cd click-fit
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   - Create a `.env` file in the root directory based on the example below:
```
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_DATABASE=click_fit

# Application Configuration
PORT=3000
```

4. Create the database:
```sql
CREATE DATABASE click_fit;
```

5. Set up the database tables:
   - First, run the SQL script to create the users table and stored procedures:
   ```bash
   mysql -u your_db_username -p click_fit < src/database/users.sql
   ```
   - Then start the application, which will automatically create other tables (like uploads) using TypeORM:
   ```bash
   npm run start:dev
   ```

## Running the Application

### Development mode
```bash
npm run start:dev
# or
yarn start:dev
```

### Production mode
```bash
# Build the application
npm run build
# or
yarn build

# Start the application
npm run start:prod
# or
yarn start:prod
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
click-fit/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── main.ts
│   ├── database/
│   │   └── users.sql
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   └── uploads/
│       ├── entities/
│       ├── uploads.controller.ts
│       ├── uploads.module.ts
│       └── uploads.service.ts
├── public/                    # Static files served directly
│   ├── css/
│   ├── js/
│   └── index.html
├── upload_images/            # Directory for uploaded product images
│   ├── products/            # Product images
│   └──                # Temporary storage for uploads
├── .env
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Database Setup

The project uses a hybrid approach for database management:

1. **Users Table**: Created using a SQL script (`src/database/users.sql`) that:
   - Creates the users table with all required columns
   - Sets up the `addUser` stored procedure
   - Must be run before starting the application

2. **Other Tables**: Created automatically by TypeORM when the application starts:
   - Uploads table
   - Any other entities defined in the project

You can use both approaches in your code:
```typescript
// Using stored procedure for users
await usersService.createUserWithStoredProcedure(userData);

// Using TypeORM for uploads
await uploadsService.create(uploadData);
```

## API Endpoints

### Users
- `POST /api/users` - Create a new user

### Uploads
- `POST /upload` - Upload an image

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
