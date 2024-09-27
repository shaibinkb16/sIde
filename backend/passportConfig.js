import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';

import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  // scope: Specify the scopes if needed
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Ensure profile.email is extracted correctly
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user if one doesn't exist
      user = await User.create({
        username: profile.displayName,
        email,
        password: '', // Skip password for OAuth users
      });
    }

    // Pass the user object to `done`
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  // Store user ID in session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // Retrieve user from database using stored ID
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
