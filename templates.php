<?php

$loader = new Twig_Loader_Filesystem(__DIR__ . DIRECTORY_SEPARATOR . 'templates');
$twig = new Twig_Environment($loader, ['debug' => true]);
if (getenv('TEMPLATE_CACHE_ENABLED') && getenv('TEMPLATE_CACHE_ENABLED') === 'true') {
    $twig->setCache(__DIR__ . DIRECTORY_SEPARATOR . 'cache');
}
$twig->addExtension(new Twig_Extension_Debug());
