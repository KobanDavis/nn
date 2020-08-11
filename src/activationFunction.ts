type Fn = (x: number) => number

interface ActivationFunction {
	activation: Fn
	derivative: Fn
}

class ActivationFunction {
	constructor(public activation: Fn, public derivative: Fn) {}
}

export default ActivationFunction
