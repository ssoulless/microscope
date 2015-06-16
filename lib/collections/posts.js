Posts = new Mongo.Collection('posts');

// Posts.allow({
// 	update: function(userId, post) { return ownsDocument(userId, post); },
// 	remove: function(userId, post) { return ownsDocument(userId, post); },
// });

// Posts.deny({
// 	update: function(userId, post, fieldNames) {
// 		// may only edit the following two fields:
// 		return (_.without(fieldNames, 'url', 'title').length > 0);
// 	}
// });

validatePost = function (post) {
	var errors = {};
	if (!post.title)
		errors.title = "Please fill in a headline";
	if (!post.url)
		errors.url = "Please fill in a URL";
	return errors;
}

Meteor.methods({
	postInsert: function(postAttributes) {
		check(this.userId, String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var errors = validatePost(postAttributes);
		if (errors.title || errors.url)
			throw new Meteor.Error('invalid-post', "You must set a title and URL for
			your post");

		var postWithSameLink = Posts.findOne({url: postAttributes.url});
		if (postWithSameLink) {
			return {
				postExists: true,
				_id: postWithSameLink._id
			}
		}
		var user = Meteor.user();
		var post = _.extend(postAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date()
		});
		var postId = Posts.insert(post);
		return {
			_id: postId
		};
	},
	postUpdate: function(postAttributes, postId){
		check(this.userId, String);
		check(postAttributes, {
			title: String,
			url: String
		});

		var errors = validatePost(postAttributes);
		if (errors.title || errors.url)
			throw new Meteor.Error('invalid-post', "You must set a title and URL for
			your post");

		var postsWithSameLink = Posts.find({url: postAttributes.url});

		if (postsWithSameLink.count() > 1) {
			return {
				postUpdateExists: true,
				_id: postId
			}
		}else if (postsWithSameLink.count() == 1){
			var postWithSameLink = Posts.findOne({url: postAttributes.url});
			if (postWithSameLink._id !== postId){
				return {
					postUpdateExists: true,
					_id: postId
				}
			}
		}
		if ((_.size(postAttributes) <= 2 && _.has(postAttributes, 'title') && _.has(postAttributes, 'url'))) {
			var postToEdit = Posts.findOne({_id: postId});
			if (ownsDocument(Meteor.userId(), postToEdit)){
				Posts.update(postId, {$set: postAttributes});
				return {
					_id:postId
				}
			}else {
				throw new Meteor.Error(419, 'Error 419: Access denied error', 'Access denied.');
			}
		}else {
			throw new Meteor.Error(403, 'Error 403: unexpected error', 'An unexpected error ocurred.');
		}

	},
	postRemove: function(postId){
		check(postId, String);
		var postToRemove = Posts.findOne({_id: postId});
		if (ownsDocument(Meteor.userId(), postToRemove)) {
			Posts.remove(postId);
			return
		} else {
			throw new Meteor.Error(419, 'Error 419: Access denied error', 'Access denied.');	
		}
	},
});