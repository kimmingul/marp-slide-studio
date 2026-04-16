# CI Scripts

## `render-all.sh`
Local smoke test. Renders every deck under `slides/` and fails non-zero on any error.

```bash
bash scripts/ci/render-all.sh          # HTML only
bash scripts/ci/render-all.sh --pdf    # + PDF
```

Run before pushing to catch broken markdown/CSS before CI does.

## `screenshot-diff.mjs`
Compare per-slide PNGs between two directories using pixelmatch.

```bash
node scripts/ci/screenshot-diff.mjs <base-dir> <head-dir> <out-dir> <slug>
```

Outputs a GitHub-flavored markdown table to stdout with per-slide status (unchanged / changed / new / removed / size-change) and pixel-diff percentages. Diff PNGs written to `<out-dir>`.

## GitHub Actions

The `.github/workflows/slide-ci.yml` workflow:

1. Detects changed decks on PR (`slides/*/deck.md`, `slides/*/theme.css`)
2. Renders each to HTML
3. Captures per-slide 1920×1080 screenshots with Playwright
4. Diffs against the base branch's screenshots
5. Posts a comment on the PR with the per-slide change table
6. Uploads HTML/PDF/PPTX/PNGs as an artifact

### Required setup

- Enable GitHub Actions for the repository.
- In repo settings, grant Actions write access to PR comments: **Settings → Actions → General → Workflow permissions → Read and write**.
- Commit your deck's `out/screenshots/` to get a baseline. (Normally excluded by `.gitignore` — CI decks need an exception.)

### Baseline strategy

The `.gitignore` excludes `slides/*/out/` and `slides/*/.qa-log.md` to keep repos clean. For CI diff to work, you need the screenshots committed on the base branch.

Options:

**A. Commit only screenshots, not PDFs.** In your project's `.gitignore`:
```
slides/*/out/deck.html
slides/*/out/deck.pdf
slides/*/out/deck.pptx
# but DO commit screenshots
!slides/*/out/screenshots/
```

**B. Approve-to-update flow.** PR comment shows pixel diff. Reviewer runs a one-click "Update baselines" workflow (see `update-baselines.yml` — add as a separate workflow if you want this pattern) to regenerate and commit screenshots to the PR branch.

**C. First-time deck.** If a deck has no baseline yet, CI reports "(new deck) — no baseline to compare" for that slug. After the PR merges, the next PR will have a baseline.

### Dispatching manually

```bash
# From the Actions tab → slide-ci → Run workflow → input a slug
```

Useful for re-running after fixing fonts or after a theme change that affects all decks.
