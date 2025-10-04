// services/githubService.js
const axios = require('axios');
const User = require('../models/User');

exports.fetchUserPRs = async (userId) => {
    try {
        const user = await User.findById(userId); // Get the full user doc with token
        if (!user || !user.githubAccessToken) {
            throw new Error('User or GitHub token not found.');
        }

        const response = await axios.get('https://api.github.com/search/issues', {
            params: {
                q: `is:pr author:${user.username} is:public`, // Search public PRs by the user
                sort: 'created',
                order: 'desc',
            },
            headers: {
                'Authorization': `token ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
        });

        return response.data.items.map(pr => ({
            title: pr.title,
            url: pr.html_url,
            state: pr.state,
            createdAt: pr.created_at,
            repository: pr.repository_url.split('/').slice(-2).join('/'),
        }));
    } catch (error) {
        console.error('Error fetching GitHub PRs:', error);
        throw error;
    }
};