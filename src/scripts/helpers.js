const models = require('../models');

/**
 * The class is a facilitator to manipulate the elements of the Snack form.
 */
export class SnackFormHelper {
	constructor(d, snacks, typesOfBread, cheeses, fillings, salads, sauces, seasonings, order) {
		
		this.fields = {
			form: {
				'name': d.getElementById('name'),
				'address': d.getElementById('address'),
				'snack-list': d.getElementById('snack-list'),
				'bread-list': d.getElementById('bread-list'),
				'cheese-list': d.getElementById('cheese-list'),
				'filling-list': d.getElementById('filling-list'),
				'salad-options': d.getElementById('salad-options'),
				'sauce-options': d.getElementById('sauce-options'),
				'seasoning-options': d.getElementById('seasoning-options'),
				'snack-value': d.getElementById('snack-value'),
				'total-order': d.getElementById('total-order')
			},
			buttons: {
				'add-snack': d.getElementById('add-snack')
			},
			'snack-table': d.getElementById('snack-table')
		};

		this.snacks = snacks;
		this.typesOfBread = typesOfBread;
		this.cheeses = cheeses;
		this.fillings = fillings;
		this.salads = salads;
		this.sauces = sauces;
		this.seasonings = seasonings;
		this.d = d;
		this.order = order;

		// Keep the snack objects inserted in the table
		this.tableDataSet = [];

		// init click listeners
		this.addClickListenerAddSnack();
		this.addChangeListenerSnack();
		this._updateTotal();
		
		// init components
		this._createSnackList();
		this._createTypesOfBreadList();
		this._createCheeseList();
		this._createFillingList();
		this._createSaladOptions();
		this._createSauceOptions();
		this._createSeasoningOptions();
	}

	/*
	 * Bind event listener.
	 * 
	 * @target
	 * 			define element where the new input will be inserted
	 * @event
	 * 			define event
	 * @callback
	 * 			define the function will be called when event was trigged
	 */
	addListener(target, event, callback) {
		target.addEventListener(event, callback.bind(this));
	}

	addClickListenerAddSnack() {
		this.fields.buttons['add-snack'].addEventListener('click', this._addSnack.bind(this));
	}

	addChangeListenerSnack() {
		this.fields.form['snack-list'].addEventListener('change', this._selectIngredientsOfSnack.bind(this));
	}

	_createSnackList() {
		this._createOptionsSelect(this.fields.form['snack-list'], this.snacks);
	}

	_createTypesOfBreadList() {
		this._createOptionsSelect(this.fields.form['bread-list'], this.typesOfBread);
	}

	_createCheeseList() {
		this._createOptionsSelect(this.fields.form['cheese-list'], this.cheeses);
	}

	_createFillingList() {
		this._createOptionsSelect(this.fields.form['filling-list'], this.fillings);
	}

	/*
	 * Creates the options of the select component.
	 * 
	 * @target
	 * 			Reference to select component where the options will be created
	 * @items
	 *			List of items
	 */
	_createOptionsSelect(target, items) {
		let opt = this.d.createElement('option');
		opt.value = '';
		opt.innerHTML = '-----';
		target.appendChild(opt);

		for (let key in items) {
			let opt = this.d.createElement('option');
			opt.value = items[key].name;
			opt.innerHTML = opt.value;
			target.appendChild(opt);
		}
	}

	_createSaladOptions() {
		for (let key in this.salads) {
			let saladName = this.salads[key].name;
			this._createInput('checkbox', 'salad', saladName, saladName, this.fields.form['salad-options']);
		}
	}

	_createSauceOptions() {
		for (let key in this.salads) {
			let sauceName = this.sauces[key].name;
			this._createInput('checkbox', 'sauce', sauceName, sauceName, this.fields.form['sauce-options']);
		}
	}

	_createSeasoningOptions() {
		for (let key in this.seasonings) {
			let seasoningName = this.seasonings[key].name;
			this._createInput('checkbox', 'seasoning', seasoningName, seasoningName, this.fields.form['seasoning-options']);
		}
	}

