import 'dotenv/config'
import helpers from './lib/helpers.js'
const TOKEN = process.env.GIT_TOKEN
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const STEAM_USER_ID = process.env.STEAM_USER_ID;

export default {
  "services": {
    "github": {
      "repo": "tristanhampton/playground",
      "token": TOKEN,
      "branch": "main",
      "committer": {
        "name": "Tristan Hampton",
        "email": "tristanhampton@icloud.com"
      }
    }
  },
  "sites": [
    {
      "name": "letterboxd",
      "feed": "https://letterboxd.com/tristanhampton/rss",
      "json": false,
      "services": [
        "github"
      ],
      "transform": {
        getId: (data) => {
          const title = helpers.getLetterboxdMovieTitle(data.title);
          return `${title}-${data.guid}`;
        },
        format: (data) => {
          const frontMatterTag = '---\n';
          let content = frontMatterTag;
          const title = helpers.getLetterboxdMovieTitle(data.title);
          content += `title: "${title}"\n`;
          content += `id: ${data.guid}\n`;
          content += `poster: ${helpers.getLetterboxdMoviePoster(data.content)}\n`;
          content += `link: ${data.link}\n`;
          content += `review: "${data.contentSnippet}"\n`;
          content += `date: ${data.isoDate}\n`
          content += frontMatterTag;
          content += data.content;
          return {
            content: content.trim(),
            date: new Date(data.isoDate).toISOString(),
            filePath: `src/_content/_collections/letterboxd/${new Date().getFullYear()}-${helpers.slugify(title)}.md`,
          }
        }
      }
    },
    {
      "name": "goodreads",
      "feed": "https://www.goodreads.com/user/updates_rss/105651598-tristan-hampton",
      "json": false,
      "services": [
        "github"
      ],
      "transform": {
        getId: (data) => {
          const title = helpers.getGoodreadsBookTitle(data.title);
          return `${title}-${data.guid}`
        },
        format: (data) => {
          const title = helpers.getGoodreadsBookTitle(data.title);
          const frontMatterTag = '---\n';
          let content = frontMatterTag;
          content += `title: "${title}"\n`;
          content += `id: ${data.guid}\n`;
          content += `contentSnippet: "${data.contentSnippet}"\n`;
          content += `date: ${data.isoDate}\n`;
          content += `link: ${data.link}\n`;
          content += `cover: ${helpers.getGoodreadsBookCover(data.content)}\n`
          content += `author: ${helpers.getGoodreadsAuthor(data.content)}\n`;
          content += `category: ${helpers.getGoodreadsIsRead(data.contentSnippet)}\n`
          content += frontMatterTag;
          content += data.content;
          return {
            content: content.trim(),
            date: new Date(data.isoDate).toISOString(),
            filePath: `src/_content/_collections/goodreads/${new Date().getFullYear()}-${helpers.slugify(title)}.md`,
          }
        },
        filter: (items) => {
          // only get reviews
          return items.filter(item => {
            return item.guid.includes('Review')
          })
        }
      }
    },
    {
      "name": "strava",
      "feed": "https://feedmyride.net/activities/87509611",
      "json": false,
      "services": [
        "github"
      ],
      "transform": {
        getId: (data) => {
          return `${data.title}-${data.guid}`
        },
        format: (data) => {
          const title = data.title;
          const details = helpers.getStravaData(data.content);
          const frontMatterTag = '---\n';
          let content = frontMatterTag;
          content += `title: "${title}"\n`;
          content += `id: ${data.guid}\n`;
          content += `link: ${data.link}\n`;
          content += `date: ${data.isoDate}\n`;
          content += `rideDate: ${helpers.convertISODate(data.isoDate)}\n`;
          content += `pubDate: ${data.pubDate}\n`;
          content += `type: ${helpers.getStravaType(data.content)}\n`;
          content += `distance: ${details.distance}\n`;
          content += `elevation: ${details.elevation}\n`;
          content += `time: ${details.time}\n`;
          content += `speed: ${details.speed}\n`;
          content += frontMatterTag;
          content += data.content;
          return {
            content: content.trim(),
            date: new Date(data.isoDate).toISOString(),
            filePath: `src/_content/_collections/strava/${new Date().getFullYear()}-${helpers.slugify(title)}.md`,
          }
        }
      }
    },
    {
      "name": "steam",
      "feed": `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_USER_ID}&format=json`,
      "json": true,
      "services": [
        "github"
      ],
      "transform": {
        getId: (data) => {
          // 2024-08-31-gameID
          // set daily id so that it can be updated daily, even though the script is runnin hourly
          const id = `${data.name}-${new Date().getFullYear()}-${new Date().getDate()}-${new Date().getMonth()}-${data.appid}`;
          return id
        },
        format: (data) => {
          const title = data.name;
          const frontMatterTag = '---\n';
          let content = frontMatterTag;
          content += `title: "${data.name}"\n`;
          content += `id: ${data.appid}\n`;
          content += `date: ${new Date().toISOString()}\n`;
          content += `link: games/steam/recent/${helpers.slugify(data.name)}\n`;
          content += `image: http://media.steampowered.com/steamcommunity/public/images/apps/${data.appid}/${data.img_icon_url}.jpg\n`;
          content += `playtime_2weeks: ${data.playtime_2weeks}\n`;
          content += `playtime_forever: ${data.playtime_forever}\n`;
          content += `playtime_windows_forever: ${data.playtime_windows_forever}\n`;
          content += `playtime_mac_forever: ${data.playtime_mac_forever}\n`;
          content += `playtime_linux_forever: ${data.playtime_linux_forever}\n`;
          content += `playtime_deck_forever: ${data.playtime_deck_forever}\n`;
          content += frontMatterTag;

          return {
            content: content.trim(),
            date: new Date().toISOString(),
            filePath: `src/_content/_collections/steam/${helpers.slugify(title)}.md`,
          }
        }
      }
    }
  ]
}