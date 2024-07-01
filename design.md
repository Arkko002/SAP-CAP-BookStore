# Design

## Stories
1. As a customer I want to order books
2. As a customer I want to filter books based on genre and author
3. As a customer I want my actions to be persistent between sessions
4. As an author I want to be able to add my books and tag them with genres
5. As an author I want to be able to see how many people viewed and bought my book
6. As an author I want to be able to remove my book from the store

## System operations
<!-- https://microservices.io/post/architecture/refactoring/2023/07/27/assemblage-overview-part-1-defining-system-operations.html -->
<!-- Maybe add auth? -->
<!-- createCustomer(email) -> Customer -->
<!-- createAuthor(email) -> Author -->
placeOrder(customer, book)
filterBooks(author?, genre?) -> BooksFiltered
createBook(author, genres)
removeBook(book)
viewBookStats(book) -> (views, bought) 

## Subdomains
<!-- https://microservices.io/post/architecture/2023/08/14/assemblage-overview-part-2-defining-subdomains.html -->
CustomerSubdomain -> customer state management (basket, bought books)
Book Subdomain -> Searching, Filtering, Creating, Removing books
Order Subdomain -> Placing orders
AuthorSubdomain -> author state management (created books, removed books)

