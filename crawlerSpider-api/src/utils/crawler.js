const HTMLParser = require("node-html-parser");
const axios = require("axios");

const getHtmlAnchorHrefs = (htmlPage, baseUrl) => {
  const anchors = htmlPage.querySelectorAll("a");
  const hrefs = anchors
    .map((anchor) => {
      let href = anchor.getAttribute("href");

      if (("" + href).startsWith("//")) return baseUrl + ("" + href).slice(2);

      if (("" + href).startsWith("/")) return baseUrl + href.toString();
      return href + "";
    })
    .filter((link) => !("" + link).startsWith("#") && link !== "undefined");

  return hrefs;
};
const parseUrlDataToObject = async (url) => {
  let pageHtml;
  const currentUrl = new URL(encodeURI(url));
  try {
    const page = (await axios.get(currentUrl.toString())).data;
    pageHtml = HTMLParser.parse(page);
    const links = getHtmlAnchorHrefs(
      pageHtml,
      currentUrl.protocol + "//" + currentUrl.hostname
    );
    const title = pageHtml.querySelector("title")
      ? pageHtml.querySelector("title").innerText
      : "None";
    return { title, links, url };
  } catch (err) {
    if (err.response)
      return {
        error: {
          status: err.response.status,
          message: err.response.statusText,
        },
      };
    else
      console.log(
        "🚀 ~ file: test.js ~ line 34 ~ parseUrlDataToObject ~ err",
        err
      );
  }
};
const crawlerSpider = async (startUrl, maxDepth, maxTotalPages) => {
  let pages = {};
  let pagesCount = 1;
  let startUrlData = await parseUrlDataToObject(startUrl);
  if (startUrlData.error) throw new Error(startUrlData.error);
  pages = {
    ...pages,
    [startUrl]: { depth: 0, pagesCount, ...startUrlData },
  };

  const crawler = async (url, depth) => {
    let urlData = pages[url];
    depth++;
    if (depth > maxDepth) return;
    console.log("depth:" + depth);
    if (urlData.links) {
      const nextLinks = [];
      for (const link of urlData.links) {
        if (!pages[link] && link !== url) {
          urlData = await parseUrlDataToObject(link);
          pagesCount++;
          if (pagesCount > maxTotalPages) return;
          console.log("pageCount:" + pagesCount);

          pages = {
            ...pages,
            [link]: { depth, pagesCount, ...urlData },
          };

          nextLinks.push(link);
        }
      }
      for (const link of nextLinks) {
        await crawler(link, depth);
      }
    }
  };

  await crawler(startUrl, 0); //start recursive function

  return pages;
};
module.exports = crawlerSpider;
