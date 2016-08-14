var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post= mongoose.model('Post'),
  slug=require("slug"),
  pinyin=require("pinyin"),
  Category=mongoose.model("Category"),
  auth=require("./user.js");

module.exports = function (app) {
  app.use('/admin/categories', router);
};

router.get('/', auth.requireLogin,function (req, res, next) {
	res.render("admin/category/index",{
		pretty:true,
		title:"后台管理分类列表"
	})
});

router.get("/add",auth.requireLogin,function(req,res,next){
	res.render("admin/category/add",{
		action:"/admin/categories/add",
		pretty:true,
		pageHeader:"添加分类",
		category:{_id:""},
		title:"后台管理添加分类"
	})
})

router.post("/add",auth.requireLogin,function(req,res,next){
	req.checkBody("name","分类标题不能为空").notEmpty();
	
	var errors=req.validationErrors();
	if(errors){
		return res.render("admin/category/add",{
			errors:errors,
			category:{title:req.body.name}
		});
	}

	var name=req.body.name.trim();
	var py=pinyin(name,{
		style:pinyin.STYLE_NORMAL,
		heteronym:false
	}).map(function(item){
		return item[0];
	}).join(" ");


	var category=new Category({
		title:name,
		slug:slug(py),
		created:new Date(),
	});
	category.save(function(err,post){
		if(err){
			req.flash("error","分类保存失败");
			res.redirect("/admin/categories/add");
		}else{
			req.flash("info","分类保存成功！");
			res.redirect("/admin/categories");
		}
		
	})
});


router.get("/edit/:id",auth.requireLogin,getCategoryById,function(req,res,next){
	res.render("admin/category/add",{
		action:"/admin/categories/edit/"+req.category._id,
		pretty:true,
		pageHeader:"编辑分类",
		category:req.category,
		title:"后台管理编辑分类"
	})
})

router.post("/edit/:id",auth.requireLogin,getCategoryById,function(req,res,next){
	var category=req.category;
	var name=req.body.name.trim();
	
	var py=pinyin(name,{
		style:pinyin.STYLE_NORMAL,
		heteronym:false
	}).map(function(item){
		return item[0];
	}).join(" ");

	category.title=name;
	category.slug=slug(py);

	category.save(function(err,category){
		if(err){
			req.flash("error","分类编辑失败");
			res.redirect("/admin/categories/edit/"+category._id);
		}else{
			req.flash("info","分类编辑成功！");
			res.redirect("/admin/categories");
		}
	})
})


router.get("/delete/:id",auth.requireLogin,getCategoryById,function(req,res,next){
	req.category.remove(function(err,rowsRemoved){
		if(err){
			return next(err);
		}
		if(rowsRemoved){
			req.flash("success","分类删除成功");
		}else{
			req.flash("success","分类删除失败");
		}
		res.redirect("/admin/categories") ;
	})
})


function getCategoryById(req,res,next){
	if(!req.params.id){
		return next(new Error("no category id provided."));
	}
	Category.findOne({_id:req.params.id})
	.exec(function(err,category){
		if(err){
			return next(err);
		}
		if(!category){
			return next(new Error("category not found: ",req.params.id));
		}
		req.category=category;
		next();
	})
}