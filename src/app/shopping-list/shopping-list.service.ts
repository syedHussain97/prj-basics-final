import {Ingredient} from '../shared/ingredient.model';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class ShoppingListService {

  ingredientsChanged = new Subject<Ingredient[]>();

  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  public getIngredients() {
    return this.ingredients.slice();
  }

  public addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient);
    // incase of update to the original array, we should create an event
    // emitter that would be delivering the changes to those subsrcibed
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  public getIngredient(index: number) {
    return this.ingredients[index];

  }

  public addIngredients(ingredients: Ingredient[]) {

    // for (const ingredient of ingredients) {
    //     this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient: Ingredient) {
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteItem(index: number) {
    this.ingredients.splice(index, 1);
    this.ingredientsChanged.next(this.ingredients.slice());
  }


}
