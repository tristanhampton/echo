import TurndownService from 'turndown'
import * as Cheerio from 'cheerio'
import { convert } from 'html-to-text'
import { v4 as uuidv4 } from 'uuid'
import urlRegex from 'url-regex'
import { countableText } from './mastodonCount/counter.js'
import { encode, decode } from 'html-entities'

const turndownForWhat = new TurndownService()

export default {
  toMarkdown: (html) => {
    return turndownForWhat.turndown(html)
  },
  cheerioLoad: (html) => {
    return Cheerio.load(html)
  },
  generateUuid: () => {
    return uuidv4()
  },
  htmlToText: (html) => {
    return convert(html, {
      selectors:
        [
          {
            selector: 'a',
            options: {
              ignoreHref: true

            }
          }
        ]
    })
  },
  getMastodonLength: (string) => {
    return countableText(string).length
  },
  getLinks: (string) => {
    return string.match(urlRegex())
  },
  decode: (string) => {
    return decode(string)
  },
  encode: (string) => {
    return encode(string)
  },
  slugify: (string) => {
    return string.toLowerCase().replace(/[^\w\s]/gi, '').split(' ').join('-')
  },
  getLetterboxdMovieTitle: (string) => {

    // remove rating
    let title = string.replaceAll('★', '');
    title = title.replaceAll('½', '');
    title = title.trim();

    // remove year
    title = title.slice(0, -8);

    return title;
  },
  getLetterboxdMoviePoster: (string) => {
    const hasPoster = string.includes('<img src="')

    if (!hasPoster) {
      return null;
    }

    // Get src from image
    const $ = Cheerio.load(string);
    const imageUrl = $('img').attr('src');

    return imageUrl;
  },
  getGoodreadsBookTitle: (string) => {
    const titleArray = string.split('');
    let inTitle = false;
    let newTitle = '';

    // we know the title is in single quotes, so get text inside quote
    titleArray.forEach(character => {
      if (inTitle && character == '\'') {
        return;
      }

      if (inTitle) {
        newTitle = newTitle + character;
      }

      if (character == '\'') {
        inTitle = true;
      }
    });


    return newTitle.trim();
  },
  getGoodreadsBookCover: (string) => {
    const $ = Cheerio.load(string);
    const imageURL = $('img').attr('src');

    // Image is very small, lets update the URL to get a larger image because Goodreads often uses an S in the URL instead of L for a large image
    const largeImageURL = imageURL.replace(/S([XY]\d+)/, 'M$1');
    return largeImageURL;
  },
  getGoodreadsAuthor: (string) => {
    const $ = Cheerio.load(string);
    let author = $('.by + a').text();
    return author;
  },
  getGoodreadsIsRead: (string) => {

    if (string.includes('wants to read')) {
      return 'want';
    }

    if (string.includes('is currently reading')) {
      return 'currently reading';
    }

    if (string.includes('has read')) {
      return 'read';
    }

    if (string.includes('% done with')) {
      return 'progress';
    }

    return 'read';
  },
  getStravaData: (string) => {
    const data = string.split(': ');
    data.shift();
    const cleanData = {};
    cleanData.distance = data[1].split(', ')[0];
    cleanData.elevation = data[2].split(', ')[0];
    cleanData.time = data[3].split(', ')[0];

    if (string.includes('Average Speed')) {
      cleanData.speed = data[4].split(', ')[0];
    }

    return cleanData;
  },
  getStravaType: (string) => {
    if (string.includes('Ride:')) {
      return 'ride';
    }

    if (string.includes('Walk:')) {
      return 'walk';
    }

    return null;
  },
  convertISODate: (iso) => {
    let date = new Date(iso);
    return date.toDateString();
  }
}
