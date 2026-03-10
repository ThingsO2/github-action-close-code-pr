# github-action-close-code-pr

GitHub Action to automatically close and merge the original code Pull Request when a deployment/manifest Pull Request is merged.

## Features

- **Automatic Merging**: When a manifest PR is merged (e.g., deployment to an environment), this action finds the original code PR and merges it automatically.
- **Label Synchronization**: Uses labels to identify associated PRs across repositories.
- **Status Comments**: If there are other open PRs for the same environment/labels, it will post a comment on the original code PR notifying that it's waiting for other merges before final completion.
- **Actor Mentions**: Mentions the person who triggered the merge in the status comments for better visibility.

## Inputs

- `pr_number`: The PR number that triggered the action.
- `repo_name`: The repository name where the PR is located.
- `owner`: The owner of the repository.

## Environment Variables

- `GITHUB_TOKEN`: A GitHub token with permissions to read PRs, post comments, and merge PRs.
- `GITHUB_ACTOR`: Used to mention the user in comments (provided automatically by GitHub Actions).
