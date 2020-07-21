import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../recipe.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  recipeChangedSubscription: Subscription;

  constructor(private recipeService: RecipeService,
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    // this.recipes = this.recipeService.getRecipes();
    // this.recipeChangedSubscription =
    //   this.recipeService.recipesChanged.subscribe(updatedRecipesArray => this.recipes = updatedRecipesArray);
    this.recipeChangedSubscription = this.store.select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe(updatedRecipesArray => this.recipes = updatedRecipesArray);
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.recipeChangedSubscription.unsubscribe();
  }
}
