Template.postEdit.events({
	'submit form': function(e) {
		e.preventDefault();
		var currentPostId = this._id;
		var postProperties = {
			url: $(e.target).find('[name=url]').val(),
			title: $(e.target).find('[name=title]').val()
		}
		Meteor.call('postUpdate', postProperties, currentPostId, function(error, result) {
			if(error)
				return throwError(error.reason);

			if(result.postUpdateExists)
				throwError('OoOps you want to edit post url to a doplicate one');

			Router.go('postPage', {_id: currentPostId});
		});
		// Posts.update(currentPostId, {$set: postProperties}, function(error) {
		// 	if (error) {
		// 	// display the error to the user
		// 	alert(error.reason);
		// 	} else {
		// 		Router.go('postPage', {_id: currentPostId});
		// 	}
		// });
	},
	'click .delete': function(e) {
		e.preventDefault();
		if (confirm("Delete this post?")) {
			var currentPostId = this._id;
			Meteor.call('postRemove', currentPostId, function(error, result) {
				if(error)
					return throwError(error.reason);

				Router.go('postsList');
			});
			// Posts.remove(currentPostId);
			// Router.go('postsList');
		}
	}
});