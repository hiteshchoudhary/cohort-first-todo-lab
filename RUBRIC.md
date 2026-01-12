# Grading Rubric - Todo API Lab

**Total Points: 100**

## How Grading Works

Your grade is determined entirely by automated tests running on GitHub Actions:
- Each test that passes earns points
- Tests run automatically when you push to GitHub
- Green checkmark in Actions tab = all tests passed = 100%
- You can resubmit as many times as you want before the deadline

## Point Breakdown

### 1. Infrastructure & Setup (15 points)

#### Health Endpoint (5 points)

**Test File**: `tests/visible/01-health.spec.js`

| Criteria                                | Points |
|-----------------------------------------|--------|
| GET /health returns 200 status          | 3      |
| Response body is `{ ok: true }`         | 2      |

**What's Being Tested:**
- Express app is correctly set up
- JSON middleware is configured
- Basic routing works

**Common Mistakes:**
- Forgetting to add express.json() middleware
- Wrong endpoint path (should be `/health` not `/api/health`)
- Returning wrong response format

---

#### Database Connection (10 points)

**Test File**: `tests/visible/02-connect.spec.js`

| Criteria                                          | Points |
|---------------------------------------------------|--------|
| connectDB successfully establishes connection     | 6      |
| connectDB throws error for missing URI            | 2      |
| connectDB throws error for empty string URI       | 2      |

**What's Being Tested:**
- MongoDB connection logic works
- URI validation is implemented
- Proper error handling for missing configuration

**Common Mistakes:**
- Not returning the connection object
- Not throwing the exact error message "MongoDB URI is required"
- Not handling empty string as invalid

---

### 2. Data Model (15 points)

**Test File**: `tests/visible/03-create.spec.js` (schema validated through create operation)

| Criteria                                                | Points |
|---------------------------------------------------------|--------|
| Schema has all required fields with correct types       | 4      |
| Title validation (required, min 3, max 120, trim)       | 4      |
| Priority enum validation (low/medium/high)              | 3      |
| Timestamps enabled (createdAt, updatedAt)               | 2      |
| Default values correct (completed: false, priority: medium, tags: []) | 2      |

**What's Being Tested:**
- Mongoose schema definition
- Field types and validation rules
- Default values
- Automatic timestamps

**Common Mistakes:**
- Wrong validation messages
- Missing `trim: true` on title
- Forgetting `timestamps: true` in schema options
- Not setting correct default values

---

### 3. Create Operation (15 points)

**Test File**: `tests/visible/03-create.spec.js`

| Criteria                                           | Points |
|----------------------------------------------------|--------|
| POST /api/todos creates todo with minimal data     | 5      |
| Returns 201 status code                            | 2      |
| Creates todo with all optional fields              | 3      |
| Validates input data                               | 3      |
| Returns proper error format for invalid data       | 2      |

**What's Being Tested:**
- Create endpoint works
- Correct HTTP status code (201 for created)
- All fields are saved correctly
- Validation errors are handled

**Common Mistakes:**
- Returning 200 instead of 201
- Not handling validation errors properly
- Wrong error format in response

---

### 4. List Operations (25 points)

**Test File**: `tests/visible/04-list.spec.js`

| Criteria                                              | Points |
|-------------------------------------------------------|--------|
| GET /api/todos returns data array and meta object     | 4      |
| Returns empty array with correct meta when no todos   | 2      |
| Pagination works (page & limit parameters)            | 5      |
| Meta calculations correct (total, page, limit, pages) | 4      |
| Filters by completed status                           | 3      |
| Filters by priority                                   | 3      |
| Search in title (case-insensitive)                    | 2      |
| Sorts by createdAt descending (newest first)          | 2      |

**What's Being Tested:**
- List endpoint with pagination
- Query parameter handling
- Filtering capabilities
- Search functionality
- Proper sorting
- Response structure with metadata

**Common Mistakes:**
- Wrong meta structure or missing fields
- Incorrect pagination math (`pages = total / limit` instead of `Math.ceil(total / limit)`)
- Case-sensitive search
- Wrong sort order (oldest first instead of newest)
- Not handling query parameters correctly

---

### 5. Get Single Todo (5 points)

**Test File**: `tests/visible/05-update-delete.spec.js`

| Criteria                                    | Points |
|---------------------------------------------|--------|
| GET /api/todos/:id returns correct todo     | 2      |
| Returns 404 for non-existent todo           | 2      |
| Returns 400 for invalid ObjectId format     | 1      |

