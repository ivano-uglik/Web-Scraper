const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function scrapeScrape() {
  // launch browser, go to new page, go to the website of the school
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("http://ss-tehnicka-ntesla-vu.skole.hr/");
  ``;
  const brojClanaka = await page.$$eval(
    "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > a",
    (clanci) => {
      const filteredClanci = clanci.filter(
        (x) => x.textContent.trim() === "više"
      );
      return filteredClanci.map((x) => x.getAttribute("href"));
    }
  );

  const articles = [];
  // for loop which loops through each clanak
  for (let i = 0; i < brojClanaka.length; i++) {
    console.log(brojClanaka[i]);

    const id = i;
    // go to each clanak
    await page.goto("http://ss-tehnicka-ntesla-vu.skole.hr" + brojClanaka[i]);

    // function which returns the title (textcontent of h2 element) of each clanak
    const getTitle = await page.$$eval(
      "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > h2",
      (titles) => {
        return titles.map((x) => x.textContent);
      }
    );

    const getImgs = await page.$$eval("#result > a", (imgs) => {
      return imgs.map((x) => x.getAttribute("href"));
    });

    const getText = await page.$$eval(
      "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > div.news_more_lead > *, #content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > div.news_more_body > *",
      (texts) => {
        return texts.map((x) => x.textContent);
      }
    );

    articles.push({ id, getTitle, getImgs, getText });

    console.log(articles[i]);
  }

  await browser.close();

  return articles;
}

scrapeScrape()
  .then((data) => {
    const jsonData = data.map(({ id, getTitle, getImgs, getText }) => {
      const article = { id, getTitle, getImgs, getText };
      return JSON.stringify(article, null, 2) + "\n";
    });
    return fs.writeFile("../blogs/data.json", jsonData.join(""));
  })
  .then(() => {
    console.log("Data has been written to data.json");
  })
  .catch((error) => {
    console.error(error);
  });
