import { ApplicationService, connect } from "@sap/cds";
import cds from "@sap/cds";
import {
  Book,
  Order,
} from "../../@cds-models/bookstore";
import { OrderRepository } from "../repository/order-repository";
import { BookRepository } from "srv/book/repository/book-repository";
import { InsertResult } from "@dxfrontier/cds-ts-repository";

// TODO: Order and Payments separate, using CQRS
// Payments should be processed async with message queue
// After Payment gets processed assign Payment entity to Order Entity
export class OrderService extends ApplicationService {
  private bookRepository: BookRepository = new BookRepository();
  private orderRepository: OrderRepository = new OrderRepository();

  async init(): Promise<void> {
    const BookService = await connect.to("BookService");
    const PaymentService = await connect.to("PaymentService");

    BookService.on("OrderedBook", async (req) => {
      cds.log(`OrderService - order recieved ID ${req.id}`);

      const { bookId, quantity, userId } = req.data;
      // TODO: SAP Currency common in TS?
      const book: Book = await this.bookRepository.findOne({ ID: bookId });

      const insertResult: InsertResult<Order> =
        await this.orderRepository.create({
          buyer_ID: userId,
          currency: book.currency,
          items: [{ book_ID: book.ID, price: book.price, quantity }],
          status: "new",
        });
      if (!insertResult.query.INSERT.entries.length) {
        // TODO: Error here
      }
      const order = insertResult.query.INSERT.entries[0];

      await this.emit("OrderCreated", {
        orderId: order.ID,
        currency: order.currency,
        price: order.priceTotal,
      });

      cds.log(`OrderService - order created ID ${req.id}`);
    });

    PaymentService.on("PayementProcessed", async (req) => {
      const { orderId, paymentStatus } = req.data;

      cds.log(
        `OrderService - payement recieved ID ${req.id}, order ID ${orderId}`,
      );

      if (paymentStatus === "success") {
        await this.orderRepository.update(
          { ID: orderId },
          { status: "inProcessing" },
        );
      }
    });
  }
}

