var container = document.querySelector(".container");
//Default events
var defaultWidth = 620;
// contains a group of collided events
var collideList = [];
// used to determine where to put the collided event vertically
var columnsList = [];
// sort the events according to the start time
function compare(a,b) {
if (a.start < b.start)
  return -1;
if (a.start > b.start)
  return 1;
return 0;
}

//main function
function layOutDay(events){
  events.sort(compare);
  //clear container
  container.innerHTML = "";
  for(let i = 0; i <events.length; i++)
  {
    //reset the lists
    collideList = [];
    columnsList = [];
    columnsList.push(events[i].end);
    if(events[i].visited !=1) {
      startEvent = i;
      //start at first column
      events[i].column = 0;
      //get of the parameters needed to draw the event
      getDrawData(i,events);
    }
    //caluclate the width of the event
    width = Math.floor(defaultWidth/events[i].columnsNumber)
    //where to start from the left( sets margin-left)
    startFromleft = events[i].column * width;
    //the height of the event
    duration = events[i].end - events[i].start;
    //draw the event
    draw(events[i].start,startFromleft,duration,width)
  }
  //for testing and detailed look
  console.log(events);
}

function getDrawData(v,events){
  //mark the current node as visited to avoid miscalculations and infinte loop
  events[v].visited = 1;
  for(let i = 0; i <events.length; i++)
  {
    //condition for the collision
    if(events[v].end > events[i].start && events[v].start < events[i].end && events[i].visited !=1)
    {
      //get the min vertical starting pixel that the event can be put
      let min = Math.min.apply(null, columnsList);
      //add the detected event to the collided list
      collideList.push(i);
      if(events[i].start >= min){
        //get the coulmn number that this was columnd in, this is used to caluclate the margin for the event, it will later be multipled by the width
        events[i].column = columnsList.indexOf(min);
        //it has a column, put it and change the min to the end of the event
        columnsList[columnsList.indexOf(min)] = events[i].end;
      }
      else{
        //no column, add a new column and record it
        columnsList.push(events[i].end);
        events[i].column = columnsList.length - 1;
      }
      getDrawData(i,events);
    }
  }
  //when the backtracking gets returns to the first event, update all the collided events width parameter
  if(v == startEvent){
    for(let i = 0; i <collideList.length; i++)
      events[collideList[i]].columnsNumber = columnsList.length;
    }
  events[v].columnsNumber = columnsList.length;
}
// draws the events
function draw(startFromTop,startFromleft,height,width){
  container.innerHTML += '<div class="plan" style="margin-top:'+startFromTop+'px;margin-left:'+startFromleft+'px;height:'+height+'px;width:'+width+'px;"><div class="strip"></div><p class="green">Sample Item</p><p class="grey">Sample Location</p></div>';
}
//main function
layOutDay([ {start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670} ]);
