<?php

namespace Table;

class Table{

	// method magic
	public function __get($get){

		$method = 'get' . ucfirst($get);

		$this->$get = $this->$method();

		return $this->$get;

	}

	/**
	 *	$statement : string
	 *	$attributes : array(string...)
	 *	$options : array( one => boolean , debug => boolean )
	 */
	protected static function query($statement, $attributes=false, $options=[]){

		if(isset($options['debug']) ? $options['debug']===true : false){
			self::debug($statement, $attributes);
		}

		if($attributes){
			return \App::getDb()->prepare($statement, $attributes, get_called_class(), isset($options['one']) ? $options['one']===true : false ); 
		}else{
			return \App::getDb()->query($statement, get_called_class(), isset($options['one']) ? $options['one']===true : false ); 
		}
		
	}

	/**
	 *	$statement : string
	 *	$attributes : array(string...)
	 *	$options : array( debug => boolean )
	 */
	protected static function exec($statement, $attributes, $options=[]){

		if(isset($options['debug']) ? $options['debug']===true : false){
			self::debug($statement, $attributes);
		}
		return \App::getDb()->exec($statement, $attributes);

	}

	/**
	 *	$statement : string
	 *	$attributes : array(string...)
	 */
	private static function debug($statement, $attributes){

		$d_statement = preg_replace("/\t+|\s{2,}|(\-\-\s.*(\s|$))/", ' ', $statement);
		$d_statement = preg_replace("/\s+/", ' ', $d_statement);

		if($attributes){
			foreach ($attributes as $attribute) {
				$d_statement = preg_replace("/\?/", "'$attribute'", $d_statement, 1);
			}
		}

		$wordkey = array('SELECT', 'INSERT', 'DELETE', 'UPDATE', 'FROM', 'SET', 'AND', 'OR', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'WHERE', 'ORDER BY', 'GROUP BY', 'LIMIT');

		foreach ($wordkey as  $word) {
			$tab = '';
			if($word==='AND'||$word==='OR')
				$tab = "\t";
			$d_statement = str_replace($word, "\n$tab$word", $d_statement);
		}

		error_log($d_statement);

	}



}