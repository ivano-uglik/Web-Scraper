const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function scrapeScrape() {
  // launch browser, go to new page, go to the website of the school
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://ss-tehnicka-ntesla-vu.skole.hr/");

  // get the number of artikli, to use later to open each of them and extract info
  const brojClanaka = await page.$$eval(
    "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > a",
    (clanci) => {
      return clanci.map((x) => x.getAttribute("href"));
    }
  );

  const articles = [];
  // for loop which loops through each clanak
  for (let i = 0; i < brojClanaka.length; i++) {
    // go to each clanak
    await page.goto("http://ss-tehnicka-ntesla-vu.skole.hr" + brojClanaka[i]);

    // function which returns the title (textcontent of h2 element) of each clanak
    const getTitle = await page.$$eval(
      "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > h2",
      (titles) => {
        return titles.map((x) => x.textContent);
      }
    );

    const getImgs = await page.$$eval("#result > a", (titles) => {
      return titles.map((x) => x.getAttribute("href"));
    });

    articles.push({ getTitle, getImgs });
    console.log(articles);
  }

  await browser.close();

  return articles;
}

scrapeScrape()
  .then((data) => {
    const jsonData = data.map(({ getTitle, getImgs }) => {
      const article = { getTitle, getImgs };
      return JSON.stringify(article, null, 2) + "\n";
    });
    return fs.writeFile("data.json", jsonData.join(""));
  })
  .then(() => {
    console.log("Data has been written to data.json");
  })
  .catch((error) => {
    console.error(error);
  });
