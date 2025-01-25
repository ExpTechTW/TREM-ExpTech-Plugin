const config = require("../config/config");
const ExpTech = require("./src/exptech");

class Plugin {
  static instance = null;

  #ctx;
  #config;

  constructor(ctx) {
    if (Plugin.instance) return Plugin.instance;

    this.#ctx = ctx;
    this.name = "exptech";
    this.#config = null;
    this.config = {};
    this.logger = null;

    Plugin.instance = this;
  }

  static getInstance() {
    if (!Plugin.instance) throw new Error("Plugin not initialized");

    return Plugin.instance;
  }

  onLoad() {
    const { Logger, info, utils } = this.#ctx;

    const { CustomLogger } =
      require("../logger/logger").createCustomLogger(Logger);
    this.logger = new CustomLogger("exptech");

    const defaultDir = utils.path.join(info.pluginDir, "./exptech/resource/default.yml");
    const configDir = utils.path.join(info.pluginDir, "./exptech/config.yml");

    this.#config = new config("exptech", this.logger, utils.fs, defaultDir, configDir);

    const exptech = new ExpTech(this.#config);

    exptech.runlogin(exptech);
  }
}

module.exports = Plugin;
