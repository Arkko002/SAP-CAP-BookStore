# Monolith Design

## Stories
1. As a customer I want to order books
2. As a customer I want to filter books based on genre and author
3. As a customer I want my actions to be persistent between sessions
4. As an author I want to be able to add my books and tag them with genres
5. As an author I want to be able to see how many people viewed and bought my book
6. As an author I want to be able to remove my book from the store

## System operations
> **_NOTE:_**  CRUD operations on schema models are handled by CAP.

placeOrder(customer, array of (book, quantity))
analyzeBookSales(book)


## Recommendation system
### Relationships:
1. User-item: A user specific matrix is created that contains the data of all products they have purchased and interacted with
2. Item-item: The item-item matrix contains a mapping of product feature similarities. A gaming laptop and gaming mouse have the relationship of being an electronic item, a computing item, a gaming product, and so on
3. User-user: This matrix contains a mapping of the similarities in user characteristics. Two users who purchased the same product and then gave it a rating of 4, for example, are mapped together

### User-Based Filtering
Identify preferences by user's activity history (purchases, views, searches)

### Item-Based Filtering
Recommend items based on the previously or currently interacted with item's attributes (title, author i.e. books in the same series)

### User-Based Collaborative Filtering
Identify users with similar purchase history, recommend products to users based on new purchases by users with similar purchase history

### Item-Based Collaborative Filtering
Item-based collaborative filtering identifies similarities between items based on who purchased them

For instance, if many users who purchased Product X also bought Product Y, the system may recommend Product Y to users who have recently purchased Product X.

### Content-Based Filtering
Content-based filtering analyzes the characteristics of the products, such as their titles, descriptions, categories, and attributes

### Hybrid Approaches
- Collaborative filtering combined with content-based filtering to recommend movies based on both user preferences and film attributes
- Using collaborative filtering to identify similar users and then applying content-based filtering to recommend products based on their specific attributes

### Contextual Factors
Recommend books based on client's attributes (like language)


# Microservice Design TODO

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

