/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

function moveFile() {
  const [source, destination] = process.argv.slice(2);

  if (!source || !destination) {
    console.error('Please provide source and destination paths.');

    return;
  }

  const resolvedSource = path.resolve(source);
  const resolvedDestination = path.resolve(destination);

  if (resolvedSource === resolvedDestination) {
    console.log('Source and destination paths are the same. No action taken.');

    return;
  }

  fs.stat(source, (sourceError, sourceStat) => {
    if (sourceError) {
      console.error(`Error: Source path does not exist or is inaccessible.`);

      return;
    }

    if (!sourceStat.isFile()) {
      console.error(`Error: Source is not a file.`);

      return;
    }

    fs.stat(destination, (destStatError, destStat) => {
      if (destStatError && destStatError.code !== 'ENOENT') {
        console.error(`Error: Destination path check failed.`);

        return;
      }

      const destPath =
        destStat && destStat.isDirectory()
          ? path.join(destination, path.basename(source))
          : destination;

      fs.rename(source, destPath, (renameError) => {
        if (renameError) {
          console.error(`Error: Failed to move file.`, renameError);
        } else {
          console.log(`File moved successfully to ${destPath}`);
        }
      });
    });
  });
}

moveFile();
