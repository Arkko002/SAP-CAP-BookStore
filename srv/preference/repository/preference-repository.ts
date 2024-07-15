import { BaseRepository } from "@dxfrontier/cds-ts-repository";
import { PreferenceRank, PreferenceRanks } from "../../@cds-models/bookstore";

export class PreferenceRepository extends BaseRepository<PreferenceRank> {
    public constructor(){
	super(PreferenceRank);
    }
}

export class PreferencesRepository extends BaseRepository<PreferenceRanks> {
    public constructor() {
	super(PreferenceRanks);
    }
}
