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

// Analyze user's GitHub activity for AI matching
exports.analyzeUserActivity = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.githubAccessToken) {
            console.log('No user or GitHub token found for user:', userId);
            return null;
        }

        // Skip GitHub API calls for test tokens
        if (user.githubAccessToken.startsWith('test_')) {
            console.log('Skipping GitHub API calls for test user');
            return null;
        }

        console.log('Fetching GitHub data for user:', user.username);

        // Get user's repositories with timeout
        const reposResponse = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            params: {
                sort: 'updated',
                per_page: 10
            },
            timeout: 10000 // 10 second timeout
        });

        // Analyze repositories for skills
        const languages = {};
        let totalCommits = 0;
        
        for (const repo of reposResponse.data) {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
            totalCommits += repo.size || 0;
        }

        // Get recent activity with timeout
        const activityResponse = await axios.get('https://api.github.com/search/issues', {
            params: {
                q: `is:pr author:${user.username} is:public created:>2024-01-01`,
                sort: 'created',
                order: 'desc',
            },
            headers: {
                'Authorization': `token ${user.githubAccessToken}`,
                'Accept': 'application/vnd.github.v3+json',
            },
            timeout: 10000 // 10 second timeout
        });

        const recentPRs = activityResponse.data.items.length;
        const topLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([lang]) => lang);

        console.log('GitHub data fetched successfully for user:', user.username);

        return {
            totalRepos: reposResponse.data.length,
            totalCommits,
            languages: topLanguages,
            activityLevel: recentPRs > 10 ? 'high' : recentPRs > 5 ? 'medium' : 'low',
            recentPRs,
            openSourceContributions: activityResponse.data.items.filter(pr => 
                !pr.repository_url.includes(user.username)
            ).length,
            skillIndicators: {
                frontend: topLanguages.includes('JavaScript') || topLanguages.includes('TypeScript') ? 85 : 0,
                backend: topLanguages.includes('Python') || topLanguages.includes('Java') ? 70 : 0,
                devops: topLanguages.includes('Docker') || topLanguages.includes('YAML') ? 45 : 0,
                testing: recentPRs > 5 ? 60 : 30
            }
        };
    } catch (error) {
        console.error('Error analyzing GitHub activity:', error.message);
        // Return null instead of throwing to allow graceful fallback
        return null;
    }
};