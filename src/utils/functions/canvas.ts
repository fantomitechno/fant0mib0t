import { CanvasRenderingContext2D } from 'canvas'
import { EmojiEntity, parse } from 'twemoji-parser'
import Canvas from 'canvas'


export const drawEmoji = async (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, w: number, h: number) => {

    let emojis = parse(text, {assetType: 'png'})
    let str = text.split('')
    const regex = /^[\w\s]*$/

    emojis = emojis.reverse()
    emojis.forEach((emoji: EmojiEntity) => {
        str.splice(emoji.indices[0], Math.abs(emoji.indices[0] - emoji.indices[1]), emoji.url)
    })

    let index = 0

    for (let i =0; i < str.length; i++) {
        if (str[i].length != 1) {
            if (regex.test(str.slice(index,i).join('')) === false) {
                let font = ctx.font
                ctx.font = `${ctx.font.split(' ')[0]} sans-serif`
                ctx.fillText(str.slice(index,i).join(''), x, y)
                x += ctx.measureText(str.slice(index,i).join('')).width
                ctx.font = font
            } else {
                ctx.fillText(str.slice(index, i).join(''), x, y)
                x += ctx.measureText(str.slice(index, i).join('')).width
            }
            ctx.drawImage(await getImgCache(str[i]), x, y - (5 / 6) * h, w, h)
            x += w + 10
            index = i + 1
        }
    }
    if (index < str.length) {
        if (regex.test(str.slice(index).join('')) === false) {
            let font = ctx.font
            ctx.font = `${ctx.font.split(' ')[0]} sans-serif`
            ctx.fillText(str.slice(index).join(''), x, y)
            x += ctx.measureText(str.slice(index).join('')).width
            ctx.font = font
        } else ctx.fillText(str.slice(index).join(''), x, y)
    }
}


const imageCache: any = {}


export const getImgCache = async (url: string, useCache = true) => {
	if (!useCache) return await Canvas.loadImage(url)
	if (imageCache[url]) return imageCache[url]

	return imageCache[url] = await Canvas.loadImage(url)
}

export const drawCircle = async (x: number, y: number, r: number, ctx: CanvasRenderingContext2D) => {
	ctx.beginPath()
	ctx.arc(x, y, r, 0, Math.PI * 2, false)
	ctx.closePath()
	ctx.fill()
}

export const rectRounded = async (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, r: number) => {
    ctx.beginPath()
	ctx.moveTo(x, y + r)
	ctx.lineTo(x, y + height - r)
	ctx.quadraticCurveTo(x, y + height, x + r, y + height)
	ctx.lineTo(x + width - r, y + height)
	ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - r)
	ctx.lineTo(x + width, y + r)
	ctx.quadraticCurveTo(x + width, y, x + width - r, y)
	ctx.lineTo(x + r, y)
	ctx.quadraticCurveTo(x, y, x, y + r)
	ctx.stroke()
}