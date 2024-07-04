namespace bookstore;

using {
    Currency,
    Language,
    User,
    cuid,
    managed,
    sap.common.CodeList
} from '@sap/cds/common';

@cds.search: {
    title,
    description,
    tags,
    language,
    author.name,
}
entity Books : cuid, managed {
    title       : localized String      @mandatory  @assert.unique;
    description : localized String;
    tags        : Association to Genres @mandatory;
    author      : Association to Authors            @mandatory  @assert.target;
    language    : Language              @readonly;
    sold        : Integer;
    stock       : Integer;
    price       : Decimal;
    currency    : Currency;
    image       : LargeBinary           @Core.MediaType: 'image/jpg';
}

entity Genres : cuid, CodeList {
    parent   : Association to Genres;
    children : Composition of many Genres
                   on children.parent = $self;
}

@cds.search: {
    name,
    books
}
entity Authors : cuid, managed {
    name  : String  @readonly  @assert.unique;
    books : Association to many Books
                on books.author = $self;
}


entity Users : cuid, managed {
    email         :      String  @readonly  @assert.unique  @assert.format: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$';
    orders        :      Association to many Orders;
    searchHistory : many String;
    viewHistory   :      Association to many Books;
}


entity Orders : cuid, managed {
    items    : Composition of many {
                   key ID       : UUID;
                       book     : Association to Books;
                       quantity : Integer;
                       price    : Double;
               };
    buyer    : User;
    currency : Currency
}

/* TODO:
    1. Association to client
    2. Track search history (keywords?) Might be too hard to implement
    3. Track view history
    4. Track order history
    5. Aggregate numerical values for search, view and order history
    6. Weight those values by modifiers (heuristics? neural network?)
    7. Based on those weighted values provide recommendations
    8. Based on those weighted values modify search results (might be hard to implement?)
*/

/* NOTE: Considerations:
    1. Would modified PageRank be useful here?
    2. How does Amazon do it? Research
*/

entity Rank : cuid, managed {

}
