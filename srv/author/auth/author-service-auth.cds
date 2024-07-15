using {bookstore} from '../../../db/schema';

annotate bookstore.Authors with @restricts: [
    {
        grant: 'CREATE',
        to   : 'admin'
    },
    {
        grant: 'UPDATE',
        to   : 'admin'
    },
    {
        grant: 'DELETE',
        to   : 'admin'
    }
];
