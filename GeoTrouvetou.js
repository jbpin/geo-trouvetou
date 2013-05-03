// The MIT License (MIT)

// Copyright (c) 2013 Jean-Baptiste Pin

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


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

	this.closer = function(p1,p2){
		var sqdist1 = Math.pow(p1.latitude - this.latitude,2) + Math.pow(p1.longitude - this.longitude,2)
		var sqdist2 = Math.pow(p2.latitude - this.latitude,2) + Math.pow(p2.longitude - this.longitude,2)
		if(sqdist1 < sqdist2){
			return p1;
		}else{
			return p2;
		}
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

	this.getClosest = function(point,parent,previousDirection){
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
			if(sqdist1 > sqdist2){
				return this.point;
			}else{
				return parent.point;
			}
		}else{
			var p = this.leaf[direction].getClosest(point,this,direction);
			if(direction != 0 && this.leaf[0]){
				var p0 = this.leaf[0].getClosest(point,this,0);
				p = point.closer(p,p0);
			}
			if(direction != 1 && this.leaf[1]){
				var p0 = this.leaf[1].getClosest(point,this,1);
				p = point.closer(p,p0);
			}
			if(direction != 2 && this.leaf[2]){
				var p0 = this.leaf[2].getClosest(point,this,2);
				p = point.closer(p,p0);
			}
			if(direction != 3 && this.leaf[3]){
				var p0 = this.leaf[3].getClosest(point,this,3);
				p = point.closer(p,p0);
			}
			return p;
		}

	}

}

function GeoTrouvetou(){

	this.tree = null;

	this.addPoint = function(point){
		if(!this.tree){
			this.tree = new TreeNode(point)
		}else{
			this.tree.addLeaf(point)
		}
	}

	this.findClosest = function(point){
		return this.tree.getClosest(point);
	}
}

//Node js export
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		GeoTrouvetou : GeoTrouvetou,
		GeoPoint : GeoPoint
	}
}

