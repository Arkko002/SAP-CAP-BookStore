import cds, { connect } from "@sap/cds";
import {
  PreferenceRepository,
  PreferencesRepository,
} from "../repository/preference-repository";
import { PreferenceRank } from "../../@cds-models/bookstore";

// TODO: Would this be internal service (protocol: none) or will it need to communicate with HANA outside?
export class PreferenceService extends cds.ApplicationService {
  private preferenceRepository: PreferenceRepository =
    new PreferenceRepository();
  private preferencesRepository: PreferencesRepository =
    new PreferencesRepository();

  async init(): Promise<void> {
    const BookService = await connect.to("BookService");

    BookService.on("OrderedBook", async (req) => {
      const { userId, bookId } = req.data;

      this.upsertPreferenceRankByScore(5, userId, bookId);
    });
    BookService.on("SearchByUser", async (req) => {
      const { userId, value, category } = req.data;

      this.upsertPreferenceRankByScore(1, userId, value);
    });
    BookService.on("ViewByUser", async (req) => {
      const { userId, bookId } = req.data;
      this.upsertPreferenceRankByScore(2, userId, bookId);
    });
  }

  private async upsertPreferenceRankByScore(
    score: number,
    userId: string,
    prefered: string,
  ) {
    const preference: PreferenceRank | undefined =
      await this.preferenceRepository.findOne({
        user_ID: userId,
        prefered,
      });

    if (preference) {
      await this.preferenceRepository.update(
        { ID: preference.ID },
        { score: preference.score + 2 },
      );
    } else {
      await this.preferenceRepository.create({
        score: 2,
        prefered,
        user_ID: userId,
      });
    }
  }
}

export enum SearchPreferenceCategory {
  Generic,
  Title,
  Author,
  Genre,
}

// TODO: Multiple preferences in one search, title + author etc.
export interface SearchPreferenceEventParams {
  userId: string;
  value: string;
  category: SearchPreferenceCategory;
}

export const createSearchPreferenceEventParams = (
  value: string,
  userId: string,
  category: SearchPreferenceCategory,
): SearchPreferenceEventParams | null => {
  // TODO: Definition of enum from CDS definition
  return {
    value,
    userId,
    category,
  };
};

