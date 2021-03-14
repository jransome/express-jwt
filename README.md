# Express app that uses JWTs to authenticate users

When a user signs up, their password is hashed and salted before being stored in the db.

A JWT is created and signed from the db user id, then sent back as a cookie (with an expiry). This cookie is checked for on all requests in order to ascertain if the user is logged in. If a valid token is found, then their details are injected into the view headers.

If it does not exist or is invalid (due to eg. being tampered with), the user is (re)directed to login. 

This is all fine and dandy because we are not exposing any state changing endpoints from the app (eg. if this was a bank, a state changing endpoint would be one that allows funds to be transfered). However, if we were, we'd need to look into ways to guard agains Cross Site Request Forgery attacks, which basically exploit a user/victim's authenticated status (thanks to the JWT cookie) to perform actions on their behalf. 
