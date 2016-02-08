#!/bin/bash
set -ex
set -o pipefail

CIRCLEUTIL_TAG="v1.34"

# Cache phase of circleci
function do_cache() {
  [ ! -d "$HOME/circleutil" ] && git clone https://github.com/signalfx/circleutil.git "$HOME/circleutil"
  (
    cd "$HOME/circleutil"
    git fetch -a -v
    git fetch --tags
    git reset --hard "$CIRCLEUTIL_TAG"
  )
  . "$HOME/circleutil/scripts/common.sh"
  npm install
}

# Test phase of circleci
function do_test() {
  . "$HOME/circleutil/scripts/common.sh"
  npm test
}

# Deploy phase of circleci
function do_deploy() {
  . "$HOME/circleutil/scripts/common.sh"
  (
    npm whoami
    npm deploy
  )
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

