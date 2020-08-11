import Matrix from './matrix'

interface Layer {
	weights: Matrix
	bias: Matrix
}

class Layer {
	constructor(prevNodes: number, nodes: number) {
		this.weights = new Matrix(nodes, prevNodes).randomize()
		this.bias = new Matrix(nodes, 1).randomize()
	}

	public add(deltaWeight: Matrix, bias: Matrix) {
		this.weights.add(deltaWeight)
		this.bias.add(bias)
	}
}

export default Layer
