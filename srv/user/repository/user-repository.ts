import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { User, Users } from "../../@cds-models/bookstore";

export class UserRepository extends BaseRepository<User> {
    public constructor() {
	super(User);
    }
}

export class UsersRepository extends BaseRepository<Users> {
    public constructor() {
	super(Users);
    }
}
