const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        }

        try {
            //Checking the database to see if the userid already exists, if it does we don't need to add it again.
            let user = await User.findOne({googleId: profile.id})

            if(user) {
                done(null, user)
            } else {
                //if not create a new user
                user = await User.create(newUser)
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }
        })
        )

    passport.serializeUser(function (user,done) {
        done(null, user.id)
    })

    passport.deserializeUser(function (id,done) {
        User.findById(id, function (err,user){
            done(err,user)
        })
    })
}