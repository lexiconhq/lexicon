// This is a temporary helper script to aid in the migration from
// apollo-tools to graphql-code-generator.
//
// The goal is to require as little of a refactor as possible of the actual code,
// i.e. configure graphql-code-generator to produce the same output as apollo-tools was.
//
// The problem this script solves is that src/graphql/server has all of its filenames
// in camelCase, but the codebase currently imports from src/generated/server as if
// all of the generated filenames are in PascaleCase.
//
// Despite tinkering with graphql-code-generator settings & plugins quite a bit, there
// didn't seem to be a good way to rename all the files to PascalCase.
//
// This script accomplishes that.
//
// This script should be deleted and removed from codegen.yaml once we've refactored
// the codebase to more fully embrace the features of graphql-code-generator.

// NOTE: to debug this file as it runs with graphql-code-generator, go into codegen.yml
// and change this line:
// ` - node ./scripts/rename-generated-files.js`
// to this:
// ` - node ./scripts/rename-generated-files.js > output.txt 2>&1

const path = require('path');
const fs = require('fs');

const toPascalCase = (s = '') => `${s[0].toUpperCase()}${s.slice(1)}`;

function run(filePaths) {
  const relativePathObjects = filePaths.map((file) =>
    path.parse(path.relative(process.cwd(), file)),
  );

  relativePathObjects.forEach((pathObject) => {
    const name = toPascalCase(pathObject.name);
    const base = toPascalCase(pathObject.base);

    const oldPath = path.format(pathObject);
    const newPath = path.format({ ...pathObject, base, name });
    fs.renameSync(oldPath, newPath);
  });
}

function getValidFilePaths() {
  const filePaths = process.argv.slice(2);
  if (filePaths.length < 1) {
    process.exit(0);
  }

  // Remove `types.ts` since it's the only one that is imported by the other files
  // If we don't do this, we have to manually change the import at the top of every
  // file to have a capital `T`: `generated/server/Types.ts`.
  const filteredPaths = filePaths.filter(
    (filePath) => !filePath.endsWith('generated/server/types.ts'),
  );

  return filteredPaths;
}

const filePaths = getValidFilePaths();
run(filePaths);
