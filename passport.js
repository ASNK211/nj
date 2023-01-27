const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/User");

const GOOGLE_CLIENT_ID = "285542797384-cvcerr1pgt1ejmi1ufu2rq9jkp8kas28.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_callback_URL = "https://zoolgame.com/api/auth/google/callback"

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_callback_URL,
  // passReqToCallback: true
},
  async (req, accessToken, refreshToken, profile, done) => {
    const defaultUser = {
      username: profile.name.givenName,
      email: profile.emails[0].value,
      googleId: profile.id
    }
    try {
      let user = await User.findOne({ googleId: profile.id })
      if (user) {
        done(null, user)
      } else {
        user = await User.create(defaultUser)
        done(null, user)
      }
    } catch (error) {
      console.error(error)
    }
  }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (_id, done) => {
  User.findById(_id, (err , user) => done(err, user))
})
