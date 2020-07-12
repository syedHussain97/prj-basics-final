import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  recipeSelected = new Subject<Recipe>();

  // private recipes: Recipe[] = [
  //   new Recipe('A Test Recipe', 'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20),
  //     ]),
  //   new Recipe('Big freaking Burger ', 'This is simply a test :)',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg', [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1),
  //     ])
  // ];
  private recipes: Recipe[] = [];

  constructor(private shoppingListService: ShoppingListService,
              private store: Store<fromShoppingList.AppState>) {

  }

  // Slice because we are returning a copy
  public getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shoppingListService.addIngredients(ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));

  }

  public getRecipeById(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(recipes.slice());
  }
}
