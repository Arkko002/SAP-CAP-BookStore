import { ApplicationService } from "@sap/cds";
export class UserService extends ApplicationService {
  init(): Promise<void> {
    this.on("READ", "me", ({ tenant, user, locale }) => ({
      id: user.id,
      locale,
      tenant,
    }));
    this.on("login", (req) => {
      if (req.user.is('anonymous'))
	//@ts-ignore
        req._.res
          .set("WWW-Authenticate", 'Basic realm="Users"')
          .sendStatus(401);
      else return this.read("me");
    });

    return super.init();
  }
}

