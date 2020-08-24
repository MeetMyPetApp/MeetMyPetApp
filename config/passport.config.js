const passport = require("passport");
const Owner = require("../models/owner.model");
const SlackStrategy = require("passport-slack").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const slack = new SlackStrategy(
  {
    clientID: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    callbackUrl: "/auth/slack",
  },
  (accessToken, refreshToken, profile, next) => {
    Owner.findOne({ "social.slack": profile.id })
      .then((owner) => {
        if (owner) {
          next(null, owner);
        } else {
          const newOwner = new Owner({
            name: profile.displayName,
            email: profile.owner.email,
            ownername: profile.owner.email.split("@")[0],
            avatar: profile.owner.image_1024,
            password: profile.provider + Math.random().toString(36).substring(7),
            status: 'Hey, I am using MeetMyPet',
            bio: '',
            social: {
              slack: profile.id,
            },
          });

          newOwner
            .save()
            .then((owner) => {
              next(null, owner);
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
    Owner.findOne({ email: profile.emails[0].value })
      .then(owner => {
        if (owner) {
          next(null, owner);
          return;
        } else {

          const newOwner = new Owner({
            name: profile.displayName,
            email: profile.emails[0].value,
            ownername: profile.emails[0].value.split("@")[0],
            avatar: profile._json.picture,
            password: profile.provider + Math.random().toString(36).substring(7),
            status: 'Hey, I am using MeetMyPet',
            bio: '',
            social: {
              google: profile.id,
            },
            googleID: profile.id,
          });

          newOwner
              .save()
              .then((owner) => {
                next(null, owner);
              })
              .catch((err) => next(err));
        }

      })
      .catch(err => done(err));
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
