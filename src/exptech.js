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
      const response = await fetch('https://api.exptech.dev/api/v1/auth/login', {
        body: JSON.stringify({
          email    : this.getconfig.user.email,
          password : this.getconfig.user.pass
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (response && response.ok) {
        const ans = await response.json();
        // this.logger.info("Login: ", ans);
        this.login_token = ans.token;
        this.refresh_login_token = ans.refresh_token;
        this.expires_at = ans.expires_at;
        this.getconfig.login.token = this.login_token;
        this.getconfig.login.refresh_token = this.refresh_login_token;
        this.getconfig.login.expires_at = this.expires_at;
        this.config.writeConfig(this.getconfig);
        return await this.#serviceToken();
      } else
        this.logger.error("Login http status code: ", response.status);
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

  async #serviceToken() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);

    try {
      const response = await fetch(`https://api.exptech.dev/api/v1/auth/service-tokens`, {
        body: JSON.stringify({
          note    : 'trem-lite',
          permissions: [10_101, 10_102, 102, 20_101, 202]
        }),
        headers: {
          'Authorization': `Bearer ${this.login_token}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (response && response.ok) {
        const ans = await response.json();
        // this.logger.info("serviceToken: ", ans);
        this.key = ans.token;
        this.getconfig.user.token = this.key;
        this.config.writeConfig(this.getconfig);
        return this.key;
      } else
        this.logger.error("ServiceToken http status code: ", response.status);
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
