import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {
  @ViewChild('name') nameRef: ElementRef;
  @ViewChild('amount') amountRef: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
  }

  onSubmit() {
    const ingName = this.nameRef.nativeElement.value;
    const ingAmount = this.amountRef.nativeElement.value;
    const ingredient = new Ingredient(ingName, ingAmount);
    this.shoppingListService.addIngredient(ingredient);
  }

}
