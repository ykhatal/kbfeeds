/**
 * CategoryController
 *
 * @description :: Server-side logic for managing categories
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res) {
		var user = req.user;
		return res.status(200).json({ success: user.categories });
	},
	add: function(req, res) {
		var user = req.user;
		Category.findOne({ name: req.body.name, owner: user.id }, function(err, category) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (category) {
			   	return res.status(404).json({ error: 'Category already exist' });
			} else {
			   	Category.create({ name: req.body.name, owner: user.id })
			   	.exec(function(err, category) {
			   		user.categories.add(category.id);
			   		user.save(function(err) {
			            if (err) {
			               	return res.status(500).json({ error: 'DB error' });
			            }
			            return res.status(200).json({ success: "Category added successfuly" });
			        });
			   	});
			}
        });
	},
	delete: function(req, res) {
		var user = req.user;
		Category.findOne({ id: req.params.id, owner: user.id }, function(err, category) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!category) {
			    return res.status(404).json({ error: 'Category don\'t exist' });
			} else {
			    Category.destroy({ id: category.id }).exec(function(err) {
			    	user.categories.remove(category.id);
			        user.save(function(err) {
					    if (err) {
					        return res.status(500).json({ error: 'DB error' });
					    }
					    return res.status(200).json({ success: "Category deleted successfuly" });
				    });
			    });
			}
        });
	},
	edit: function(req, res) {
		var user = req.user;
		Category.findOne({ id: req.body.category_id, owner: user.id }, function(err, category) {
			if (err) {
			    return res.status(500).json({ error: 'DB error' });
			}
			if (!category) {
			    return res.status(404).json({ error: 'Category don\'t exist' });
			} else {
				category.name = req.body.new_name;
			    category.save(function(err) {
					if (err) {
					    return res.status(500).json({ error: 'DB error' });
					}
					return res.status(200).json({ success: "Category updated successfuly" });
				});
			}
        });
	}
};

