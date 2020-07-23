import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../../recipes/store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.id = +this.route.snapshot.params['id'];

    this.route.params.pipe(map(param => +param['id']),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState => {
        return recipeState.recipes.find((recipe, index) => {
          return index === this.id;
        });
      })
    ).subscribe(recipe => this.recipe = recipe);

    // this.route.params.subscribe(params => {
    //   this.id = +params['id'];
    //   this.recipe = this.recipeService.getRecipeById(this.id);
    // });

    // this.recipe = this.recipeService.getRecipeById(this.id);
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
  }

  navigateToRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  deleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}

