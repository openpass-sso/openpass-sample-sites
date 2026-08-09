const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const CreateBaseTizen= async () => {
  const dir = path.join(__dirname, "..", "applications/Tizen");
  const subFolder = path.join(__dirname, "..", "applications/Tizen/OpenPassWebTv");

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
    const resourcesDir = path.join(__dirname, "..", "resources", "Tizen");
    try {
      fsPromises.cp(resourcesDir, subFolder, { recursive: true });
    } catch (error) {
      console.error(`Error copying resources:`, err);
      throw err;
    }
  };

  const copyFilesFromBuild = async () => {
    try {
      const jsFiles = path.join(__dirname, "..", "build", "static");
      fsPromises.cp(jsFiles, `${subFolder}`, { recursive: true });

      const imagesFiles = path.join(__dirname, "..", "build", "images");
      fsPromises.cp(imagesFiles, `${subFolder}/images`, { recursive: true });

      const indexFile = path.join(__dirname, "..", "build", "index.html");
      fsPromises.copyFile(indexFile, `${subFolder}/index.html`);

      const logoFile = path.join(__dirname, "..", "build", "openpass-logo.svg");
      fsPromises.copyFile(logoFile, `${subFolder}/openpass-logo.svg`);

    } catch (error) {
      console.error(`Error copying resources:`, err);
      throw err;
    }
  };

  await createPath(dir);
  await createPath(subFolder);
  console.info("✓ building: Created root folder");
  await copyFilesFromResources();
  console.info("✓ building: Copied resources");

  await copyFilesFromBuild();
  console.info("✓ building: Copied code files");
};

module.exports = CreateBaseTizen;
