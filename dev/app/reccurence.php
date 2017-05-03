<?php

require '../app/Autoloader.php';

Autoloader::register();

use Table\User;

$user = new User();

$user->checkRecurrenteDebt();