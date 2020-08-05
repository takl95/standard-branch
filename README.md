# standard-branch

A zero-config opiniated, like command line utility to create [conventional](https://conventionalcommits.org/) branches.
See also [standard-commit-2](https://www.npmjs.com/package/standard-commit-2)

- **cb**: Same as `git branch -b` but with prompt and formatting for the branch name.

## Installation
```bash
npm install -g standard-branch
```
## Usage
```bash
cb
```
## Git Alias
```bash
git config --global alias.cb "!standard-branch"
# Now you can use:
git cb
```
## Update

```bash
npm update -g standard-branch
```

## Configuration
** You can only configure with `standard-commit-2`.**
 
 See https://www.npmjs.com/package/standard-commit-2#configuration
 
you  configure standard-commit via a `.standard-commitrc` file. You should add this file to the git repo.
## Default Types
Use the suggested defaults.
* **feat**: Add a new feature (equivalent to a MINOR in Semantic Versioning).
* **fix**: Fix a bug (equivalent to a PATCH in Semantic Versioning).
* **chore**: Update something without impacting the user (ex: bump a dependency in package.json).
* **build**: Changes that affect the build system or external dependencies (ex: webpack config changes)
* **ci**: changes made to the pipeline
* **docs**: Documentation changes.
* **refactor**: Refactor code without changing public API.
* **revert**: Reverting an old commit
* **style**: Code style change (semicolon, indentation...).
* **test**: Add test to an existing feature or update a test

