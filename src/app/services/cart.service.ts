import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in our cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;


    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id );
      
      // check if we found it
      alreadyExistInCart = (existingCartItem != undefined);
    }
    
      if(alreadyExistInCart){
        // increment the quantity
        existingCartItem!.quantity++;
      }
      else {
        // just add the item to the array
        this.cartItems.push(theCartItem);
      }

      // compute cart total price and total quantity
      this.computeCartTotals();
    

  }
  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

      // publish the new values ... all subscribers will receive the new data
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);

      // log cart data just for debugging purposes
      this.logCartDate(totalPriceValue, totalQuantityValue);
  }

  logCartDate(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice} subTotlaPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue} `);
    console.log('----');
  }

  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if (theCartItem.quantity === 0){
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }

  }
  remove(theCartItem: CartItem) {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
    
  }

}
