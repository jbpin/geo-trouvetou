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

	this.logPoint = function(point){
		console.log(point.latitude+" "+point.longitude);
	}

	this.find = function(point){
		var direction = this.point.getDirection(point);
		if(!this.leaf[direction]){
			return this;
		}else{
			var n = this.leaf[direction].find(point);
			var p = point.closer(n.point,this.point);
			if(p == this.point)
				n = this;
			var c,c1,c2;
			if(direction == 0 || direction == 3){
				if(this.leaf[1])
					c1 = this.leaf[1].find(point);
				if(this.leaf[2])
					c2 = this.leaf[2].find(point);
			}else{
				if(this.leaf[0])
					c1 = this.leaf[0].find(point);
				if(this.leaf[3])
					c2 = this.leaf[3].find(point);
			}
			if(c1 && c2){
				p = point.closer(c1.point,c2.point);
				if(p == c1.point)
					c = c1;
				else
					c = c2;
			}else if(c1){
				c = c1
			}else if(c2){
				c = c2	
			}else{
				return n;
			}
			p = point.closer(n.point, c.point);
			if(p == c.point){
				n = c;
			}
			return n;
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
		if(this.tree == null)
			return null;
		return this.tree.find(point).point;
	}
}

//Node js export
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		GeoTrouvetou : GeoTrouvetou,
		GeoPoint : GeoPoint
	}
}

