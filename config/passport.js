import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import crypto from 'crypto';
import { promisify } from 'util';
import { findUserByUsername } from '../models/users.js';

const pbkdf2 = promisify(crypto.pbkdf2);

// Simple PBKDF2 Password Hashing (Asynchronous)
async function hashPassword(password, salt) {
  const hash = await pbkdf2(password, salt, 1000, 64, 'sha512');
  return hash.toString('hex');
}

// Configure local strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await findUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      const hash = await hashPassword(password, user.salt);
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
