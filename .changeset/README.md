# Changesets

This folder is managed by [changesets](https://github.com/changesets/changesets). It records intent-to-release notes so version bumps and the CHANGELOG are derived from PRs, not hand-edited.

## Adding a changeset

When your change is user-facing, run:

```bash
bun run changeset
```

Pick the bump type (patch / minor / major following [semver](https://semver.org)) and write a one-line summary. This creates a markdown file here that you commit alongside your change.

## Releasing

```bash
bun run changeset:version   # consumes pending changesets, bumps version + CHANGELOG
bun run changeset:publish   # publishes (only relevant if this template is ever distributed to a registry)
```

> This is a starter template (`"private": true`), so `changeset:publish` is wired for completeness but isn't used unless you flip the package public. `changeset:version` is still useful on its own for a versioned CHANGELOG.
