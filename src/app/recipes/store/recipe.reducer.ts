import {Recipe} from '../recipe.model';
import * as RecipeActions from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: []
};

export function recipeReducer(state = initialState, action: RecipeActions.RecipeActions) {

  switch (action.type) {
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      const updateRecipe = {...state.recipes[action.payload.index], ...action.payload.newRecipe};
      const updateRecipes = [...state.recipes];
      updateRecipes[action.payload.index] = updateRecipe;
      return {
        ...state,
        recipes: updateRecipe
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      };
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      };
    default :
      return state;
  }
}
