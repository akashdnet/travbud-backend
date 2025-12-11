# Add Query Features to Trip and User Modules

## Overview

Add pagination, search term, sorting, and filtering capabilities to the following endpoints:
- **Trip Module**: `GET /api/v1/trips/all-my-trips` (user's own trips)
- **Trip Module**: `GET /api/v1/trips/admin/all-trips` (admin - all trips)
- **User Module**: `GET /api/v1/users/all-users` (admin - all users)

## Query Parameters

All endpoints will support the following query parameters:

### Pagination
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

### Search
- `search`: Search term for text-based fields
  - **Trip**: Search in `destination`, `description`
  - **User**: Search in `name`, `email`, `currentLocation`

### Sorting
- `sortBy`: Field to sort by (default: `createdAt`)
- `sortOrder`: Sort direction - `asc` or `desc` (default: `desc`)

### Filtering
- **Trip-specific filters**:
  - `status`: Filter by trip status (`Open`, `Full`, `Completed`, `Cancelled`)
  - `minBudget`: Minimum budget filter
  - `maxBudget`: Maximum budget filter
  - `travelType`: Filter by travel type (can be comma-separated for multiple)
  - `startDate`: Filter trips starting after this date
  - `endDate`: Filter trips ending before this date

- **User-specific filters**:
  - `role`: Filter by user role (`user`, `admin`)
  - `status`: Filter by user status (`active`, `blocked`)
  - `gender`: Filter by gender (`Male`, `Female`)
  - `minAge`: Minimum age filter
  - `maxAge`: Maximum age filter

## Proposed Changes

### Trip Module

#### [MODIFY] [trip.service.ts](file:///d:/lab/nextlevel/travbud-backend/src/modules/trip/trip.service.ts)

**Changes to `getAllTrips` function**:
- Add query parameters interface for type safety
- Build dynamic MongoDB query based on filters
- Implement search using `$regex` for destination and description
- Add budget range filtering
- Add travel type filtering
- Add date range filtering
- Add status filtering
- Implement sorting with `sortBy` and `sortOrder`
- Implement pagination with `skip` and `limit`
- Return paginated response with metadata (total count, current page, total pages)

**Changes to `getAllMyTrips` function**:
- Similar to `getAllTrips` but filter by `userId` first
- Support same query parameters (search, sort, filter, pagination)
- Return paginated response with metadata

#### [MODIFY] [trip.controller.ts](file:///d:/lab/nextlevel/travbud-backend/src/modules/trip/trip.controller.ts)

**Changes to `getAllTrips` controller**:
- Extract query parameters from `req.query`
- Pass query parameters to service layer
- Return paginated response with metadata

**Changes to `getAllMyTrips` controller**:
- Extract query parameters from `req.query`
- Pass userId and query parameters to service layer
- Return paginated response with metadata

---

### User Module

#### [MODIFY] [user.service.ts](file:///d:/lab/nextlevel/travbud-backend/src/modules/user/user.service.ts)

**Changes to `getAllUsers` function**:
- Add query parameters interface for type safety
- Build dynamic MongoDB query based on filters
- Implement search using `$regex` for name, email, currentLocation
- Add role filtering
- Add status filtering
- Add gender filtering
- Add age range filtering
- Implement sorting with `sortBy` and `sortOrder`
- Implement pagination with `skip` and `limit`
- Return paginated response with metadata (total count, current page, total pages)

#### [MODIFY] [user.controller.ts](file:///d:/lab/nextlevel/travbud-backend/src/modules/user/user.controller.ts)

**Changes to `getAllUsers` controller**:
- Extract query parameters from `req.query`
- Pass query parameters to service layer
- Return paginated response with metadata

---

## Response Format

All endpoints will return responses in this format:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

## Verification Plan

### Manual Testing

Since there are no existing automated tests in the project, verification will be done through manual API testing using tools like Postman, Thunder Client, or curl.

#### Test Cases for Trip Endpoints

**1. Test Pagination - `GET /api/v1/trips/all-my-trips`**
```bash
# Test default pagination
GET /api/v1/trips/all-my-trips

# Test custom page and limit
GET /api/v1/trips/all-my-trips?page=2&limit=5
```

**2. Test Search - `GET /api/v1/trips/all-my-trips`**
```bash
# Search by destination
GET /api/v1/trips/all-my-trips?search=Paris

# Search by description content
GET /api/v1/trips/all-my-trips?search=adventure
```

**3. Test Sorting - `GET /api/v1/trips/all-my-trips`**
```bash
# Sort by budget ascending
GET /api/v1/trips/all-my-trips?sortBy=budget&sortOrder=asc

# Sort by startDate descending
GET /api/v1/trips/all-my-trips?sortBy=startDate&sortOrder=desc
```

**4. Test Filtering - `GET /api/v1/trips/all-my-trips`**
```bash
# Filter by status
GET /api/v1/trips/all-my-trips?status=Open

# Filter by budget range
GET /api/v1/trips/all-my-trips?minBudget=1000&maxBudget=5000

# Filter by travel type
GET /api/v1/trips/all-my-trips?travelType=Adventure,Culture
```

**5. Test Combined Query - `GET /api/v1/trips/all-my-trips`**
```bash
# Combine search, filter, sort, and pagination
GET /api/v1/trips/all-my-trips?search=beach&status=Open&sortBy=budget&sortOrder=asc&page=1&limit=10
```

**6. Test Admin All Trips - `GET /api/v1/trips/admin/all-trips`**
```bash
# Same tests as above but for admin endpoint
GET /api/v1/trips/admin/all-trips?search=Paris&status=Open&page=1&limit=10
```

#### Test Cases for User Endpoints

**1. Test Pagination - `GET /api/v1/users/all-users`**
```bash
# Test default pagination
GET /api/v1/users/all-users

# Test custom page and limit
GET /api/v1/users/all-users?page=2&limit=20
```

**2. Test Search - `GET /api/v1/users/all-users`**
```bash
# Search by name
GET /api/v1/users/all-users?search=John

# Search by email
GET /api/v1/users/all-users?search=example.com
```

**3. Test Sorting - `GET /api/v1/users/all-users`**
```bash
# Sort by name ascending
GET /api/v1/users/all-users?sortBy=name&sortOrder=asc

# Sort by age descending
GET /api/v1/users/all-users?sortBy=age&sortOrder=desc
```

**4. Test Filtering - `GET /api/v1/users/all-users`**
```bash
# Filter by role
GET /api/v1/users/all-users?role=user

# Filter by status
GET /api/v1/users/all-users?status=active

# Filter by gender
GET /api/v1/users/all-users?gender=Male

# Filter by age range
GET /api/v1/users/all-users?minAge=25&maxAge=35
```

**5. Test Combined Query - `GET /api/v1/users/all-users`**
```bash
# Combine search, filter, sort, and pagination
GET /api/v1/users/all-users?search=John&role=user&status=active&sortBy=age&sortOrder=asc&page=1&limit=10
```

### Expected Outcomes

- All endpoints should return paginated results with correct metadata
- Search should work case-insensitively and match partial strings
- Sorting should work in both ascending and descending order
- Filters should correctly narrow down results
- Combining multiple query parameters should work correctly
- Invalid query parameters should be handled gracefully (use defaults)
- Empty results should return empty array with correct pagination metadata

### Manual Testing Steps

1. Start the development server: `npm run dev`
2. Use Postman/Thunder Client to test each endpoint with various query combinations
3. Verify response format matches the expected structure
4. Verify pagination metadata is accurate (total, page, limit, totalPages)
5. Verify search returns relevant results
6. Verify sorting orders results correctly
7. Verify filters narrow down results as expected
8. Test edge cases (page=0, limit=0, invalid sortBy field, etc.)
