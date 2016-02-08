#!/bin/bash
set -ex
set -o pipefail

# Cache phase of circleci
function do_cache() {
  npm install
}

# Test phase of circleci
function do_test() {
  npm --version
  node --version
  npm test
}

# Deploy phase of circleci
function do_deploy() {
  VERSION=${CIRCLE_TAG//v/}
  echo "Trying to install version $VERSION"
  npm whoami
  
  # For some reason this command returns 1???
  npm --depth=0 list 
  npm --depth=0 list | grep "signalfx@$VERSION "
  npm publish
}

function do_all() {
  do_cache
  do_test
  do_deploy
}

case "$1" in
  cache)
    do_cache
    ;;
  test)
    do_test
    ;;
  deploy)
    do_deploy
    ;;
  all)
    do_all
    ;;
  *)
  echo "Usage: $0 {cache|test|deploy|all}"
    exit 1
    ;;
esac

