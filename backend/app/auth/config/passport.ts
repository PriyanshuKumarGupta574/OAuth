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

        // Safety check: googleId must be unique
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

export default passport;


// import passport from "passport";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import User from "../schemas/user.schema";

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL!,
//     },
//     async (_accessToken, _refreshToken, profile, done) => {
//       try {
//         const googleEmail = profile.emails?.[0]?.value;

//         if (!googleEmail) {
//           return done(new Error("Google account has no email"), undefined);
//         }

//         let user = await User.findOne({ email: googleEmail });

//         if (!user) {
//           user = await User.create({
//             email: googleEmail,
//             googleId: profile.id,
//             authProviders: ["google"],
//             isVerified: true,
//           });
//         } else {
//           if (!user.googleId) {
//             user.googleId = profile.id;

//             if (!user.authProviders.includes("google")) {
//               user.authProviders.push("google");
//             }

//             await user.save();
//           }
//         }

//         return done(null, user);
//       } catch (err) {
//         return done(err, undefined);
//       }
//     }
//   )
// );

// export default passport;
