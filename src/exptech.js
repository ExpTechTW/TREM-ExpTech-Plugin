const logger = require("./utils/logger");

class ExpTech {
  static #instance = null;

  constructor(config) {
    if (ExpTech.#instance)
      return ExpTech.#instance;
    this.config = config;
    this.key = null;
    this.#login();
    ExpTech.#instance = this;
  }

  static getInstance() {
    if (!ExpTech.#instance)
      ExpTech.#instance = new ExpTech();
    return ExpTech.#instance;
  }

  async #login() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch("https://api-1.exptech.dev/api/v3/et/login", {
        method : "POST",
        signal : controller.signal,
        body   : JSON.stringify({

        }),
      });

      if (res && res.ok) {
        const ans = await res.json();
      } else
        logger.error("Login http status code: ", res.status);
    } catch (error) {
      if (error.name === "AbortError")
        logger.error("請求超時");
      else
        logger.error(error.message);
    } finally {
      clearTimeout(timeout);
    }
  }

  getKey() {
    return this.key;
  }
}

module.exports = ExpTech;
