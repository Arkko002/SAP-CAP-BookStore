using {bookstore} from '../../../db/schema';

@path: 'service/rank'
service PreferenceService {
    entity PreferenceRanks as projection on bookstore.PreferenceRanks;
}
