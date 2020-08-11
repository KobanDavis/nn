interface Matrix {
	data: number[][]
	rows: number
	columns: number
}

type MapFn = (v: number, row: number, col: number) => number

class Matrix {
	constructor(rows: number, columns: number) {
		this.rows = rows
		this.columns = columns
		this.data = []
		this.init()
	}

	private init(): void {
		for (let i = 0; i < this.rows; i++) {
			this.data[i] = []
			for (let j = 0; j < this.columns; j++) {
				this.set(i, j, 0)
			}
		}
	}

	public get(row: number): number[]
	public get(row: number, col?: number): number
	public get(row: number, col?: any): any {
		if (col !== undefined) {
			return this.data[row][col]
		} else {
			return this.data[row]
		}
	}

	public set(row: number, col: number, value: number): void {
		this.data[row][col] = value
	}

	public map(fn: MapFn): this {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				this.set(i, j, fn(this.get(i, j), i, j))
			}
		}
		return this
	}

	public static map(matrix: Matrix, fn: MapFn): Matrix {
		return matrix.copy().map(fn)
	}

	public multiply(v: number): this
	public multiply(v: Matrix): this
	public multiply(v: number | Matrix): this {
		if (typeof v === 'number') {
			return this.map((value) => value * v)
		}
		return this.map((value, i, j) => value * v.get(i, j))
	}

	public randomize(): this {
		this.map(() => Math.random() * 2 - 1)
		return this
	}

	public add(v: number): this
	public add(v: Matrix): this
	public add(v: number | Matrix): this {
		if (typeof v === 'number') {
			return this.map((value) => value + v)
		}
		return this.map((value, i, j) => value + v.get(i, j))
	}

	public copy(): Matrix {
		const res = new Matrix(this.rows, this.columns)
		res.map((_, row, col) => this.get(row, col))
		return res
	}

	public static multiply(a: Matrix, b: Matrix): Matrix {
		const dotProduct = (a: number[], b: number[]) => {
			let res = 0
			for (let i = 0; i < a.length; i++) {
				res += a[i] * b[i]
			}
			return res
		}

		const res = new Matrix(a.rows, b.columns)
		const c = b.copy().transpose()

		res.map((_, i, j) => dotProduct(a.get(i), c.get(j)))

		return res
	}

	public transpose(): Matrix {
		return new Matrix(this.columns, this.rows).map((_, row, col) => this.get(col, row))
	}

	public static transpose(matrix: Matrix): Matrix {
		return new Matrix(matrix.columns, matrix.rows).map((_, row, col) => matrix.data[col][row])
	}

	public static subtract(a: Matrix, b: Matrix): Matrix {
		return a.copy().map((value, row, col) => value - b.get(row, col))
	}

	public static fromArray(arr: number[]): Matrix
	public static fromArray(arr: number[][]): Matrix
	public static fromArray(arr: any[]): Matrix {
		if (Array.isArray(arr[0])) {
			return new Matrix(arr.length, arr[0].length).map((_, row, col) => arr[row][col])
		}
		return new Matrix(arr.length, 1).map((_, row) => arr[row])
	}

	public toArray(): number[] {
		let arr = []
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				arr.push(this.get(i, j))
			}
		}
		return arr
	}

	// debug
	public print(): void {
		console.table(this.data)
	}
}

export default Matrix
