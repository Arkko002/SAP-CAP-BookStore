using {bookstore} from '../../db/schema';

@path: 'service/orders'
service OrdersService {
    entity Orders as projection on  bookstore.Orders;
}
