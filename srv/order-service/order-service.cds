using {bookstore} from '../../db/schema';

service OrdersService {
    entity Orders as projection on  bookstore.Orders;
}
