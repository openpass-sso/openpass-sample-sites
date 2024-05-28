const fs = require("fs").promises;
const path = require("path");

const InsertScripts = async (buildType) => {
  let scriptTag = "";

  switch (buildType) {
    case "webos":
      scriptTag =
        '<script src="webOSTVjs-1.2.4/webOSTV.js"></script> <script src="webOSTVjs-1.2.4/webOSTV-dev.js"></script>';
      break;
    case "tizen":
      scriptTag = '<script src="webOSTVjs-1.2.4/webOSTV.js"></script>';
      break;
  }

  if (!scriptTag) {
    console.error("Error - no script found");
    return;
  }

  const buildDir = path.join(__dirname, "..", "out");

  const insertScript = async (filePath) => {
    try {
      let data = await fs.readFile(filePath, "utf8");

      if (!data.includes(scriptTag)) {
        const updatedData = data.replace("</body>", `${scriptTag}</body>`);
        await fs.writeFile(filePath, updatedData, { encoding: "utf8" });
        console.log(`Inserted script into ${filePath}`);
      }
    } catch (err) {
      console.error(`Error inserting script into ${filePath}:`, err);
      throw err;
    }
  };

  const _fileStat = async (filePath) => {
    try {
      const stats = await fs.stat(filePath);

      if (stats.isDirectory()) {
        await traverseAndInsert(filePath);
      } else if (stats.isFile() && filePath.endsWith(".html")) {
        await insertScript(filePath);
      }
    } catch (err) {
      console.error(`Error with file stat for ${filePath}:`, err);
      throw err;
    }
  };

  const traverseAndInsert = async (dir) => {
    try {
      const files = await fs.readdir(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        await _fileStat(filePath);
      }
    } catch (err) {
      console.error(`Error traversing directory ${dir}:`, err);
      throw err;
    }
  };

  return traverseAndInsert(buildDir);
};

module.exports = InsertScripts;
