const config = require("../config/config");
const ExpTech = require("./src/exptech");

const path = require("path");

class Plugin {
  static instance = null;

  #ctx;
  #config;

  constructor(ctx) {
    if (Plugin.instance) return Plugin.instance;

    this.#ctx = ctx;
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
    const { Logger, info } = this.#ctx;

    const { CustomLogger } = require("./src/utils/logger").createCustomLogger(Logger);
    this.logger = new CustomLogger("exptech");

    const defaultDir = path.join(info.pluginDir, "./resource/default.yml");
    const configDir = path.join(info.pluginDir, "./config.yml");

    this.#config = new config(this.logger, defaultDir, configDir);

    this.config = this.#config.getConfig();

    console.log(this.config);

    const exptech = new ExpTech(this.config);

    const key = exptech.getKey();

    console.log(key);
  }
}

module.exports = Plugin;
