console.log("HERE");
var canvas = new fabric.Canvas('myCanvas');
canvas.setDimensions({width:window.innerWidth, height:window.innerHeight});

var imgElement = document.getElementById('background');

// var imgElement1 = document.getElementById('my-image');
// var imgElement2 = document.getElementById('background2');
// var imgElement3 = document.getElementById('background2');
var rect = new fabric.Rect({
  left: 100,
  top: 100,
  fill: 'red',
  width: 20,
  height: 20
});
var imgInstance = new fabric.Image(imgElement);
// var imgInstance1 = new fabric.Image(imgElement1);
// var imgInstance2 = new fabric.Image(imgElement2);
// var imgInstance3 = new fabric.Image(imgElement3);
var onCanvas = [];
var earrings = [];
var earring1;
var earring2;
imgInstance.set('selectable', false)
canvas.add(imgInstance);
var select_ear = new fabric.ActiveSelection([], {
  canvas: canvas
});
document.querySelectorAll('.drag').forEach(item=>
item.addEventListener('click', event => {
    //handle click
    
    console.log(onCanvas);
    if(onCanvas.includes(event.currentTarget)){
      alert("Already on the canvas");
    }
    else{
      if(event.target.classList.contains("earring")){
      earring1 =new fabric.Image(event.currentTarget,{
        left:150,
        lockScalingFlip:true
      }); 
      canvas.add(earring1);
      earring1.toObject = (function(toObject) {
  return function() {
    return fabric.util.object.extend(toObject.call(this), {
      name: this.name
    });
  };
})(earring1.toObject);
earring1.name = "earring";
      earring2 = new fabric.Image(event.currentTarget,{
        lockScalingFlip:true
      });
      canvas.add(earring2);
      earring2.toObject = (function(toObject) {
  return function() {
    return fabric.util.object.extend(toObject.call(this), {
      name: this.name
    });
  };
})(earring2.toObject);
earring2.name = "earring";
      onCanvas.push(event.currentTarget);
    }
    else{
    canvas.add(new fabric.Image(event.currentTarget));
    onCanvas.push(event.currentTarget);
    }
    }
  }));

  //If an object is scaled on the canvas, this function runs. checkear is function that is run to check if it is an earring. 
  //If an earring then the other one in pair too is scalled accordingly, thus keeping them seperate. 
  canvas.on({
    // 'object:moving': checkear,
    'object:scaling': checkear,
    'object:resizing': checkear,
    'object:rotating': checkear,
    // 'object:skewing': checkear
  });


//Checking when to display the scale slider!
canvas.on('mouse:down', function(options) {


  if (canvas.getActiveObject()) {
    
    document.getElementById("scalecontrol").removeAttribute("hidden");
    document.getElementById("scalecontrol").value = canvas.getActiveObject().scaleX;
  }
  else{
    document.getElementById("scalecontrol").setAttribute("hidden",true);
  }

});

function deleteImage(){
 var image =  canvas.getActiveObject();
 canvas.remove(image);
 const index = onCanvas.indexOf(image);
if (index > -1) {
  onCanvas.splice(index, 1);
}

}

//Controlling the scale toggle. 
var scaleControl = document.getElementById("scalecontrol");
scaleControl.oninput = function() {
console.log(this.value);
var image =  canvas.getActiveObject();
if(canvas.getActiveObject().name == "earring"){ //If earring then scaling is applied to the other half of the pair.
  canvas.forEachObject((obj)=>{
      if(obj.name == "earring"){
        obj.scale(parseFloat(this.value)).setCoords();
// canvas.requestRenderAll();
      }
    })
    }
image.scale(parseFloat(this.value)).setCoords();
canvas.requestRenderAll();
  };

function checkear(){ //Determines if the selected object is an earring and then both earring in the pair are scalled together.
 var selected =  canvas.getActiveObject()
  scaleControl.value = selected.scaleX;
  if(selected.name == "earring"){
    canvas.forEachObject((obj)=>{
      if(obj.name == "earring"){
        obj.scale(parseFloat(selected.scaleX)).setCoords();
canvas.requestRenderAll();
      }
    })
  }
}

//To implemet the scaling using the mouse wheel up and down. 
$(canvas.wrapperEl).on('mousewheel', function(e) {
    var target = canvas.getActiveObject();
    var delta = e.originalEvent.wheelDelta /2000;
    
    if (target) {
        target.scaleX += delta;
        target.scaleY += delta;
        
        // constrain
        if (target.scaleX < 0.1) {
            target.scaleX = 0.1;
            target.scaleY = 0.1;
        }
        // constrain
        if (target.scaleX > 1) {
            target.scaleX = 1;
            target.scaleY = 1;
        }
        scaleControl.value = target.scaleX;
        checkear();
        target.setCoords();
        canvas.renderAll();
        return false;
    }
});