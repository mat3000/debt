<?php

// ini_set("display_errors",0);
// error_reporting(0);

session_set_cookie_params(3600); // 1 hour
session_start();
require '../app/Autoloader.php';
Autoloader::register();

use Table\User;

$user = new User();

$action = isset($_GET['action']) ? $_GET['action'] : false;


if($action==='getUsers'){

	echo json_encode($user->getUsers());

}elseif($action==='getCategories'){

	echo json_encode($user->getCategories());

}elseif($action==='getDebt'){

	echo json_encode($user->getDebt());

}elseif($action==='addDebt'){

	$debt = isset($_GET['debt']) ? json_decode($_GET['debt']) : false;

	echo json_encode($user->addDebt($debt));

}elseif($action==='updateDebt'){

	$debt = isset($_GET['debt']) ? json_decode($_GET['debt']) : false;

	echo json_encode($user->updateDebt($debt));

}elseif($action==='removeDebt'){

	$debt_id = isset($_GET['debt_id']) ? $_GET['debt_id'] : false;

	echo json_encode($user->removeDebt($debt_id));

}elseif($action==='paidDebt'){

	$id_debit = isset($_GET['id_debit']) ? $_GET['id_debit'] : false;
	$date = isset($_GET['date']) ? $_GET['date'] : false;

	echo json_encode($user->paidDebt($id_debit, $date));

}elseif($action==='addRecurrenteDebt'){

	$type = isset($_GET['type']) ? $_GET['type'] : false;
	$day = isset($_GET['day']) ? $_GET['day'] : false;
	$debt = isset($_GET['debt']) ? $_GET['debt'] : false;

	echo json_encode($user->addRecurrenteDebt($type, $day, $debt));

}elseif($action==='checkRecurrenteDebt'){

	echo json_encode($user->checkRecurrenteDebt());

}

