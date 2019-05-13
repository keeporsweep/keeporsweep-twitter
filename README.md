# 🐦🔀🗑️ Keep or Sweep for Twitter

Platforms like Twitter, Facebook and Instagram have your embarrassing old stuff that not even you know about anymore. Time to take a trip down memory lane and sweep it!

![](images/screenshot.png)

The app fetches all of a user’s Tweets from the Twitter API, randomizes, and displays them as embed one at a time to keep or sweep.



## 💬 Testimonials

> Every Nigerian politician needs this app so they can clean up their old lies.

– [@enobong](https://twitter.com/enobong), 129+ Sweeps


> Before I start using this, please remember that people can change.

– [@hugoroyd](https://twitter.com/hugoroyd), 41 sweeps


> Aaah where's the funny stuff!?

– [@madeline_oh](https://twitter.com/madeline_oh), 29 sweeps


> had a great meal: vegetables

– [@pierreozoux](https://twitter.com/pierreozoux) (back in 2009), 27 sweeps


> I used this app and my cryptocoins are all still there.
>
> Trustworthy

– [@mradwanz](https://twitter.com/mradwanz), 21 Sweeps


> Very very fun! Can you do this with other people's accounts?

– [@christalib_](https://twitter.com/christalib_), 15 sweeps, including an accidental one


> Ooh this is very empowering!
>
> Marie Kondo would be proud of this app

– [@saadcaffeine](https://twitter.com/saadcaffeine), 13 Sweeps


> `Insert testimonial here`

– [@myamy_vicy](https://twitter.com/myamy_vicy), 12 Sweeps

What do you think about Keep or Sweep? Let us know and include your Twitter username and Sweep score!


## 🏗 Setup
1. Register a [Twitter app](https://apps.twitter.com).
2. Set `http://localhost:8000/callback.php` as a "Callback URL" in the newly registered application.
3. Copy `.env.template` to `.env`.
4. In `.env`, set the `CONSUMER_KEY` and `CONSUMER_SECRET` from your Twitter app.
5. In a terminal, run `composer install` to install the dependencies.
6. Then run `./dev.sh` to start the server.
7. Visit [http://localhost:8000](http://localhost:8000) in a browser.


## 🚦 Fixes and features

### 🐛 Issues happening often
- Embedded Tweets sometimes exceed viewport: Use max-height of embed or CSS to prevent overflow. → Seems the embed parameters `cards: 'hidden'` or `width: '550'` are not honored?
- People don’t know their passwords. We could possibly have a fallback where you just put in your username, and swept Tweets are added onto a list you could mail to yourself at the end.

### 📑 Enhancements
- People in the audience have difficulty reading the Tweets: Needs a bigger screen for presentation, external monitor or even projector. Vertical monitor would be perfect for display of Tweet embed.
- Unclear when Tweets are Retweets: Needs a better indicator for Retweets.
- Sound effects not audible at crowded events: Need to be louder.
- Sweeping could be more satisfying: Sound effects for spree sweeps (m-m-m-MONSTER SWEEP!) like in Unreal Tournament.
- Possibly implement showing favorited Tweets too, with `favorites/list` and `favorites/destroy`. Needs additional indicator then.
- Ability to undo last action would be nice. But in the case of sweeping we then need to hold off on actual deletion until the next action.

### 📜 Advanced stuff and details
- Mouse cursor keeps showing when buttons are used: Hide mouse when in fullscreen and not moving.
- Currently white screen when Twitter can’t be reached, instead show note about it (maybe also wifi is slow).
- Could also display people you are following, to unfollow. However it’s a level above (kind of a "collection" and not a single element) and thus there’s less context there.
- Super like / Love: Additional button which retweets _and_ likes the Tweet, even if it is your own.
- Global high score table of sweep counter → maybe just Tweet from @keeporsweep with messages like "Yeah! @username swept 12 Tweets using http://keeporsweep.net 👏"
- Keep or Sweep x Wahl-o-mat: Show anonymized tweets of politicians, and show a result screen of parties you most agreed with.


## ❤ Thanks

Based on the great [TwitterOAuth PHP library](https://twitteroauth.com) and its demo site – thanks to [Abraham Williams](https://abrah.am)! 🎉

Using the official [Twitter embedded Tweets](https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/overview), so it shows conversation as well as count of replies & likes for context.
