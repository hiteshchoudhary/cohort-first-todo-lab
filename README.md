# Todo API Lab - Express + MongoDB CRUD

Build a complete REST API for managing todos using Express and MongoDB with Mongoose. This lab teaches backend fundamentals through test-driven development.

## What You'll Learn

- Express.js application architecture
- MongoDB/Mongoose schemas and validation
- REST API design patterns
- Error handling middleware
- Test-driven development (TDD)
- CRUD operations with pagination and filtering

## Quick Start

### 1. Start MongoDB (Choose One Option)

#### Option A: Using Docker (Recommended)

If you have Docker installed, this is the easiest way:

```bash
# Start MongoDB in Docker
docker-compose up -d

# Check if it's running
docker-compose ps

# View logs (optional)
docker logs todo-api-mongodb

# Stop MongoDB when done
docker-compose down
```

The MongoDB container will:
- Run on `localhost:27017` (default MongoDB port)
- Create a database called `todo_api_lab`
- Persist data in a Docker volume (survives container restarts)
- Automatically restart if it crashes

**First time using Docker?** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) first.

#### OR

### Option 2: Use Your Own MongoDB

If you have MongoDB installed locally or want to use a cloud service (MongoDB Atlas):

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `MONGO_URI` in `.env` with your MongoDB connection string:
   ```
   MONGO_URI=mongodb://localhost:27017/todo_api_lab
   # or for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/todo_api_lab
   ```

**Note:** Tests don't need a running MongoDB - they use an in-memory database automatically.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

All tests will fail initially - that's expected!

```bash
npm test
```

Tests use an in-memory MongoDB instance, so you don't need Docker running for tests!

### 4. Implement Features

Follow the TODO comments in each file. Implement features step by step, running tests after each section.

### 5. Verify Progress

Re-run tests until all pass. Each test file corresponds to a feature:

```bash
npm test -- 01-health    # Test health endpoint
npm test -- 02-connect   # Test database connection
npm test -- 03-create    # Test create operation
npm test -- 04-list      # Test list with pagination
npm test -- 05-update    # Test update and delete
```

## Project Structure

```
first-crud-app/
├── src/
│   ├── app.js                   # Express app factory (TODO)
│   ├── server.js                # Server startup (mostly complete)
│   ├── db/
│   │   └── connect.js           # Database connection (TODO)
│   ├── models/
│   │   └── todo.model.js        # Todo schema (TODO)
│   ├── controllers/
│   │   └── todo.controller.js   # Business logic (TODO)
│   ├── routes/
│   │   └── todo.routes.js       # HTTP routes (TODO)
│   └── middlewares/
│       ├── error.middleware.js           # Error handler (TODO)
│       ├── notFound.middleware.js        # 404 handler (TODO)
│       └── validateObjectId.middleware.js # ID validation (TODO)
├── tests/
│   ├── __helpers__/
│   │   └── setupTestDb.js       # Test utilities (provided)
│   └── visible/
│       ├── 01-health.spec.js
│       ├── 02-connect.spec.js
│       ├── 03-create.spec.js
│       ├── 04-list.spec.js
│       └── 05-update-delete.spec.js
├── .github/
│   └── workflows/
│       └── autograde.yml        # GitHub Actions autograding
├── docker-compose.yml           # Docker setup for MongoDB
├── package.json
├── jest.config.js
├── .env.example
├── .gitignore
├── README.md
├── SOLUTION.md                  # Complete solution (instructors only)
└── RUBRIC.md                    # Grading criteria
```

## Implementation Guide

Follow these steps in order for the best learning experience:

### Step 1: Health Check (Start Here!)

**File**: `src/app.js`

- Create Express app factory function
- Add JSON middleware
- Add GET /health endpoint that returns `{ ok: true }`

**Test**: `npm test -- 01-health`

### Step 2: Database Connection

**File**: `src/db/connect.js`

- Implement `connectDB` function
- Validate MongoDB URI parameter
- Connect using Mongoose
- Return connection object

**Test**: `npm test -- 02-connect`

### Step 3: Todo Model

**File**: `src/models/todo.model.js`

Define the Todo schema with these fields:
- `title` - String (required, 3-120 chars, trimmed)
- `completed` - Boolean (default: false)
- `priority` - Enum: low/medium/high (default: medium)
- `tags` - Array of strings (max 10)
- `dueDate` - Date (optional)
- Enable timestamps (createdAt, updatedAt)
- Add index: `{ completed: 1, createdAt: -1 }`

**Test**: `npm test -- 03-create` (schema is tested through create operation)

### Step 4: Create Operation

**Files**:
- `src/controllers/todo.controller.js` - Implement `createTodo`
- `src/routes/todo.routes.js` - Define POST / route

Create a todo from request body and return 201 status.

**Test**: `npm test -- 03-create`