	/*
	 * Create a new input.
	 * 
	 * @type
	 * 			define type of the input will be created
	 * @name
	 * 			define name of the input will be created
	 * @value
	 *			define value of the input will be created
	 * @id
	 * 			define id of the input will be created
	 * @target
	 * 			define element where the new input will be inserted
	 */
	_createInput(type, name, value, id, target) {
		let opt = this.d.createElement('input');
		opt.setAttribute('type', type);
		opt.setAttribute('name', name);
		opt.setAttribute('value', value);
 		opt.setAttribute('id', id);

		let lbl = this.d.createElement('label');
 		lbl.setAttribute('for', value);
		lbl.innerHTML = value;

		target.appendChild(opt);
		target.appendChild(lbl);
	}

	_addSnack() {
		
		let strError = this._validate();
		
		if (strError !== '') {
			alert(strError);
			return;
		}

		let table = this.fields['snack-table'];

		let snackSelected = this._getSelectedSnack();
		let breadSelected = this._getSelectedBread();
		let cheeseSelected = this._getSelectedCheese();
		let fillingSelected = this._getSelectedFilling();
		
		let saladSelected = this._getAdditionalsSelected('salad', this.salads);
		let sauceSelected = this._getAdditionalsSelected('sauce', this.sauces);
		let seasoningSelected = this._getAdditionalsSelected('seasoning', this.seasonings);

		if (snackSelected === undefined) {

			let snack = new models.Snack('', [breadSelected,
																				cheeseSelected,
																				fillingSelected]
																				.concat(saladSelected)
																				.concat(sauceSelected)
																				.concat(seasoningSelected)
																				);

			this._addTableRow(table, snack, breadSelected.name);
		
		} else {
			snackSelected.ingredients = [breadSelected,
																	 cheeseSelected,
																	 fillingSelected]
																	 .concat(saladSelected)
																	 .concat(sauceSelected)
																	 .concat(seasoningSelected);

			this._addTableRow(table, snackSelected, breadSelected.name);
			this.order.push(snackSelected);
		}

		localStorage.setItem('clientName', this.fields.form.name.value);
		
		this._resetForm();

		this._updateTotal();
	}

	_addTableRow(table, snackSelected, breadName) {
		const CELL_NAME = 0,
					CELL_AMOUNT = 1,
					CELL_VALUE = 2,
					CELL_TOTAL = 3;

		let isNew = true;

		let row = table.insertRow(-1);
		let cellName = row.insertCell(CELL_NAME);
		let cellAmount = row.insertCell(CELL_AMOUNT);
		let cellValue = row.insertCell(CELL_VALUE);
		let cellTotal = row.insertCell(CELL_TOTAL);

		cellName.innerHTML = `${(this.tableDataSet.length+1)} - ${breadName}`;
		cellAmount.innerHTML = 1;
		cellValue.innerHTML = snackSelected.value();
		cellTotal.innerHTML = snackSelected.value();

		this.tableDataSet.push(snackSelected);
	}

	_getSelectedSnack() {
		let snackList = this.fields.form['snack-list'];
		return this.snacks[snackList.selectedIndex - 1];
	}

	_getSelectedBread() {
		let breadList = this.fields.form['bread-list'];
		return this.typesOfBread[breadList.selectedIndex - 1];
	}

	_getSelectedCheese() {
		let cheeseList = this.fields.form['cheese-list'];
		return this.cheeses[cheeseList.selectedIndex - 1];
	}

	_getSelectedFilling() {
		let fillingList = this.fields.form['filling-list'];
		return this.fillings[fillingList.selectedIndex - 1];
	}

	_getAdditionalsSelected(name, list) {
		let items = document.querySelectorAll(`input[name="${name}"]:checked`);
		let itemsSelected = [];

		for (let i in items) {
			for (let j in list) {
				if (items[i].value === list[j].name) {
					itemsSelected.push(list[j]);
				}
			}
		}

		return itemsSelected;
	}

