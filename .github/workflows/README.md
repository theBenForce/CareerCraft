# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Career Craft application.

## Workflows

### 1. Docker Build and Publish (`docker-build-publish.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Push tags starting with `v*` (e.g., `v1.0.0`)
- Pull requests to `main` branch (test only)

**What it does:**
- Runs tests and linting
- Builds the Docker image
- Pushes to GitHub Container Registry (GHCR)
- Performs security scanning with Trivy
- Generates build attestations

**Docker Images:**
- `ghcr.io/[username]/[repo]:latest` - Latest from main branch
- `ghcr.io/[username]/[repo]:main` - Latest from main branch
- `ghcr.io/[username]/[repo]:develop` - Latest from develop branch
- `ghcr.io/[username]/[repo]:v1.0.0` - Specific version tags

### 2. Dependency and Security Checks (`dependency-security.yml`)

**Triggers:**
- Weekly schedule (Mondays at 9 AM UTC)
- Manual trigger via workflow dispatch
- Pull requests (dependency review only)

**What it does:**
- Reviews dependencies for security vulnerabilities
- Runs npm security audit
- Creates automated dependency update PRs (weekly)
- Ensures updates don't break the build

### 3. Release (`release.yml`)

**Triggers:**
- GitHub release published

**What it does:**
- Builds production Docker images
- Tags with version numbers and `stable` tag
- Deploys to production environment

## Setup Requirements

### 1. Repository Settings

No additional secrets are required! The workflows use the built-in `GITHUB_TOKEN` which automatically has permissions to:
- Read repository contents
- Write to GitHub Container Registry
- Create pull requests
- Write to security events

### 2. GitHub Container Registry

The workflows automatically push Docker images to GitHub Container Registry (GHCR). Images will be available at:
```
ghcr.io/[username]/[repository-name]
```

To pull images:
```bash
# Latest version
docker pull ghcr.io/[username]/[repository-name]:latest

# Specific version
docker pull ghcr.io/[username]/[repository-name]:v1.0.0

# Stable release
docker pull ghcr.io/[username]/[repository-name]:stable
```

### 3. Environment Configuration

For the release workflow to work with production deployments, you may want to:

1. Create a `production` environment in your repository settings
2. Add environment protection rules
3. Configure environment-specific secrets if needed

## Usage

### Building and Publishing

1. **Development builds**: Push to `develop` branch
   ```bash
   git push origin develop
   ```

2. **Production builds**: Push to `main` branch
   ```bash
   git push origin main
   ```

3. **Release builds**: Create and publish a GitHub release
   ```bash
   # Create a tag
   git tag v1.0.0
   git push origin v1.0.0
   
   # Or create a release through GitHub UI
   ```

### Manual Triggers

You can manually trigger workflows from the GitHub Actions tab:

1. Go to your repository
2. Click on "Actions" tab
3. Select the workflow you want to run
4. Click "Run workflow" button

### Monitoring

- **Build Status**: Check the Actions tab for build status
- **Security Scans**: View security scan results in the Security tab
- **Docker Images**: View published images in the Packages section

## Troubleshooting

### Common Issues

1. **Permission denied when pushing to GHCR**
   - Ensure the repository has package write permissions
   - Check that GITHUB_TOKEN has the required scopes

2. **Build failures**
   - Check the build logs in the Actions tab
   - Ensure all tests pass locally first
   - Verify Docker build works locally

3. **Dependency update failures**
   - Check for breaking changes in updated packages
   - Review the automated PR and test changes locally

### Local Testing

Test Docker builds locally before pushing:

```bash
# Build the image
docker build -t career-craft:test .

# Run the container
docker run -p 3000:3000 career-craft:test
```

## Security Features

- **Dependency scanning**: Weekly automated checks
- **Container scanning**: Trivy security scans on all builds
- **Build attestations**: Cryptographic proof of build integrity
- **SARIF uploads**: Security findings integrated with GitHub Security tab

## Multi-platform Support

All Docker images are built for both:
- `linux/amd64` (Intel/AMD 64-bit)
- `linux/arm64` (ARM 64-bit, including Apple Silicon)

This ensures compatibility across different hosting platforms and development machines.