### Step 5: List Operations

**File**: `src/controllers/todo.controller.js` - Implement `listTodos`

Requirements:
- Support pagination (page, limit)
- Filter by completed status
- Filter by priority
- Search in title (case-insensitive)
- Sort by createdAt descending (newest first)
- Return `{ data: [...], meta: { total, page, limit, pages } }`

**Test**: `npm test -- 04-list`

### Step 6: Update & Delete

**Files**:
- `src/controllers/todo.controller.js` - Implement remaining functions:
  - `getTodo` - Get single todo by ID
  - `updateTodo` - Update todo fields
  - `toggleTodo` - Toggle completed status
  - `deleteTodo` - Remove todo
- `src/middlewares/validateObjectId.middleware.js` - Validate MongoDB ObjectIds
- `src/routes/todo.routes.js` - Define remaining routes

**Test**: `npm test -- 05-update`

### Step 7: Error Handling

**Files**:
- `src/middlewares/error.middleware.js` - Handle all errors
- `src/middlewares/notFound.middleware.js` - Handle 404s
- `src/app.js` - Wire up middleware (order matters!)

Error handlers must use this exact format:
```json
{
  "error": {
    "message": "Error description"
  }
}
```

**Test**: `npm test` (all tests validate error handling)

## API Endpoints

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | /health               | Health check                         |
| POST   | /api/todos            | Create new todo                      |
| GET    | /api/todos            | List todos (with filters/pagination) |
| GET    | /api/todos/:id        | Get single todo                      |
| PATCH  | /api/todos/:id        | Update todo                          |
| PATCH  | /api/todos/:id/toggle | Toggle completed status              |
| DELETE | /api/todos/:id        | Delete todo                          |

### Query Parameters (GET /api/todos)

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `completed` - Filter by completion status (true/false)
- `priority` - Filter by priority (low/medium/high)
- `search` - Search in title (case-insensitive)

**Example**:
```
GET /api/todos?page=2&limit=5&priority=high&completed=false
```

## Required Error Format

**CRITICAL**: All errors MUST use this exact format:

```json
{
  "error": {
    "message": "Description of what went wrong"
  }
}
```

This format is validated in every test. If your error format is wrong, tests will fail!

## Testing Strategy

Tests are numbered to guide your implementation order:

1. **01-health.spec.js** - Basic Express setup
2. **02-connect.spec.js** - Database connection
3. **03-create.spec.js** - Create todos + model validation
4. **04-list.spec.js** - List, pagination, filtering
5. **05-update-delete.spec.js** - Get, update, toggle, delete

### Running Tests

**All tests**:
```bash
npm test
```

**Specific test file**:
```bash
npm test -- 01-health
npm test -- 02-connect
npm test -- 03-create
npm test -- 04-list
npm test -- 05-update-delete
```

**Watch mode** (auto-rerun on save):
```bash
npm test -- --watch
```

**With coverage**:
```bash
npm test -- --coverage
```

## Grading

Your grade is based entirely on automated test results:

- All tests pass = 100%
- Partial passes = proportional credit
- Tests run automatically on GitHub Actions when you push

### Point Breakdown (100 total):

- Infrastructure & Setup: 15 points
- Data Model: 15 points
- Create Operation: 15 points
- List Operations: 25 points
- Get/Update/Delete: 20 points
- Error Handling: 10 points

### Viewing Your Grade

1. Push your code to GitHub
2. Go to the "Actions" tab in your repository
3. Click on the most recent workflow run
4. Green checkmark = all tests passed = 100%
5. Red X = some tests failed (click to see which)

## Common Pitfalls

### 1. Wrong Error Format
**Problem**: Using `res.json({ message: "error" })` instead of `{ error: { message: "..." } }`

**Fix**: Always use:
```javascript
res.status(400).json({
  error: { message: "Your error message" }
});
```

### 2. Middleware Order
**Problem**: Error middleware before routes, or routes after notFound

**Fix**: Follow this order in app.js:
```javascript
app.use(express.json());      // 1. Parse JSON
app.get("/health", ...);      // 2. Routes
app.use("/api/todos", ...);   // 3. More routes
app.use(notFound);            // 4. 404 handler
app.use(errorHandler);        // 5. Error handler (LAST!)
```

### 3. Not Awaiting Database Operations
**Problem**: Forgetting `await` on async operations

**Fix**:
```javascript
await connectDB(uri);         // ✅ Correct
connectDB(uri);               // ❌ Wrong - race condition
```

### 4. Missing runValidators on Update
**Problem**: Updates bypass schema validation

**Fix**:
```javascript
Todo.findByIdAndUpdate(id, updates, {
  new: true,
  runValidators: true  // ← Required!
});
```

### 5. Pagination Math Errors
**Problem**: Wrong pages calculation

