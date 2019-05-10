<?php
/**
 * @file
 * Clears PHP sessions and redirects to the connect page.
 */

/* Load and clear sessions */
session_start();
session_destroy();

/* Redirect front page again. */
header('Location: ./');
exit;
