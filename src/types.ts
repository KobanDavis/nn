export interface SerializedMatrix {
	rows: number
	columns: number
	data: number[][]
}

export interface SerializedLayer {
	weights: SerializedMatrix
	bias: SerializedMatrix
}

export interface SerializedNeuralNetwork {
	activationFunction: {}
	learningRate: number
	layerCount: number
	inputNodes: number
	outputNodes: number
	layers: SerializedLayer[]
}
