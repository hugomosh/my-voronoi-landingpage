function Voronoi(){this.vertices=null,this.edges=null,this.cells=null,this.toRecycle=null,this.beachsectionJunkyard=[],this.circleEventJunkyard=[],this.vertexJunkyard=[],this.edgeJunkyard=[],this.cellJunkyard=[]}function resize(){console.log("resize"),oldWidth=width,oldHeight=height,width=parseInt(leVoronoi.style("width"),10),height=parseInt(leVoronoi.style("height"),10),svg.attr("width",width).attr("height",height),vertices=vertices.map(function(a){return{point:[a.point[0]*width/oldWidth,a.point[1]*height/oldHeight],vx:0,vy:0}}),diagram=buildVoronoi(vertices),drawVoronoiDiagram(diagram)}function moveVertices(a){return a=a.map(function(a){var b=a.point;return b[0]+=a.vx,b[0]<0?b[0]=a.vx*=-1:b[0]>width&&(b[0]=width+(a.vx*=-1)),b[1]+=a.vy,b[1]<0?b[1]=a.vy*=-1:b[1]>height&&(b[1]=height+(a.vy*=-1)),{point:b,vx:a.vx+(.1*(Math.random()-.5)-.001*a.vx),vy:a.vy+(.1*(Math.random()-.5)-.001*a.vy)}})}function buildVoronoi(a){bbox={xl:0,xr:width,yt:0,yb:height},sites=a.map(function(a){return{x:a.point[0],y:a.point[1]}});var b=voronoi.compute(sites,bbox);return b}function drawVoronoiDiagram(a){var b=[];return a.cells.map(function(a){var c=[],d=a.halfedges[0].getStartpoint();c.push([d.x,d.y]),a.halfedges.map(function(a){d=a.getEndpoint(),c.push([d.x,d.y])}),b.push(c)}),drawPolygon(b),drawSites(sites),b}function drawSites(a){var b=svg.append("g"),c=5;b.selectAll(".sites").data(a).enter().append("g").attr("transform",function(a){return"translate("+a.x+","+a.y+")"}).append("circle").attr("fill","blue").attr("r",c)}function drawVerices(a){var b=svg.append("g"),c=3;b.selectAll(".sites").data(a).enter().append("g").attr("transform",function(a,b){return console.log(b,a),"translate("+a.x+","+a.y+")"}).append("circle").attr("fill","green").attr("r",c)}function drawPolygon(a){var b=svg.append("g").selectAll("path");b=b.data(a,polygonF),b.exit(),b.enter().append("path").attr("class",function(a,b){return"celula q"+b%9+"-9"}).attr("d",polygonF),b.order()}function polygonF(a){return"M"+a.join("L")+"Z"}function continousM(a){svg.selectAll("g").remove(),console.log("c"),total_time=a,vertices=moveVertices(vertices),diagram=buildVoronoi(vertices),drawVoronoiDiagram(diagram)}function flash(a,b){return function(){"mouseenter"===a&&timer.stop(),"mouseleave"===a&&timer.restart(continousM),console.log(a,b)}}Voronoi.prototype.reset=function(){if(this.beachline||(this.beachline=new this.RBTree),this.beachline.root)for(var a=this.beachline.getFirst(this.beachline.root);a;)this.beachsectionJunkyard.push(a),a=a.rbNext;this.beachline.root=null,this.circleEvents||(this.circleEvents=new this.RBTree),this.circleEvents.root=this.firstCircleEvent=null,this.vertices=[],this.edges=[],this.cells=[]},Voronoi.prototype.sqrt=Math.sqrt,Voronoi.prototype.abs=Math.abs,Voronoi.prototype.ε=Voronoi.ε=1e-9,Voronoi.prototype.invε=Voronoi.invε=1/Voronoi.ε,Voronoi.prototype.equalWithEpsilon=function(a,b){return this.abs(a-b)<1e-9},Voronoi.prototype.greaterThanWithEpsilon=function(a,b){return a-b>1e-9},Voronoi.prototype.greaterThanOrEqualWithEpsilon=function(a,b){return 1e-9>b-a},Voronoi.prototype.lessThanWithEpsilon=function(a,b){return b-a>1e-9},Voronoi.prototype.lessThanOrEqualWithEpsilon=function(a,b){return 1e-9>a-b},Voronoi.prototype.RBTree=function(){this.root=null},Voronoi.prototype.RBTree.prototype.rbInsertSuccessor=function(a,b){var c;if(a){if(b.rbPrevious=a,b.rbNext=a.rbNext,a.rbNext&&(a.rbNext.rbPrevious=b),a.rbNext=b,a.rbRight){for(a=a.rbRight;a.rbLeft;)a=a.rbLeft;a.rbLeft=b}else a.rbRight=b;c=a}else this.root?(a=this.getFirst(this.root),b.rbPrevious=null,b.rbNext=a,a.rbPrevious=b,a.rbLeft=b,c=a):(b.rbPrevious=b.rbNext=null,this.root=b,c=null);b.rbLeft=b.rbRight=null,b.rbParent=c,b.rbRed=!0;var d,e;for(a=b;c&&c.rbRed;)d=c.rbParent,c===d.rbLeft?(e=d.rbRight,e&&e.rbRed?(c.rbRed=e.rbRed=!1,d.rbRed=!0,a=d):(a===c.rbRight&&(this.rbRotateLeft(c),a=c,c=a.rbParent),c.rbRed=!1,d.rbRed=!0,this.rbRotateRight(d))):(e=d.rbLeft,e&&e.rbRed?(c.rbRed=e.rbRed=!1,d.rbRed=!0,a=d):(a===c.rbLeft&&(this.rbRotateRight(c),a=c,c=a.rbParent),c.rbRed=!1,d.rbRed=!0,this.rbRotateLeft(d))),c=a.rbParent;this.root.rbRed=!1},Voronoi.prototype.RBTree.prototype.rbRemoveNode=function(a){a.rbNext&&(a.rbNext.rbPrevious=a.rbPrevious),a.rbPrevious&&(a.rbPrevious.rbNext=a.rbNext),a.rbNext=a.rbPrevious=null;var b,c=a.rbParent,d=a.rbLeft,e=a.rbRight;b=d?e?this.getFirst(e):d:e,c?c.rbLeft===a?c.rbLeft=b:c.rbRight=b:this.root=b;var f;if(d&&e?(f=b.rbRed,b.rbRed=a.rbRed,b.rbLeft=d,d.rbParent=b,b!==e?(c=b.rbParent,b.rbParent=a.rbParent,a=b.rbRight,c.rbLeft=a,b.rbRight=e,e.rbParent=b):(b.rbParent=c,c=b,a=b.rbRight)):(f=a.rbRed,a=b),a&&(a.rbParent=c),!f){if(a&&a.rbRed)return void(a.rbRed=!1);var g;do{if(a===this.root)break;if(a===c.rbLeft){if(g=c.rbRight,g.rbRed&&(g.rbRed=!1,c.rbRed=!0,this.rbRotateLeft(c),g=c.rbRight),g.rbLeft&&g.rbLeft.rbRed||g.rbRight&&g.rbRight.rbRed){g.rbRight&&g.rbRight.rbRed||(g.rbLeft.rbRed=!1,g.rbRed=!0,this.rbRotateRight(g),g=c.rbRight),g.rbRed=c.rbRed,c.rbRed=g.rbRight.rbRed=!1,this.rbRotateLeft(c),a=this.root;break}}else if(g=c.rbLeft,g.rbRed&&(g.rbRed=!1,c.rbRed=!0,this.rbRotateRight(c),g=c.rbLeft),g.rbLeft&&g.rbLeft.rbRed||g.rbRight&&g.rbRight.rbRed){g.rbLeft&&g.rbLeft.rbRed||(g.rbRight.rbRed=!1,g.rbRed=!0,this.rbRotateLeft(g),g=c.rbLeft),g.rbRed=c.rbRed,c.rbRed=g.rbLeft.rbRed=!1,this.rbRotateRight(c),a=this.root;break}g.rbRed=!0,a=c,c=c.rbParent}while(!a.rbRed);a&&(a.rbRed=!1)}},Voronoi.prototype.RBTree.prototype.rbRotateLeft=function(a){var b=a,c=a.rbRight,d=b.rbParent;d?d.rbLeft===b?d.rbLeft=c:d.rbRight=c:this.root=c,c.rbParent=d,b.rbParent=c,b.rbRight=c.rbLeft,b.rbRight&&(b.rbRight.rbParent=b),c.rbLeft=b},Voronoi.prototype.RBTree.prototype.rbRotateRight=function(a){var b=a,c=a.rbLeft,d=b.rbParent;d?d.rbLeft===b?d.rbLeft=c:d.rbRight=c:this.root=c,c.rbParent=d,b.rbParent=c,b.rbLeft=c.rbRight,b.rbLeft&&(b.rbLeft.rbParent=b),c.rbRight=b},Voronoi.prototype.RBTree.prototype.getFirst=function(a){for(;a.rbLeft;)a=a.rbLeft;return a},Voronoi.prototype.RBTree.prototype.getLast=function(a){for(;a.rbRight;)a=a.rbRight;return a},Voronoi.prototype.Diagram=function(a){this.site=a},Voronoi.prototype.Cell=function(a){this.site=a,this.halfedges=[],this.closeMe=!1},Voronoi.prototype.Cell.prototype.init=function(a){return this.site=a,this.halfedges=[],this.closeMe=!1,this},Voronoi.prototype.createCell=function(a){var b=this.cellJunkyard.pop();return b?b.init(a):new this.Cell(a)},Voronoi.prototype.Cell.prototype.prepareHalfedges=function(){for(var a,b=this.halfedges,c=b.length;c--;)a=b[c].edge,a.vb&&a.va||b.splice(c,1);return b.sort(function(a,b){return b.angle-a.angle}),b.length},Voronoi.prototype.Cell.prototype.getNeighborIds=function(){for(var a,b=[],c=this.halfedges.length;c--;)a=this.halfedges[c].edge,null!==a.lSite&&a.lSite.voronoiId!=this.site.voronoiId?b.push(a.lSite.voronoiId):null!==a.rSite&&a.rSite.voronoiId!=this.site.voronoiId&&b.push(a.rSite.voronoiId);return b},Voronoi.prototype.Cell.prototype.getBbox=function(){for(var a,b,c,d=this.halfedges,e=d.length,f=1/0,g=1/0,h=-(1/0),i=-(1/0);e--;)a=d[e].getStartpoint(),b=a.x,c=a.y,f>b&&(f=b),g>c&&(g=c),b>h&&(h=b),c>i&&(i=c);return{x:f,y:g,width:h-f,height:i-g}},Voronoi.prototype.Cell.prototype.pointIntersection=function(a,b){for(var c,d,e,f,g=this.halfedges,h=g.length;h--;){if(c=g[h],d=c.getStartpoint(),e=c.getEndpoint(),f=(b-d.y)*(e.x-d.x)-(a-d.x)*(e.y-d.y),!f)return 0;if(f>0)return-1}return 1},Voronoi.prototype.Vertex=function(a,b){this.x=a,this.y=b},Voronoi.prototype.Edge=function(a,b){this.lSite=a,this.rSite=b,this.va=this.vb=null},Voronoi.prototype.Halfedge=function(a,b,c){if(this.site=b,this.edge=a,c)this.angle=Math.atan2(c.y-b.y,c.x-b.x);else{var d=a.va,e=a.vb;this.angle=a.lSite===b?Math.atan2(e.x-d.x,d.y-e.y):Math.atan2(d.x-e.x,e.y-d.y)}},Voronoi.prototype.createHalfedge=function(a,b,c){return new this.Halfedge(a,b,c)},Voronoi.prototype.Halfedge.prototype.getStartpoint=function(){return this.edge.lSite===this.site?this.edge.va:this.edge.vb},Voronoi.prototype.Halfedge.prototype.getEndpoint=function(){return this.edge.lSite===this.site?this.edge.vb:this.edge.va},Voronoi.prototype.createVertex=function(a,b){var c=this.vertexJunkyard.pop();return c?(c.x=a,c.y=b):c=new this.Vertex(a,b),this.vertices.push(c),c},Voronoi.prototype.createEdge=function(a,b,c,d){var e=this.edgeJunkyard.pop();return e?(e.lSite=a,e.rSite=b,e.va=e.vb=null):e=new this.Edge(a,b),this.edges.push(e),c&&this.setEdgeStartpoint(e,a,b,c),d&&this.setEdgeEndpoint(e,a,b,d),this.cells[a.voronoiId].halfedges.push(this.createHalfedge(e,a,b)),this.cells[b.voronoiId].halfedges.push(this.createHalfedge(e,b,a)),e},Voronoi.prototype.createBorderEdge=function(a,b,c){var d=this.edgeJunkyard.pop();return d?(d.lSite=a,d.rSite=null):d=new this.Edge(a,null),d.va=b,d.vb=c,this.edges.push(d),d},Voronoi.prototype.setEdgeStartpoint=function(a,b,c,d){a.va||a.vb?a.lSite===c?a.vb=d:a.va=d:(a.va=d,a.lSite=b,a.rSite=c)},Voronoi.prototype.setEdgeEndpoint=function(a,b,c,d){this.setEdgeStartpoint(a,c,b,d)},Voronoi.prototype.Beachsection=function(){},Voronoi.prototype.createBeachsection=function(a){var b=this.beachsectionJunkyard.pop();return b||(b=new this.Beachsection),b.site=a,b},Voronoi.prototype.leftBreakPoint=function(a,b){var c=a.site,d=c.x,e=c.y,f=e-b;if(!f)return d;var g=a.rbPrevious;if(!g)return-(1/0);c=g.site;var h=c.x,i=c.y,j=i-b;if(!j)return h;var k=h-d,l=1/f-1/j,m=k/j;return l?(-m+this.sqrt(m*m-2*l*(k*k/(-2*j)-i+j/2+e-f/2)))/l+d:(d+h)/2},Voronoi.prototype.rightBreakPoint=function(a,b){var c=a.rbNext;if(c)return this.leftBreakPoint(c,b);var d=a.site;return d.y===b?d.x:1/0},Voronoi.prototype.detachBeachsection=function(a){this.detachCircleEvent(a),this.beachline.rbRemoveNode(a),this.beachsectionJunkyard.push(a)},Voronoi.prototype.removeBeachsection=function(a){var b=a.circleEvent,c=b.x,d=b.ycenter,e=this.createVertex(c,d),f=a.rbPrevious,g=a.rbNext,h=[a],i=Math.abs;this.detachBeachsection(a);for(var j=f;j.circleEvent&&i(c-j.circleEvent.x)<1e-9&&i(d-j.circleEvent.ycenter)<1e-9;)f=j.rbPrevious,h.unshift(j),this.detachBeachsection(j),j=f;h.unshift(j),this.detachCircleEvent(j);for(var k=g;k.circleEvent&&i(c-k.circleEvent.x)<1e-9&&i(d-k.circleEvent.ycenter)<1e-9;)g=k.rbNext,h.push(k),this.detachBeachsection(k),k=g;h.push(k),this.detachCircleEvent(k);var l,m=h.length;for(l=1;m>l;l++)k=h[l],j=h[l-1],this.setEdgeStartpoint(k.edge,j.site,k.site,e);j=h[0],k=h[m-1],k.edge=this.createEdge(j.site,k.site,void 0,e),this.attachCircleEvent(j),this.attachCircleEvent(k)},Voronoi.prototype.addBeachsection=function(a){for(var b,c,d,e,f=a.x,g=a.y,h=this.beachline.root;h;)if(d=this.leftBreakPoint(h,g)-f,d>1e-9)h=h.rbLeft;else{if(e=f-this.rightBreakPoint(h,g),!(e>1e-9)){d>-1e-9?(b=h.rbPrevious,c=h):e>-1e-9?(b=h,c=h.rbNext):b=c=h;break}if(!h.rbRight){b=h;break}h=h.rbRight}var i=this.createBeachsection(a);if(this.beachline.rbInsertSuccessor(b,i),b||c){if(b===c)return this.detachCircleEvent(b),c=this.createBeachsection(b.site),this.beachline.rbInsertSuccessor(i,c),i.edge=c.edge=this.createEdge(b.site,i.site),this.attachCircleEvent(b),void this.attachCircleEvent(c);if(b&&!c)return void(i.edge=this.createEdge(b.site,i.site));if(b!==c){this.detachCircleEvent(b),this.detachCircleEvent(c);var j=b.site,k=j.x,l=j.y,m=a.x-k,n=a.y-l,o=c.site,p=o.x-k,q=o.y-l,r=2*(m*q-n*p),s=m*m+n*n,t=p*p+q*q,u=this.createVertex((q*s-n*t)/r+k,(m*t-p*s)/r+l);return this.setEdgeStartpoint(c.edge,j,o,u),i.edge=this.createEdge(j,a,void 0,u),c.edge=this.createEdge(a,o,void 0,u),this.attachCircleEvent(b),void this.attachCircleEvent(c)}}},Voronoi.prototype.CircleEvent=function(){this.arc=null,this.rbLeft=null,this.rbNext=null,this.rbParent=null,this.rbPrevious=null,this.rbRed=!1,this.rbRight=null,this.site=null,this.x=this.y=this.ycenter=0},Voronoi.prototype.attachCircleEvent=function(a){var b=a.rbPrevious,c=a.rbNext;if(b&&c){var d=b.site,e=a.site,f=c.site;if(d!==f){var g=e.x,h=e.y,i=d.x-g,j=d.y-h,k=f.x-g,l=f.y-h,m=2*(i*l-j*k);if(!(m>=-2e-12)){var n=i*i+j*j,o=k*k+l*l,p=(l*n-j*o)/m,q=(i*o-k*n)/m,r=q+h,s=this.circleEventJunkyard.pop();s||(s=new this.CircleEvent),s.arc=a,s.site=e,s.x=p+g,s.y=r+this.sqrt(p*p+q*q),s.ycenter=r,a.circleEvent=s;for(var t=null,u=this.circleEvents.root;u;)if(s.y<u.y||s.y===u.y&&s.x<=u.x){if(!u.rbLeft){t=u.rbPrevious;break}u=u.rbLeft}else{if(!u.rbRight){t=u;break}u=u.rbRight}this.circleEvents.rbInsertSuccessor(t,s),t||(this.firstCircleEvent=s)}}}},Voronoi.prototype.detachCircleEvent=function(a){var b=a.circleEvent;b&&(b.rbPrevious||(this.firstCircleEvent=b.rbNext),this.circleEvents.rbRemoveNode(b),this.circleEventJunkyard.push(b),a.circleEvent=null)},Voronoi.prototype.connectEdge=function(a,b){var c=a.vb;if(c)return!0;var d,e,f=a.va,g=b.xl,h=b.xr,i=b.yt,j=b.yb,k=a.lSite,l=a.rSite,m=k.x,n=k.y,o=l.x,p=l.y,q=(m+o)/2,r=(n+p)/2;if(this.cells[k.voronoiId].closeMe=!0,this.cells[l.voronoiId].closeMe=!0,p!==n&&(d=(m-o)/(p-n),e=r-d*q),void 0===d){if(g>q||q>=h)return!1;if(m>o){if(!f||f.y<i)f=this.createVertex(q,i);else if(f.y>=j)return!1;c=this.createVertex(q,j)}else{if(!f||f.y>j)f=this.createVertex(q,j);else if(f.y<i)return!1;c=this.createVertex(q,i)}}else if(-1>d||d>1)if(m>o){if(!f||f.y<i)f=this.createVertex((i-e)/d,i);else if(f.y>=j)return!1;c=this.createVertex((j-e)/d,j)}else{if(!f||f.y>j)f=this.createVertex((j-e)/d,j);else if(f.y<i)return!1;c=this.createVertex((i-e)/d,i)}else if(p>n){if(!f||f.x<g)f=this.createVertex(g,d*g+e);else if(f.x>=h)return!1;c=this.createVertex(h,d*h+e)}else{if(!f||f.x>h)f=this.createVertex(h,d*h+e);else if(f.x<g)return!1;c=this.createVertex(g,d*g+e)}return a.va=f,a.vb=c,!0},Voronoi.prototype.clipEdge=function(a,b){var c=a.va.x,d=a.va.y,e=a.vb.x,f=a.vb.y,g=0,h=1,i=e-c,j=f-d,k=c-b.xl;if(0===i&&0>k)return!1;var l=-k/i;if(0>i){if(g>l)return!1;h>l&&(h=l)}else if(i>0){if(l>h)return!1;l>g&&(g=l)}if(k=b.xr-c,0===i&&0>k)return!1;if(l=k/i,0>i){if(l>h)return!1;l>g&&(g=l)}else if(i>0){if(g>l)return!1;h>l&&(h=l)}if(k=d-b.yt,0===j&&0>k)return!1;if(l=-k/j,0>j){if(g>l)return!1;h>l&&(h=l)}else if(j>0){if(l>h)return!1;l>g&&(g=l)}if(k=b.yb-d,0===j&&0>k)return!1;if(l=k/j,0>j){if(l>h)return!1;l>g&&(g=l)}else if(j>0){if(g>l)return!1;h>l&&(h=l)}return g>0&&(a.va=this.createVertex(c+g*i,d+g*j)),1>h&&(a.vb=this.createVertex(c+h*i,d+h*j)),(g>0||1>h)&&(this.cells[a.lSite.voronoiId].closeMe=!0,this.cells[a.rSite.voronoiId].closeMe=!0),!0},Voronoi.prototype.clipEdges=function(a){for(var b,c=this.edges,d=c.length,e=Math.abs;d--;)b=c[d],(!this.connectEdge(b,a)||!this.clipEdge(b,a)||e(b.va.x-b.vb.x)<1e-9&&e(b.va.y-b.vb.y)<1e-9)&&(b.va=b.vb=null,c.splice(d,1))},Voronoi.prototype.closeCells=function(a){for(var b,c,d,e,f,g,h,i,j,k=a.xl,l=a.xr,m=a.yt,n=a.yb,o=this.cells,p=o.length,q=Math.abs;p--;)if(b=o[p],b.prepareHalfedges()&&b.closeMe){for(d=b.halfedges,e=d.length,c=0;e>c;){if(g=d[c].getEndpoint(),i=d[(c+1)%e].getStartpoint(),q(g.x-i.x)>=1e-9||q(g.y-i.y)>=1e-9)switch(!0){case this.equalWithEpsilon(g.x,k)&&this.lessThanWithEpsilon(g.y,n):if(j=this.equalWithEpsilon(i.x,k),h=this.createVertex(k,j?i.y:n),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;g=h;case this.equalWithEpsilon(g.y,n)&&this.lessThanWithEpsilon(g.x,l):if(j=this.equalWithEpsilon(i.y,n),h=this.createVertex(j?i.x:l,n),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;g=h;case this.equalWithEpsilon(g.x,l)&&this.greaterThanWithEpsilon(g.y,m):if(j=this.equalWithEpsilon(i.x,l),h=this.createVertex(l,j?i.y:m),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;g=h;case this.equalWithEpsilon(g.y,m)&&this.greaterThanWithEpsilon(g.x,k):if(j=this.equalWithEpsilon(i.y,m),h=this.createVertex(j?i.x:k,m),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;if(g=h,j=this.equalWithEpsilon(i.x,k),h=this.createVertex(k,j?i.y:n),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;if(g=h,j=this.equalWithEpsilon(i.y,n),h=this.createVertex(j?i.x:l,n),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;if(g=h,j=this.equalWithEpsilon(i.x,l),h=this.createVertex(l,j?i.y:m),f=this.createBorderEdge(b.site,g,h),c++,d.splice(c,0,this.createHalfedge(f,b.site,null)),e++,j)break;default:throw"Voronoi.closeCells() > this makes no sense!"}c++}b.closeMe=!1}},Voronoi.prototype.quantizeSites=function(a){for(var b,c=this.ε,d=a.length;d--;)b=a[d],b.x=Math.floor(b.x/c)*c,b.y=Math.floor(b.y/c)*c},Voronoi.prototype.recycle=function(a){if(a){if(!(a instanceof this.Diagram))throw"Voronoi.recycleDiagram() > Need a Diagram object.";this.toRecycle=a}},Voronoi.prototype.compute=function(a,b){var c=new Date;this.reset(),this.toRecycle&&(this.vertexJunkyard=this.vertexJunkyard.concat(this.toRecycle.vertices),this.edgeJunkyard=this.edgeJunkyard.concat(this.toRecycle.edges),this.cellJunkyard=this.cellJunkyard.concat(this.toRecycle.cells),this.toRecycle=null);var d=a.slice(0);d.sort(function(a,b){var c=b.y-a.y;return c?c:b.x-a.x});for(var e,f,g,h=d.pop(),i=0,j=this.cells;;)if(g=this.firstCircleEvent,h&&(!g||h.y<g.y||h.y===g.y&&h.x<g.x))(h.x!==e||h.y!==f)&&(j[i]=this.createCell(h),h.voronoiId=i++,this.addBeachsection(h),f=h.y,e=h.x),h=d.pop();else{if(!g)break;this.removeBeachsection(g.arc)}this.clipEdges(b),this.closeCells(b);var k=new Date,l=new this.Diagram;return l.cells=this.cells,l.edges=this.edges,l.vertices=this.vertices,l.execTime=k.getTime()-c.getTime(),this.reset(),l},"undefined"!=typeof module&&(module.exports=Voronoi);var leVoronoi=d3.select("#leVoronoi");console.debug(leVoronoi);var width=parseInt(leVoronoi.style("width"),10),height=parseInt(leVoronoi.style("height"),10);console.debug({width:width,height:height});var svg=leVoronoi.append("svg").attr("width",width).attr("height",height);d3.select(window).on("resize",resize);var oldWidth,oldHeight,n=6,bloques=new Array(n),vertices=d3.range(n).map(function(){return{point:[Math.random()*width,Math.random()*height],vx:0,vy:0}}),voronoi=new Voronoi,bbox,sites,diagram=buildVoronoi(vertices);drawVoronoiDiagram(diagram);var total_time,timer=d3_timer.timer(continousM);svg.on("mouseenter",flash("mouseenter","-1em")).on("mouseover",flash("mouseover","0")).on("mouseout",flash("mouseout","1em")).on("mouseleave",flash("mouseleave","2em"));