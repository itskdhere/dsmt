# Contributing to Docker Storage Migration Tool (DSMT)

Thank you for considering contributing to DSMT! This document provides guidelines and instructions to help you contribute effectively.

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

- Check the [issue tracker](https://github.com/itskdhere/dsmt/issues) to see if the issue has already been reported
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/itskdhere/dsmt/issues/new?template=bug_report.md)

When filing a bug report, please include:

- A clear and descriptive title
- Steps to reproduce the issue
- Expected and actual behavior
- System information (OS, Docker version, Node.js version)
- Any relevant logs or error messages

### Suggesting Features

We welcome feature suggestions! [Open an issue](https://github.com/itskdhere/dsmt/issues/new?template=feature_request.md) with your idea, providing as much context and detail as possible.

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature or bugfix
3. Make your changes
4. Ensure your code follows the project style and passes all tests
5. Submit a pull request

## Development Setup

```bash
# Clone your fork of the repo
git clone https://github.com/YOUR-USERNAME/dsmt.git
cd dsmt

# Install dependencies
npm install

# Start development mode (watches for changes)
npm run dev

# Link the package globally for testing
npm link
```

## Project Structure

- cli.ts - CLI entry point
- cmd - Command implementations
- docker - Docker API wrapper
- types - TypeScript type definitions

## Coding Guidelines

- Use TypeScript for all new code
- Follow existing code style (2 spaces for indentation)
- Add appropriate error handling and logging
- Document new functions and methods

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests liberally after the first line

## Testing Your Changes

Please ensure your changes work properly with:

- Different types of Docker volumes
- Bind mounts with various path structures
- Different operating systems (if possible)

## Submitting Changes

1. Push your changes to your fork
2. Submit a pull request to the main repository
3. The title of your PR should clearly describe the change
4. Link any relevant issues in the PR description

## License

By contributing to DSMT, you agree that your contributions will be licensed under the project's MIT License.

## Questions?

Feel free to open an issue if you have any questions about contributing.

Thank you for contributing to DSMT!
