import { CartItem } from "#cds-models/bookstore";
import { BookstoreBaseRepository } from "../../shared/IRepository";

export class CartItemRepository extends BookstoreBaseRepository<CartItem> {
  public constructor() {
    super(CartItem);
  }
}

