const config = require("./src/utils/config");

const ExpTech = require("./src/exptech");

class Plugin {
  static instance = null;

  #ctx;
  #config;

  constructor(ctx) {
    if (Plugin.instance) return Plugin.instance;

    this.#ctx = ctx;
    this.#config = new config(this.#ctx);
    this.config = {};
    this.logger = null;

    Plugin.instance = this;
  }

  static getInstance() {
    if (!Plugin.instance) throw new Error("Plugin not initialized");

    return Plugin.instance;
  }

  onLoad() {
    const { Logger } = this.#ctx;

    this.config = this.#config.getConfig();

    const { CustomLogger } = require("./src/utils/logger").createCustomLogger(Logger);
    this.logger = new CustomLogger("exptech");

    console.log(this.config);

    const exptech = new ExpTech(this.config);

    const key = exptech.getKey();

    console.log(key);
  }
}

module.exports = Plugin;
