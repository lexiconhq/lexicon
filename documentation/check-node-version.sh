#!/bin/sh

node_required=18

# Get the major version of Node
node_current=$(node -v | awk -F \. {'print substr($1,2)'})

if [[ "$node_current" -lt "$node_required" ]]; then
    echo "NOTE: the Lexicon documentation requires Node >= 18.0."
    echo "Your current Node version is $(node -v)"
    echo "\n"
    echo "This is a requirement of our tooling, Docusaurus (>= 3.0)."
    echo "To help make this less of a pain, we recommend you install a tool like nvm (Node Version Manager)."
    echo "This allows you to easily switch between Node versions for situations like this."
    echo "\n"
    echo "https://github.com/nvm-sh/nvm"
    echo "\n"
    
    exit 1;
fi;
