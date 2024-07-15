import cds, { User } from "@sap/cds";
import {
  createSearchPreferenceEventParams,
  SearchPreferenceCategory,
  SearchPreferenceEventParams,
  PreferenceRepository,
} from "../../preference/";
import { Book, Books, PreferenceRanks } from "#cds-models/bookstore";
import { BookRepository } from "../repository/book-repository";

interface ISearchParams {
  title: string | undefined;
  author: string | undefined;
  genre: string | undefined;
}

export class BooksService extends cds.ApplicationService {
  private bookRepository: BookRepository = new BookRepository();
  private preferenceRepository: PreferenceRepository =
    new PreferenceRepository();

  async init(): Promise<void> {
    const { ListOfBooks } = this.entities;

    // TODO: Check if search had a query before rank related processing
    this.on("READ", ListOfBooks, async (req) => {
      const user: User = req.user;
      const searchArgs = req.params as object as ISearchParams;

      const rankEventParams: SearchPreferenceEventParams =
        this.getSearchPreferenceEventParams(searchArgs, user.id);
      if (rankEventParams) {
        await this.emit("SearchByUser", rankEventParams);
      }

      // TODO:
      // 1. Check existing user / item preference matrix
      // 2. On hit display re-ordered results according to preference scores as ordering weights
      // 3. On no preference existing use default sorting
      const preferences = await this.preferenceRepository.find({
        user_ID: user.id,
      });
    });

    this.after("READ", Book, async (book, req) => {
      const user: User = req.user;
      await this.emit("ViewByUser", { userId: user, bookId: book.ID });
    });

    this.on("submitOrder", async (req) => {
      let { book: id, quantity } = req.data;
      let book: Book | undefined = await this.bookRepository.findOne({
        ID: id,
      });

      if (!book) return req.error(404, `Book #${id} doesn't exist`);
      if (quantity < 1) return req.error(400, `quantity has to be 1 or more`);
      if (quantity > book.stock)
        return req.error(409, `${quantity} exceeds stock for book #${id}`);

      await this.bookRepository.update(
        { ID: id },
        { stock: book.stock - quantity },
      );

      await this.emit("OrderedBook", {
        bookId: book.ID,
        quantity,
        userId: req.user,
      });

      return book;
    });

    return super.init();
  }

  // TODO: Category mapping probably unneeded in service
  private getSearchPreferenceEventParams = (
    searchParams: ISearchParams,
    userId: string,
  ): SearchPreferenceEventParams => {
    let category: SearchPreferenceCategory = SearchPreferenceCategory.Generic;
    // TODO: Make value non-nullable, pass the parsed query if no keyword matches
    let value: string = "";
    if (searchParams.genre) {
      category = SearchPreferenceCategory.Genre;
      value = searchParams.genre;
    } else if (searchParams.title) {
      category = SearchPreferenceCategory.Title;
      value = searchParams.title;
    } else if (searchParams.author) {
      category = SearchPreferenceCategory.Author;
      value = searchParams.author;
    }

    return createSearchPreferenceEventParams(value, userId, category);
  };
}

