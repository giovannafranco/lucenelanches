const utils = require('../utils');

export class SnackService {

	constructor() {
		this._ingredients = [];
		this._ajaxUtils = new utils.AjaxUtils();
	}

	getSnacks() {
		this._ajaxUtils.makeSyncCall('https://private-anon-ecaabf1f91-lucenelanchesfrontend.apiary-mock.com/lanches');
		return this._ajaxUtils.getObjectArr();
	}

	_getIngredients() {
		if (this._ingredients.length > 0) {
			return this._ingredients;
		}

		this._ajaxUtils.makeSyncCall('https://private-anon-ecaabf1f91-lucenelanchesfrontend.apiary-mock.com/ingredientes');
		this._ingredients = this._ajaxUtils.getObjectArr();

		return this._ingredients;
	}

	getBreads() {
		let ingredients = this._getIngredients();

		for (let key in ingredients) {
			if (ingredients[key].categoria === 'Tipo de pão') {
				return ingredients[key];
			}
		}
	}

	getCheeses() {
		let ingredients = this._getIngredients();

		for (let key in ingredients) {
			if (ingredients[key].categoria === 'Queijos') {
				return ingredients[key];
			}
		}
	}

	getFilling(){
		let ingredients = this._getIngredients();

		for (let key in ingredients) {
			if (ingredients[key].categoria === 'Recheio') {
				return ingredients[key];
			}
		}
	}

	getSalad(){
		let ingredients = this._getIngredients();

		for (let key in ingredients) {
			if (ingredients[key].categoria === 'Saladas') {
				return ingredients[key];
			}
		}
	}

	getSauce(){
		let ingredients = this._getIngredients();

		for (let key in ingredients) {
			if (ingredients[key].categoria === 'Molhos') {
				return ingredients[key];
			}
		}
	}

	getSeasoning(){
		let ingredients = this._getIngredients();

		for (let key in ingredients) {
			if (ingredients[key].categoria === 'Temperos') {
				return ingredients[key];
			}
		}
	}

}