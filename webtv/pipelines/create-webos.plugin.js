const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const { exec } = require("child_process");

const CreateWebOs = async () => {
  const dir = path.join(__dirname, "..", "applications/WebOS");

  const createPath = async (dir) => {
    try {
      const exists = await fs.existsSync(dir);
      if (!exists) {
        console.log("Creating Build destination folder");
        fsPromises.mkdir(dir);
      }
    } catch (error) {
      throw error;
    }
  };

  const copyFilesFromResources = async () => {
    const resourcesDir = path.join(__dirname, "..", "resources", "WebOS");
    try {
      fsPromises.cp(resourcesDir, dir, { recursive: true });
    } catch (error) {
      console.error(`Error copying resources:`, err);
      throw err;
    }
  };

  const copyFilesFromBuild = async () => {
    try {
      const jsFiles = path.join(__dirname, "..", "out", "_next");
      fsPromises.cp(jsFiles, `${dir}/_next`, { recursive: true });

      const imagesFiles = path.join(__dirname, "..", "out", "images");
      fsPromises.cp(imagesFiles, `${dir}/images`, { recursive: true });

      const indexFile = path.join(__dirname, "..", "out", "index.html");
      fsPromises.copyFile(indexFile, `${dir}/index.html`);

      const logoFile = path.join(__dirname, "..", "out", "openpass-logo.svg");
      fsPromises.copyFile(logoFile, `${dir}/openpass-logo.svg`);
    } catch (error) {
      console.error(`Error copying resources:`, err);
      throw err;
    }
  };

  const createBuild = () => {
    exec(`ares-package ${dir} -o ${dir}/package`, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  };

  await createPath(dir);
  console.info("✓ building: Created root folder");
  await copyFilesFromResources();
  console.info("✓ building: Copied resources");

  await copyFilesFromBuild();
  console.info("✓ building: Copied code files");

  await createBuild();
};

module.exports = CreateWebOs;
