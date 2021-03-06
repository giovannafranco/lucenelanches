export class Snack {
	constructor(name, ingredients) {
		this.name = name;
		this.ingredients = ingredients.map((i) => {
			if (i instanceof Ingredient) {
				return i;
			}
			return new Ingredient(i.categoria, i.nome, i.valor);
		});
		this.value = () => {
			let total = 0;
			for (let key in this.ingredients) {
				total += this.ingredients[key].value;
			}
			return total;
		};
	}

	static arrayToObject(arr) {
		let snacks = [];

		for (let key in arr) {
			let name = arr[key].nome;
			let ingredients = arr[key].ingredientes;
			let s = new Snack(name, ingredients);

			snacks.push(s);
		}

		return snacks;
	}
}

export class Ingredient{
	constructor(category, name, value){
		this.category = category;
		this.name = name;
		this.value = value;
	}

	static arrayToObject(arr) {
		let ingredients = [];

		let category = arr.categoria;
		
		for (let key in arr.ingredientes) {
			let name = arr.ingredientes[key].nome;
			let value = arr.ingredientes[key].valor;
			let i = new Ingredient(category, name, value);

			ingredients.push(i);
		}

		return ingredients;
	}
}



