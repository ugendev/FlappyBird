const game = {
	width: 800,
	height: 600,
	canvas: null,
	ctx: null,
	pipePadding: 200,
	sprites: {
		background: null,
		bird: null,
		pipedown: null,
		pipeup: null,
	},
	pipesPairsCoords: [],
	upPipeYMin: -164,
	upPipeYMax: 0,
	firstPipe: {
		x: 0,
		y: 0,
		isChecked: false
	},
	bird: {
		x: 50,
		y: 200,
		dy: 1,
		angle: 0,
		moveMethod: "descend",
		descend() {
			this.angle += this.angle + 1 > 20
				? 0
				: 2

			this.y += this.dy
			this.dy += this.dy + 1 > 15 
				? 0
				: 1
		},
		flyUp() {
			this.angle -= this.angle - 3 < -40
				? 0
				: 3

			this.y -= this.dy
			this.dy -= this.dy - 1 < 1 
				? 0
				: 1

			if (this.dy == 1) {
				this.moveMethod = "descend"
			}
		},
		beginFlyUp() {
			game.bird.angle = 0
			game.bird.dy = 10
			game.bird.moveMethod = "flyUp"
		}
	},
	init() {
		this.canvas 				= document.getElementById("canvas")
		this.ctx 					= this.canvas.getContext("2d")
		
		this.sprites.background 	= new Image()
		this.sprites.background.src = "./img/background.png"

		this.sprites.bird			= new Image()
		this.sprites.bird.src 		= "./img/bird.png"

		this.sprites.pipedown 		= new Image()
		this.sprites.pipedown.src	= "./img/pipedown.png"		
		
		this.sprites.pipeup 		= new Image()
		this.sprites.pipeup.src		= "./img/pipeup.png"

		const upPipeY 				= this.getRandomPipeY()
		const downPipeY				= upPipeY + 282 + this.pipePadding

		this.firstPipe.x 			= 400
		this.firstPipe.y 			= upPipeY

		this.pipesPairsCoords.push(
			{
				upPipe: {
					x: 400,
					y: upPipeY
				},
				downPipe: {
					x: 400,
					y: downPipeY
				}
			}
		)

		this.run()
	},
	render() {
		this.ctx.clearRect(0, 0, this.width, this.height)

		this.ctx.drawImage(this.sprites.background, 0, 0, this.sprites.background.width, this.sprites.background.height)

		const tx = this.bird.x + this.sprites.bird.width / 2
		const ty = this.bird.y + this.sprites.bird.height / 2 

        this.ctx.save()
        this.ctx.translate(tx, ty)
        this.ctx.rotate(this.bird.angle * Math.PI / 180)
        this.ctx.translate(-tx, -ty)
		this.ctx.drawImage(this.sprites.bird, this.bird.x, this.bird.y)
        this.ctx.restore();

		this.pipesPairsCoords.forEach(item => {
			this.ctx.drawImage(this.sprites.pipeup, item.upPipe.x, item.upPipe.y)
			this.ctx.drawImage(this.sprites.pipedown, item.downPipe.x, item.downPipe.y)
		});

	},
	update() {
		this.bird[this.bird.moveMethod]()

		let newPipe = null

		this.pipesPairsCoords.forEach(item => {
			if (!item.upPipe.isChecked && item.upPipe.x < 400) {
				const upPipeY = this.getRandomPipeY()

				newPipe = {
					upPipe: {
						x: this.width,
						y: upPipeY,
						isChecked: false
					},
					downPipe: {
						x: this.width,
						y: upPipeY + 282 + this.pipePadding
					}
				}

				item.upPipe.isChecked = true
			}

			item.upPipe.x 	-= 3
			item.downPipe.x -= 3
		})

		if (newPipe) {
			this.pipesPairsCoords.push(newPipe)
		}

		this.pipesPairsCoords = this.pipesPairsCoords.filter(item => item.upPipe.x > -this.sprites.pipeup.width)

		if (this.bird.y + this.sprites.bird.height >= this.height) {
			this.gameOver()
		}

		this.pipesPairsCoords.forEach(item => {
			const upPipeCondition = this.bird.x + this.sprites.bird.width >= item.upPipe.x &&
				this.bird.x <= item.upPipe.x + this.sprites.pipeup.width &&
				this.bird.y <= item.upPipe.y + this.sprites.pipeup.height

			const downPipeCondition = this.bird.x + this.sprites.bird.width >= item.downPipe.x &&
				this.bird.x <= item.downPipe.x + this.sprites.pipedown.width &&
				this.bird.y + this.sprites.bird.height >= item.downPipe.y

			if (upPipeCondition || downPipeCondition) {
				this.gameOver()
			}
		})
	},
	run() {
		this.update()
		this.render()

		requestAnimationFrame(() => {
			game.run()
		})
	},
	getRandomPipeY() {
		return Math.floor(Math.random() * (Math.floor(this.upPipeYMax) - Math.ceil(this.upPipeYMin) + 1)) + this.upPipeYMin
	},
	gameOver() {
		alert("GameOver")
		this.run = null
	}
}

document.addEventListener("DOMContentLoaded", () => {
	game.init();
	document.body.addEventListener("keydown", game.bird.beginFlyUp)
})