	_selectIngredientsOfSnack() {
		let snack = this._getSelectedSnack();

		if (snack !== undefined) {
			let bread = snack.ingredients.filter((i) => { return i.category === 'Tipo de pão'; })[0];		
			let cheese = snack.ingredients.filter((i) => { return i.category === 'Queijo'; })[0];
			let filling = snack.ingredients.filter((i) => { return i.category === 'Recheio'; })[0];
			let salads = snack.ingredients.filter((i) => { return i.category === 'Saladas'; });
			let sauces = snack.ingredients.filter((i) => { return i.category === 'Molhos'; });
			let seasonings = snack.ingredients.filter((i) => { return i.category === 'Temperos'; });

			this.fields.form['bread-list'].value = bread.name;
			this.fields.form['cheese-list'].value = cheese.name;
			this.fields.form['filling-list'].value = filling.name;
			this._setCheckboxItem('salad', salads);
			this._setCheckboxItem('sauce', sauces);
			this._setCheckboxItem('seasoning', seasonings);

		} else {
			this.fields.form['bread-list'].value = '';
			this.fields.form['cheese-list'].value = '';
			this.fields.form['filling-list'].value = '';
		}
	}

	_setCheckboxItem(checkboxName, dataSet) {
		[...this.d.getElementsByName(checkboxName)].forEach((itemCheckbox) => {
			let isEquals = (dataSet.filter((s) => { return s.name === itemCheckbox.value }).length > 0);
			itemCheckbox.checked = isEquals;
		});
	}

	_validate() {
		let errMsg = '';

		if (this.fields.form.name.value === '') {
			errMsg += 'The field name is required.\n';
		}

		if (this.fields.form.address.value === '') {
			errMsg += 'The field address is required.\n';
		}

		let element = this.fields.form['bread-list'];
		if (element.options[element.selectedIndex].value === '') {
			errMsg += 'The field type of bread is required.\n';
		}

		return errMsg;
	}

	_resetForm() {
		this.fields.form.name.value = '';
		this.fields.form.address.value = '';
		this.fields.form['snack-list'].value = '';
		this.fields.form['bread-list'].value = '';
		this.fields.form['cheese-list'].value = '';
		this.fields.form['filling-list'].value = '';

		[...this.d.getElementsByName('salad')].forEach((itemCheckbox) => {
			itemCheckbox.checked = false;
		});

		[...this.d.getElementsByName('sauce')].forEach((itemCheckbox) => {
			itemCheckbox.checked = false;
		});

		[...this.d.getElementsByName('seasoning')].forEach((itemCheckbox) => {
			itemCheckbox.checked = false;
		});
	}

	_updateTotal() {
		let total = this.order.reduce((i, j) => {
			return i + j.value();
		}, 0);

		this.fields.form['total-order'].value = total;
	}
}

/**
 * The class is a facilitator to manipulate the elements of the Order form.
 */
export class OrderFormHelper {
	constructor(d) {
		this.fields = {
			form: {
				'name': d.getElementById('name'),
				'value': d.getElementById('value'),
				'value-order': d.getElementById('value-order'),
				'amount-people': d.getElementById('amount-people'),
				'value-person': d.getElementById('value-person'),
				'percent-person' : d.getElementById('percent-person')
			}
		}

		this.d = d;
		this.orderValue = parseFloat(localStorage.getItem('orderValue'));
		this.clientName = localStorage.getItem('clientName');

		this._setClientInformations();
		this._setValueOfTheOrder();
		this.addSplitAccountListener();
	}

	_setClientInformations() {
		this.fields.form['name'].innerHTML = this.clientName;
	}

	_setValueOfTheOrder() {
		this.fields.form['value'].innerHTML = this.orderValue;
		this.fields.form['value-order'].value = this.orderValue;
	}

	addSplitAccountListener() {
		this.fields.form['amount-people'].addEventListener('blur', this._calculatePricePerPerson.bind(this));
	}

	_calculatePricePerPerson() {
		let amountPeople = parseInt(this.fields.form['amount-people'].value);

		let valuePerPerson = this.orderValue / amountPeople;

		this.fields.form['value-person'].value = valuePerPerson;

		this.fields.form['percent-person'].value = (valuePerPerson / this.orderValue) * 100;
	}

}