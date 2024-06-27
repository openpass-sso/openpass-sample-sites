const InsertScripts = require("./insert-script.plugin");
const CreateBaseWebOs = require("./base-webos.plugin");
const CreateWebOs = require("./build-webos.plugin");

const CreateBaseTizen = require("./base-tizen.plugin");

const BuildWebOS = async () => {
  try {
    console.info("building: Creating WebOS structure");
    await CreateBaseWebOs();

    console.info("scripts: Updating html files with script tags");
    await InsertScripts("webos");
    console.info("✓ scripts: done");

    await CreateWebOs();
    console.info("✓ building: done");
  } catch (error) {
    throw error;
  }
};

const BuildTizen = async () => {
  try {
    console.info("building: Creating Tizen structure");
    await CreateBaseTizen();

    console.info("scripts: Updating html files with script tags");
    await InsertScripts("tizen");

    console.info("✓ scripts: done");
  } catch (error) {
    throw error;
  }
};

(async () => {
  await BuildWebOS();
  await BuildTizen();
})();
