import localForage from "localforage";

const PREFIX = "KIRAFAN-NEWS-SEARCH-";
// const PREFIX = "DEBUG-001-KIRAFAN-NEWS-SEARCH-";
const VERSION = "0.0.0";

type News_DB = {
  //   type: "information" | "maintenance" | "update";
  id: string;
  title: string;
  content: string;
  date: string;
  link: string;
};

export class news_db {
  private db: typeof localForage;
  constructor() {
    this.db = localForage.createInstance({
      name: PREFIX + "news-db",
      storeName: "news",
    });
  }

  isInitilized() {
    return this.db !== undefined;
  }

  async get_db(key: string): Promise<News_DB | null> {
    return this.db.getItem(key);
  }

  async set_db(key: string, db: News_DB) {
    return this.db.setItem(key, db);
  }

  async get_ley_list(): Promise<string[]> {
    return this.db.keys();
  }

  async get_db_by_index(i: number): Promise<News_DB | null> {
    return this.db.getItem(await this.db!.key(i));
  }

  async get_all(): Promise<News_DB[]> {
    const output: News_DB[] = [];
    await this.db.iterate((value, _key) => {
      output.push(value as News_DB);
    });
    return output;
  }
}

type Config = {
  news_list_hash: string;
  version: string;
  skip_list: string[];
};

export class config_db {
  private db = localForage;
  private db_key_name = "config";
  private _init_db_data = {
    news_list_hash: "",
    version: VERSION,
    skip_list: [],
  };

  constructor() {
    this.db = localForage.createInstance({
      name: PREFIX + "config-db",
      storeName: "news",
    });
  }

  async init() {
    if (!(await this.isDBInitialized())) {
      await this.init_db();
    }
  }

  private async init_db() {
    if (await this.isDBInitialized()) {
      this.set_db(this._init_db_data);
    } else {
      throw new Error("config db already initialized");
    }
  }

  async isDBInitialized(): Promise<boolean> {
    return this.get_db() != null;
  }

  async get_db(): Promise<Config> {
    return (await this.db.getItem(this.db_key_name)) || this._init_db_data;
  }

  async set_db(config: Config) {
    return this.db.setItem(this.db_key_name, config);
  }
}
