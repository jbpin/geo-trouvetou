fs = require "fs"
path = require "path"
geo = require "./geotrouvetou"
prompt = require "prompt"

time = process.hrtime()

elapsed_time = (note)->
	time = process.hrtime(time)
	precision = 3
	elapsed = process.hrtime(time)[1] / 1000000;
	console.log time[0]+"s "+elapsed.toFixed(precision) + " ms - " + note
	time = process.hrtime()

randomFloatBetween = (minValue,maxValue,precision)->
    if(typeof(precision) == 'undefined')
        precision = 2;
    return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision))

app = {

	tree:new geo.GeoTrouvetou(),

	start:()->
		console.log "Welcome to geo-trouvetou example"
		console.log "Loading data file"
		time = process.hrtime()
		fs.readFile path.join(__dirname, 'data/rows.json'),"utf-8", (err, data)->
			if err
				console.log err;
			elapsed_time("file loaded")
			data = JSON.parse data
			elapsed_time("parsing json")
			console.log "Tree creation"
			i = data.data.length
			while(i--)
				item = data.data[i]
				point = new geo.GeoPoint(parseFloat(item[18]), parseFloat(item[17]))
				point.data = item
				app.tree.addPoint point
			elapsed_time("building tree")
			console.log data.data.length+" points loaded"
			console.log "The app is ready"

			prompt.start()
			app.infinite()

	,
	infinite:()->
		console.log  "Enter a location in San Francisco in order to find the nearest crime."
		console.log "Press Ctrl+Z to close the app"
		prompt.get ["Latitude","Longitude"], (err, result)->
			if err
				console.log err
			time = process.hrtime()
			gp = new geo.GeoPoint(parseFloat(result.Latitude), parseFloat(result.Longitude))
			console.log gp
			console.log app.tree.findClosest gp
			elapsed_time("found")
			app.infinite()
}

app.start()