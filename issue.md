# Feature: User Registration API

## Overview
We need to build a new feature that allows users to register an account. This involves updating our database to store passwords securely and creating a new API endpoint to handle the registration process. 

You will be working with Bun, ElysiaJS, Drizzle ORM, and MySQL. Don't worry, the steps are broken down to be very easy to follow!

## 1. Update the Database Schema
First, we need to update our `users` table in the database so it can store passwords.

**File to edit:** `src/db/schema.ts` (or wherever your database schema is defined)

**Instructions:**
- Look for the `users` table definition.
- Make sure the table has exactly these columns:
  - `id`: An integer that automatically increases (auto-increment). This is the primary key.
  - `name`: A string (varchar) up to 255 characters. Cannot be empty (not null).
  - `email`: A string (varchar) up to 255 characters. Cannot be empty (not null). It should also be unique.
  - `password`: A string (varchar) up to 255 characters. Cannot be empty (not null). *Note: We will store a scrambled hash here, never the real password!*
  - `created_at`: A timestamp that automatically defaults to the current time when a new row is inserted.

**After updating the code:** 
Don't forget to run your database migration commands (like `bun run db:generate` and `bun run db:push`) to apply these changes to your actual MySQL database.

## 2. Install bcrypt for Passwords
To scramble (hash) the passwords, we will use a popular library called `bcrypt`.

**Commands to run in your terminal:**
```bash
bun add bcrypt
bun add -d @types/bcrypt
```

## 3. Create the Business Logic (Service)
We want to keep our code organized. "Business logic" (the actual work of checking emails and hashing passwords) goes in the `services` folder.

**File to create:** `src/services/user-services.ts`

**Instructions:**
1. Inside this file, write a function (e.g., `registerUser`).
2. The function should accept `name`, `email`, and `password` as inputs.
3. First, query the database to check if a user with that `email` already exists.
4. If they **do exist**, throw an error or return a specific failure object indicating the email is taken.
5. If they **do not exist**, use bcrypt to hash the plain text `password`.
6. Insert the new user into the database using Drizzle ORM. Remember to save the **hashed** password, not the plain one!
7. Return a success signal.

## 4. Create the API Route
Now we need to connect the outside world to our service. "Routing logic" (handling URLs and HTTP methods) goes in the `routes` folder.

**File to create:** `src/routes/user-routes.ts`

**Instructions:**
1. Set up a new Elysia router instance.
2. Create a `POST` endpoint at the path `/api/users`.
3. In this endpoint, read the `name`, `email`, and `password` from the incoming Request Body.
4. Call your `registerUser` function from `user-services.ts`.
5. **If it succeeds:** 
   - Set the HTTP Status code to `201` (Created).
   - Return this exact JSON response:
     ```json
     {
         "message": "User created successfully"
     }
     ```
6. **If it fails (because the email already exists):** 
   - Set the HTTP Status code to `400` (Bad Request).
   - Return this exact JSON response:
     ```json
     {
         "message": "Failed to create user",
         "error": {
             "email": "email already exists"
         }
     }
     ```

## 5. Hook it all up
Finally, go to your main server file (`src/index.ts`). 
- Import your new `user-routes.ts`.
- Attach it to your main Elysia app using `.use()`. 

**Testing:** 
Run your server and use a tool like Postman, Insomnia, or a simple `curl` command to send a POST request to `http://localhost:3000/api/users` with the correct JSON body. Check if you get the `201` success response, and try registering the same email twice to make sure you get the `400` error response!
