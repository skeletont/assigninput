
const editMainPage = async function(inputId, value) {
	console.log("assignInput: editMainPage " + inputId);
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	chrome.scripting.executeScript({
		target: {tabId: tab.id},
		func: (inputId, value) => {
			console.log("assignInput: call executeScript");
			console.log("assignInput: " + inputId);
			console.log("assignInput: " + value);
			const inputTag = document.getElementById(inputId);
			inputTag.value = value;
		},
		args: [inputId, value]
	});
};

const makeSelectList = (csvText) => {
	const lines = csvText.split(/[\r\n]+/);
	const headers = lines.shift().split(/,/);
	lines.forEach(line => {	
		const tokens = line.split(/,/);
		if (tokens.length < 4) return;

		const tr = document.createElement("tr");
		tblb.appendChild(tr);
		const td1 = document.createElement("td");
		tr.appendChild(td1);
		const td2 = document.createElement("td");
		td2.innerText = tokens[1];
		tr.appendChild(td2);
		const btn = document.createElement("button");
		btn.innerText = tokens[0];
		btn.addEventListener("click", () => {
			console.log("click");
			for (let i = 2; i < headers.length; i++) {
				editMainPage(headers[i], tokens[i]);
			}
		});
		td1.appendChild(btn);
	});
};
const loadFile = (file) => {
	console.log("File selected: ", file);
	const fileReader = new FileReader();
	fileReader.onload = ev => {
		if (fileReader.readyState == 2) { 
			console.log("assignInput data: " + fileReader.result);
			// sessionStorage.setItem('assignInput', fileReader.result);
			// localStorage.setItem('assignInput', fileReader.result);
			if (chrome.storage) {
				chrome.storage.sync.set({ 
					csvText: fileReader.result 
				}, () => {
					console.log("assignInput save");
				});
			}
			// makeSelectList(fileReader.result);
		}
	};
	// fileReader.readAsDataURL(file);
	fileReader.readAsText(file);
};

if (chrome.storage) {
	chrome.storage.sync.get('csvText', (value) => {
		const preCsvText = value.csvText;
		if (preCsvText) {
			console.log("assignInput data: " + preCsvText);
			makeSelectList(preCsvText);
		} else {
			console.log("assignInputFile: no data");
		}
	});
}

const elem = document.getElementById("fl");
elem.addEventListener("change", (event) => {
	const el = event.target;
	// const tblb = document.getElementById("tblb");
	// tblb.innerHTML = '';
	for (let i = 0; i < el.files.length; i++) {
		const file = el.files[i];
		loadFile(file);
	}
});

