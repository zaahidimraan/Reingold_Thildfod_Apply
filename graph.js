
//import flareData from './flare.json' assert {type:"json"}
//function Mapping(){
//  let root=d3.hierarchy(flareData);
//  console.log(flareData);
//  console.log(root);
//}

const data = await d3.json("./flare.json");
let clickme1= document.getElementById('clickmeQ1');
clickme1.onclick=function(){
  //let root=d3.hierarchy(flareData);
  //console.log(flareData);
  //console.log(root);
    console.log("\nData Output from file\n");
    console.log(data);
    let root=d3.hierarchy(data);
    console.log("\nData Output from using d3.heirarchy\n");
    console.log(root);
}

let clickme2= document.getElementById('clickmeQ2');
clickme2.onclick=function(){
    let root=d3.hierarchy(data);
   //variable for x,y axis
    let x=10;
    let y=20;
    let array=[];
    array=findChildren(root,array,x,y);
    console.log(array);
    treeDesign(array);
    
}

let clickme3= document.getElementById('clickmeQ3');
clickme3.onclick=function(){
    let root=d3.hierarchy(data);
   //variable for x,y axis
    let x=10;
    let y=20;
    let array=[];
    array=findChildren(root,array,x,y);
    console.log(array);
    radialDesign(array);
    
}

function findChildren(child,array,x,y){
  
  y=y+250; 
  if(child.height==0)
  {
    array.push(saveAxisNode(x,y,child));
    
    // shifting forward
    let requireChild=array.length;
    let storeForLater=requireChild; 
    requireChild=requireChild-2;
    storeForLater=storeForLater-1;
    
    let increment=0;
    for(let i=requireChild;i>=0;i--){
        //console.log(array[i].x,array[i].y,array[i].data);
        if((array[i].x>=array[storeForLater].x)&&(array[i].height==0)){
          increment=array[i].x+20;
          //console.log(array[i].x,array[i].y,increment);
          i=-1;
        }  
      }
      if(increment!=0){
        for(let i=storeForLater;i<array.length;i++){
         array[i].x=increment;
         increment+=20;
         //console.log(array[i].x,array[i].y,increment);

      }
    }
    return array;
  }
    
  //for children
  x=0;
  let x1=0;
  for(let i=0;i<child.children.length;i++)
  {
    //console.log(child.children[i].data);
    x+=20;
    array=findChildren(child.children[i],array,x,y);

    // for x-axis of node having any child
    if(i==0){
      let tempLen=array.length;
      tempLen=tempLen-1;
      x1=x1+array[tempLen].x;
    }
    else if((i+1)==child.children.length)
    {
      let tempLen=array.length;
      tempLen=tempLen-1;
      x1=x1+array[tempLen].x;   
    }
    
  }  
  
 
  // for parent nodes
  if(child.children.length!=1)
     x1=x1/2;

   array.push(saveAxisNode(x1,y,child));
  return array;
}

function saveAxisNode(x1,y1,node){
  return {name: node.data.name,
          value: node.data.value,
          depth: node.depth,
          height: node.height,
          x: x1,
          y: y1};

}

function treeDesign(array){
  let index=array.length;
  index=index-1;
  lineMaking(index,array);
  circleAppend(array);
  textAppend(array);
}

function radialDesign(array){
  let index=array.length;
  index=index-1;
  lineMaking(index,array);
  circleAppend(array);
  textAppend(array);
}


function circleAppend(array){
  let svg = d3.select("svg");
  for(let i=0;i<array.length;i++)
  {
      svg.append("circle")
                  .attr("cx", array[i].x)
                  .attr("cy", array[i].y)
                  .attr("r", 2)
                  .attr("stroke","#2291D4")
                  .attr("fill","#2291D4");

  }
  
}

function lineMaking(index,array){

  //child node
  if(array[index].height==0)
     return;
  let indexChild=index;
  indexChild=indexChild-1;
  
  let depthParent=array[index].depth;
  depthParent=depthParent+1;
  for(let i=indexChild;i>=0;i--){
   if(array[i].depth==depthParent)
   {
    //console.log(index);
    lineAppend(array[index].x,array[index].y,array[i].x,array[i].y);
    lineMaking(i,array);
   }
   else if(array[index].depth==array[i].depth){
     i=-1;
   }
  }

}



function lineAppend(x1,y1,x2,y2){
  let svg = d3.select("svg");
  svg.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke-width", 0.5)
            .attr("stroke", "#778383"); ;
}


function textAppend(array){
  let svg = d3.select("svg");
  let g=svg.append("g")
  for(let i=0;i<array.length;i++)
  {
    if(((i%3)==0)&&(array[i].height>0))
    {
      g.append("text")
                .style("font-size","10px")
                .attr("x", (array[i].x+2))
                .attr("y", (array[i].y-12))
                .text(`${array[i].name}`);
    }
    else if(((i%3)==1)&&(array[i].height>0))
    {
      g.append("text")
                .style("font-size","10px")
                .attr("x", (array[i].x+2))
                .attr("y", (array[i].y+12))
                .text(`${array[i].name}`);
    }
    else if(((i%3)==2)&&(array[i].height>0))
    {
      g.append("text")
                .style("font-size","10px")
                .attr("x", (array[i].x+2))
                .attr("y", (array[i].y))
                .text(`${array[i].name}`);
    }
    else{
      g.append("text")
      .style("font-size","10px")
      .style("writing-mode","vertical-lr")
      .style("text-orientation","upright")
      .style("background-color","yellow")
      .attr("x", (array[i].x+1))
      .attr("y", (array[i].y+3))
      .text(`${array[i].name} (${array[i].value})`)    
      .attr("rotate","90deg") 
    }
  }
  
}


                   