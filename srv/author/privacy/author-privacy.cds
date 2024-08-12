using {bookstore} from '../../../db/schema';

annotate bookstore.Authors with @PersonalData : { DataSubjectRole : 'author', EntitySemantics : 'DataSubject', } {
    ID @PersonalData.FieldSemantics : 'DataSubjectID';
    name @PersonalData.IsPotentiallyPersonal;
    books @PersonalData.IsPotentiallyPersonal;
}
