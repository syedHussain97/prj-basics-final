import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from '../../shared/ingredient.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('f', {static: false})
  slForm: NgForm;

  subscription: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(/*private shoppingListService: ShoppingListService,*/
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.subscription = this.store.select('shoppingList').subscribe((stateData) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.slForm.setValue({
          name: this.editedItem.name,
          amount: this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
    // this.subscription = this.shoppingListService.startedEditing.subscribe((index) => {
    //   this.editMode = true;
    //   this.editedItemIndex = index;
    //   this.editedItem = this.shoppingListService.getIngredient(index);
    //   this.slForm.setValue({
    //     name: this.editedItem.name,
    //     amount: this.editedItem.amount
    //   });
    // });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onAddItem(form: NgForm) {

    const value = form.value;
    const ingredient = new Ingredient(value.name, value.amount);

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
      // this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient);
    } else {

      /*this.shoppingListService.addIngredient(ingredient);*/
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }

    this.slForm.reset();
    this.editMode = false;
  }

  onClear() {
    this.slForm.reset();
    this.editMode = false;
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {

    // this.shoppingListService.deleteItem(this.editedItemIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
