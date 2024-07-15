import { Book } from "#cds-models/bookstore";
import { BookstoreBaseRepository } from "../../shared/IRepository";

export class BookRepository extends BookstoreBaseRepository<Book> {
    public constructor() {
	super(Book);
    }
}
