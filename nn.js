// nn.js

class NeuralNetwork {
	constructor(inputs, hidden1s, hidden2s, outputs) {
		this.inputs = inputs
		this.hidden1s = hidden1s
		this.hidden2s = hidden2s
		this.outputs = outputs

		this.weights_ih = math.matrix(Array.from({length: hidden1s}, () => Array.from({length: inputs}, () => math.random(-1, 1))))
		this.weights_hh = math.matrix(Array.from({length: hidden2s}, () => Array.from({length: hidden1s}, () => math.random(-1, 1))))
		this.weights_ho = math.matrix(Array.from({length: outputs}, () => Array.from({length: hidden2s}, () => math.random(-1, 1))))

		this.bias_h1 = math.matrix(Array.from({ length: hidden1s }, () => [math.random(-1, 1)])); // 2D array for biases
		this.bias_h2 = math.matrix(Array.from({ length: hidden2s }, () => [math.random(-1, 1)])); // 2D array for biases
		this.bias_o = math.matrix(Array.from({ length: outputs }, () => [math.random(-1, 1)])); // 2D array for biases

		this.learning_rate = 0.01

		this.sigmoid = x => 1 / (1 + math.exp(-x))
		this.dsigmoid = x => x * (1 - x)
	}

	feedforward(input) {
		let inputM = math.matrix(input.map(value => [value]));

    // Ensure input is a matrix
    let hidden1 = math.multiply(this.weights_ih, inputM); // This should be [hidden1s, 1]
    hidden1 = math.add(hidden1, this.bias_h1); // This should match dimensions now
    hidden1 = hidden1.map(this.sigmoid);

    let hidden2 = math.multiply(this.weights_hh, hidden1); // [hidden2s, 1]
    hidden2 = math.add(hidden2, this.bias_h2);
    hidden2 = hidden2.map(this.sigmoid);

    let output = math.multiply(this.weights_ho, hidden2); // [outputs, 1]
    output = math.add(output, this.bias_o);
    output = output.map(this.sigmoid);

    return output; // Output should be a [outputs, 1] matrix
	}

	train(input, target) {
		let inputM = math.matrix(input.map(value => [value]));
		let targetM = new Array(10).fill([0])
		targetM[target] = [1]
		targetM = math.matrix(targetM);

		let hidden1 = math.multiply(this.weights_ih, inputM);
    hidden1 = math.add(hidden1, this.bias_h1);
    hidden1 = hidden1.map(this.sigmoid);

    let hidden2 = math.multiply(this.weights_hh, hidden1);
    hidden2 = math.add(hidden2, this.bias_h2);
    hidden2 = hidden2.map(this.sigmoid);

    let output = math.multiply(this.weights_ho, hidden2);
    output = math.add(output, this.bias_o);
    output = output.map(this.sigmoid);

    let output_errors = math.subtract(targetM, output);

    let output_gradients = math.dotMultiply(output.map(this.dsigmoid), output_errors);
    output_gradients = math.dotMultiply(output_gradients, this.learning_rate);

    let hidden2T = math.transpose(hidden2);
    let weights_ho_deltas = math.multiply(output_gradients, hidden2T);
    this.weights_ho = math.add(this.weights_ho, weights_ho_deltas);
		
		let who_t = math.transpose(this.weights_ho);
		let hidden2_errors = math.multiply(who_t, output_errors);
		
		let hidden2_gradients = math.map(hidden2, this.dsigmoid);
		hidden2_gradients = math.dotMultiply(hidden2_gradients, hidden2_errors);
		hidden2_gradients = math.multiply(hidden2_gradients, this.learning_rate);
		
		let hidden1T = math.transpose(hidden1);
		let weights_hh_deltas = math.multiply(hidden2_gradients, hidden1T);
		this.weights_hh = math.add(this.weights_hh, weights_hh_deltas);
		
		let whh_t = math.transpose(this.weights_hh);
		let hidden1_errors = math.multiply(whh_t, hidden2_errors);
		
		let hidden1_gradients = math.map(hidden1, this.dsigmoid);
		hidden1_gradients = math.dotMultiply(hidden1_gradients, hidden1_errors);
		hidden1_gradients = math.multiply(hidden1_gradients, this.learning_rate);
		
		let inputT = math.transpose(inputM);
		let weights_ih_deltas = math.multiply(hidden1_gradients, inputT);
		this.weights_ih = math.add(this.weights_ih, weights_ih_deltas);
	}
	

	saveWeights() {
		const weights = {
			weights_ih: this.weights_ih._data,
			weights_hh: this.weights_hh._data,
			weights_ho: this.weights_ho._data,
			bias_h1: this.bias_h1._data,
			bias_h2: this.bias_h2._data,
			bias_o: this.bias_o._data
		};
		localStorage.setItem('neuralNetworkWeights', JSON.stringify(weights));
	}

	loadWeights() {
		const savedWeights = localStorage.getItem('neuralNetworkWeights');
		if (savedWeights) {
			const weights = JSON.parse(savedWeights);
			this.weights_ih = math.matrix(weights.weights_ih);
			this.weights_hh = math.matrix(weights.weights_hh);
			this.weights_ho = math.matrix(weights.weights_ho);
			this.bias_h1 = math.matrix(weights.bias_h1);
			this.bias_h2 = math.matrix(weights.bias_h2);
			this.bias_o = math.matrix(weights.bias_o);
		}
	}
}

function show(m) {
	console.log(m.toString())
}

function getSize(m) {
	let s = math.size(m)._data
	console.log(s.length > 1 ? `${s[0]}x${s[1]}` : s[0])
}