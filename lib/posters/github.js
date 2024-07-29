/**
 * 
 * @param {*} formatted 
 * @param {*} config 
 * @returns JSON response of fetch request. response.status is likely either 200 or 404
 */
const getPost = async(formatted, config) => {
    const url = `https://api.github.com/repos/${config.repo}/contents/${formatted.filePath}`;

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/vnd.github.v3+json',
            Authorization: `token ${config.token}`
        }
    }

    // Success gives 200, otherwise 404
    const res = await fetch(url, options)
    return res.json();
}

const createPost = async(formatted, config) => {
    const url = `https://api.github.com/repos/${config.repo}/contents/${formatted.filePath}`
    const fileContent = formatted.content
    
    const payload = {
        message: formatted.commit || 'New post',
        content: Buffer.from(fileContent).toString('base64'),
        committer: config.committer,
    }
    
    // If the post already exists, add the SHA so we can replace the content
    const existingPost = await getPost(formatted, config);
    if (existingPost.sha) {
        payload.sha = existingPost.sha;
    }
    
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/vnd.github.v3+json',
            Authorization: `token ${config.token}`
        },
        body: JSON.stringify(payload)
    }

    const res = await fetch(url, options)
    
    return res.json()
}

export default async (config, formatted, site) => {
    const res = await createPost(formatted, config);

    console.log(`⭐ Created post!`)
}