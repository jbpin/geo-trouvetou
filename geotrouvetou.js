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
	this.data = null;
}

GeoPoint.prototype.getDirection = function(point) {
	// 0 NW
	// 1 NE
	// 2 SW
	// 3 SE
	var latdif = 0;
	if(this.latitude > point.latitude){
		//South
		latdif = 2;
	}
	if(this.longitude > point.longitude){
		// East
		latdif += 1;
	}
	return latdif;
};

GeoPoint.prototype.equals = function(point){
	if(point.latitude == this.latitude && point.longitude == this.longitude)
		return true;
};

GeoPoint.prototype.closer = function(p1,p2){
	var sqdist1 = Math.pow(p1.latitude - this.latitude,2) + Math.pow(p1.longitude - this.longitude,2);
	var sqdist2 = Math.pow(p2.latitude - this.latitude,2) + Math.pow(p2.longitude - this.longitude,2);
	if(sqdist1 < sqdist2){
		return p1;
	}else{
		return p2;
	}
};


function TreeNode(point){
	this.point = point;
	this.leaf = [];
}

TreeNode.prototype.addLeaf = function(point){
	// find current closest point
	var p = this.find(point);
	// get direction
	var dir = p.point.getDirection(point);
	// if no point on this direction add it to this treenode
	if(!p.leaf[dir]){
		p.leaf[dir] = new TreeNode(point);
	} else {
		// get closest point
		var c = p.point.closer(point, p.leaf[dir].point);
		// if the closest point is the leaf add under it
		if(c == p.leaf[dir].point) {
			p.leaf[dir].addLeaf(point);
		} else {
			// replace the current leaf with the new leaf and attach the old one to it
			var pl = p.leaf[dir];
			var pt = new TreeNode(point);
			pt.leaf[pt.point.getDirection(pl.point)] = pl;
			p.leaf[dir] = pt;
		}
	}
};

TreeNode.prototype.logPoint = function(point){
	console.log(point.latitude+" "+point.longitude);
};

TreeNode.prototype.find = function(point){
	var direction = this.point.getDirection(point);
	if(!this.leaf[direction]){
		// if no leaf so return this point
		if(!this.leaf.length){
			return this;
		} else {
			// else find the closest point on leafs
			var closest = this;
			this.leaf.forEach(function (leaf) {
				var closerPoint = point.closer(closest.point, leaf.point);
				if( closerPoint !== closest.point) {
					closest = leaf;
				}
			});
			return closest == this ? this : closest.find(point);
		}
	}else{
		var n = this.leaf[direction].find(point);
		var p = point.closer(n.point,this.point);
		if(p == this.point)
			n = this;
		var c,c1,c2;
		if(direction === 0 || direction === 3){
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
			c = c1;
		}else if(c2){
			c = c2;
		}else{
			return n;
		}
		p = point.closer(n.point, c.point);
		if(p == c.point){
			n = c;
		}
		return n;
	}
};

TreeNode.prototype.toString = function(prefix) {
	if(!prefix) {
		prefix = '.';
	}
	if(this.point.data && this.point.data.name) {
		console.log(prefix + ' ' + this.point.data.name + ': ' + this.point.latitude + ',' + this.point.longitude);
	}
	this.leaf.forEach(function(dir, index) {
		dir.toString(prefix + '--' + index);
	});
};

function GeoTrouvetou(){
	this.tree = null;
}

GeoTrouvetou.prototype.addPoint = function(point){
	if(!this.tree){
		this.tree = new TreeNode(point);
	}else{
		this.tree.addLeaf(point);
	}
};

GeoTrouvetou.prototype.findClosest = function(point){
	if(this.tree === null)
		return null;
	return this.tree.find(point);
};

GeoTrouvetou.prototype.toString = function(){
	this.tree.toString();
};

//Node js export
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		GeoTrouvetou : GeoTrouvetou,
		GeoPoint : GeoPoint
	};
}

