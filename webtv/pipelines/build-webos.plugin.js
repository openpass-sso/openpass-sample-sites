const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const { exec } = require("child_process");

const CreateWebOs = async () => {
  const dir = path.join(__dirname, "..", "applications/WebOS");

  const createBuild = async () => {
    return new Promise((resolve) => {
      exec(`ares-package ${dir} -o ${dir}/package`, (err, stdout, stderr) => {
        if (err) {
          // node couldn't execute the command
          return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        resolve()
      });
    });
  };

  console.info("building: Creating WebOS IPK file");
  await createBuild();
};

module.exports = CreateWebOs;
