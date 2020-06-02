import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipeService} from './recipe.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
  providers: [RecipeService]
})
export class RecipesComponent implements OnInit, OnDestroy {
  // removing recipe service as it is no longer needed, router link does the work for us
  // selectedRecipe: Recipe;
  private recipeSelectedSubscription: Subscription;

  // constructor(private recipeService: RecipeService) {
  // }

  ngOnInit() {
    // this.recipeSelectedSubscription = this.recipeService.recipeSelected.subscribe(
    //   (recipe: Recipe) => {
    //     this.selectedRecipe = recipe;
    //   }
    // );
  }

  ngOnDestroy() {
    // this.recipeSelectedSubscription.unsubscribe();
  }

}
