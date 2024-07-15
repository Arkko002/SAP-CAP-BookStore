using {bookstore} from '../../../db/schema.cds';

@path: 'service/admin'
service AdminService {
    entity Books   as projection on bookstore.Books;
    entity Authors as projection on bookstore.Authors;
}

