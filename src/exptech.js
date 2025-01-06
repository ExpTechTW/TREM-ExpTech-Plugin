const logger = require("./utils/logger");

class ExpTech {
  static #instance = null;

  constructor(config) {
    if (ExpTech.#instance)
      return ExpTech.#instance;
    this.config = config;
    this.getconfig = this.config.getConfig();
    this.key = null;
    ExpTech.#instance = this;
  }

  static getInstance() {
    if (!ExpTech.#instance)
      ExpTech.#instance = new ExpTech();
    return ExpTech.#instance;
  }

  async #login() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch("https://api-1.exptech.dev/api/v3/et/login", {
        method  : "POST",
        signal  : controller.signal,
        headers : { "Content-Type": "application/json" },
        body    : JSON.stringify({
          email : this.getconfig.user.name,
          pass  : this.getconfig.user.pass,
          name  : "TREM-lite"
        }),
      });

      if (res && res.ok) {
        const ans = await res.text();
        this.key = ans;
        this.getconfig.user.token = this.key
        this.config.writeConfig(this.getconfig);
        console.log(this.key);
      } else
        logger.error("Login http status code: ", res.status);
    } catch (error) {
      if (error.name === "AbortError")
        logger.error("請求超時");
      else
        logger.error(error.message);
    } finally {
      clearTimeout(timeout);
      return null;
    }
  }

  async runlogin() {
    this.key = await this.#login();
    return this.key;
  }

  getKey() {
    return this.key;
  }
}

module.exports = ExpTech;
