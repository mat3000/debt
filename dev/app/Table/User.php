<?php

namespace Table;

class User extends Table{

	private $values;
	

	public function __construct(){

	}

	public function getUsersIdByName($name){

		$id = self::query("SELECT id FROM user WHERE name=?", [$name], ['one'=>true]);

		return $id->id;

	}

	public function getUsers(){

		// sleep(1);

		return self::query("SELECT * FROM user");

	}
	
	public function getCategories(){
		
		// sleep(1);

		return self::query("SELECT * FROM categories");

	}

	public function getDebt(){

		// sleep(1);

		$data = self::query("SELECT * FROM credit WHERE removed IS NULL ORDER BY credit.id DESC");

		foreach ($data as $key => $value) {

			$d = self::query("SELECT * FROM debit WHERE credit_id=?", [$value->id]);

			$data[$key]->debit = $d;

		}

		$list = [];
		foreach ($data as $k => $v) {
				
				$user_debit=[];
				foreach ($data[$k]->debit as $v1) {
					$user_debit[] = [
						'id_debit'=>$v1->id,
						'id_user'=>$v1->user_id,
						'sum'=>$v1->sum,
						'refund'=>$v1->refunded_date
					];
				}

				$list[] = [
					'id_credit'=>$v->id,
					'id_user'=>$v->user_id,
					'sum'=>$v->sum,
					'date'=>$v->date,
					'category_id'=>$v->category_id,
					'description'=>$v->description,
					'user_debit'=>$user_debit
				];

		}

		return ['users'=> $this->getUsers(), 'categories'=> $this->getCategories(), 'debt'=>$list];

	}

	public function getDebtByCreditId($id){

		$credit = self::query("SELECT *FROM credit WHERE removed IS NULL AND credit.id = ? ORDER BY credit.id DESC", [$id], ['one'=>true]);

		$debit = self::query("SELECT * FROM debit WHERE credit_id=?", [$credit->id]);

		$user_debit=[];
		foreach ($debit as $v1) {
			$user_debit[] = [
				'id_debit'=>$v1->id,
				'id_user'=>$v1->user_id,
				'sum'=>$v1->sum,
				'refund'=>$v1->refunded_date
			];
		}

		$list = [
			'id_credit'=>$credit->id,
			'id_user'=>$credit->user_id,
			'sum'=>$credit->sum,
			'date'=>$credit->date,
			'category_id'=>$credit->category_id,
			'description'=>$credit->description,
			'user_debit'=>$user_debit
		];

		return $list;

	}

	public function addDebt($debt){

		// sleep(1);

		foreach ($debt->user_debit as $user_debit) {

			$date = isset($debt->date) ? $debt->date : date('Y-m-d');
			$user_debit->refund = $debt->id_user === $user_debit->id_user ? $date : null;

		}

		$credit = [
			$debt->id_user,
			$debt->sum,
			isset($debt->date) ? $debt->date : date('Y-m-d'),
			$debt->category_id,
			isset($debt->description) ? $debt->description : null
		];

		$id = self::exec("INSERT INTO credit(user_id, sum, date, category_id, description) VALUES(?, ?, ?, ?, ?)", $credit);

		foreach ($debt->user_debit as $d) {

			$debit = [
				$id,
				$d->id_user,
				$d->sum,
				isset($d->refund) ? $d->refund : null
			];

			self::exec("INSERT INTO debit(credit_id, user_id, sum, refunded_date) VALUES(?, ?, ?, ?)", $debit);

		}

		return $this->getDebtByCreditId($id);

	}

	public function addRecurrenteDebt($type, $day, $debt){

		$id = self::exec("INSERT INTO recurrence(type, day, debt) VALUES(?, ?, ?)", [$type, $day, $debt]);

	}

	public function checkRecurrenteDebt(){

		$date =  date('j');
		$day =  date('w');

		$month = self::query('SELECT debt FROM recurrence WHERE type="month" AND day=?', [$date]);

		$week = self::query('SELECT debt FROM recurrence WHERE type="week" AND day=?', [$day]);


		foreach ($month as $value) {

			$debt = json_decode($value->debt);

			$this->addDebt($debt);

		}
		foreach ($week as $value) {

			$debt = json_decode($value->debt);

			$this->addDebt($debt);

		}

	}

	/*public function updateRecurrenteDebt($type, $day, $debt, $id){
		
		self::exec('UPDATE recurrence SET type = ?, day = ?, debt = ? WHERE id = ?', [$type, $day, $debt, $id]);

	}*/

	public function updateDebt($updateDebt){

		$credit = [
			$updateDebt->id_user,
			$updateDebt->sum,
			$updateDebt->date,
			$updateDebt->category_id,
			isset($updateDebt->description) ? $updateDebt->description : null,
			$updateDebt->id_credit,
		];
		
		self::exec('UPDATE credit SET user_id = ?, sum = ?, date = ?, category_id = ?, description = ? WHERE id = ?', $credit);

		$bdd_debit = self::query('SELECT * FROM debit WHERE credit_id=?', [$updateDebt->id_credit]);


		foreach ($bdd_debit as $vI) {

			$type = $this->compareUser($vI, $updateDebt->user_debit);

			if( $type == 'update' ){

				error_log('------------------------------------- update ---------------------------------------');

				foreach ($updateDebt->user_debit as $user_debit) {

					if($user_debit->id_debit == $vI->id){
						$debit = [
							$user_debit->id_user,
							$user_debit->sum,
							isset($user_debit->refund) ? $user_debit->refund : null,
							$user_debit->id_debit
						];
						self::exec('UPDATE debit SET user_id = ?, sum = ?, refunded_date = ? WHERE id = ?', $debit, ['debug'=>true]);
					}
				}

			}elseif($type=='remove'){

				error_log('------------------------------------- remove ---------------------------------------');

				self::exec('DELETE FROM debit WHERE id=?', [$vI->id], ['debug'=>true]);

			}

		}

		foreach ($updateDebt->user_debit as $user_debit) {

			if(!isset($user_debit->id_debit)){

				error_log('------------------------------------- new ---------------------------------------');

				$debit = [
					$updateDebt->id_credit,
					$user_debit->id_user,
					$user_debit->sum,
					isset($user_debit->refund) ? $user_debit->refund : null
				];

				self::exec("INSERT INTO debit(credit_id, user_id, sum, refunded_date) VALUES(?, ?, ?, ?)", $debit, ['debug'=>true]);

			}

		}

		return $this->getDebtByCreditId($updateDebt->id_credit);

	}

	private function compareUser($ud1, $ud2){
		foreach ($ud2 as $value) {
			if(isset($value->id_debit) && $value->id_debit == $ud1->id) return 'update';
		}
		return 'remove';
	}

	public function removeDebt($debt_id){

		$id = self::exec("UPDATE credit SET removed = NOW() WHERE id = ?", [$debt_id]);

	}

	public function paidDebt($id, $date){

		$debt = json_decode($debt);

		error_log(print_r($debt, true));


		self::exec('UPDATE debit SET refunded_date = ? WHERE id = ?', [$date, $id]);


	}



}

