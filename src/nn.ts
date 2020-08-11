import Matrix from './matrix'
import { SerializedNeuralNetwork, SerializedMatrix } from './types'
import ActivationFunction from './activationFunction'
import Layer from './layer'

const sigmoid = new ActivationFunction(
	(x) => 1 / (1 + Math.exp(-x)),
	(y) => y * (1 - y)
)

interface NeuralNetwork {
	inputToHiddenWeights: Matrix
	hiddenBias: Matrix
	hiddenToOutputWeights: Matrix
	outputBias: Matrix
	learningRate: number
	activationFunction: ActivationFunction
	layerCount: number
	inputNodes: number
	outputNodes: number
	layers: Layer[]
}

class NeuralNetwork {
	constructor(layers: number[], activationFunction: ActivationFunction = sigmoid) {
		this.activationFunction = activationFunction
		this.learningRate = 0.1
		this.layerCount = layers.length - 1 // ignore output layer
		this.inputNodes = layers[0]
		this.outputNodes = layers[layers.length - 1]
		this.layers = []
		this.initLayers(layers)
	}

	public initLayers(layers: number[]): void {
		for (let i = 0; i < this.layerCount; i++) {
			this.layers[i] = new Layer(layers[i], layers[i + 1])
		}
	}

	public predict(input: number[]) {
		let layerResult = Matrix.fromArray(input)
		for (let i = 0; i < this.layerCount; i++) {
			layerResult = Matrix.multiply(this.layers[i].weights, layerResult)
				.add(this.layers[i].bias)
				.map(this.activationFunction.activation)
		}
		return layerResult.toArray()
	}

	public train(input: number[], target: number[]) {
		const inputs = Matrix.fromArray(input)
		const layerResult = []

		layerResult[0] = inputs

		for (let i = 0; i < this.layerCount; i++) {
			layerResult[i + 1] = Matrix.multiply(this.layers[i].weights, layerResult[i])
				.add(this.layers[i].bias)
				.map(this.activationFunction.activation)
		}

		const targets = Matrix.fromArray(target)
		const layerErrors = []
		const gradients = []

		layerErrors[this.layerCount] = Matrix.subtract(targets, layerResult[this.layerCount])

		for (let i = this.layerCount; i > 0; i--) {
			gradients[i] = Matrix.map(layerResult[i], this.activationFunction.derivative)
				.multiply(layerErrors[i])
				.multiply(this.learningRate)

			const weightDeltas = Matrix.multiply(gradients[i], Matrix.transpose(layerResult[i - 1]))

			this.layers[i - 1].add(weightDeltas, gradients[i])
			layerErrors[i - 1] = Matrix.multiply(Matrix.transpose(this.layers[i - 1].weights), layerErrors[i])
		}
	}

	public serialize(): string {
		return JSON.stringify(this)
	}

	public static deserialize(v: string | SerializedNeuralNetwork): NeuralNetwork {
		let data: SerializedNeuralNetwork
		if (typeof v === 'string') {
			data = JSON.parse(v)
		} else {
			data = v
		}
		const layers = [data.inputNodes, ...data.layers.map((l) => l.weights.rows)]
		const nn = new NeuralNetwork(layers)
		data.layers.forEach(({ weights, bias }, i) => {
			nn.layers[i].weights = Matrix.fromArray(weights.data)
			nn.layers[i].bias = Matrix.fromArray(bias.data)
		})
		nn.learningRate = data.learningRate
		return nn
	}
}

export default NeuralNetwork
