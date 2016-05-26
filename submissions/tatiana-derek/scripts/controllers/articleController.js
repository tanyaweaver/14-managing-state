(function(module) {
  var articlesController = {};

  Article.createTable();  // Ensure the database table is properly initialized

  articlesController.index = function(ctx, next) {
    articleView.index(ctx.articles);
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  //The method is a callback in a route to load and display a single article based on its id in the database
  //1. Creates a private helper function articleData;
  //2. which is then passed as an argument into the Article.findWhere method ;
  //3. Article.findWhere accesses information based on the primary key id from the database and
  //makes it available for the current route.
  //4. articleData function sets the 'articles' property on the ctx object;
  // and passes control to the next callback in the route (which is articleController.index)
  articlesController.loadById = function(ctx, next) {
    var articleData = function(article) {
      ctx.articles = article;
      next();
    };

    Article.findWhere('id', ctx.params.id, articleData);
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  //The method is a callback in a route to load and display all articles written by specific author
  //1. Creates a private helper function authorData;
  //2. which is then passed as an argument into the Article.findWhere method;
  //3. Article.findWhere accesses information based on the author from the database and
  //makes it available for the current route.
  //4. authorData function sets the 'articles' property on the ctx object;
  // and passes control to the next callback in the route (which is articleController.index)
  articlesController.loadByAuthor = function(ctx, next) {
    var authorData = function(articlesByAuthor) {
      ctx.articles = articlesByAuthor;
      next();
    };

    Article.findWhere('author', ctx.params.authorName.replace('+', ' '), authorData);
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  // This method loads and displays the articles by category. It is used as a callback
  // in a route.
  // it creates a private helper function (categoryData) which is then passed in as an
  // argument to Article.findWhere which gets information from the database and puts it
  // in the ctx object for use by other callbacks in the route by calling next().
  articlesController.loadByCategory = function(ctx, next) {
    var categoryData = function(articlesInCategory) {
      ctx.articles = articlesInCategory;
      next();
    };

    Article.findWhere('category', ctx.params.categoryName, categoryData);
  };

  // COMMENT-DONE: What does this method do?  What is it's execution path?
  // This method is called in the route for the home page.
  // It creates a private helper function that is used as a callback to
  // Article.fetchAll.
  // If the articles have been loaded then we just attach the array to the context
  // for use by other callbacks in the current route.
  // If the articles haven't been loaded, we call fetchAll with our private helper
  // to retrieve them and put them in the pages ctx variable and call the next callback in the route
  articlesController.loadAll = function(ctx, next) {
    var articleData = function(allArticles) {
      ctx.articles = Article.all;
      next();
    };

    if (Article.all.length) {
      ctx.articles = Article.all;
      next();
    } else {
      Article.fetchAll(articleData);
    }
  };


  module.articlesController = articlesController;
})(window);
