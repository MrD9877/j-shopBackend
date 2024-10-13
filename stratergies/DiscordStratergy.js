// import Strategy from "passport-discord";
// import passport from "passport";
// import { UserDiscord } from "../mongooseSchemas/discordUser.js";
// var scopes = ['identify', 'email'];

// passport.serializeUser((user, done) => {
//     console.log("seri");
//     done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//     console.log("dis");
//     try {
//         const findUser = await UserDiscord.findById(id);
//         return findUser ? done(null, findUser) : done(null, null);
//     } catch (err) {
//         done(err, null);
//     }
// });


// export default passport.use(new Strategy({
//     clientID: '1291334889018232862',
//     clientSecret: 'UcscIfJeQ25sYHFvExQwP7a8tjFQfZ3j',
//     callbackURL: 'http://localhost:3000/auth',
//     scope: scopes
// },
//     async (accessToken, refreshToken, profile, done) => {
//         let findUser;
//         try {
//             findUser = await UserDiscord.findOne({ discordID: profile.id })
//             if (findUser) { done(null, findUser) }
//             if (!findUser) {
//                 const user = new UserDiscord({
//                     username: profile.username,
//                     discordID: profile.id,
//                     email: profile.email
//                 });
//                 await user.save();
//                 done(null, user)
//             }

//         } catch (err) {
//             console.log(err)
//         }
//     }));