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

		this.ctx.drawImage(this.sprites.pipeup, 400, 0)
		this.ctx.drawImage(this.sprites.pipedown, 400, this.sprites.pipeup.height + this.pipePadding)
	},
	update() {
		this.bird[this.bird.moveMethod]()
	},
	run() {
		this.update()
		this.render()

		requestAnimationFrame(() => {
			game.run()
		})
	}
}

document.addEventListener("DOMContentLoaded", () => {
	game.init();
	document.body.addEventListener("keydown", game.bird.beginFlyUp)
})