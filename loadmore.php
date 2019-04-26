<?php

require 'bootstrap.php';
use Abraham\TwitterOAuth\TwitterOAuth;

/* If access tokens are not available redirect to connect page. */
if (empty($_SESSION['access_token']) ||
    empty($_SESSION['access_token']['oauth_token']) ||
    empty($_SESSION['access_token']['oauth_token_secret'])
) {
    header('Location: ./clearsessions.php');
    exit;
}

/* Get user access tokens out of the session. */
$access_token = $_SESSION['access_token'];

/* Create a TwitterOauth object with consumer/user tokens. */
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

/* If method is set change API call made. Test is called by default. */
$user = $connection->get('account/verify_credentials', ['tweet_mode' => 'extended', 'include_entities' => 'true']);


// More requests take more time. Use a lower number for quick testing
// The more requests, the older the tweets
// To go through a profile with 10.000 Tweets you need a minimum of 50 requests
// (50 * 200 API count limit, and then there’s the random offset)
$max_requests = 5;
$tweets = [];
// max count (amount of tweets you get in one API call) is 200
$count = 200;
if(isset($_GET['id_str'])) {
    $chosen_id = htmlspecialchars($_GET['id_str']);
}

for ($i = 0; $i < $max_requests; $i++) {
    // statuses/user_timeline is tweets and retweets
    // favorites/list is favorites
    if(isset($chosen_id)) {
        $statuses = $connection->get('statuses/user_timeline', [
            'count' => $count,
            'max_id' => $chosen_id
        ]);
    } else {
        $statuses = $connection->get('statuses/user_timeline', [
            'count' => $count
        ]);
    }

    // Random offset so it doesn't always take the 200th, 400th, etc tweet
    // count minus 1 so it doesn’t pick the same tweet twice
    $offset = rand(1, $count-1);
    $index = $count - $offset;

    // Exit loop if end of statuses is reached
    if(!isset($statuses[$index])) {
        break;
    }

    // Add chosen tweet id to tweets array
    $chosen_id = $statuses[$index]->id_str;
    array_push($tweets, $chosen_id);

    // Log to check how long it takes and to have Tweet IDs for reference
    error_log(print_r($chosen_id, TRUE));
}

// Randomize
shuffle($tweets);

// Hand back to the Javascript
echo json_encode($tweets);
