# 🐦🔀🗑️ Keep or Sweep for Twitter

![](images/screenshot.png)

Based on the great [TwitterOAuth PHP library](https://twitteroauth.com) and its demo site – thanks to [Abraham Williams](https://abrah.am)! 🎉

Using the official [Twitter embedded Tweets](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview), so it shows conversation as well as count of replies & likes for context.


## 🏗 Setup
1. Register a [Twitter app](https://apps.twitter.com).
2. Set `http://localhost:8000/callback.php` as a "Callback URL" in the newly registered application.
3. Copy `.env.template` to `.env`.
4. In `.env`, set the `CONSUMER_KEY` and `CONSUMER_SECRET` from your Twitter app.
5. In a terminal, run `composer install` to install the dependencies.
6. Then run `./dev.sh` to start the server.
7. Visit [http://localhost:8000](http://localhost:8000) in a browser.


## 📑 To do basics
- [ ] Pull the safety plug off the sweep action. Right now you need to manually uncomment the lines in the sweep function of `script.js` … just to be sure.
- [x] Initial load is slow because of many API requests and building the HTML. Better make one request and show result directly, then do the other requests in the background.
- [x] People need a way to log out before reaching the end, currently only works via going to [http://localhost:8000/clearsessions.php](http://localhost:8000/clearsessions.php)
- [x] There’s no count for replies, retweets or likes, and for replies the tweet being replied to is not shown. Could be fixed by replacing [<twitter-status>](https://github.com/abraham/twitter-status) with [Twitter’s official embedded tweets](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview.html).
- [x] Check if statuses/destroy also works for retweets or if `statuses/unretweet` is needed → it’s not needed, because you get a specific ID for your own retweeted version.
- [x] For retweets which are swept, they are also unfavorited.


### 📜 To do advanced
- [ ] Ability to undo last action would be nice. But in the case of sweeping we then need to hold off on actual deletion until the next action.
- [ ] The first batch of Tweets is hackily loaded via inserting invisible elements into the HTML first and getting the IDs from them via Javascript. This should be done properly.
- [ ] Reduce duplication in app.php and loadmore.php
- [ ] Currently it runs through tweets only once, picking random ones along the way. A lot of tweets are skipped that way. (Roughly only 1 in 100 is picked, as one API call is 200 Tweets and we choose randomly, and then use the position as new max_id.) People are prompted to refresh at the end, but maybe we can do this more elegantly if needed.
- [ ] For simplicity, consider to have clicking anywhere on the embedded tweet open it in a new tab (not only the date).
- [ ] Possibly implement showing favorited Tweets too, with `favorites/list` and `favorites/destroy`. Needs additional indicator then.
