# TravBud Backend

TravBud is a travel companion application backend that helps users find travel buddies, organize trips, and manage join requests. Built with Node.js, Express, and TypeScript.

## 🚀 Features

-   **User Management**: Registration, Login, Profile Update, and Role Management (Admin/User).
-   **Trip Management**: Create, Read, Update, and Delete trips.
-   **Join Requests**: Users can request to join trips; creators can approve or reject requests.
-   **Advanced Search & Filter**: Search trips by destination, budget, date range, and travel type.
-   **Dashboard Overview**: User specific overview including trip statistics and upcoming schedules.
-   **Authentication & Authorization**: Secure JWT-based authentication and role-based access control.
-   **Image Upload**: Integrated Cloudinary support for profile and trip photo uploads.

## 🛠 Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: MongoDB with Mongoose ODM
-   **Language**: TypeScript
-   **Validation**: Zod
-   **Authentication**: JWT (JSON Web Tokens), Bcrypt
-   **File Storage**: Cloudinary, Multer

## 📂 Project Structure

```
src/
├── config/         # Configuration files (env, database, cloudinary, etc.)
├── middlewares/    # Custom middlewares (auth, upload, validation, error handling)
├── modules/        # Feature-based modules (User, Trip, Auth)
│   ├── auth/       # Authentication logic
│   ├── user/       # User management
│   └── trip/       # Trip management
├── routes/         # Central route definition
├── utils/          # Helper functions and utilities
├── app.ts          # App entry point with middleware setup
└── server.ts       # Server initialization
```

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/akashdnet/travbud-backend.git
    cd travbud-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and add the following variables:
    ```env
    NODE_ENV=development
    PORT=8000
    DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/travbud
    JWT_ACCESS_SECRET=your_jwt_secret
    JWT_ACCESS_EXPIRES_IN=1d
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Run the application:**
    ```bash
    # Development mode
    npm run dev

    # Production build
    npm run build
    npm start
    ```

## 🔗 API Endpoints

For detailed API documentation, please refer to [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Key Routes

-   **Auth**:
    -   `POST /api/auth/login`
    -   `POST /api/auth/register` (Note: Register is typically handled via user route in this setup)

-   **Users**:
    -   `POST /api/users/register` - Register a new user
    -   `GET /api/users/me` - Get current user profile & overview
    -   `GET /api/users/all-users` - Get all users (Admin)

-   **Trips**:
    -   `POST /api/trips/register` - Create a trip
    -   `GET /api/trips/all-my-trips` - Get my created trips
    -   `GET /api/trips/admin/all-trips` - Get all trips (Admin)
    -   `POST /api/trips/request/:tripId` - Request to join a trip
    -   `POST /api/trips/approve` - Approve a join request

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the ISC License.
