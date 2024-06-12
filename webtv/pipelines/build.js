const InsertScripts = require("./insert-script.plugin");
const CreateBaseWebOs = require("./base-webos.plugin");
const CreateWebOs = require("./build-webos.plugin")

const BuildWebOS = async () => {
  try {
    console.info("building: Creating WebOS structure");
    await CreateBaseWebOs();

    console.info("scripts: Updating html files with script tags");
    await InsertScripts("webos");
    console.info("✓ scripts: done");

    await CreateWebOs()
    console.info("✓ building: done");
  } catch (error) {
    throw error;
  }
};

BuildWebOS();
