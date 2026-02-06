import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../schemas/user.schema";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const googleEmail = profile.emails?.[0]?.value;
        const googleId = profile.id;

        if (!googleEmail) {
          return done(new Error("Google account has no email"), undefined);
        }


        const existingGoogleUser = await User.findOne({ googleId });
        if (existingGoogleUser && existingGoogleUser.email !== googleEmail) {
          return done(new Error("Google account already linked"), undefined);
        }

        let user = await User.findOne({ email: googleEmail });

        if (!user) {
          user = await User.create({
            email: googleEmail,
            googleId,
            authProviders: ["google"],
            isVerified: true,
          });
        } else {
          if (!user.authProviders.includes("google")) {
            user.authProviders.push("google");
          }

          if (!user.googleId) {
            user.googleId = googleId;
          }

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

import { Strategy as GitHubStrategy } from "passport-github2";

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
      },
      async (accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          const githubEmail = profile.emails?.[0]?.value;
          const githubId = profile.id;

          if (!githubEmail) {
            return done(new Error("GitHub account has no public email"), undefined);
          }

          let user = await User.findOne({ githubId });

          if (!user) {
            user = await User.findOne({ email: githubEmail });
          }

          if (!user) {
            user = await User.create({
              email: githubEmail,
              githubId,
              githubAccessToken: accessToken,
              authProviders: ["github"],
              isVerified: true,
            });
          } else {
            if (!user.authProviders.includes("github")) {
              user.authProviders.push("github");
            }
            user.githubId = githubId;
            user.githubAccessToken = accessToken;
            await user.save();
          }

          return done(null, user);
        } catch (err) {
          return done(err, undefined);
        }
      }
    )
  );
} else {
  console.warn("GitHub Client ID or Secret missing. GitHub authentication disabled.");
}

export default passport;


