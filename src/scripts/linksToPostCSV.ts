import fs from 'fs';
import cheerio from 'cheerio';
import { getHtml } from './HttpClient';

// top posts as input
const getPostHtml = (): string => {
  const PATH_TO_HTML = './data/Relationships_06_27_21_Complete_Top_Posts_Last_Year.html';
  const READ_FILE_ENCODING = 'utf8';
  const HTML_PAGE: string = fs.readFileSync(PATH_TO_HTML, READ_FILE_ENCODING);

  return HTML_PAGE;
}

// parse links to posts
const extractLinksFromHtml = (html: string): string[] => {
  const linksInPage: string[] = html.match(/href="[^"]+"/g) || [];
  return linksInPage;
}

const filterPostLinks = (links: string[]): string[] => {
  const linksToPosts = links
    .filter(link => link.match(/https:\/\/www.reddit.com\/r\/relationships\/comments\//))
    .map(link => link.slice(6, -1)) || [];

  return linksToPosts;
}

const filterUniqueStrings = (strings: string[]): string[] => {
  const uniqueStrings: Set<string> = strings.reduce((acc, c) => {
    return acc.add(c);
  }, new Set<string>());

  return Array.from(uniqueStrings);
}

// load posts and create objects for them
class Post {
  private html?: string;
  private content?: string;
  private comments?: string[];
  private redditId: string;

  constructor(private link: string) {
    this.redditId = link.slice(48,54);
  }

  public async getHtml(): Promise<string> {
    return this.html ? this.html : getHtml(this.link).then(res => {
      this.html = res;
      return this.html;
    })
  }

  public async getContent(): Promise<string> {
    const $ = cheerio.load(await this.getHtml());
    // extract content
    this.content = $('div[data-test-id=post-content]').first().text();
    return this.content;
  }

  public async getComments(): Promise<string[]> {
    const $ = cheerio.load(await this.getHtml());
    // extract comments
    const comments: string[] = [];
    $('div[data-test-id=comment]').each(function (i, e) {
      comments.push($(e).text());
    });

    this.comments = comments;
    return this.comments;
  }

  public async getContentCSV(): Promise<string> {
    const content = await this.getContent();
    return `${this.redditId},${content}`;
  }

  public async getCommentCSV(): Promise<string> {
    const comments = await this.getComments();
    return comments.map(comment => `${this.redditId},${comment}`)
      .join('\n');
  }

  public getLink(): string {
    return this.link;
  }
}

const linksToPosts = (links: string[]): Post[] => {
  return links.map(link => new Post(link));
}

const throttledPostInitialization = (posts: Post[]): Promise<Post[]> => {
  const getTimeout = (order: number) => order * 5000 + Math.random() * 100;

  for(let i = 0; i < posts.length; i++) {
    const currPost = posts[i];
    // Set a delayed call to get html every 5 seconds
    setTimeout(() => {
      console.log(`fetching post at url: ${currPost.getLink()}`)
      currPost.getHtml().then(res => console.log(`post retrieved: ${res.slice(0,10)}`));
    }, getTimeout(i + 1));
  }

  return new Promise((res) => {
    // resolve a promise with all posts 5 seconds after all the posts are retrieved
    setTimeout(() => res(posts), getTimeout(posts.length + 1) + 5000);
  })
}


// create data to load posts into cypher
// metadata will be created in a neo4j client
const postsHtml = getPostHtml();
const links = filterUniqueStrings(filterPostLinks(extractLinksFromHtml(postsHtml)));
const posts = linksToPosts(links);


throttledPostInitialization(posts).then(async function (initialized) {
  // CSV creation
  const contentCSVs = await Promise.all(initialized.map((post) => {
    return post.getContentCSV();
  }));
  const contentCSV = contentCSVs.join('\n');
  const commentCSVs = await Promise.all(initialized.map((post) => {
    return post.getCommentCSV();
  }));
  const commentCSV = commentCSVs.join('\n');
  // Path creation
  const PATH_FOR_OUTPUTS = './outputs';
  const contentCSVFileName = 'post_content.csv';
  const commentCSVFileName = 'post_comment.csv';
  const contentOutputPath = `${PATH_FOR_OUTPUTS}/${contentCSVFileName}`;
  const commentOutputPath = `${PATH_FOR_OUTPUTS}/${commentCSVFileName}`;
  // Write files
  const WRITE_FILE_ENCODING = 'utf8';
  fs.writeFileSync(contentOutputPath, contentCSV, WRITE_FILE_ENCODING);
  fs.writeFileSync(commentOutputPath, commentCSV, WRITE_FILE_ENCODING);
});
