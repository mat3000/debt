<?php

	sleep(2);
?>

<form ng-submit="Users.newDebt.addNewDebt()">

    <div>

        <label class="dialog__label">quelle est la personne qui a dépensé ?</label>

        <div class="badge-user-group-radio" >
            <span class="badge-user-radio" ng-repeat="user in Users.users" >
                <input type="radio" name="user" id="radio-{{user.id}}" ng-model="Users.newDebt.debt.id_user" ng-value="user.id" required />
                <label class="badge-user" for="radio-{{user.id}}" data-letter="{{user.name[0]}}" style="background: {{user.color}};"></label>
            </span>
        </div>

    </div>

    <br>

    <div>
        <label class="dialog__label">combien a t'elle dépensé ?</label>
        <input type="text" name="totalsum" ng-model="Users.newDebt.debt.sum" ng-change="Users.newDebt.updateSum()" required autocomplete="off" />
    </div>

    <br>

    <div ng-class="{disabled: Users.newDebt.debt.recurrence.type==='month' || Users.newDebt.debt.recurrence.type==='week'}" >
        <label class="dialog__label">quand ?</label>
        <input type="text" name="date" ng-model="Users.newDebt.debt.date" ui-date="Users.newDebt.dateOptions" required autocomplete="off" ng-disabled="Users.newDebt.debt.recurrence.type==='month' || Users.newDebt.debt.recurrence.type==='week'"/>
    </div>

    <br>

    <!-- <div>
        <label class="dialog__label">categorie :</label>
        <select name="category" ng-options="option.id as option.label for option in Users.categories track by option.id" ng-model="Users.newDebt.debt.category_id" required >
        	<option value=""></option>
        </select>
    </div> -->
    <div>
        <label class="dialog__label">categorie :</label>
        <select name="category-test" ng-model="Users.newDebt.debt.category_id" required >
            <option value=""></option>
            <option ng-repeat="option in Users.categories" value="{{option.id}}">{{option.label}}</option>
        </select>
    </div>

    <br>

    <div>
        <label class="dialog__label">description :</label>
        <textarea ng-model="Users.newDebt.debt.description" autocomplete="off" rows="4"></textarea>
    </div>

    <br>

    <div>

        <label class="dialog__label">réparticipation :</label>

        <div class="badge-user-group-checkbox" >

            <span class="badge-user-checkbox" ng-repeat="(k, user) in Users.users" >

                <input type="checkbox" name="userDebt" id="checkbox-{{user.id}}" ng-checked="Users.newDebt.checkChecked(user)" ng-click="Users.newDebt.updateCheck(user)" ng-required="Users.newDebt.checkRequired()" />
                
                <label class="badge-user" for="checkbox-{{user.id}}" data-letter="{{user.name[0]}}" style="background: {{user.color}};"></label>

                <input type="text" name="sum" ng-model="user.sum" ng-value="Users.newDebt.checkSum(user)" ng-change="Users.newDebt.balanceSum(user)" autocomplete="off" ng-disabled="!Users.newDebt.checkChecked(user)"/>

            </span>

        </div>

    </div>

    <div>
        <p>récurrence : </p>

        <select name="recurrence" ng-model="Users.newDebt.debt.recurrence.type">
            <option value="" selected>aucune</option>
            <option value="month">une fois par mois</option>
            <option value="week">une fois par semaine</option>
        </select>

        <select name="date" ng-model="Users.newDebt.debt.recurrence.date" ng-show="Users.newDebt.debt.recurrence.type==='month'" ng-required="Users.newDebt.debt.recurrence.type==='month'" >
        	<option value=""></option>
            <option ng-repeat="n in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]" value="{{n}}">{{n}}</option>
        </select>

        <select name="day" ng-model="Users.newDebt.debt.recurrence.day" ng-show="Users.newDebt.debt.recurrence.type==='week'" ng-required="Users.newDebt.debt.recurrence.type==='week'" >
        	<option value=""></option>
            <option value="1">lundi</option>
            <option value="2">mardi</option>
            <option value="3">mercredi</option>
            <option value="4">jeudi</option>
            <option value="5">vendredi</option>
            <option value="6">samedi</option>
            <option value="0">dimanche</option>
        </select>

    </div>

    <br/>


    <div class="dialog__submit">
        <input type="submit" value="AJOUTER" />
    </div>

</form>