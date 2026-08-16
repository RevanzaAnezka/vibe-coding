# Feature: User Login & Sessions API

## Overview
We need to build a new feature that allows users to log into their accounts securely. When they provide the correct email and password, we will create a "session" for them in the database.

You will be working with Bun, ElysiaJS, Drizzle ORM, and MySQL. Don't worry, the steps are broken down to be very easy to follow!

## 1. Create the Sessions Database Table
First, we need to make a new table in our database to remember which users are logged in.

**File to edit:** `src/db/schema.ts`

**Instructions:**
- Add a new table called `sessions`.
- Make sure the table has exactly these columns:
  - `id`: An integer that automatically increases (auto-increment). This is the primary key.
  - `token`: A string (varchar) up to 255 characters. Cannot be empty (not null). This will store a unique UUID for the session.
  - `user_id`: An integer. This connects to the `users` table (it's a Foreign Key pointing to `users.id`).
  - `created_at`: A timestamp that automatically defaults to the current time when a new row is inserted.

**After updating the code:** 
Don't forget to run your database migration commands (like `bun run db:generate` and `bun run db:push`) to apply these changes to your actual MySQL database.

## 2. Create the Business Logic (Service)
We will add the login logic to our existing `user-services.ts` file to keep things organized.

**File to edit:** `src/services/user-services.ts`

**Instructions:**
1. Inside this file, write a new function (e.g., `loginUser`).
2. The function should accept `email` and `password` as inputs.
3. First, query the `users` table to find the user with that `email`.
4. If the user **is not found**, throw an error or return a specific failure object indicating "invalid credentials".
5. If the user **is found**, use `bcrypt.compare()` to check if the plain-text password they typed matches the scrambled hash saved in the database.
6. If the password **does not match**, throw an error indicating "invalid credentials".
7. If the password **does match**, generate a new unique token (you can use `crypto.randomUUID()` which is built into Node/Bun).
8. Insert a new row into the `sessions` table using Drizzle ORM. Save the generated `token` and the user's `id`.
9. Return a success signal!

## 3. Create the API Route
Now we need to connect the outside world to our service. 

**File to edit:** `src/routes/user-routes.ts`

**Instructions:**
1. Open your existing user router.
2. We need an endpoint specifically for `POST /api/login`. *(Note: If your user router currently uses the prefix `/api/users`, you can either change the router to handle `/api` generally, or create a separate route group for `/api/login`. Follow whatever fits the current code best to make it exactly `POST /api/login`)*.
3. In this endpoint, read the `email` and `password` from the incoming Request Body.
4. Call your `loginUser` function from `user-services.ts`.
5. **If it succeeds:** 
   - Set the HTTP Status code to `201` (Created).
   - Return this exact JSON response:
     ```json
     {
         "message": "login successfully"
     }
     ```
6. **If it fails (because the email or password was wrong):** 
   - Set the HTTP Status code to `401` (Unauthorized).
   - Return this exact JSON response:
     ```json
     {
         "message": "Invalid email or password",
         "error": {
             "email": "invalid credentials"
         }
     }
     ```

## 4. Hook it all up & Test
Since the router is already connected in `src/index.ts`, you just need to make sure your new route is saved properly!

**Testing:** 
Run your server and use a tool like Postman, Insomnia, or a simple `curl` command to send a POST request to `http://localhost:3000/api/login` with the correct JSON body. Check if you get the `201` success response, and try logging in with the wrong password to make sure you get the `401` error response!
