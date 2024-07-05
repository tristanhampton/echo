import helpers from './lib/helpers.js'
const TOKEN = process.env.GIT_TOKEN
console.log(TOKEN)

export default {
    "services": {
        "github": {
            "repo": "tristanhampton/portfolio-2022",
            "token": TOKEN,
            "branch": "master",
            "committer": {
                "name": "Tristan Hampton",
                "email": "tristanhampton@icloud.com"
            }
        }
    },
    "sites": [
        // {
        //     "name": "letterboxd",
        //     "feed": "https://letterboxd.com/tristanhampton/rss",
        //     "json": false,
        //     "services": [
        //         "github"
        //     ],
        //     "transform": {
        //         getId: (data) => {
        //             return data.guid
        //         },
        //         format: (data) => {
        //             const frontMatterTag = '---\n';
        //             let content = frontMatterTag;
        //             const title = helpers.getLetterboxdMovieTitle(data.title);
        //             content += `title: "${title}"\n`;
        //             content += `id: ${data.guid}\n`;
        //             content += `poster: ${helpers.getLetterboxdMoviePoster(data.content)}\n`;
        //             content += `link: ${data.link}\n`;
        //             content += `review: "${data.contentSnippet}"\n`;
        //             content += `isoDate: ${data.isoDate}\n`
        //             content += frontMatterTag;
        //             content += data.content;
        //             return {
        //                 content: content.trim(),
        //                 date: new Date(data.isoDate).toISOString(),
        //                 filePath: `src/content/letterboxd/${new Date().getFullYear()}-${helpers.slugify(title)}.md`,
        //             }
        //         }
        //     }
        // },
        {
            "name": "goodreads",
            "feed": "https://www.goodreads.com/user/updates_rss/105651598-tristan-hampton",
            "json": false,
            "services": [
                "github"
            ],
            "transform": {
                getId: (data) => {
                    return data.guid
                },
                format: (data) => {
                    const title = helpers.getGoodreadsBookTitle(data.title)
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
                        filePath: `src/content/goodreads/${new Date().getFullYear()}-${helpers.slugify(title)}.md`,
                    }
                },
                filter: (items) => {
                    // only get reviews
                    return items.filter(item => {
                        return item.guid.includes('Review')
                    })
                }
            }
        }
    ]
}