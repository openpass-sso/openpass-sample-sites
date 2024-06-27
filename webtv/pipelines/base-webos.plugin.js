const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const CreateBasesWebOs = async () => {
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
      const jsFiles = path.join(__dirname, "..", "build", "static");
      fsPromises.cp(jsFiles, `${dir}/static`, { recursive: true });

      const imagesFiles = path.join(__dirname, "..", "build", "images");
      fsPromises.cp(imagesFiles, `${dir}/images`, { recursive: true });

      const indexFile = path.join(__dirname, "..", "build", "index.html");
      fsPromises.copyFile(indexFile, `${dir}/index.html`);

      const logoFile = path.join(__dirname, "..", "build", "openpass-logo.svg");
      fsPromises.copyFile(logoFile, `${dir}/openpass-logo.svg`);

      const assetManifest = path.join(__dirname, "..", "build", "asset-manifest.json");
      fsPromises.copyFile(assetManifest, `${dir}/asset-manifest.json`);

    } catch (error) {
      console.error(`Error copying resources:`, err);
      throw err;
    }
  };

  await createPath(dir);
  console.info("✓ building: Created root folder");
  await copyFilesFromResources();
  console.info("✓ building: Copied resources");

  await copyFilesFromBuild();
  console.info("✓ building: Copied code files");
};

module.exports = CreateBasesWebOs;
