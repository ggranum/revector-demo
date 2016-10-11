#!/usr/bin/env bash
# npm publish with goodies
# prerequisites:
# Create a github access token [https://github.com/settings/tokens] and save it in a file named 'generate-changelog-token.local.txt'
# Run this script with required argument `patch`/`minor`/`major`/`<version>`
# defaults to conventional-recommended-bump
# and optional argument preset `angular`/ `jquery` ...
# defaults to conventional-commits-detector

logAndExit () {
    echo >&2 "$@"
    exit 1
}

[ "$#" -ge 1 ] || logAndExit "At least 1 argument required, $# provided"

githubToken=$(cat ./generate-changelog-token.local.txt) &&
  cp package.json _package.json &&
  preset=$(./node_modules/.bin/conventional-commits-detector) &&
  echo 'Using preset: ' $preset &&
  bump=$1 &&
  echo 'Bumping ' $bump '. Running npm --no-git-tag-version' &&
  npm --no-git-tag-version version $bump &>/dev/null &&
  echo 'Updating changelog...' &&
  ./node_modules/.bin/conventional-changelog -i CHANGELOG.md -s -p ${2:-$preset} &&
  echo 'Adding changelog changes to git...' &&
  git add CHANGELOG.md &&
  version=$(./node_modules/.bin/json -f package.json version) &&
  echo 'Committing changelog changes to git: git commit -m "docs(CHANGELOG): $version"' &&
  git commit -m"docs(CHANGELOG): $version" &&
  echo 'Restore backed-up package.json file' &&
  mv -f _package.json package.json &&
  echo 'Call npm version ${1:-$bump} -m "chore(release): %s' &&
  npm version ${1:-$bump} -m "chore(release): %s" &&
  echo 'Run git push --follow-tags'
  git push --follow-tags &&
  ./node_modules/.bin/conventional-github-releaser -t ${githubToken} -p ${2:-$preset} &&
  echo 'Run npm publish' &&
  npm publish &&
  echo 'done'

