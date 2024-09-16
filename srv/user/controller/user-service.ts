import { ApplicationService } from "@sap/cds";

export class UserService extends ApplicationService {
  public init(): Promise<void> {
    this.on("READ", "me", ({ tenant, user, locale }) => ({
      id: user.id,
      locale,
      tenant,
    }));

    this.on("login", (req) => {
      if (req.user.is("anonymous"))
        //@ts-ignore
        req._.res
          .set("WWW-Authenticate", 'Basic realm="Users"')
          .sendStatus(401);
      else return this.read("me");
    });

    this.on("create", (req) => {
      // TODO: User bootstrap:
      // 1. Create user cart
    });

    return super.init();
  }
}

