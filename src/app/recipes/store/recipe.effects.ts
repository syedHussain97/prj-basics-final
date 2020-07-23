import {Actions, Effect, ofType} from '@ngrx/effects';
import * as RecipesActions from './recipe.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import * as fromApp from '../../store/app.reducer';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';

@Injectable()
export class RecipeEffects {

  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>('https://learning-angular-http-request.firebaseio.com/recipes.json');
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    map(recipes => new RecipesActions.SetRecipes(recipes))
  );


  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put('https://learning-angular-http-request.firebaseio.com/recipes.json', recipesState.recipes);
    }));

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {
  }
}
