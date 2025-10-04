// controllers/githubController.js
const { fetchUserPRs } = require('../services/githubService');

// @desc    Get latest pull requests for authenticated user
// @route   GET /api/github/prs
exports.getPullRequests = async (req, res) => {
    try {
        const prs = await fetchUserPRs(req.user.id);
        res.status(200).json(prs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch GitHub PRs' });
    }
};