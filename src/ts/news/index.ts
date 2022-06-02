import { news_db, config_db } from "../db";
import jsSHA from "jssha";
import pLimit from "p-limit";

function get_hash(str: string): string {
  const shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.update(str);
  return shaObj.getHash("HEX");
}

const news_list_url =
  "https://y52en.github.io/kirafan-news-searcher/dirlist.json";
const base_url = "https://y52en.github.io/kirafan-news-searcher/";

export async function news_dl_db(callback: (i: number, sum: number) => void) {
  const db = new news_db();
  const config_db_ = new config_db();
  await config_db_.init();
  const res = await fetch_with_retry(news_list_url);
  const json: string[] = await res.json();
  const json_hash = get_hash(JSON.stringify(json));
  if ((await config_db_.get_db())["news_list_hash"] === json_hash) {
    return;
  }
  let _i = 0;
  const skip_list: string[] = [];
  await PromiseAllWithLimit(
    300,
    json.map(async (url, i) => async () => {
      _i++;
      callback(_i, json.length);
      if (i % 100 === 0) {
        console.log(`${i}/${json.length}`);
      }
      let res;
      try {
        res = await fetch_with_retry(base_url + url);
      } catch (e) {
        skip_list.push(url);
        return;
      }
      const db_data = await res.text();
      const dom_parser = new DOMParser();
      const doc = dom_parser.parseFromString(db_data, "text/html");
      doc.querySelectorAll("style").forEach((x) => (x.textContent = ""));

      const title =
        doc.querySelector<HTMLElement>(".newsTitle>dl>dd")?.innerText ||
        "error";
      const date =
        doc.querySelector<HTMLElement>(".newsTitle>dl>dt")?.innerText ||
        "error";
      const content = doc.body.innerText || "error";

      const id =
        url.match(/\/(?<id>\d+)\/(?<title>[^/]+)\/index\.html$/)?.groups?.id ||
        "error:" + url;

      await db.set_db(url, {
        title: title,
        content: content,
        date: date,
        link: "https://" + url.replace(/\/[^/]+\/index\.html$/, ""),
        id: id,
      });
    })
  );

  (async () =>
    console.log(`key_len: ${await db.get_ley_list().then((x) => x.length)}`))();
  await config_db_.set_db({
    news_list_hash: json_hash,
    version: "0.0.0",
    skip_list: skip_list,
  });
}

async function fetch_with_retry(
  url: string,
  retry_count: number = 3
): Promise<Response> {
  let res = await fetch(url);
  if (res.status !== 200) {
    if (retry_count > 0) {
      return fetch_with_retry(url, retry_count - 1);
    }
    throw new Error(`${res.status} ${res.statusText}`);
  }
  return res;
}

async function PromiseAllWithLimit(
  limit: number,
  promises: Promise<any>[]
): Promise<Promise<any>[]> {
  const p = pLimit(limit);
  return Promise.all(promises.map(async (x) => p(await x)));
}
