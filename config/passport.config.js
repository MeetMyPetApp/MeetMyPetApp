const passport = require("passport");
const User = require("../models/user.model");
const SlackStrategy = require("passport-slack").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const slack = new SlackStrategy(
  {
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackUrl: "/auth/slack",
  },
  (accessToken, refreshToken, profile, next) => {
    User.findOne({ "social.slack": profile.id })
      .then((user) => {
        if (user) {
          next(null, user);
        } else {
          const newUser = new User({
            name: profile.displayName,
            email: profile.user.email,
            username: profile.user.email.split("@")[0],
            avatar: profile.user.image_1024,
            password: profile.provider + Math.random().toString(36).substring(7),
            status: 'Hey, I am using MeetMyPet',
            bio: '',
            social: {
              slack: profile.id,
            },
          });

          newUser
            .save()
            .then((user) => {
              next(null, user);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
);

const google = new GoogleStrategy(
  {
    clientID: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },

  (accessToken, refreshToken, profile, next) => {
    User.findOne({ email: profile.emails[0].value })
      .then(user => {
        if (user) {
          next(null, user);
          return;
        } else {

          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.emails[0].value.split("@")[0],
            avatar: profile._json.picture,
            password: profile.provider + Math.random().toString(36).substring(7),
            status: 'Hey, I am using MeetMyPet',
            bio: '',
            social: {
              google: profile.id,
            },
            googleID: profile.id,
          });

          newUser
              .save()
              .then((user) => {
                next(null, user);
              })
              .catch((err) => next(err));
        }

      })
      .catch(err => next(err));
  }
);


passport.use(slack)
passport.use(google)

passport.serializeUser(function(user, next) {
  next(null, user);
});

passport.deserializeUser(function(user, next) {
  next(null, user);
});

module.exports = passport.initialize()
