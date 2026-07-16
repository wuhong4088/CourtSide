import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { findUserByUsername } from '../models/users.js';

// Simple PBKDF2 Password Hashing
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

// Configure local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const hash = hashPassword(password, user.salt);
      if (hash !== user.passwordHash) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.username);
});

// Deserialize user from the session
passport.deserializeUser(async (username, done) => {
  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export { hashPassword };
export default passport;
