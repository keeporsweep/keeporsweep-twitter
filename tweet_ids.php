<?php

require 'bootstrap.php';
use Abraham\TwitterOAuth\TwitterOAuth;

/* Get user access tokens out of the session. */
$access_token = $_SESSION['access_token'];

/* Create a TwitterOauth object with consumer/user tokens. */
$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

/* If method is set change API call made. Test is called by default. */
$user = $connection->get('account/verify_credentials', ['tweet_mode' => 'extended', 'include_entities' => 'true']);

function get_id_str($status) {
    return $status->id_str;
}

$tweets = [];
// max count (amount of tweets you get in one API call) is 200
$options = [
    'count' => 200,
    'trim_user' => TRUE,
];

while (TRUE) {
    if(isset($max_id)) {
        $options['max_id'] = $max_id;
    }
    
    // statuses/user_timeline is tweets and retweets
    // favorites/list is favorites
    $response_data = $connection->get('statuses/user_timeline', $options);
    if (is_object($response_data) && $response_data->errors) {
        break;
    }

    $ids = array_map("get_id_str", $response_data);

    if(isset($max_id)) {
        // remove first element as it is also the last of the former call
        array_shift($ids);
    }

    $tweets = array_merge($tweets, $ids);

    if(count($ids) > 0) {
        $max_id = $ids[count($ids) - 1];
    } else {
        break;
    }

    // uncomment for testing to save API quota:
    //break;
}

header('Content-Type: application/json');
if (is_object($response_data) && $response_data->errors) {
    echo json_encode($response_data);
} else {
    echo json_encode($tweets);
}
