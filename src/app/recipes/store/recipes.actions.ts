import {Action} from '@ngrx/store';
import {Recipe} from '../recipe.model';


export const ADD_RECIPE = '[Recipe] Add Recipe';
export const UPDATE_RECIPE = '[Recipe] Update Recipe';
export const DELETE_RECIPE = '[Recipe] Delete Recipe';


export class AddRecipeAction implements Action {

  readonly type = ADD_RECIPE;

  constructor(public payload: Recipe) {
  }
}


export class UpdateRecipe implements Action {
  readonly type = UPDATE_RECIPE;

  constructor(public payload: { index: number, newRecipe: Recipe }) {
  }

}

export class DeleteRecipe implements Action {
  readonly type = DELETE_RECIPE;

  constructor(public payload: number) {
  }
}
