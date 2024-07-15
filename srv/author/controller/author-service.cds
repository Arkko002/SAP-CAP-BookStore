using {bookstore} from '../../../db/schema';

@path: 'service/author'
service AuthorService {
    entity Author        as
        projection on bookstore.Authors {
            ID,
            name,
        };

    entity BooksByAuthor as
        projection on bookstore.Books {
            title,
            description,
            genres,
            language,
            author,
        };

}
