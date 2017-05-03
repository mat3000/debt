<?php

class App{

	const DB_HOST = 'localhost';	/* replace('localhost', 'mysql51-74.perso') */
	const DB_NAME = 'dette';			/* replace('dette', 'matdevsql') */
	const DB_USER = 'root';			/* replace('root', 'matdevsql') */
	const DB_PASS = 'root';			/* replace('root', 'nDjx0sfK') */

	private static $database;

	public static function getDb(){

		if(self::$database===null){

			self::$database = new Database(self::DB_HOST, self::DB_NAME, self::DB_USER, self::DB_PASS);

		}

		return self::$database;

	}

}