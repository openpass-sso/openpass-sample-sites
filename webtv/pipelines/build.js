const InsertScripts = require("./insert-script.plugin");
const CreateWebOs = require("./create-webos.plugin");

const BuildWebOS = async () => {
  try {
    console.info("scripts: Updating html files with script tags");
    await InsertScripts("webos");
    console.info("✓ scripts: done");

    console.info("building: Creating WebOS structure");
    await CreateWebOs();
    console.info("✓ building: done");
  } catch (error) {
    throw error;
  }
};

BuildWebOS();
