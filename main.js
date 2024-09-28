// main.js

let nn = new NeuralNetwork(size**2, 28, 28, 10)

nn.loadWeights()

$('#train')[0].addEventListener('click', () => {
	fetch('mnist_train.json')
	.then(response => response.json())
	.then(data => {
			let currentTime = Date.now();
			let i = 0;
			let trainingInterval = setInterval(() => {
					if (Date.now() - currentTime > 10000) { // Stop after 30 seconds
							clearInterval(trainingInterval);
							nn.saveWeights();
							return;
					}

					let value = data[Math.floor(Math.random() * data.length)];
					nn.train(math.matrix(value.data), value.label);

					let elapsedTime = 100 - Math.floor((Date.now() - currentTime) / 100);

					$('#train span')[0].innerHTML = elapsedTime; // Update the time in the UI
			}, 10); // Train every 10ms
	})
	.catch(error => console.error('Error fetching the JSON data:', error));
});

for (let i = 0; i < 10; i++) {
	$('.output')[i].addEventListener('click', () => {
		saveChanges(values, i)
		values = new Array(size**2).fill(0)
		$('.cell').css('background-color', '#0000');
	})
}

function saveChanges(inputs, output) {
	nn.train(math.matrix(inputs), output);
	nn.saveWeights()
}

setInterval(() => {
	let inputs = values
	let guess = nn.feedforward(inputs)
	for (let i = 0; i < guess._data.length; i++) {
		$(`#outputs :nth-child(${i+1})`).css('background-color', `rgba(255, 255, 0, ${guess._data[i]})`);
	}
}, 1)