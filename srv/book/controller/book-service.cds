using {bookstore} from '../../../db/schema';
using {User} from '@sap/cds/common';

@path: 'service/books'
service BooksService {
    entity ListOfBooks    as
        projection on bookstore.Books
        excluding {
            description,
            soldNumber,
            sold,
        };

    entity Books          as
        projection on bookstore.Books {
            *
        }
        excluding {
            createdBy,
            modifiedBy,
        };

    entity Users          as
        projection on bookstore.Users {
            key ID,
                searchHistory,
                viewHistory,
                preferences,
        };

    entity PreferenceRank as projection on bookstore.PreferenceRanks;
    action submitOrder(book : Books:ID, quantity : Integer);

    event OrderedBook {
        bookId   : Books:ID;
        quantity : Integer;
        userId   : UUID;
    };

    event SearchByUser {
        userId   : UUID;
        value    : String;
        category : SearchCategory;
    };

    event ViewByUser {
        userId : UUID;
        bookId : Books:ID;
    };
}

type SearchCategory : String enum {
    title;
    author;
    genre;
}
