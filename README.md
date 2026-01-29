# Book-Buddy-platform Server

A TypeScript-based backend server for a book exchange platform that allows users to share and exchange books.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Project Structure](#project-structure)
- [Authentication](#authentication)
- [Validation](#validation)
- [Setup Instructions](#setup-instructions)

## Project Overview

This server provides the backend functionality for a book exchange platform where users can:
- Register and authenticate
- List books they want to share or exchange
- Browse available books
- Request books from other users
- Manage incoming and outgoing book requests

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Express** - Web framework for Node.js
- **TypeScript** - Typed superset of JavaScript
- **Prisma** - ORM for database access
- **PostgreSQL** - Relational database
- **JWT (JSON Web Tokens)** - For user authentication
- **Zod** - For request validation
- **bcryptjs** - For password hashing
- **cookie-parser** - For handling cookies

## API Endpoints

The API is structured under the `/api/v1` prefix:

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and receive JWT token
- `POST /api/v1/auth/logout` - Logout and clear token

### Users
- `GET /api/v1/user/` - Get all users (protected)
- `GET /api/v1/user/profile` - Get current user profile (protected)
- `PUT /api/v1/user/:id` - Update user information (protected)

### Books
- `GET /api/v1/book/` - Get all books (protected)
- `GET /api/v1/book/filtered` - Get filtered books with pagination (protected)
- `POST /api/v1/book/` - Create a new book (protected)
- `GET /api/v1/book/:id` - Get book by ID (protected)
- `PUT /api/v1/book/:id` - Update book information (protected)
- `DELETE /api/v1/book/:id` - Delete a book (protected)

### Orders
- `GET /api/v1/order/incoming/:userId` - Get incoming orders for a user (protected)
- `GET /api/v1/order/outgoing/:userId` - Get outgoing orders for a user (protected)

## Data Models

### User
- `id` (Int) - Unique identifier
- `name` (String) - Unique username
- `email` (String) - Unique email address
- `password` (String) - Hashed password
- `avatar` (String, optional) - URL to user avatar
- `books` (Book[]) - List of books owned by the user
- `createdAt` (DateTime) - Creation timestamp
- `updatedAt` (DateTime) - Last update timestamp
- `incomingOrders` (Orders[]) - Orders received by the user
- `outgoingOrders` (Orders[]) - Orders placed by the user

### Book
- `id` (Int) - Unique identifier
- `title` (String) - Book title
- `author` (String) - Book author
- `genre` (String) - Book genre
- `ageGroup` (String) - Recommended age group
- `coverImage` (String) - URL to cover image
- `availabilityType` (availabilityType) - Availability type (Free or Exchange)
- `ownerId` (Int) - ID of the book owner

### Orders
- (Not fully visible in the schema snippet, but related to User model)

### Enums
- `orderStatus`: Pending, Approved, Rejected, Completed, Shared
- `availabilityType`: Free, Exchange

## Project Structure

```
├── src/
│   ├── common/           # Common utilities and validators
│   │   ├── authValidator.ts
│   │   ├── bookValidator.ts
│   │   ├── enums.ts
│   │   └── orderValidator.ts
│   ├── controllers/      # Request handlers
│   │   ├── authController.ts
│   │   ├── bookController.ts
│   │   ├── orderController.ts
│   │   └── userController.ts
│   ├── middlewares/      # Custom middleware
│   │   └── authMiddleware.ts
│   ├── routes/           # API route definitions
│   │   ├── authRoutes.ts
│   │   ├── bookRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── userRoutes.ts
│   ├── utils/            # Utility functions
│   │   └── prisma.ts
│   └── index.ts          # Application entry point
├── prisma/               # Database schema and migrations
│   ├── migrations/
│   └── schema.prisma
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Authentication

Authentication is implemented using JWT (JSON Web Tokens). When a user logs in, a JWT token is generated and stored in a cookie. Protected routes use the `authMiddleware` to verify the token before allowing access.

The `authMiddleware`:
1. Extracts the token from cookies
2. Verifies the token using the JWT secret from environment variables
3. Attaches the decoded user ID to the request object for use in controllers
4. Returns 401 status if no token is provided or if the token is invalid

## Validation

Request validation is implemented using Zod schemas:
- `authValidator.ts` - For authentication routes
- `bookValidator.ts` - For book management routes
- `orderValidator.ts` - For order processing routes

Each controller validates incoming requests using these schemas before processing the data.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/book_exchange?schema=public"
   JWT_SECRET="your-jwt-secret-key"
   PORT=3000
   ```

3. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

4. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

5. **Start the Server**
   ```bash
   npm start
   ```

The server will start running on `http://localhost:3000`
