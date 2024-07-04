import { ApplicationService, connect } from "@sap/cds";
import { randomUUID } from "crypto";
import cds from "@sap/cds";

export class OrderService extends ApplicationService {
  async init(): Promise<void> {
    const BookService = await connect.to("BookService");
    const { Books, Orders } = cds.entities("bookstore");

    BookService.on("OrderedBook", async (req) => {
      cds.log(`OrderService - order recieved ID ${req.id}`);

      const { bookId, quantity, buyer } = req.data;
      // TODO: SAP Currency common in TS?
      const book: { price: number; currency: any } = await SELECT.one
        .from(Books)
        .columns("price", "currency")
        .where({ ID: bookId });

      const order = {
        items: [
          { ID: randomUUID(), book: bookId, quantity, price: book.price },
        ],
        buyer,
        currency: book.currency,
      };

      await INSERT(order).into(Orders);

      cds.log(`OrderService - order processed ID ${req.id}`);
    });
  }
}

