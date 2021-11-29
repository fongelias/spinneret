// This file will be used to test and prove concepts
// we will spin off into dedicated modules
console.log('running sandbox.js script');


// Things we want to be able to do:
// retrieve pages
// find links in pages
// navigate to subsequent pages
// parse content within pages
// create queries allowing us to store content

// Subsequently, the data will be analyzed—
// determine if we wish to build that functionality in a different package


// Retrieve Page
import { getHtml } from './HttpClient';
import cheerio from 'cheerio';



const url = 'https://www.reddit.com/r/relationships/';
// getHtml(url).then(result => {
// 	console.log(result);
// 	const $ = cheerio.load(result);

// 	// console.log($('a').first().attr('href'));
// 	$('a').map((i, elem) => {
// 		console.log((elem as cheerio.TagElement).attribs.href)
// 	});
// });



// Get it done method:
// Every website is crawlable— but creating a crawler for my goals would be more difficult
// than simply saving the generated html and parsing it
// Plan: Parse links from a given threshold and gather data without worrying about reuse or resources
console.log('accessing source text');

import fs from 'fs';

const PATH_TO_HTML = './data/Relationships_06_27_21_Complete_Top_Posts_Last_Year.html';
const READ_FILE_ENCODING = 'utf8';
const HTML_PAGE = fs.readFileSync(PATH_TO_HTML, READ_FILE_ENCODING);


console.log('extracting all links');
const linksInPage: string[] = HTML_PAGE.match(/href="[^"]+"/g) || [];
const linksToPosts = linksInPage
  .filter(link => link.match(/https:\/\/www.reddit.com\/r\/relationships\/comments\//))
  .map(link => link.slice(6, -1)) || [];
console.log(linksToPosts);

// Extracts post text and comments

type RedditPage = string;

class Post {
  public content: string;
  public comments: string[];

  constructor(html: RedditPage) {
    const $ = cheerio.load(html);
    // extract content
    this.content = $('div[data-test-id=post-content]').first().text();
    // extract comments
    const comments: string[] = [];
    $('div[data-test-id=comment]').each(function (i, e) {
      comments.push($(e).text());
    });

    this.comments = comments;
  }
}

// getHtml(linksToPosts ? linksToPosts[0] : url).then(res => {
//   const $ = cheerio.load(res);
//   // original post
//   console.log($('div[data-test-id=post-content]').first().text())
//   // comments
//   $('div[data-test-id=comment]').each(function (i, e) {
//     console.log($(e).text());
//   });
// });


// focus on downloading all the data first
