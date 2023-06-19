const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function tutorial() {
  // launch browser, go to new page, go to the website of the school
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://ss-tehnicka-ntesla-vu.skole.hr/");

  // // return naslovi od svih clanaka, tako sto se od "vise" anchor tag-a dobije title, koji je title pojedinacnih clanaka
  // const naslovi = await page.$$eval(
  //   "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > a[title]",
  //   (titles) => {
  //     return titles.map((x) => x.getAttribute("title"));
  //   }
  // );
  // // write naslovi.txt with the titles of all elements
  // await fs.writeFile("naslovi.txt", naslovi.join("\n"));

  // // return source of svih images
  // const photos = await page.$$eval(
  //   "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div * img",
  //   (imgs) => {
  //     return imgs.map((x) => x.src);
  //   }
  // );
  // // save all images of all articles in imgs folder
  // for (let i = 0; i < photos.length; i++) {
  //   // console.log(photos[i]);
  //   const imagefile = await page.goto(photos[i]);
  //   await fs.writeFile("imgs/" + i + ".png", await imagefile.buffer());
  // }

  // get the number of artikli, to use later to open each of them and extract info
  const brojClanaka = await page.$$eval(
    "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > a",
    (clanci) => {
      return clanci.map((x) => x.getAttribute("href"));
    }
  );

  // for loop which loops through each clanak
  for (let i = 0; i < brojClanaka.length; i++) {
    // go to each clanak
    await page.goto("http://ss-tehnicka-ntesla-vu.skole.hr" + brojClanaka[i]);
    console.log("Ovo je clanak " + i + ": " + brojClanaka[i]);

    // function which returns the title (textcontent of h2 element) of each clanak
    const getTitle = await page.$$eval(
      "#content > div.clanak > div.srednji_stupac_tijelo.mod_news > div > div > h2",
      (titles) => {
        return titles.map((x) => x.textContent);
      }
    );
    console.log("ovo je title clanka " + i + ": " + getTitle);

    getImgs = await page.$$eval("#result > a", (titles) => {
      return titles.map((x) => x.getAttribute("href"));
    });
    console.log("Ovo je image clanka " + i + ": " + getImgs + "\n");
  }
  await browser.close();
}

tutorial();
