Template.postSubmit.events({
	'submit form': function(e) {
		e.preventDefault();
		var post = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		};
		// post._id = Posts.insert(post);
		// Router.go('postPage', post);
		Meteor.call('postInsert', post, function(error, result) {
			// display the error to the user and abort
			if (error)
				return throwError(error.reason);

			//Show this result but route anyway
			if(result.postExists)
				throwError('This post has already been posted');

			Router.go('postPage', {_id: result._id});
		});
	}
});