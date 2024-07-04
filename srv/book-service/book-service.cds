using {bookstore} from '../../db/schema';
using {User} from '@sap/cds/common';

@path: 'service/books'
service BooksService {
    entity ListOfBooks as
        projection on bookstore.Books
        excluding {
            description,
            soldNumber,
	    sold,
        };

    entity Books  as
        projection on bookstore.Books {
            *
        }
        excluding {
            createdBy,
            modifiedBy,
        };

    action submitOrder(book: Books:ID, quantity: Integer);
    event OrderedBook : {bookId: Books:ID; quantity: Integer; buyer: User}
}
