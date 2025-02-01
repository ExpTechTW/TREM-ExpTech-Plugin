const os = require("node:os");

class ExpTech {
  static #instance = null;

  constructor(logger, config) {
    if (ExpTech.#instance)
      return ExpTech.#instance;
    this.logger = logger;
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
          email : this.getconfig.user.email,
          pass  : this.getconfig.user.pass,
          name  : `${this.getconfig.user.name}/TREM-lite/3.1.0-rc.4/${os.release()}`
        }),
      });

      if (res && res.ok) {
        const ans = await res.text();
        this.key = ans;
        this.getconfig.user.token = this.key
        this.config.writeConfig(this.getconfig);
      } else
        this.logger.error("Login http status code: ", res.status);
    } catch (error) {
      if (error.name === "AbortError")
        this.logger.error("請求超時");
      else
        this.logger.error(error.message);
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
