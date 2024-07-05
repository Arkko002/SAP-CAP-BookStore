import cds from "@sap/cds";

export class BookService extends cds.ApplicationService {
  async init(): Promise<void> {
    const { ListOfBooks, Books } = this.entities;

    // TODO: Check if search had a query before rank related processing
    this.on("READ", ListOfBooks, async (req) => {
      const user = req.user;
      const searchArgs = req.params as object;
      const rankEventParams: SearchRankEventParams | null =
        processSearchRequestRankInfluence(searchArgs as SearchParams, user.id);

      if (rankEventParams) {
        await this.emit("SearchByUser", {
          userId: rankEventParams.userId,
          value: rankEventParams.value,
          category: rankEventParams.category,
        });
      }
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
      await this.emit("OrderedBook", {
        bookId: book.ID,
        quantity,
        buyer: req.user.id,
      });
    });

    return super.init();
  }
}

interface SearchParams {
  title: string | undefined;
  author: string | undefined;
  genre: string | undefined;
}

interface SearchRankEventParams {
  userId: string;
  value: string;
  category: SearchCategory;
}

enum SearchCategory {
  Title,
  Author,
  Genre,
}

// TODO: Multiple categories in one search
const processSearchRequestRankInfluence = (
  searchParams: SearchParams,
  userId: string,
): SearchRankEventParams | null => {
  // TODO: Definition of enum from CDS definition
  if (searchParams.title) {
    return {
      userId,
      value: searchParams.title,
      category: SearchCategory.Title,
    };
  } else if (searchParams.author) {
    return {
      userId,
      value: searchParams.author,
      category: SearchCategory.Author,
    };
  } else if (searchParams.genre) {
    return {
      userId,
      value: searchParams.genre,
      category: SearchCategory.Genre,
    };
  }

  return null;
};

