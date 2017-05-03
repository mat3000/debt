<?php

class Database{

	private $db_name;
	private $db_user;
	private $db_pass;
	private $db_host;
	private $pdo;

	public function __construct($db_host, $db_name, $db_user, $db_pass){

		$this->db_host = $db_host;
		$this->db_name = $db_name;
		$this->db_user = $db_user;
		$this->db_pass = $db_pass;

	}

	private function getPDO(){

		if($this->pdo === null){
			$pdo = new PDO(
				"mysql:dbname=$this->db_name;host=$this->db_host", 
				$this->db_user, 
				$this->db_pass, 
				array( PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8")
			);
			$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$this->pdo = $pdo;
		}

		return $this->pdo;

	}

	public function query($statement, $class, $one=false){

		$req = $this->getPDO()->query($statement);

		// $req->setFetchMode(PDO::FETCH_CLASS, $class);
		$req->setFetchMode(PDO::FETCH_OBJ);
		// $req->setFetchMode(PDO::FETCH_ASSOC);

		if($one) $datas = $req->fetch();
		else $datas = $req->fetchAll();
		
		return $datas;

	}

	public function prepare($statement, $attr, $class, $one=false){

		$req = $this->getPDO()->prepare($statement);
		$req->execute($attr);

		// $req->setFetchMode(PDO::FETCH_CLASS, $class);
		$req->setFetchMode(PDO::FETCH_OBJ);
		// $req->setFetchMode(PDO::FETCH_ASSOC);

		if($one) $datas = $req->fetch();
		else $datas = $req->fetchAll();

		return $datas;

	}

	public function exec($statement, $attr){

		$req = $this->getPDO()->prepare($statement);
		$req->execute($attr);

		return $this->getPDO()->lastInsertId();

	}

}