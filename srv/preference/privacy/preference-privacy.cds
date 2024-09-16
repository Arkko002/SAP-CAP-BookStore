using {bookstore} from '../../../db/schema';

annotate bookstore.PreferenceRanks with @PersonalData : { EntitySemantics : 'Other', } {
    user @PersonalData.FieldSemantics : 'DataSubjectID';
}