**Fix**:
```javascript
const pages = Math.ceil(total / limit);  // ✅ Correct
const pages = total / limit;             // ❌ Wrong
```

### 6. Invalid ObjectId Crashes Server
**Problem**: Not validating ObjectId before querying

**Fix**: Use `validateObjectId` middleware on routes with `:id` parameter

## Development Workflow

### Local Development

```bash
# 1. Start MongoDB (using Docker - recommended)
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Run in development mode (auto-restart on changes)
npm run dev

# 4. Run tests (tests use in-memory DB, Docker not needed)
npm test

# 5. Run tests in watch mode
npm test -- --watch

# When done, stop MongoDB
docker-compose down
```

### Docker Commands

**Start MongoDB**:
```bash
docker-compose up -d
```

**Check status**:
```bash
docker-compose ps
docker-compose logs mongodb
```

**Stop MongoDB** (keeps data):
```bash
docker-compose down
```

**Stop and delete all data**:
```bash
docker-compose down -v
```

**Restart MongoDB**:
```bash
docker-compose restart
```

### Environment Variables

If NOT using Docker, create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Contents:
```
MONGO_URI=mongodb://localhost:27017/todo_api_lab
PORT=3000
NODE_ENV=development
```

**Note**:
- Tests don't need `.env` - they use an in-memory database
- With Docker Compose, the default connection string works automatically

## Submission

### Before Submitting

1. Run all tests locally: `npm test`
2. Verify all tests pass
3. Review your code for any TODOs you missed

### Submit Your Work

```bash
git add .
git commit -m "Complete Todo API lab"
git push origin main
```

### After Pushing

1. Go to your repository on GitHub
2. Check the "Actions" tab
3. Wait for the workflow to complete
4. Verify green checkmark (all tests passed)

## Resources

### Documentation
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Mongoose Documentation](https://mongoosejs.com/docs/guide.html)
- [Mongoose Validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose Queries](https://mongoosejs.com/docs/queries.html)

### Tutorials
- [REST API Best Practices](https://restfulapi.net/)
- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [Jest Documentation](https://jestjs.io/docs/getting-started) - Testing framework

## Getting Help

### If You're Stuck:

1. **Read the TODO comments** - They contain detailed requirements
2. **Check the test that's failing** - Test code shows expected behavior
3. **Review error messages** - They often tell you exactly what's wrong
4. **Check the error format** - Most failures are due to wrong error format
5. **Ask for help** - Reach out to your instructor or TA

### Debugging Tips:

```javascript
// Add console.logs to see what's happening
console.log("Request body:", req.body);
console.log("Query params:", req.query);
console.log("Found todo:", todo);

// Check what data is being saved
const todo = await Todo.create({ title: "Test" });
console.log("Created todo:", todo);
```

## Bonus Challenges (Optional)

Not graded, but great for learning:

1. **Add more filtering**:
   - Filter by tags
   - Filter by due date range
   - Combined filters

2. **Add sorting options**:
   - Sort by priority
   - Sort by due date
   - Sort by title

3. **Add validation middleware**:
   - Validate request body before controller
   - Sanitize user input

4. **Add more features**:
   - Bulk operations (delete/update multiple)
   - Todo categories
   - Todo notes field

## Troubleshooting

### Tests Fail with "Cannot find module"
**Fix**: Run `npm install` to install dependencies

### Tests Timeout
**Fix**: Make sure you're awaiting all async operations

### "ValidationError" in tests
**Fix**: Check your schema validation rules match requirements

### "Invalid id" errors
**Fix**: Make sure validateObjectId middleware is used on :id routes

### GitHub Actions fails but tests pass locally
**Fix**: Commit all files, including test files and config

### Docker Issues

**Docker Compose not found**:
```bash
# Install Docker Desktop from https://www.docker.com/products/docker-desktop/
# Verify installation:
docker --version
docker-compose --version
```

**Port 27017 already in use**:
```bash
# Check what's using the port
lsof -i :27017  # macOS/Linux
netstat -ano | findstr :27017  # Windows

# Stop local MongoDB service if running
sudo systemctl stop mongodb  # Linux
brew services stop mongodb-community  # macOS
```

**Can't connect to MongoDB in Docker**:
```bash
# Check if container is running
docker-compose ps

# Check container logs
docker-compose logs mongodb

# Restart container
docker-compose restart

# If all else fails, recreate container
docker-compose down -v
docker-compose up -d
```

**Docker daemon not running**:
- Start Docker Desktop application
- Wait for it to fully start (whale icon in system tray)
- Try command again

## Academic Integrity

- You may collaborate on concepts
- You must write your own code
- Do not share complete solutions
- Do not modify test files
- Copying solutions = zero credit

## License

This lab is part of your coursework. All rights reserved.

---

**Happy coding!** Remember: if tests pass, you're done! 🎉
