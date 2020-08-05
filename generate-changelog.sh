baseurl=$(git remote get-url origin | sed "s/git@//g" | sed "s/\.git//g" | sed "s/:/\//g" | sed "s/^/https:\/\//")
auto-changelog --commit-url "$baseurl/commit/{id}" --starting-version v1.0.0 --config autochangelog.config.json --template changelog-template.hbs --breaking-pattern "Breaking Change:" --output CHANGELOG.md --issue-pattern AMS-\\d{4} --issue-url https://ats.anexia-it.com/browse/{id} --commit-limit false --sort-commits date-desc --ignore-commit-pattern "chore: Release v"

