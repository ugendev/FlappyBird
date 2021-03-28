const game = {
	width: 800,
	height: 600,
	ctx: null,
	pipePadding: 200,
	sprites: {
		background: null,
		bird: null,
		pipedown: null,
		pipeup: null,
	},
	init() {
		this.ctx 					= document.getElementById("canvas").getContext("2d")
		
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
		this.ctx.drawImage(this.sprites.bird, 50, 200)
		this.ctx.drawImage(this.sprites.pipeup, 400, 0)
		this.ctx.drawImage(this.sprites.pipedown, 400, this.sprites.pipeup.height + this.pipePadding)
	},
	run() {
		this.render()

		requestAnimationFrame(() => {
			game.run()
		})
	}
}

document.addEventListener("DOMContentLoaded", () => {
	game.init();
})