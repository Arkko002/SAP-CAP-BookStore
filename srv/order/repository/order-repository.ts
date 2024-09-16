import { Order, Orders } from "../../@cds-models/bookstore";
import { BookstoreBaseRepository } from "../../shared/IRepository";

export class OrderRepository extends BookstoreBaseRepository<Order> {
    public constructor() {
	super(Order);
    }
}

export class OrdersRepository extends BookstoreBaseRepository<Orders> {
    public constructor() {
	super(Orders);
    }
}
