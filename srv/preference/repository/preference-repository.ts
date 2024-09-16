import { PreferenceRank, PreferenceRanks } from "../../@cds-models/bookstore";
import { BookstoreBaseRepository } from "../../shared/IRepository";

export class PreferenceRepository extends BookstoreBaseRepository<PreferenceRank> {
    public constructor(){
	super(PreferenceRank);
    }
}

export class PreferencesRepository extends BookstoreBaseRepository<PreferenceRanks> {
    public constructor() {
	super(PreferenceRanks);
    }
}
