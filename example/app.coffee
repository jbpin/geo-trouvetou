fs = require "fs"
path = require "path"
geo = require "./GeoTrouvetou"
prompt = require "prompt"
async = require "async"

time = process.hrtime()

elapsed_time = (note)->
	time = process.hrtime(time)
	precision = 3
	elapsed = process.hrtime(time)[1] / 1000000;
	console.log time[0]+"s "+elapsed.toFixed(precision) + " ms - " + note
	time = process.hrtime()

app = {

	tree:null,

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
				point = new geo.GeoPoint(item[18], item[17])
				point.data = item
				if(!app.tree)
					app.tree = new geo.TreeNode point
				else
					app.tree.addLeaf point
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
			console.log app.tree.getClosest new geo.GeoPoint(parseFloat(result.Latitude), parseFloat(result.Longitude))
			elapsed_time("found")
			app.infinite()
}

app.start()