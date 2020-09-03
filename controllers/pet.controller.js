const mongoose = require('mongoose');
const User = require('../models/user.model');
const Pets = require('../models/pet.model');

//PET PROFILE

module.exports.showAddPetPage = (req, res, next) => {
	res.render('pets/addnewpet')
}

module.exports.createPet = (req, res, next) => {
	const petParams = req.body;
	userParams.avatar = req.file ? req.file.path : undefined;
	const pet = new Pets(petParams);


	pet.save()
		.then(pet => {
			res.render('pets/pets', {
				pet,
				message: 'Your pet (name) has been sucessfully added!'
			})
			console.log(pet);
		})
		.catch((error) => {
			if (error instanceof mongoose.Error.ValidationError) {
				res.render("pet/addnewpet", {
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
	console.log('petParams', petParams);

	Pets.findByIdAndUpdate(req.params.id, petParams, {
			runValidators: true,
			new: true
		})
		.then(pet => {
			if (pet) {
				console.log('saved Pet', pet);
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
			const userId = req.currentUser.id

			res.redirect(`/user/${userId}`)
		})
		.catch(err => next(err))
}