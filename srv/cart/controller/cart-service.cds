using {bookstore} from '../../../db/schema';

@path: 'service/cart'
service CartService {
    entity UserCart as projection on bookstore.Carts

    event cartUpdated : {
        userId    : UUID;
        itemId    : UUID;
        quantity  : Integer;
        operation : String enum {
            removed;
            added;
        };
    }

    event addToCart {
        itemId   : UUID;
        quantity : Integer;
        userId   : UUID;
        price    : Integer;
    };

    event removeFromCart {
        itemId   : UUID;
        quantity : Integer;
        price    : Integer;
        userId   : UUID;
    }
}
