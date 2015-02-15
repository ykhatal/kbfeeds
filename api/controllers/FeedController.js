/**
 * FeedController
 *
 * @description :: Server-side logic for managing feeds
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res) {
		var user = req.user;
		return res.status(200).json({ success: user.feeds });
	},
	add: function(req, res) {
		var user = req.user;
	    utils.addHttpToUrl(req.body.url);
		Feed.findOne({ $or: [{ name: req.body.name, owner: user.id },
		{ url: req.body.url, owner: user.id}] }, function(err, feed) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (feed) {
			   	return res.status(404).json({ error: 'Feed already exist' });
			} else {
			   	Feed.create({ name: req.body.name, url: req.body.url, owner: user.id })
			   	.exec(function(err, feed) {
			   		user.feeds.add(feed.id);
			   		user.save(function(err) {
			            if (err) {
			               	return res.status(500).json({ error: 'DB error' });
			            }
			            return res.status(200).json({ success: "Feed added successfuly" });
			        });
			   	});
			}
        });
	},
	delete: function(req, res) {
		var user = req.user;
		Feed.findOne({ id: req.params.id, owner: user.id }, function(err, feed) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!feed) {
			    return res.status(404).json({ error: 'Feed don\'t exist' });
			} else {
			    Feed.destroy({ id: feed.id }).exec(function(err) {
			    	user.feeds.remove(feed.id);
			        user.save(function(err) {
					    if (err) {
					        return res.status(500).json({ error: 'DB error' });
					    }
					    return res.status(200).json({ success: "Feed deleted successfuly" });
				    });
			    });
			}
        });
	},
	getNewsByFeedId: function(req, res) {
		var user = req.user;
		Feed.findOne({ id: req.params.id, owner: user.id }, function(err, feed) {
			if (err) {
	          	return res.status(500).json({ error: 'DB error' });
	        }
	        if (!feed) {
		       	return res.status(404).json({ error: 'Feed don\'t exist' });
		    } else {
			   	var feedParser = require('feedparser');
				var http = require('http');
			   	var feedMeta;
			    var articles = [];
			    http.get(feed.url, function(response) {
			       	response.pipe(new feedParser({}))
			    	.on('error', function(error) { 
			        	return res.status(500).json({ error: 'RSS parsing error' });
			        })
			        .on('meta', function(meta) {
			        	feedMeta = meta; 
			        })
			        .on('readable', function() {
			            var stream = this, item;
			            while (item = stream.read()) {
				            // Each 'readable' event will contain 1 article
				            // Add the article to the list of articles
				            var date = new Date(item.pubDate);
				            if (req.params.pubDate < date.getTime()) {
					            var article = {
						            'title': item.title,
						          	'link': item.link,
						            'description': item.description,
						            'image': item.enclosures[0].url,
						            'publicationDate': date.getTime()
					            };
				                articles.push(article);
				            }
			            }
			        })
				    .on('end', function() {
				       	return res.status(200).json({ success: {
				      		feed: feed,
				       		news: articles
				       	} });
				    });
			    });
			}
        });
	},
	edit: function(req, res) {
		var user = req.user;
		Feed.findOne({ id: req.body.feed_id, owner: user.id }, function(err, feed) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!feed) {
			    return res.status(404).json({ error: 'Feed don\'t exist' });
			} else {
				feed.name = req.body.new_name;
				feed.url = req.body.new_url;
			    feed.save(function(err) {
					if (err) {
					    return res.status(500).json({ error: 'DB error' });
					}
					return res.status(200).json({ success: "Feed updated successfuly" });
				});
			}
        });
	},
	updateCategory: function(req, res) {
		var user = req.user;
		Category.findOne({ id: req.body.category_id, owner: user.id }).populate('feeds').exec(function(err, category) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!category) {
			    return res.status(404).json({ error: 'Category don\'t exist' });
			} else {
				Feed.findOne({ id: req.body.feed_id, owner: user.id }, function(err, feed) {
					if (err) {
					    return res.status(500).json({ error: 'DB error' });
					}
					if (!feed) {
					    return res.status(404).json({ error: 'Feed don\'t exist' });
					} else {
						category.feeds.add(feed);
					    category.save(function(err) {
							if (err) {
								return res.status(500).json({ error: 'DB error' });
							}
							return res.status(200).json({ success: "Feed category updated successfuly" });
						});
					}
        		});
			}
        });
	},
	getByCategoryId: function(req, res) {
		var user = req.user;
		Category.findOne({ id: req.params.id, owner: user.id }).populate('feeds').exec(function(err, category) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!category) {
			    return res.status(404).json({ error: 'Category don\'t exist' });
			} else {
				return res.status(200).json({ success: category });
			}
        });
	}
};

