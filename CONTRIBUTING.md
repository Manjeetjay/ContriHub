# Contributing to OSSBridge

First off, thank you for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to OSSBridge and its packages, which are hosted in the OSSBridge Organization on GitHub. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report for OSSBridge. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- **Check existing issues**: Before creating a bug report, please check the [issues list](issues) as you might find out that you don't need to create one.
- **Use the bug template**: When creating an issue, please use the provided BUG report template and fill it out completely.

### Suggesting Enhancements
This section guides you through submitting an enhancement suggestion for OSSBridge, including completely new features and minor improvements to existing functionality.

- **Check existing issues**: Ensure your idea hasn't already been suggested.
- **Use the feature template**: Utilize the provided FEATURE request template to ensure you're providing the best context for the feature.

## Development Workflow

### 1. Fork and Clone
1. Fork the repository on GitHub.
2. Clone your forked repository to your local machine:
   ```bash
   git clone https://github.com/YOUR_USERNAME/OSSBridge.git
   ```

### 2. Local Setup
The project uses Docker to spin up essential services like PostgreSQL, Redis, and Kafka. We recommend using Docker for local development.

1. Ensure you have Docker and Docker Compose installed.
2. Run the application stack:
   ```bash
   docker-compose up -d
   ```
3. The Backend (Spring Boot) will map to your local ports, or you can run it via your IDE (IntelliJ/Eclipse).
4. For the Frontend (React):
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 3. Branching Strategy
Create a new branch for your feature or bug fix:
- Features: `feature/short-description`
- Bug Fixes: `bugfix/short-description`
- Documentation: `docs/short-description`

```bash
git checkout -b feature/add-new-button
```

### 4. Committing Your Changes
Write clear and concise commit messages.

- Use the present tense ("Add feature" not "Added feature").
- Prepend the message with the component being affected (e.g., `[Backend] Fix auth bug` or `[Frontend] Add landing page nav`).

### 5. Open a Pull Request
1. Push your branch to your fork.
2. Open a Pull Request against the `main` branch of the upstream OSSBridge repository.
3. Use the provided Pull Request template and fill out all details.
4. Wait for a maintainer to review your code!

## Code Style
- **Backend**: We follow standard Java conventions. Format your code before opening a PR.
- **Frontend**: We use Prettier for code formatting. Run `npm run format` (if available) or ensure your editor is running Prettier before committing.

Thank you for contributing!
