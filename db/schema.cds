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
    genres      : Association to Genres @mandatory;
    author      : Association to Authors            @mandatory  @assert.target;
    language    : Language              @mandatory  @readonly;
    sold        : Integer;
    stock       : Integer;
    price       : Decimal               @mandatory;
    currency    : Currency              @mandatory;
    image       : LargeBinary           @Core.MediaType: 'image/jpg';

    viewHistory : Association to many BookViews
                      on viewHistory.book = $self;
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
    orders        :      Association to many Orders
                             on orders.buyer = $self;
    searchHistory : many String;
    viewHistory   :      Association to many BookViews
                             on viewHistory.user = $self;

    preferences   :      Association to many PreferenceRanks
                             on preferences.user = $self;
}

entity BookViews : cuid {
    key user : Association to one Users;
    key book : Association to one Books;
}

entity Orders : cuid, managed {
    buyer                 : Association to one Users;
    @cds.autoexpose items : Composition of many OrderItems
                                on items.order = $self;
    currency              : Currency
}

entity OrderItems : cuid {
    order    : Association to one Orders;
    book     : Association to Books;
    quantity : Integer;
    price    : Double;
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

// TODO: Generalize prefered value into something that can be stored verbatim and later matched using custom logic depending on needs
entity PreferenceRanks : cuid, managed {
    user     : Association to one Users;
    prefered : String;
    score    : Integer;
}

entity UserToUserPreferenceRanks : managed {
    key first  : Association to one Users;
    key second : Association to one Users;
        score  : Integer;
}
