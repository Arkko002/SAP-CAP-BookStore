using {bookstore} from '../../../db/schema';

annotate bookstore.Users with @PersonalData : { DataSubjectRole : 'customer', EntitySemantics : 'DataSubject', } {
    ID @PersonalData.FieldSemantics : 'DataSubjectID';
    email @PersonalData.IsPotentiallyPersonal;
};

annotate bookstore.Orders with @PersonalData : {EntitySemantics : 'Other',} {
    buyer @PersonalData.FieldSemantics : 'DataSubjectID';
}
