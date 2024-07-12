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

    entity Books       as
        projection on bookstore.Books {
            *
        }
        excluding {
            createdBy,
            modifiedBy,
        };

    action submitOrder(book : Books:ID, quantity : Integer);

    event OrderedBook {
        bookId   : Books:ID;
        quantity : Integer;
        buyer    : User
    };

    event SearchByUser {
        userId   : User;
        value    : String;
        category : SearchCategory;
    };

    event ViewByUser {
        userId : User;
        bookId : Books:ID;
    };
}

type SearchCategory : String enum {
    title;
    author;
    genre;
}
