import cds from "@sap/cds";

export class BookService extends cds.ApplicationService {
  init(): Promise<void> {
    const { ListOfBooks, Books } = this.entities;

    this.on("READ", ListOfBooks, (req) => {
      // TODO: Apply ranking on search here
    });

    this.on("submitOrder", async (req) => {
      let { book: id, quantity } = req.data;
      //@ts-ignore
      let book = await SELECT.from(Books, id, (b) => b.stock);

      if (!book) return req.error(404, `Book #${id} doesn't exist`);
      if (quantity < 1) return req.error(400, `quantity has to be 1 or more`);
      if (quantity > book.stock)
        return req.error(409, `${quantity} exceeds stock for book #${id}`);

      await UPDATE(Books, id).with({ stock: (book.stock -= quantity) });

      return book;
    });

    this.after("submitOrder", async (_, req) => {
      let { book, quantity } = req.data;
      await this.emit("OrderedBook", { bookId: book.ID, quantity, buyer: req.user.id });
    });

    return super.init();
  }
}

