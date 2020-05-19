/* This node.js script generates a file named
promiseGitBranch.json that is later used by
fileVersionHistory.js
*/
// to do:
// read from inout string

const fs = require("fs");
// path to folder containing .git file
const path = process.argv[2];
// git log in reverse order from initial to most recent
const gitCmd = `git log --reverse  --skip 2 --pretty=format:"%H %ae %an"`;

console.log(process.env.GIT_DIR);
execShellCommand(gitCmd).then((data) => {
  const json = JSON.stringify(data).slice(1, -1);
  const json2 = json.split("\\n");
  let commitsArray = [];
  for (let i = 0; i < json2.length; i++) {
    let commitInfo = json2[i].split(" ");
    // console.log(commitInfo);
    const hash = commitInfo[0];
    const autherEmail = commitInfo[1];
    const authorName = commitInfo.slice(2, commitInfo.length).join(" ");
    commitsArray[i] = {
      hash,
      authorName,
      autherEmail,
    };
  }

  const promiseArray = commitsArray.map((elem) => {
    return getFilesChangedOnCommit(elem["hash"]);
  });

  Promise.all(promiseArray).then(function (values) {
    values.forEach((val, index) => {
      const { filesAdded, filesModify, filesDeleted, filesRenamed } = val;

      commitsArray[index]["filesAdded"] = filesAdded;
      commitsArray[index]["filesModify"] = filesModify;
      commitsArray[index]["filesDeleted"] = filesDeleted;
      commitsArray[index]["filesRenamed"] = filesRenamed;
    });
    stringifySave(commitsArray);
  });
});

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */

function execShellCommand(cmd) {
  const exec = require("child_process").exec;
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

/* write to file */

function stringifySave(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("promiseGitBranch.json", jsonData);
}

function getFileVersionAtCommit(hash, filePath) {
  const gitCommand = `git show ${hash}:${filePath}`;
  return new Promise((resolve, reject) => {
    execShellCommand(gitCommand).then((data) => {
      // console.log("data");
      resolve(data ? data : "fucked");
    });
  });
}

/* get file changes in a commit */
function getFilesChangedOnCommit(hash) {
  const gitCommand = `git show --stat --oneline --no-commit-id  --name-only ${hash}`;
  const gitCommandForNameStatus = `git show --name-status --oneline --no-commit-id  ${hash}`;

  // array of promises to run

  const p1 = new Promise((resolve, reject) => {
    execShellCommand(gitCommand).then((data, errors) => {
      !errors ? resolve(data ? data : "fucked") : reject(errors);
    });
  });

  const p2 = new Promise((resolve, reject) => {
    execShellCommand(gitCommandForNameStatus).then((data, errors) => {
      !errors ? resolve(data ? data : "fucked") : reject(errors);
    });
  });
  const toreturn = Promise.all([p1, p2]).then((values) => {
    const p1Result = values[0].split("\n");
    const p2Result = values[1].split("\n");
    const filesChanged = p1Result.slice(0, -2);
    const filesChangedFull = p2Result.slice(0, -1);
    const filesChangedStatus = filesChangedFull.map((str) => str[0]);
    const filesChangedStatusLetter = filesChangedFull
      .map((str) => str[0])
      .slice(0, -1);
    const conciseHashAndCommitMessage =
      filesChangedFull[filesChangedFull.length - 1];
    const filesAdded = [];
    const filesModify = [];
    const filesDeleted = [];
    const filesRenamed = [];
    const others = [];
    filesChanged.forEach((val, index) => {
      const status = filesChangedStatusLetter[index];
      switch (status) {
        case "A":
          filesAdded.push(val);
          break;
        case "M":
          filesModify.push(val);
          break;
        case "D":
          filesDeleted.push(val);
          break;
        case "R":
          filesRenamed.push(val);
          break;
        default:
          others.push(val);
        // code
      }
    });
    const finalResult = { filesAdded, filesModify, filesDeleted, filesRenamed };
    return finalResult;
  });

  return toreturn;
}