**What's Being Tested:**
- Single todo retrieval by ID
- 404 error handling
- ObjectId validation

**Common Mistakes:**
- Not using validateObjectId middleware
- Wrong 404 error format
- Not handling invalid ObjectId format

---

### 6. Update Operations (10 points)

**Test File**: `tests/visible/05-update-delete.spec.js`

| Criteria                                      | Points |
|-----------------------------------------------|--------|
| PATCH /api/todos/:id updates fields           | 4      |
| Returns 200 with updated todo                 | 2      |
| Validates updated fields (runValidators)      | 2      |
| Only updates provided fields                  | 2      |

**What's Being Tested:**
- Update endpoint works
- Partial updates (only specified fields change)
- Validation runs on updates
- Correct response format

**Common Mistakes:**
- Forgetting `runValidators: true` option
- Not returning updated document (`new: true`)
- Updating fields that weren't provided

---

### 7. Toggle Operation (5 points)

**Test File**: `tests/visible/05-update-delete.spec.js`

| Criteria                                                | Points |
|---------------------------------------------------------|--------|
| PATCH /api/todos/:id/toggle flips completed status      | 3      |
| Can be called multiple times (true ↔ false)             | 2      |

**What's Being Tested:**
- Toggle endpoint works
- Properly flips boolean value
- Works repeatedly

**Common Mistakes:**
- Setting to true instead of toggling
- Not saving the change to database

---

### 8. Delete Operation (5 points)

**Test File**: `tests/visible/05-update-delete.spec.js`

| Criteria                                     | Points |
|----------------------------------------------|--------|
| DELETE /api/todos/:id removes todo           | 2      |
| Returns 204 status with empty body           | 2      |
| Todo is actually deleted from database       | 1      |

**What's Being Tested:**
- Delete endpoint works
- Correct status code (204 No Content)
- Empty response body
- Database deletion confirmed

**Common Mistakes:**
- Returning 200 instead of 204
- Returning the deleted todo (should be empty body)
- Not actually deleting from database

---

### 9. Error Handling (10 points)

**Test Files**: All test files validate error handling

| Criteria                                           | Points |
|----------------------------------------------------|--------|
| Error middleware returns consistent format         | 3      |
| Mongoose ValidationError handled (400 status)      | 2      |
| Mongoose CastError handled (400 status)            | 2      |
| 404 errors formatted correctly                     | 2      |
| ObjectId validation middleware works               | 1      |

**What's Being Tested:**
- Centralized error handling
- Consistent error response format
- Proper HTTP status codes
- Specific error type handling

**Required Error Format:**
```json
{
  "error": {
    "message": "Error description"
  }
}
```

**Common Mistakes:**
- Wrong error format (most common mistake!)
- Error middleware placed before routes
- Not handling Mongoose-specific errors
- Wrong status codes

---

## Grade Calculation

```
Total Score = (Passing Tests / Total Tests) × 100
```

### Weighted by Category:

- **Infrastructure & Setup**: 15% (basic setup)
- **Data Model**: 15% (schema and validation)
- **Create Operation**: 15% (POST endpoint)
- **List Operations**: 25% (most complex - pagination, filtering, search)
- **Get/Update/Delete**: 20% (remaining CRUD operations)
- **Error Handling**: 10% (proper error responses)

---

## Grade Interpretation

| Score   | Grade | Interpretation                                    |
|---------|-------|---------------------------------------------------|
| 90-100  | A     | Exceptional - All features work perfectly         |
| 80-89   | B     | Good - Core features work, minor issues           |
| 70-79   | C     | Satisfactory - Basic CRUD works, missing features |
| 60-69   | D     | Needs Improvement - Significant gaps              |
| 0-59    | F     | Unsatisfactory - Critical features not working    |

### What Each Range Typically Means:

**90-100 (A):**
- All CRUD operations work
- Pagination and filtering implemented
- Error handling consistent
- All edge cases handled

**80-89 (B):**
- Core CRUD operations work
- Pagination works but might have bugs
- Some filtering works
- Most error cases handled

**70-79 (C):**
- Basic create, read, delete work
- List endpoint works without filters
- Update has issues
- Some error handling missing

**60-69 (D):**
- Some endpoints work
- Missing functionality in multiple areas
- Error handling incomplete

**Below 60 (F):**
- Significant functionality missing or broken
- Multiple test files failing completely
- Basic setup issues

---

## Test File Mapping

