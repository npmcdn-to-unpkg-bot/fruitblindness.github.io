// Variable for static dots
	var $dots=$(".menu-item")
  // movable glob
		,$current=$(".active")


    // Variable to measue spacing between dots
		,spacing=53
    // Halved spacing
		,halfSpacing=spacing/2
    // Empty global start position variable
		,startPos
	;

  // Set startPos equal to top position of first dot
	startPos=3;

function updatePos(){
		var pos=$current.data("pos").y-startPos;
		var scale=pos%spacing;
	    if(scale>halfSpacing){
	      scale=halfSpacing-(scale-halfSpacing);
	    }
	    scale=1-((scale/halfSpacing)*0.35);
	    TweenMax.set($current,{
	    	y:pos+startPos,
	    	scale:scale*0.6,
	    	force3D:true
	    });

	    var curItem=pos/spacing,
	    	curItemR=Math.round(curItem)
	    ;
    }

$(document).ready(function(){

	  // Reset active glob to startPos
	$current.data("pos",{y:startPos});

  //When dot clicked
	$dots.click(function(event){
		var $cur=$(this);
		// $('.menu-item').removeClass('visible');
		// $cur.toggleClass('visible');

    // Amount to move active glob by
		var dest=($cur.index())*spacing;

		console.log(startPos);
		console.log(spacing);
		console.log(dest);

    // Move active glob
		TweenMax.to($current.data("pos"),0.6,{
			y:startPos+dest,
			onUpdate:updatePos,
			onComplete:updatePos,
			ease:Expo.easeOut
			// ease:Elastic.easeOut,
			// easeParams:[1.1,0.6]
		});
	});

  // Simulate click on first dot to position
	$dots.eq(0).click();
})
