# Contributing to Promptly

Thank you for your interest in contributing to Promptly! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Code Style Guidelines](#code-style-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Code of Conduct

This project follows a simple code of conduct:

- Be respectful and inclusive
- Be constructive in feedback
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/promptly.git
   cd promptly
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development servers:
   ```bash
   npm run dev
   ```

### Project Structure

```
promptly/
├── apps/
│   ├── web/                 # Next.js website
│   └── extension/           # Browser extension
├── docs/                    # Documentation
└── scripts/                 # Build scripts
```

## How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes**: Fix issues in the codebase
- **New features**: Add new functionality
- **Documentation**: Improve or add documentation
- **UI/UX improvements**: Enhance the user interface
- **Performance improvements**: Optimize code performance
- **Testing**: Add or improve tests

### Areas That Need Help

- **AI Provider Support**: Add support for new AI providers
- **Platform Support**: Add support for new AI platforms
- **UI/UX**: Improve the extension popup and website design
- **Documentation**: Improve setup guides and API documentation
- **Testing**: Add automated tests
- **Performance**: Optimize extension performance
- **Accessibility**: Improve accessibility features

## Code Style Guidelines

### General Guidelines

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Write clear, self-documenting code
- Add comments for complex logic
- Use meaningful variable and function names

### TypeScript

- Use strict type checking
- Prefer interfaces over types when possible
- Use proper error handling with try-catch blocks
- Avoid `any` type unless absolutely necessary

### React/Next.js

- Use functional components with hooks
- Prefer `const` over `let` when possible
- Use proper dependency arrays in useEffect
- Follow Next.js best practices

### Extension Code

- Follow Chrome Extension Manifest V3 guidelines
- Use proper error handling for API calls
- Implement proper cleanup in event listeners
- Follow security best practices

## Pull Request Process

### Before Submitting

1. **Test your changes**: Make sure your changes work as expected
2. **Check for linting errors**: Run `npm run lint` and fix any issues
3. **Update documentation**: Update relevant documentation if needed
4. **Write a clear description**: Explain what your PR does and why

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested locally
- [ ] Added tests (if applicable)
- [ ] All existing tests pass

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
- [ ] My changes generate no new warnings
```

### Review Process

1. **Automated checks**: All automated checks must pass
2. **Code review**: At least one maintainer will review your code
3. **Testing**: Your changes will be tested by maintainers
4. **Approval**: Once approved, your PR will be merged

## Reporting Issues

### Before Reporting

1. Check if the issue already exists
2. Try the latest version
3. Check the documentation
4. Search existing discussions

### Issue Template

When reporting bugs, please include:

- **Description**: Clear description of the issue
- **Steps to reproduce**: Detailed steps to reproduce the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened
- **Environment**: Browser, OS, extension version
- **Screenshots**: If applicable, include screenshots
- **Logs**: Include any relevant console logs

### Feature Requests

For feature requests, please include:

- **Description**: Clear description of the feature
- **Use case**: Why would this feature be useful?
- **Proposed solution**: How do you think this should work?
- **Alternatives**: Any alternative solutions you've considered?

## Development Workflow

### Branch Naming

Use descriptive branch names:
- `feature/add-gemini-support`
- `fix/optimization-bug`
- `docs/update-readme`
- `refactor/cleanup-api-calls`

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add support for Gemini API`
- `fix: resolve optimization timeout issue`
- `docs: update installation instructions`
- `refactor: simplify AI provider selection`

### Testing

- Test your changes on multiple browsers
- Test with different AI providers
- Test edge cases and error conditions
- Test performance impact

## Getting Help

If you need help:

1. Check the documentation
2. Search existing issues and discussions
3. Ask in GitHub Discussions
4. Open a new issue with the "question" label

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project README (for significant contributions)

## License

By contributing to Promptly, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Promptly! 🚀
