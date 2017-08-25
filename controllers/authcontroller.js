var exports = module.exports = {}


exports.signup = function(req,res){
	res.render('signup'); 
}

exports.signin = function(req,res){
	res.render('login'); 
}

exports.userpage = function(req,res){
	res.render('profile', {users: req.users}); 
}

exports.logout = function(req,res){

  req.session.destroy(function(err) {
  res.redirect('/');
  });

}