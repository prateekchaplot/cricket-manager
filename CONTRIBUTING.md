# Contributing

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org). All commit messages must follow this format:

```
<type>(<optional scope>): <description>
```

Rules:

- Lowercase, imperative description; no trailing period
- Use a scope when it adds clarity, e.g. `skills(prd): ...`, `docs(readme): ...`
- Optionally add a body separated by a blank line for context

### Allowed Types

| Type | Description |
| --- | --- |
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `chore` | Maintenance tasks, tooling, dependencies |

### Examples

Good:

- `feat(auth): add session timeout`
- `fix: prevent crash on empty match list`
- `docs: describe skills in readme`

Bad:

- `Added some stuff.` (not lowercase imperative, trailing period, no type)
- `updated files` (missing type)

## CI

CI runs only on pull requests — pushes to branches do not trigger it. Open a PR against `main` to see checks run.
