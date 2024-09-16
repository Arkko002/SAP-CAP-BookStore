import { Cart } from "#cds-models/bookstore";
import { BookstoreBaseRepository } from "../../shared/IRepository";

export class CartRepository extends BookstoreBaseRepository<Cart> {
  public constructor() {
    super(Cart);
  }
}

