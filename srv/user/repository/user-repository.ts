import { User, Users } from "../../@cds-models/bookstore";
import { BookstoreBaseRepository } from "../../shared/IRepository";

export class UserRepository extends BookstoreBaseRepository<User> {
    public constructor() {
	super(User);
    }
}

export class UsersRepository extends BookstoreBaseRepository<Users> {
    public constructor() {
	super(Users);
    }
}
