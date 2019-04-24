<?php

// All auth code just copied again from app.php

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
$user = $connection->get('account/verify_credentials');


if (property_exists($user, 'status')) {
    // Delete is statuses/destroy, use favorites/create or /destroy for testing
    // For retweets it’s statuses/unretweet
    $tweet = $connection->post('statuses/destroy', [
      'id' => htmlspecialchars($_GET['id_str'])
    ]);
} else {
    $tweet = [];
}
