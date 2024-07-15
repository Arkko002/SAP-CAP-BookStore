import { ApplicationService, connect } from "@sap/cds";
import { randomUUID } from "crypto";
import cds from "@sap/cds";
import { Book, Books, Orders } from "../../@cds-models/bookstore";
import { OrderRepository } from "../repository/order-repository";

export class OrderService extends ApplicationService {
  private orderRepository: OrderRepository = new OrderRepository();

  async init(): Promise<void> {
    const BookService = await connect.to("BookService");

    BookService.on("OrderedBook", async (req) => {
      cds.log(`OrderService - order recieved ID ${req.id}`);

      const { bookId, quantity, userId } = req.data;
      // TODO: SAP Currency common in TS?
      const book: Book = await this.orderRepository.findOne({ ID: bookId });

      await this.orderRepository.create({
        buyer_ID: userId,
        currency: book.currency,
        items: [{ book_ID: book.ID, price: book.price, quantity }],
      });

      cds.log(`OrderService - order processed ID ${req.id}`);
    });
  }
}

