import cds, { connect } from "@sap/cds";

export class RankService extends cds.ApplicationService {
  async init(): Promise<void> {
    const BookService = await connect.to("BookService");
    const { Books, Rank } = cds.entities("bookstore");

    // TODO: Base rank schema as mapping of User ID to array of  objects, each with assigned category and prefered value
    BookService.on("OrderedBook", async (req) => {});
    BookService.on("SearchByUser", async (req) => {});
    BookService.on("ViewByUser", async (req) => {});
  }
}

