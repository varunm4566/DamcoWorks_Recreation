---
paths:
  - "server/routes/**"
  - "src/api/**"
---
# API Rules
- All routes must have input validation
- Always use try/catch with proper error responses
- Log all errors with console.error before responding
- JWT middleware must protect all non-public routes
