import {NgModule} from '@angular/core';
import {ShoppingListComponent} from './shopping-list.component';
import {ShoppingEditComponent} from './shopping-edit/shopping-edit.component';
import {AppRoutingModule} from '../app-routing.module';
import {ShoppingListRoutingModule} from './shopping-list.routing.module';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [ShoppingListComponent,
    ShoppingEditComponent],
  imports: [AppRoutingModule, ShoppingListRoutingModule, CommonModule, FormsModule]
})
export class ShoppingModule {

}
