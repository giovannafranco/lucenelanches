export class AjaxUtils {

	constructor() {
		this._arr = [];
	}

	makeSyncCall(url, method='GET') {		

		let STATUS_OK = 200;
		
		let _xhttp = new XMLHttpRequest();
		_xhttp.open('GET', url, false);
    _xhttp.send(null);

		if (_xhttp.status === STATUS_OK) {
			this._setObjectArr(JSON.parse(_xhttp.responseText));
		}

	}

	_setObjectArr(arr) {
		this._arr = arr;
	}

	getObjectArr() {
		return this._arr;
	}
}
