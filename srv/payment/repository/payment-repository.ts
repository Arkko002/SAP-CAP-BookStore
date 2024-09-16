import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { Payment, Payments } from "../../@cds-models/bookstore";

export class PaymentRepository extends BaseRepository<Payment> {
  public constructor() {
    super(Payment);
  }
}

export class PaymentsRepository extends BaseRepository<Payments> {
  public constructor() {
    super(Payments);
  }
}

