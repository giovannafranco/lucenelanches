const models 		= require('../models'),
			services 	= require('../services'),
			helpers 	= require('../helpers');

export class SnackController {
	constructor(d) {

		let service = new services.SnackService();

		let snacks 		 = models.Snack.arrayToObject(service.getSnacks());
		let breads 		 = models.Ingredient.arrayToObject(service.getBreads());
		let cheeses 	 = models.Ingredient.arrayToObject(service.getCheeses());
		let fillings 	 = models.Ingredient.arrayToObject(service.getFilling());
		let salads   	 = models.Ingredient.arrayToObject(service.getSalad());
		let sauces     = models.Ingredient.arrayToObject(service.getSauce());
		let seasonings = models.Ingredient.arrayToObject(service.getSeasoning());

		let order = [];

		let formHelper = new helpers.SnackFormHelper(d,
																								 snacks, 
																								 breads,
																								 cheeses,
																								 fillings,
																								 salads,
																								 sauces,
																								 seasonings,
																								 order);
		
		formHelper.addListener(d.getElementById('finish-order'), 'click', this.finishOrder);
	}

	finishOrder() {
		let total = 0;

		for (let key in this.order) {
			total += this.order[key].value();
		}

		console.log(`Total value: ${total}`);
	}
}
