using {bookstore} from '../../../db/schema';
using {BooksService} from '../controller/book-service';

annotate bookstore.Books with @restrict: [
    {
        grant: 'CREATE',
        to   : 'content-maintainer'
    },
    {
        grant: 'UPDATE',
        to   : 'content-maintainer'
    },
    {
        grant: 'DELETE',
        to   : 'content-maintainer'
    }
];

annotate BooksService.ListOfBooks with @readonly;
annotate BooksService.Books with @readonly;
annotate BooksService.submitOrder with @requires: 'authenticated-user';
