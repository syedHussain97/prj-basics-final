import {NgModule} from '@angular/core';
import {RecipesComponent} from './recipes.component';
import {AuthGuard} from '../auth/auth.guard';
import {RecipeStartComponent} from './recipe-start/recipe-start.component';
import {RecipeEditComponent} from './recipe-edit/recipe-edit.component';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';
import {RecipesResolverService} from './recipes-resolver.service';
import {Router, RouterModule, Routes} from '@angular/router';


const recipesRoute: Routes = [{
  path: 'recipes',
  component: RecipesComponent,
  canActivate: [AuthGuard],
  children: [
    {path: '', component: RecipeStartComponent},
    {path: 'new', component: RecipeEditComponent},
    {path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService]},
    {path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService]}
  ]
}];

@NgModule({imports: [RouterModule.forChild(recipesRoute)], exports: [RouterModule]})
export class RecipesRoutingModule {
}
