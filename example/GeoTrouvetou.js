function GeoPoint(latitude,longitude){
	
	this.latitude = latitude;
	this.longitude = longitude;
	this.data;

	this.getDirection = function(point){
		// 0 NW
		// 1 NE
		// 2 SW
		// 3 SE
		var latdif = 0
		if(this.latitude > point.latitude){
			//South
			latdif = 2;
		}
		if(this.longitude > point.longitude){
			// East
			latdif += 1;
		}
		return latdif;
	}

	this.equals = function(point){
		if(point.latitude == this.latitude && point.longitude == this.longitude)
			return true;
	}
}


function TreeNode(point){

	this.point = point;
	this.leaf = [];

	this.addLeaf = function(point){
		var direction = this.point.getDirection(point);
		if(!this.leaf[direction]){
			this.leaf[direction] = new TreeNode(point);
		}else{
			this.leaf[direction].addLeaf(point);
		}
	}

	this.getClosest = function(point,parent){
		if(this.point.equals(point))
			return this.point;
		var direction = this.point.getDirection(point);
		if(!this.leaf[direction]){
			if(!parent)
				return this.point
			// Find the nearest point
			//  (xn - x0)² + (yn - y0)² 
			var sqdist1 = Math.pow(point.latitude - this.point.latitude,2) + Math.pow(point.longitude - this.point.longitude,2)
			var sqdist2 = Math.pow(parent.latitude - this.point.latitude,2) + Math.pow(parent.longitude - this.point.longitude,2)
			if(sqdist1 < sqdist2){
				return this.point;
			}else{
				return parent;
			}
		}else{
			return this.leaf[direction].getClosest(point,this.point);
		}

	}

}

module.exports = {
	GeoPoint:GeoPoint,
	TreeNode:TreeNode
}

