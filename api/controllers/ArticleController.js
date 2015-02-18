/**
 * ArticleController
 *
 * @description :: Server-side logic for managing articles
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res) {
		var user = req.user;
		return res.status(200).json({ success: user.articles });
	},
	add: function(req, res) {
		var user = req.user;
		Article.findOne({ name: req.body.name, owner: user.id }, function(err, article) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (article) {
			   	return res.status(404).json({ error: 'Article already exist' });
			} else {
			   	Article.create({ name: req.body.name, url: req.body.link, owner: user.id })
			   	.exec(function(err, article) {
			   		user.articles.add(article.id);
			   		user.save(function(err) {
			            if (err) {
			               	return res.status(500).json({ error: 'DB error' });
			            }
			            return res.status(200).json({ success: "Article Saved successfuly" });
			        });
			   	});
			}
        });
	},
	delete: function(req, res) {
		var user = req.user;
		Article.findOne({ id: req.params.id, owner: user.id }, function(err, article) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!article) {
			    return res.status(404).json({ error: 'Article don\'t exist' });
			} else {
			    Article.destroy({ id: article.id }).exec(function(err) {
			    	user.articles.remove(article.id);
			        user.save(function(err) {
					    if (err) {
					        return res.status(500).json({ error: 'DB error' });
					    }
					    return res.status(200).json({ success: "Article deleted successfuly" });
				    });
			    });
			}
        });
	},
	edit: function(req, res) {
		var user = req.user;
		Article.findOne({ id: req.body.article_id, owner: user.id }, function(err, article) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!article) {
			    return res.status(404).json({ error: 'Article don\'t exist' });
			} else {
				article.name = req.body.new_name;
				article.link = req.body.new_link;
			    article.save(function(err) {
					if (err) {
					    return res.status(500).json({ error: 'DB error' });
					}
					return res.status(200).json({ success: "Article updated successfuly" });
				});
			}
        });
	}
};

