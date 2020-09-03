const mongoose = require('mongoose');
const User = require('../models/user.model');
const Pets = require('../models/pet.model');

//PET PROFILE

module.exports.showAddPetPage = (req, res, next) => {
	res.render('pets/addnewpet')
}

module.exports.createPet = (req, res, next) => {
	const petParams = req.body;
	petParams.user = req.currentUser.id;
	petParams.avatar = req.file ? req.file.path : undefined;
	const pet = new Pets(petParams);

	console.log('petParams', petParams);

	pet.save()
		.then(p => {
			console.log('Created pet', p);

			res.render('pets/pets', p)
				/* 
				message: 'Your pet (name) has been sucessfully added!' */
			
		})
		.catch((error) => {
			if (error instanceof mongoose.Error.ValidationError) {
				res.render("pets/addnewpet", {
					error: error.errors,
					pet
				});
			} else {
				next(error);
			}
		})
		.catch(next)
}

module.exports.showPetProfilePage = (req, res, next) => {
	const {
		id
	} = req.params;
	User.findById(id)
		.populate("pets")
		.then(user => {
			const pets = user.pets
			res.render('pets/pets', {
				user,
				pets
			})
		})
		.catch(err => next(err))
}

module.exports.showEditPetForm = (req, res, next) => {

	Pets.findById(req.params.id)
		.then(pet => {
			res.render('pets/editpetform', {
				pet
			})
		})
		.catch(err => next(err))
}


//dudas con update y delete pet
module.exports.updatePet = (req, res, next) => {
	const petParams = req.body;
	
	if (req.file) {
		petParams.avatar = req.file.path;
	}

	Pets.findByIdAndUpdate(req.params.id, petParams, {
			runValidators: true,
			new: true
		})
		.then(pet => {
			if (pet) {
				res.redirect(`/user/${pet.user._id}/pets`)
			} else {
				res.redirect(`/pet/${pet._id}/editPet`)
			}
		})
		.catch(err => next(err))
}

module.exports.deletePet = (req, res, next) => {
	Pets.findByIdAndDelete(req.params.id)
		.then(() => {
			res.redirect(`/user/${req.currentUser.id}`)
		})
		.catch(err => next(err))
}