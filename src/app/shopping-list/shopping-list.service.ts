import {Ingredient} from '../shared/ingredient.model';
import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class ShoppingListService {

  ingredientsChanged = new EventEmitter<Ingredient[]>();
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
    this.ingredientsChanged.emit(this.ingredients.slice());
  }

  public addIngredients(ingredients: Ingredient[]) {

    // for (const ingredient of ingredients) {
    //     this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.ingredients.slice());
  }


}
