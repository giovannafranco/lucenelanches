/**
 * The class is a facilitator to manipulate the elements of the Snack form.
 */

export class SnackFormHelper {
	constructor(d, snacks, typesOfBread, cheeses, fillings, salads, sauces, seasonings, order) {
		
		this.fields = {
			form: {
				'name': d.getElementById('username'),
				'address': d.getElementById('user-address'),
				'snack-list': d.getElementById('snack-list'),
				'bread-list': d.getElementById('bread-list'),
				'cheese-list': d.getElementById('cheese-list'),
				'filling-list': d.getElementById('filling-list'),
				'salad-options': d.getElementById('salad-options'),
				'sauce-options': d.getElementById('sauce-options'),
				'seasoning-options': d.getElementById('seasoning-options')
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
		let opt = this.d.createElement('option');
		opt.value = '';
		opt.innerHTML = '-----';
		this.fields.form['snack-list'].appendChild(opt);

		for (let key in this.snacks) {
			let opt = this.d.createElement('option');
			opt.value = this.snacks[key].name;
			opt.innerHTML = opt.value;

			this.fields.form['snack-list'].appendChild(opt);
		}
	}

	_createTypesOfBreadList() {
		let opt = this.d.createElement('option');
		opt.value = '';
		opt.innerHTML = '-----';
		this.fields.form['bread-list'].appendChild(opt);

		for (let key in this.typesOfBread) {
			let opt = this.d.createElement('option');
			opt.value = this.typesOfBread[key].name;
			opt.innerHTML = opt.value;

			this.fields.form['bread-list'].appendChild(opt);
		}
	}

	_createCheeseList() {
		let opt = this.d.createElement('option');
		opt.value = '';
		opt.innerHTML = '-----';
		this.fields.form['cheese-list'].appendChild(opt);

		for (let key in this.cheeses) {
			let opt = this.d.createElement('option');
			opt.value = this.cheeses[key].name;
			opt.innerHTML = opt.value;

			this.fields.form['cheese-list'].appendChild(opt);
		}
	}

	_createFillingList() {
		let opt = this.d.createElement('option');
		opt.value = '';
		opt.innerHTML = '-----';
		this.fields.form['filling-list'].appendChild(opt);

		for (let key in this.fillings) {
			let opt = this.d.createElement('option');
			opt.value = this.fillings[key].name;
			opt.innerHTML = opt.value;

			this.fields.form['filling-list'].appendChild(opt);
		}
	}

	_createSaladOptions() {
		for (let key in this.salads) {
			let saladName = this.salads[key].name;
			this._createInput('radio', 'salad', saladName, saladName, this.fields.form['salad-options']);
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
		let breadList = this.fields.form['bread-list'];
		let cheesesList = this.fields.form['cheese-list'];
		let fillingList = this.fields.form['filling-list'];
		let table = this.fields['snack-table'];


		let snackSelected = this._getSelectedSnack();
		
		// let typeOfBreadSelected = this.typesOfBread[breadList.selectedIndex];
		// let cheeseSelected = this.cheeses[cheesesList.selectedIndex];
		// let fillingSelected = this.fillings[fillingList.selectedIndex];

		// FIXME: validar se o usuário selecionou lanche, queijo, etc
		// snackSelected.ingredients.concat([typeOfBreadSelected, cheeseSelected, fillingSelected]);

		if (snackSelected === undefined) {
			alert('Selecione um lanche!');
		} else {
			this._addTableRow(table, snackSelected);
			this.order.push(snackSelected);
		}
	}

	_addTableRow(table, snackSelected) {
		const CELL_NAME = 0;
		const CELL_AMOUNT = 1;
		const CELL_VALUE = 2;
		const CELL_TOTAL = 3;

		let isNew = true;

		let hasSnack = this._hasSnack(this.tableDataSet, snackSelected);

		if (!hasSnack) {
			let row = table.insertRow(-1);
			let cellName = row.insertCell(CELL_NAME);
			let cellAmount = row.insertCell(CELL_AMOUNT);
			let cellValue = row.insertCell(CELL_VALUE);
			let cellTotal = row.insertCell(CELL_TOTAL);

			cellName.innerHTML = `${(this.tableDataSet.length+1)} - ${snackSelected.name}`;
			cellAmount.innerHTML = 1;
			cellValue.innerHTML = snackSelected.value();
			cellTotal.innerHTML = snackSelected.value();

			this.tableDataSet.push(snackSelected);
		} else {
			let snackIndex = this.tableDataSet.indexOf(snackSelected) + 1;
			let rows = this.fields['snack-table'].rows;
			
			let amount = parseInt(rows[snackIndex].cells[CELL_AMOUNT].innerHTML);
			let value = parseFloat(rows[snackIndex].cells[CELL_VALUE].innerHTML);

			rows[snackIndex].cells[CELL_AMOUNT].innerHTML = (amount + 1);
			rows[snackIndex].cells[CELL_TOTAL].innerHTML = value * (amount + 1);
		}
	}

	_hasSnack(list, snack) {
		return list.filter((s) => {
			return (s.name === snack.name &&
						  s.value === snack.value &&
						  s.ingredients.length === snack.ingredients.length);
		}).length > 0;
	}

	_getSelectedSnack() {
		let snackList = this.fields.form['snack-list'];
		return this.snacks[snackList.selectedIndex - 1];
	}

	_selectIngredientsOfSnack() {
		let snack = this._getSelectedSnack();

		if (snack !== undefined) {
			let bread = snack.ingredients.filter((i) => { return i.categoria === 'Tipo de pão'; })[0];		
			let cheese = snack.ingredients.filter((i) => { return i.categoria === 'Queijo'; })[0];
			let filling = snack.ingredients.filter((i) => { return i.categoria === 'Recheio'; })[0];
			let salad = snack.ingredients.filter((i) => { return i.categoria === 'Saladas'; })[0];



			this.fields.form['bread-list'].value = bread.nome;
			this.fields.form['cheese-list'].value = cheese.nome;
			this.fields.form['filling-list'].value = filling.nome;


			let saladArr = this.d.getElementsByName('salad');
			console.log(saladArr);

			for (let key in saladArr) {
				if (saladArr[key].value === salad.nome) {
					saladArr[key].checked = true;
					break;
				}
			}

			// this.fields.form['salad-options'].value = salad.nome;


		} else {
			this.fields.form['bread-list'].value = '';
			this.fields.form['cheese-list'].value = '';
			this.fields.form['filling-list'].value = '';
		}
	}
}