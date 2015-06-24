Meteor.publish('posts', function(sort, limit) {
	check({
		sort: Object,
		limit: Number
	});
	return Posts.find({}, {sort: sort, limit: limit});
});

Meteor.publish('comments', function(postId) {
	check(postId, String);
	return Comments.find({postId: postId});
});

Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId, read: false});
});