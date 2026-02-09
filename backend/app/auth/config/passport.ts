import passport from "passport";
import { Strategy as GoogleStrategy, Profile as GoogleProfile } from "passport-google-oauth20";
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from "passport-github2";
import User from "../schemas/user.schema";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken: string, _refreshToken: string, profile: GoogleProfile, done: (err: Error | null, user?: Express.User | false) => void) => {
      try {
        const googleEmail = profile.emails?.[0]?.value;
        const googleId = profile.id;

        if (!googleEmail) {
          return done(new Error("Google account has no email"));
        }

        const existingGoogleUser = await User.findOne({ googleId });
        if (existingGoogleUser && existingGoogleUser.email !== googleEmail) {
          return done(new Error("Google account already linked"));
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

        return done(null, user as unknown as Express.User);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: process.env.GITHUB_CALLBACK_URL || "http://localhost:5000/api/auth/github/callback",
      },
      async (accessToken: string, _refreshToken: string, profile: GitHubProfile, done: (err: Error | null, user?: Express.User | false) => void) => {
        try {
          const githubEmail = profile.emails?.[0]?.value;
          const githubId = profile.id;

          if (!githubEmail) {
            return done(new Error("GitHub account has no public email"));
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

          return done(null, user as unknown as Express.User);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
} else {
  console.warn("GitHub Client ID or Secret missing. GitHub authentication disabled.");
}

export default passport;
