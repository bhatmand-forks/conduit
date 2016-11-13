import marked from 'marked'

class ArticleCtrl {
  constructor(article, User, $sce, $rootScope, Comments) {
    'ngInject';

    this.article = article;
    this.currentUser = User.current;
    this._Comments = Comments;

    // Update the title of this page
    $rootScope.setPageTitle(this.article.title);

    // Transform the markdown into HTML
    this.article.body = $sce.trustAsHtml(marked(this.article.body, {
      sanitize: true
    }));

    // Get all comments for this article
    Comments.getAll(this.article.slug).then(
      (comments) => this.comments = comments
    )

    //Initialize empty comment form
    this.resetCommentForm();

  }

  resetCommentForm() {
    this.commentForm = {
      isSubmitting: false,
      body: '',
      errors: []
    }
  }

  addComment() {
    this.commentForm.isSubmitting = true;
    this._Comments.add(this.article.slug, this.commentForm.body).then(
      (comment) => {
        this.comments.unshift(comment);
        this.resetCommentForm();
      },
      (err) => {
        this.commentForm.isSubmitting = false;
        this.commentForm.errors = err.data.errors;
      }
    );
  }

  deleteComment(commentId, index) {
    this._Comments.destroy(commentId, this.article.slug).then(
      (success) => {
        this.comments.splice(index, 1);
      }
    );
  }


}


export default ArticleCtrl;
