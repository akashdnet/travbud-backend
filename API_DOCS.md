# Backend API Documentation

This documentation provides details on the API endpoints, request methods, required headers, and request/response bodies for the Explore Otherside backend.

**Base URL:** `http://localhost:5000/api/v1` (Adjust port based on your local setup)

## Table of Contents
- [Authentication](#authentication)
- [User Module](#user-module)
- [Trip Module](#trip-module)
- [Website Reviews](#website-reviews)
- [Explorer Module](#explorer-module)

---

## Authentication

### Login User
*   **Endpoint:** `/auth/login`
*   **Method:** `POST`
*   **Description:** Authenticates a user and returns an access token.
*   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
*   **Response:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "User logged in successfully",
      "data": {
        "accessToken": "ey...",
        "refreshToken": "ey..." // or set in cookie
      }
    }
    ```

### Refresh Token
*   **Endpoint:** `/auth/refresh-token`
*   **Method:** `POST`
*   **Description:** Refreshes the access token using a refresh token.
*   **Body:** (Typically sent via Cookies)
    ```json
    {
      "cookies": {
        "refreshToken": "..."
      }
    }
    ```

---

## User Module

### Register User
*   **Endpoint:** `/users/register`
*   **Method:** `POST`
*   **Content-Type:** `multipart/form-data` (if uploading photo) or `application/json`
*   **Body:**
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123",
      "age": 25,
      "gender": "Male",
      "contactNumber": "01712345678",
      "role": "user", // Optional: 'user', 'guide' (default: 'user')
      "bio": "Travel enthusiast",
      "about": "I love exploring new places...",
      "travelInterests": ["Hiking", "Camping"],
      "visitedCountries": ["Nepal", "India"],
      "currentLocation": "Dhaka",
      "photo": (File) // Optional
    }
    ```

### Get My Profile
*   **Endpoint:** `/users/me`
*   **Method:** `GET`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `user`, `guide`, `admin`

### Update My Profile
*   **Endpoint:** `/users/update/me`
*   **Method:** `PATCH`
*   **Headers:** `Authorization: <token>`
*   **Content-Type:** `multipart/form-data` or `application/json`
*   **Body:**
    ```json
    {
      "name": "John Updated",
      "bio": "Updated bio..."
    }
    ```

### Get Profile Overview (Dashboard Stats)
*   **Endpoint:** `/users/profile-overview`
*   **Method:** `GET`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `user`, `guide`, `admin`
*   **Description:** Returns statistics for the dashboard (Card stats, charts, upcoming trips, history).
*   **Response:**
    ```json
    {
      "success": true,
      "data": {
        "cardStats": {
          "totalTours": 12,
          "upcoming": 2,
          "completed": 10
        },
        "chartStats": [
          { "name": "Jan", "tours": 1 },
          { "name": "Feb", "tours": 3 }
        ],
        "upcomingAdventures": [
          { "id": "trip_1", "name": "Sundarbans Tour", "date": "2024-12-10", "status": "Open" }
        ],
        "recentHistory": [
          { "id": "trip_0", "name": "Sylhet Tour", "date": "2024-10-05", "status": "Completed" }
        ]
      }
    }
    ```

### Admin: Get All Users
*   **Endpoint:** `/users/all-users`
*   **Method:** `GET`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `admin`

### Admin: Manage User (Update)
*   **Endpoint:** `/users/update/:id`
*   **Method:** `PATCH`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `admin`
*   **Body:**
    ```json
    {
      "status": "blocked", // 'active', 'blocked'
      "role": "guide"
    }
    ```

---

## Trip Module

### Create Trip (Guide Only)
*   **Endpoint:** `/trips/register`
*   **Method:** `POST`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `guide`
*   **Content-Type:** `multipart/form-data`
*   **Body:**
    ```json
    {
      "destination": "Cox's Bazar",
      "startDate": "2024-12-20",
      "endDate": "2024-12-25",
      "budget": 5000,
      "travelType": ["Bus", "Boat"],
      "description": "A relaxing trip to the longest sea beach...",
      "activities": ["Surfing", "BBQ"],
      "maxGroupSize": 15,
      "photos": (Files - max 10)
    }
    ```

### Get My Trips (Guide) / My Participated Trips (User)
*   **Endpoint:** `/trips/all-my-trips`
*   **Method:** `GET`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `user`, `guide`

### Update My Trip (Guide Only)
*   **Endpoint:** `/trips/update/:id`
*   **Method:** `PATCH`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `guide`
*   **Body:**
    ```json
    {
      "budget": 6000,
      "status": "Full"
    }
    ```

### Request to Join Trip
*   **Endpoint:** `/trips/request/:tripId`
*   **Method:** `POST`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `user`, `admin`
*   **Description:** Sends a request to join a specific trip.

### Approve Join Request (Guide Only)
*   **Endpoint:** `/trips/approve`
*   **Method:** `POST`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `guide`
*   **Body:**
    ```json
    {
      "tripId": "trip_id_here",
      "userId": "user_id_to_approve"
    }
    ```

### Get My Join Requests (User)
*   **Endpoint:** `/trips/all-my-join-requests`
*   **Method:** `GET`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `user`

### Admin: Get All Trips
*   **Endpoint:** `/trips/admin/all-trips`
*   **Method:** `GET`
*   **Headers:** `Authorization: <token>` (Optional depending on public visibility, see code)

---

## Website Reviews

### Create Review
*   **Endpoint:** `/website-reviews/create`
*   **Method:** `POST`
*   **Headers:** `Authorization: <token>`
*   **Roles:** `user`
*   **Body:**
    ```json
    {
      "rating": 5, // 1-5
      "comment": "Great platform for finding travel buddies!"
    }
    ```

### Get All Reviews
*   **Endpoint:** `/website-reviews/all`
*   **Method:** `GET`
*   **Response:**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "review_1",
          "userId": "user_1",
          "rating": 5,
          "comment": "Amazing experience!",
          "createdAt": "2024-01-01T10:00:00Z"
        }
      ]
    }
    ```

---

## Explorer Module

### Get Home Data
*   **Endpoint:** `/explorer/home`
*   **Method:** `GET`
*   **Description:** Fetches data for the home page.

### Subscribe
*   **Endpoint:** `/explorer/subscribe`
*   **Method:** `POST`
*   **Body:**
    ```json
    {
      "email": "subscriber@example.com"
    }
    ```

---

## Common Response Structure
Most successful responses will follow this format:
```json
{
  "success": true,
  "statusCode": 200, // or 201 for created
  "message": "Operation successful",
  "data": { ... } // Object or Array
}
```

## Error Response Structure
```json
{
  "success": false,
  "message": "Error message description",
  "errorMessages": [
    {
      "path": "field_name",
      "message": "Validation error details"
    }
  ],
  "stack": "..." // Only in development
}
```
