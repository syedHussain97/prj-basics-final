import {NgModule} from '@angular/core';
import {ShoppingListComponent} from './shopping-list.component';
import {ShoppingEditComponent} from './shopping-edit/shopping-edit.component';
import {AppRoutingModule} from '../app-routing.module';
import {ShoppingListRoutingModule} from './shopping-list.routing.module';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';


@NgModule({
  declarations: [ShoppingListComponent,
    ShoppingEditComponent],
  imports: [AppRoutingModule, ShoppingListRoutingModule, SharedModule, FormsModule]
})
export class ShoppingListModule {

}