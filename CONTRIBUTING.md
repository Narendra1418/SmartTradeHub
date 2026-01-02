# Contributing to SmartTradeHub

Thank you for considering contributing to SmartTradeHub! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, Node version, etc.)

### Suggesting Features

1. Check if the feature has been suggested
2. Create an issue with:
   - Clear use case
   - Expected behavior
   - Potential implementation approach

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following our coding standards
4. Write or update tests as needed
5. Update documentation if required
6. Commit with clear messages: `git commit -m 'Add feature: description'`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request

## Development Setup

See [README.md](README.md) for detailed setup instructions.

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Follow Airbnb style guide
- Use meaningful variable names
- Add JSDoc comments for functions
- Handle errors properly
- Write unit tests

### React/Next.js
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Add PropTypes or TypeScript types
- Follow React best practices

### Python
- Follow PEP 8 style guide
- Use type hints
- Add docstrings
- Write unit tests

### General
- Keep functions small and focused
- Write self-documenting code
- Add comments for complex logic
- Avoid code duplication
- Follow DRY principle

## Testing

- Write tests for new features
- Maintain or improve test coverage
- Run tests before submitting PR:
  ```bash
  # Backend
  cd backend && npm test
  
  # Frontend
  cd frontend && npm test
  
  # ML Service
  cd ml-service && pytest
  ```

## Commit Messages

Format: `<type>: <subject>`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/tooling changes

Examples:
```
feat: add portfolio analytics dashboard
fix: resolve authentication token expiry issue
docs: update API documentation for market endpoints
```

## Pull Request Process

1. Update README.md with any new features
2. Update API documentation if endpoints changed
3. Ensure all tests pass
4. Request review from maintainers
5. Address review comments
6. Squash commits if requested
7. Maintainer will merge when approved

## Project Structure

```
SmartTradeHub/
├── backend/          # Node.js API
├── frontend/         # Next.js app
├── ml-service/       # Python ML service
├── infra/           # Deployment configs
└── docs/            # Documentation
```

## Questions?

Feel free to open an issue or reach out to the maintainers.

Thank you for contributing! 🎉
