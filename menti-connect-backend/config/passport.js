// config/passport.js
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email', 'read:user', 'repo'], // Important scopes
    },
    async (accessToken, refreshToken, profile, done) => {
        const { id, username, emails, photos } = profile;
        const email = emails[0].value;

        try {
            let user = await User.findOne({ githubId: id });

            if (user) {
                // User exists, update token and maybe other details
                user.githubAccessToken = accessToken;
                await user.save();
                done(null, user);
            } else {
                // New user, create in DB
                const newUser = await User.create({
                    githubId: id,
                    username: username,
                    email: email,
                    avatarUrl: photos[0].value,
                    githubAccessToken: accessToken,
                });
                done(null, newUser);
            }
        } catch (err) {
            console.error(err);
            done(err, null);
        }
    }));
};