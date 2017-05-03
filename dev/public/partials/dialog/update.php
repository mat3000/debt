<?php

	sleep(2);

?>

<form ng-submit="Users.newDebt.updateDebt()">

    <div>

        <label class="dialog__label">quelle est la personne qui a dépensé ?</label>

        <div class="badge-user-group-radio" >
            <span class="badge-user-radio" ng-repeat="user in Users.users" >
                <input type="radio" name="user" id="radio-{{user.id}}" ng-model="Users.newDebt.debt.id_user" ng-value="user.id" ng-checked="Users.newDebt.debt.id_user==user.id" required />
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

    <div>
        <label class="dialog__label">categorie :</label>
        <select name="category-test" ng-model="Users.newDebt.debt.category_id" required >
            <option value=""></option>
            <option ng-repeat="option in Users.categories" value="{{option.id}}">{{option.label}}</option>
        </select>
    </div>

    <br>

    <div>
        <p>description :</p>
        <textarea ng-model="Users.newDebt.debt.description" autocomplete="off"></textarea>
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

    <br/>

    <div class="dialog__submit">
        <input type="submit" value="MODIFIER" />
        <input type="button" value="SUPPRIMER" class="alert" ng-click="Users.newDebt.removeDebt(Users.newDebt.debt.id_credit)" />
    </div>

</form>