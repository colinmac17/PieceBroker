var exports = module.exports = {}

exports.signup = function(req,res){
	res.render('signup'); 
}

exports.signin = function(req,res){
	res.render('login'); 
}

exports.logout = function(req,res){
  res.co
  req.session.destroy(function(err) {
  res.redirect('/');
  });

}