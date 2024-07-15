using BooksService as service from '../../srv/book/controller/book-service';
annotate service.ListOfBooks with @(
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : image,
            Label : 'Cover',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : texts.title,
            Label : 'Title',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : texts.author_ID,
            Label : 'Author',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : currency.symbol,
            Label : 'Currency',
            ![@UI.Importance] : #High,
        },
        {
            $Type : 'UI.DataField',
            Value : price,
            Label : 'Price',
            ![@UI.Importance] : #High,
        },
    ]
);

