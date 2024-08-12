using {bookstore} from '../../db/schema';

@requires: 'PersonalDataManagerUser'
service PDMService @(path: '/pdm') {
    entity Users              as projection on bookstore.Users;
    entity PreferenceRanks    as projection on bookstore.PreferenceRanks;
    entity Orders             as projection on bookstore.Orders;

    entity OrderWithItemsView as
        select from Orders {
                ID,
                buyer,
                currency,
            key items.ID       as items_ID,
                items.book     as items_book,
                items.order    as items_order,
                items.quantity as items_quantity,
                items.price    as items_price,
        };

    annotate PDMService.OrderWithItemsView with @(PersonalData.EntitySemantics: 'Other') {
        buyer @PersonalData.FieldSemantics: 'DataSubjectID';
    }

    annotate Users with @(Communication.Contact: {email: [{
        type   : #preferred,
        address: email
    }]});
}
