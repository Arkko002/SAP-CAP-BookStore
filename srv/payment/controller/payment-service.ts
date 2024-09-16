import { ApplicationService, connect } from "@sap/cds";
import cds from "@sap/cds";
import { Payment } from "../../@cds-models/bookstore";
import { PaymentRepository } from "../repository/payment-repository";
import { InsertResult } from "@dxfrontier/cds-ts-repository";
import { PaymentExternalService } from "../external/payment-external-service";

// TODO: Order and Payments separate, using CQRS
export class PaymentService extends ApplicationService {
  private paymentRepository: PaymentRepository = new PaymentRepository();
  private paymentExternalService = new PaymentExternalService();

  async init(): Promise<void> {
    const OrderService = await connect.to("OrderService");

    this.on("startPaymentProcess", "Payment", ({ params: [id] }) => {
      const payment: Payment = await this.paymentRepository.findOne({ ID: id });

      const extPaymentResult = await this.paymentExternalService.startPaymentProcess(
        payment.order_ID,
        payment.amount,
        payment.currency,
      );

      return extPaymentResult;
    });

    OrderService.on("OrderCreated", async (req) => {
      cds.log(`PaymentService - Payment recieved ID ${req.id}`);

      const { orderId, currency, price } = req.data;

      const insertResult: InsertResult<Payment> =
        await this.paymentRepository.create({
          order_ID: orderId,
          amount: price,
          status: "new",
        });

      if (!insertResult.query.INSERT.entries.length) {
        // TODO: Error here
      }
      const payment: Payment = insertResult.query.INSERT.entries[0];

      // TODO: start Stripeflow,
      await this.paymentRepository.update(
        { ID: payment.ID },
        { status: "inProcessing" },
      );
      const stripeStatus = "success";

      // TODO: update Payment with status of Stripe payement
      if (stripeStatus === "success") {
        await this.paymentRepository.update(
          { ID: payment.ID },
          { status: "paidFully" },
        );
      }

      cds.log(`PaymentService - Payment processed ID ${req.id}`);
    });
  }
}

