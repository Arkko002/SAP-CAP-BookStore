import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { Order, Orders } from "../../@cds-models/bookstore";

export class OrderRepository extends BaseRepository<Order> {
    public constructor() {
	super(Order);
    }
}

export class OrdersRepository extends BaseRepository<Orders> {
    public constructor() {
	super(Orders);
    }
}
