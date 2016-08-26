  "use strict";
  //GLOBALS
  //var radius = 20;
  var beads = [];
  var selected = false;
  var maxLength = false;
  var currentCircle = {};
  var midPoint = { leftValue: 250 , bottomValue: 200};  //default vals
  var emblemPreview = false;
  var runningPrice = 0;
  var firstClick = true;
  var firstTrigger = true;

  if (window.console) {
      console.log("JS functioning");
  }

  jQuery(document).ready(function () {

    //add it to bottom
    jQuery('#big_wrapper').prependTo('#content');
    //jQuery("#post-14").append("<div class='clearer'></div>");
    //set midpoint once page has loaded
    midPoint.leftValue = jQuery('#pv-container').width() /2 ;
    midPoint.bottomValue = jQuery('#pv-container').height() /2;
    //the bead set
    var nodeSet = jQuery('#pv-container > img');
    //set number of beads
    var braceletLength = getLength(beadsDecoded);
    console.log(braceletLength);

    function getLength (allNodes) {
      var totalLength = 0;

      for (var i=0; i < allNodes.length; i++) {
        totalLength += jQuery("#"+allNodes[i]).width();
      }
      return totalLength;
    } 

    updateStatus(nodeSet);

    var contains = function(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle !== needle;
        var indexOf;

        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle) {
                var i = -1, index = -1;
                for(i = 0; i < this.length; i++) {
                    var item = this[i];
                    if((findNaN && item !== item) || item === needle) {
                        index = i;
                        break;
                    }
                }
                return index;
            };
        }
        return indexOf.call(this, needle) > -1;
    };

    //hand off the index
    function setNumber(currentObj, newObj) {
      var child = jQuery(currentObj).attr("data-child");
      jQuery(newObj).attr("data-child", child);
      
      if (jQuery(newObj).attr("data-child") == child) {
        return child -1;
      }
      else return -1;
    }

    //hand off the price
    function setPrice(currentID, newObj) {
      var newPrice = jQuery(currentID).attr("data-price");
      jQuery(newObj).attr("data-price", newPrice);
      console.log(jQuery(newObj).attr("data-price"));
    }

    //returns array of beads IN ORDER for saving/submitting purposes
    function finalizeBeads() {
      var allBeads = jQuery("#pv-container > img");
      var tempBeads = [];
      var counter = 1;
      allBeads.each( function () {
        if (parseInt(jQuery(this).attr("data-child")) == counter) {
          tempBeads.push(jQuery(this)[0]);
        }
        counter++;
      });
      return tempBeads;
    }

    //the last line nodes pass before exiting
    function updateStatus (beadSet) {
      //checking if too big and adding price
      runningPrice = 0;
      var totalLength = 0;
      beadSet.each ( function () {
        totalLength += jQuery(this).width();
        runningPrice += parseFloat(jQuery(this).attr("data-price"));
        console.log(parseFloat(jQuery(this).attr("data-price")));
        console.log(this);
        //console.log(jQuery(this).attr("data-price"));
      });
      if (totalLength > ((midPoint.leftValue * 2) - 80)) {
        maxLength = true;
      }
      else maxLength = false;

      document.getElementById('price_float').innerHTML = parseFloat(runningPrice).toFixed(2);
    }

    function displace (circleSet, position, difference, command) {
      if (command == "grow") {
        circleSet.each ( function () {
          var index = jQuery(this).attr("data-child");
          var x;
          if (index <= position) { x = parseInt(jQuery(this).css('left').substr(0,3), 10) - (difference/2); }
          if (index > position) { x = parseInt(jQuery(this).css('left').substr(0,3), 10) + (difference/2); }
          //if (index == position ) { x = parseInt(jQuery(this).css('left').substr(0,3), 10); console.log("ON PT"); }
            jQuery(this).css({
                left: x + 'px'
            });
        });
      }
      else if (command == "shrink") {
        circleSet.each ( function () {
          var index = jQuery(this).attr("data-child");
          var x;
          if (index <= position) x = parseInt(jQuery(this).css('left').substr(0,3), 10) + (difference/2);
          if (index > position) x = parseInt(jQuery(this).css('left').substr(0,3), 10) - (difference/2);
            jQuery(this).css({
                left: x + 'px'
            });
          index++;
        });
      }
    }

    //only operates with the current bead sizes
    function defaultPosition (obj, count) {

      var wristSize = braceletLength;//count*10;
      var middle = Math.round(count /2) ;
      var offSet = (midPoint.leftValue*2 - wristSize) /2 - 10;
      var step = 0;
      var dataChild = 1;

      obj.each( function () {
        if (dataChild > 1) step = jQuery('[data-child="'+ (dataChild -1)+'"]').width();
        var x = offSet + step;
        var y = midPoint.bottomValue - (jQuery(this).height()/2);

        jQuery(this).css({
            left: x + 'px',
            bottom: y + 'px'
        });

        offSet += step;
        dataChild++;
      });
    }

    var originalCircles = jQuery('#pv-container > img');
    var originalCount = originalCircles.length;
    //var wristSize = originalCount*10;
    defaultPosition(originalCircles, originalCount);

    function defaultCircle (obj, count) {
      var angle = 0;
      var step = (2*Math.PI) / count;
      obj.each(function () {
        //console.log('This is the old position: ' + $(this).css('left') + ' ' + $(this).css('bottom') + 'px');
        var x = Math.round(midPoint.leftValue + radius * Math.cos(angle) - jQuery(this).width()/2);
        var y = Math.round(midPoint.bottomValue + radius * Math.sin(angle) - jQuery(this).height()/2);

        jQuery(this).css({
            left: x + 'px',
            bottom: y + 'px'
        });
        angle += step;
      });
    }

    //trigger the container when pressing new bracelet or saved bracelet button
    jQuery(".pv-customize-trigger").on('click', function(eve) {
      eve.preventDefault();
      jQuery('#big_wrapper').slideDown({
        duration: 4000
        });
      jQuery(".pv-customize-trigger").remove();
      jQuery('.entry-header').css('overflow', 'auto');
      jQuery('#primary').css('margin-top', '110px');
    });

  	jQuery("#shrink").on('click', function(ev) {
  		ev.preventDefault();
      var originalCircles = jQuery('#pv-container > img');
      var originalCount = originalCircles.length;
      defaultPosition(originalCircles, originalCount);
      if (jQuery('#pv-container > img').length > 2 ) {
          jQuery('img:last-child','#pv-container').remove();
      }
      defaultPosition(originalCircles, originalCount);
  	});

    jQuery("#pv_submit_form").submit( function(eve) {
      var orderedBeads = finalizeBeads();
      console.log("the submitted beads");
      console.log(orderedBeads);
      console.log("total price");
      console.log(runningPrice);

      var beadSequence = concatBeads(orderedBeads);

      jQuery("#form_price").val(runningPrice);
      jQuery("#form_beads").val(beadSequence);

      return true;
      //TODO trigger save beads click
      //TODO take them to checkout page and pass array of bead ids
      //WINDOW ALERT; IF THEY SAY YES THEN PROCEED WITH REST OF FUNCTION
      //window.alert("Test");
    });

    // jQuery("#save_beads").on('click', function(eve) {
    //   //TODO pass bead array to be saved in post meta
    //   eve.preventDefault();
    //   var orderedBeads = finalizeBeads();
    //   jQuery.ajax({
    //         type : 'POST',
    //         url : parvelAjax.ajaxurl,
    //         dataType : 'json',
    //         data : {action: 'save_submit_beads' , nonce: nonce, updateOnly:true, formData: formData, occupationValue: occupationValue, birthDate: birthDate, checkmark: checkmark},
    //         success: function(response) {
    //             if(response.type == "success") {
    //                 jQuery("#myAlert").slideDown();
    //                 jQuery("#myAlert").fadeTo(2000, 500).slideUp(500, function(){
    //                 alert.style.display = "none";
    //                 });
    //             } else {
    //                 console.log("AJAX Error - "+response.message);
    //                 jQuery("#myAlertFail").slideDown();
    //                 jQuery("#myAlertFail").fadeTo(2000, 500).slideUp(500, function(){
    //                     alert.style.display = "none";
    //                 });
    //             }
    //         }
    //     });
    // });


    function concatBeads (beadArray) {

      var beadsCombined = "";

      for (var i; i<beadArray.length; i++) {
        beadsCombined.concat(beadArray[i]);
      }
      return beadsCombined;
    }

    function waitMessage (message) {
      if (!message) document.getElementById('manual').innerHTML = "Select a bead from the given options to swap it.";
      else document.getElementById('manual').innerHTML = "Click 'submit' once you are happy with your customized bracelet.";
    }

    jQuery('#pv-container').on('click', function(eve) {
      
      if (eve.target.className == 'contained-circle') {
        selected = true;
        if (!jQuery.isEmptyObject(currentCircle)) {
          jQuery(currentCircle).css('box-shadow', "");
        }
        if (firstClick) {
          firstClick = false;
          jQuery("#manual").fadeTo(1000, 0);
          setTimeout(waitMessage, 1000, false);
          jQuery("#manual").fadeTo(1000, 1);

        }
        currentCircle = eve.target;
        jQuery(currentCircle).css('box-shadow', "inset 0 -1px rgb(6, 173, 228)");
        //identifying the selected circle
        var tempSource = currentCircle.src;
        var tempQuery = currentCircle.src.substr(tempSource.indexOf('src/') + 4, tempSource.indexOf('png')- tempSource.indexOf('src/') - 5);
        if (contains.call(emblemBeads,tempQuery)) {
          //TODO change the menus here for the appropriate emblem/normal bead
          /*if (jQuery('#normal_bead_menu').css.display == "visible")*/ jQuery("#normal_bead_menu").slideUp();          
          jQuery('#emblem_bead_menu').slideDown();
        } else {
          /*if (jQuery('#emblem_bead_menu').css.display == "visible")*/ jQuery("#emblem_bead_menu").slideUp();          
          jQuery('#normal_bead_menu').slideDown();
        }
      }
    });

  	jQuery('.toggle').on('click', function(e) {
  		e.preventDefault();
      if (firstTrigger) {
        firstTrigger = false;
        jQuery("#manual").fadeTo(1000, 0);
        setTimeout(waitMessage, 1000, true);
        jQuery("#manual").fadeTo(1000, 1);
      }
      var nodes = jQuery('#pv-container > img');
      var count = nodes.length;
      var currentBottom = jQuery.isEmptyObject(currentCircle) ? "" : parseInt(jQuery(currentCircle).css('bottom').substr(0,3), 10); //only functions if the position is 3 digits
      var currentLeft = jQuery.isEmptyObject(currentCircle) ? "" : parseInt(jQuery(currentCircle).css('left').substr(0,3), 10);
      //identifying the selected menu item
      var source = e.target.src;
      var tempID = e.target.src.substr(source.indexOf('src/') + 4, source.indexOf('png')- source.indexOf('src/') - 5);  //only functions with current naming system

      if (!jQuery.isEmptyObject(currentCircle)) {
        jQuery('#pv-container').append('<img class="contained-circle" id="' + tempID + '" src="' + e.target.src + '"></img>');
        // centering functionality
        if (jQuery('#'+tempID).width() > parseInt(jQuery(currentCircle).css('width').substr(0,2), 10)) {
          if (maxLength == false) {
            currentBottom = (currentBottom - (jQuery('#'+tempID).height()) /2) + (parseInt(jQuery(currentCircle).css('width').substr(0,2), 10) /2 );
            currentLeft = (currentLeft - (jQuery('#'+tempID).width()) /2) + (parseInt(jQuery(currentCircle).css('width').substr(0,2), 10) /2 );
            var displaceUnits = setNumber(currentCircle, jQuery('.contained-circle:last-child', '#pv-container'));
            setPrice('#'+tempID, jQuery('.contained-circle:last-child', '#pv-container'));
            if (displaceUnits > -1) {
              var difference = Math.abs(jQuery('#'+tempID).width() - parseInt(jQuery(currentCircle).css('width').substr(0,2)));
              displace (nodes, displaceUnits, difference, "grow");
            }
          }
          else {
            jQuery('.contained-circle:last-child', '#pv-container').remove();
            jQuery('#edit_fail').slideDown();
            jQuery("#edit_fail").fadeTo(2000, 500).slideUp(500);
            return; 
          }
        }
        if (jQuery('#'+tempID).width() < parseInt(jQuery(currentCircle).css('width').substr(0,2), 10)) {
          currentBottom = ((currentBottom + (jQuery('#'+tempID).height()) /2) + (parseInt(jQuery(currentCircle).css('width').substr(0,2), 10) /2 )) - (jQuery('#'+tempID).height());
          currentLeft = ((currentLeft + (jQuery('#'+tempID).width()) /2) + (parseInt(jQuery(currentCircle).css('width').substr(0,2), 10) /2 )) - (jQuery('#'+tempID).width());
          var displaceUnits = setNumber(currentCircle, jQuery('.contained-circle:last-child', '#pv-container'));
          setPrice('#'+tempID, jQuery('.contained-circle:last-child', '#pv-container'));
          if (displaceUnits > -1) {
            var difference = Math.abs(jQuery('#'+tempID).width() - parseInt(jQuery(currentCircle).css('width').substr(0,2)));
            displace (nodes, displaceUnits, difference, "shrink");
          }
        }
        setNumber(currentCircle, jQuery('.contained-circle:last-child', '#pv-container'));
        setPrice('#'+tempID, jQuery('.contained-circle:last-child', '#pv-container'));
        jQuery('.contained-circle:last-child','#pv-container').css('bottom', currentBottom + 'px');
        jQuery('.contained-circle:last-child','#pv-container').css('left', currentLeft + 'px');

        //reset the reference to the current circle
        currentCircle.remove();
        currentCircle = {};
        selected = false;
        var newNodes = jQuery('#pv-container > img');
        updateStatus(newNodes);
        }
  	});
  });