| Test File                   | Primary Focus                | Points |
|-----------------------------|------------------------------|--------|
| 01-health.spec.js           | Basic Express setup          | 5      |
| 02-connect.spec.js          | Database connection          | 10     |
| 03-create.spec.js           | Model + Create operation     | 30     |
| 04-list.spec.js             | List with pagination/filters | 25     |
| 05-update-delete.spec.js    | Get, Update, Toggle, Delete  | 30     |

**Note**: Error handling is tested across all files (contributes to the 10 error handling points).

---

## Viewing Your Grade

### On GitHub:

1. Go to your repository on GitHub
2. Click the "Actions" tab
3. Click on the most recent workflow run
4. View test results:
   - ✅ Green checkmark = All tests passed = 100%
   - ❌ Red X = Some tests failed (click to see which ones)

### Locally:

```bash
npm test
```

- All tests passing = 100%
- Check terminal output for which tests failed

---

## Re-submission Policy

- You can push and resubmit as many times as you want before the deadline
- Each push triggers a new test run
- Your highest score is recorded
- No penalty for multiple submissions

### To Resubmit:

```bash
# Fix your code
# Test locally
npm test

# Commit and push
git add .
git commit -m "Fix implementation"
git push origin main

# Check GitHub Actions for new results
```

---

## Partial Credit

Partial credit is automatic based on test results:

- If 80 out of 100 tests pass, you get 80%
- If all create tests pass but list fails, you get credit for create

**No manual partial credit** - what the tests show is what you get.

---

## Academic Integrity

### Allowed:
- Collaborating on concepts and debugging strategies
- Using official documentation (Express, Mongoose, Jest)
- Asking instructors/TAs for help
- Looking at test files to understand requirements

### Not Allowed:
- Copying complete solutions from other students
- Sharing your complete solution code
- Using AI to write entire functions (understanding is key)
- Modifying test files to make them pass

### Penalties:
- First offense: Zero on assignment
- Second offense: Failing grade in course
- Serious violations: Academic disciplinary action

---

## Getting Help

### When Tests Fail:

1. **Read the test output** - It tells you what's expected vs. what you returned
2. **Check the test file** - See exactly what the test is doing
3. **Review error messages** - They often point to the exact problem
4. **Check error format** - Most failures are due to wrong error format

### Where to Get Help:

- Office hours (best for complex issues)
- Discussion forum (good for common problems)
- README.md (has troubleshooting section)
- Test file comments (explain what's being tested)

### What to Include When Asking for Help:

- Which test is failing
- Error message from test output
- What you've tried
- Relevant code snippet

---

## Tips for Success

### Before You Start:
- Read the entire README.md
- Understand the test structure
- Set up your development environment

### During Implementation:
- Implement one feature at a time
- Run tests after each feature
- Don't move on until tests pass
- Use TODO comments as a guide

### Common Pitfalls to Avoid:
1. Wrong error format - check every error response
2. Middleware order - error handlers must be last
3. Not awaiting async operations
4. Forgetting runValidators on updates
5. Wrong pagination math (use Math.ceil)

### Final Checklist:
- [ ] All tests pass locally
- [ ] Error format correct everywhere
- [ ] Pushed to GitHub
- [ ] GitHub Actions shows green checkmark
- [ ] No TODO comments left unfilled

---

## Frequently Asked Questions

**Q: Do I get partial credit if some tests pass?**
A: Yes! Your grade is proportional to tests passed.

**Q: Can I resubmit after the deadline?**
A: No, the deadline is firm. Plan to finish early and test thoroughly.

**Q: What if GitHub Actions fails but tests pass locally?**
A: Check that all files are committed. Environment should match locally and on GitHub.

**Q: Can I modify test files?**
A: No, test files are locked. You'll get zero if test files are modified.

**Q: How do I know which tests are failing?**
A: Check GitHub Actions output or run `npm test` locally.

**Q: Is there a test to check the error format?**
A: Every test that expects an error validates the format.

---

## Grade Appeals

If you believe there's a grading error:

1. **First**, verify tests pass locally with `npm test`
2. **Check** that you pushed the correct code to GitHub
3. **Review** the test output in GitHub Actions
4. **If still an issue**, contact instructor with:
   - Specific test names that you believe are incorrectly graded
   - Evidence that your implementation is correct
   - Link to your GitHub repository

**Note**: "I thought it should work this way" is not grounds for appeal. The tests define correct behavior.

---

## Resources

- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Jest Documentation](https://jestjs.io/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

**Remember**: If all tests pass, you get 100%. Focus on making tests pass!
