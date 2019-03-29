angular.module('climbGame.controllers.calendarStats', [])
    .controller('calendarStatsCtrl', ['$scope', '$http', 'uiCalendarConfig', 'dataService',
    function ($scope, $http, uiCalendarConfig, dataService) {

    $scope.index = ''
    $scope.calendarView = 0
    $scope.activityLevel = ["Extremely Active", "Very Active", "Fairly Active", "Inactive"]
    $scope.activityLevelInverse = ["Fairly Active", "Very Active", "Extremely Active"]
    $scope.colors = ["red", "blue", "orange", "green", "purple", "yellow", "brown", "white", "gray", "black"]
    $scope.colorLevel = ['#99FF99', '#FFFF99', '#FF6666', '#CCCCCC']

$scope.switchCalendar = function () {
       if($scope.calendarView == 0){
        $scope.calendarView = 1;
        $scope.calendarDisplaySwitch()
        } else if ($scope.calendarView == 1){
        $scope.calendarView = 0
        $scope.calendarDisplaySwitch()
        }
        }

 $scope.calendarDisplaySwitch = function(){
       if($scope.calendarView == 0){
       dataService.getIndex().then(
          function(index) {
          $scope.index = index
          dataService.getCalendar(0, $scope.index).then(
              function (events) {
              $scope.events.splice(0,$scope.events.length)
                  for (var i = 0; i<events.length; i++){
                      $scope.events.push({
                          title: events[i].name + ": " + events[i].distance + " Miles",
                          activityName: events[i].name,
                          meteo: events[i].meteo,
                          eactive: events[i].eadistance,
                          vactive: events[i].vadistance,
                          factive: events[i].fadistance,
                          iactive: 0,
                          start: events[i].day,
                          stick: true
                      });
                  }
                  });
          })


              }
          else if($scope.calendarView == 1){
                 dataService.getIndex().then(
                    function(index) {
                    $scope.index = index
                    dataService.getCalendar(0, $scope.index).then(
                        function (events) {
                        var dates = []
                        for (var i = 0; i< events.length-1; i++){
                        if(!dates.includes(events[i].day))
                            dates.push(events[i].day)
                        }

                        $scope.events.splice(0,$scope.events.length)
                            for (var i = 0; i<dates.length; i++){
                                var EA=0; FA=0; VA=0; IA =0; distance = 0;
                                var meteoDay = ''
                                var event = []
                                var eDistanceArr = []
                                var vDistanceArr = []
                                var fDistanceArr = []
                                for(var j =0; j<events.length-1; j++){
                                  if(events[j].day == dates[i]){
                                    EA+=events[j].eadistance
                                    VA+=events[j].vadistance
                                    FA+=events[j].fadistance
                                    distance+=events[j].distance
                                    meteoDay = events[j].meteo
                                    event.push(events[j].name)
                                    eDistanceArr.push(events[j].eadistance)
                                    vDistanceArr.push(events[j].vadistance)
                                    fDistanceArr.push(events[j].fadistance)
                                  }
                                }
                                var distanceLevel = [eDistanceArr, vDistanceArr, fDistanceArr, 0]
                                var aLevel = [EA, VA, FA, IA]
                                for(var k = 0; k < 3; k++){
                                $scope.events.push({
                                    title: $scope.activityLevel[k]+" Miles: " + aLevel[k],
                                    activityName: $scope.activityLevel[k],
                                    meteo: meteoDay,
                                    eactive: EA,
                                    vactive: VA,
                                    factive: FA,
                                    iactive: IA,
                                    event: event,
                                    distanceLevel: distanceLevel[k],
                                    start: dates[i],
                                    id: k,
                                    textColor: 'black',
                                    color: $scope.colorLevel[k],
                                    stick: true,
                                    distanceEvent: false
                                    });
                            }
                            $scope.events.push({
                                      title: "Distance: " + distance,
                                      meteo: meteoDay,
                                      start: dates[i],
                                      textColor: 'black',
                                      color: '#7FFFD4',
                                      stick: true,
                                      diffNumber: i,
                                      distanceEvent: true
                                      });
                            }
                            });
                    })

                        }
                        }

$scope.calendarDisplaySwitch()



    $scope.SelectedEvent = null;
    var isFirstTime = true;
$scope.events = [];
$scope.eventSources = [$scope.events];



    //Load events from server
    //$scope.getEvents = function() {

   // };

    //configure calendar
    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            displayEventTime: false,
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right:'today prev,next'
            },
            eventClick: function (event) {
                $scope.SelectedEvent = event;
            },
            eventAfterAllRender: function () {
                if ($scope.events.length > 0 && isFirstTime) {
                    //Focus first event
                    uiCalendarConfig.calendars.myCalendar.fullCalendar('gotoDate', $scope.events[0].start);
                    isFirstTime = false;
                }
            }
        }
    };
    $scope.setJsonOriginalView = function(SelectedEvent){
    $scope.myJson.title.text = SelectedEvent.activityName;
    $scope.myJson.scaleX.values.splice(0, $scope.myJson.scaleX.values.length);
    for(var i = 0; i<3; i++){
    $scope.myJson.scaleX.values.push($scope.activityLevelInverse[i]);
    }

    $scope.myJson.series[0].values.splice(0, $scope.myJson.series[0].values.length);
    $scope.myJson.series[0].values.push(SelectedEvent.factive);
    $scope.myJson.series[0].values.push(SelectedEvent.vactive);
    $scope.myJson.series[0].values.push(SelectedEvent.eactive);
    $scope.myJson.plot.styles.splice(0, $scope.myJson.plot.styles.length);
    $scope.myJson.plot.styles.push("#FF6666");
    $scope.myJson.plot.styles.push("#FFFF99");
    $scope.myJson.plot.styles.push("#99FF99");

    }

    $scope.setJson = function(SelectedEvent){
    if(SelectedEvent.distanceEvent == false){

    $scope.myJson.title.text = SelectedEvent.activityName;
    $scope.myJson.scaleX.values.splice(0, $scope.myJson.scaleX.values.length);
    $scope.myJson.series[0].values.splice(0, $scope.myJson.series[0].values.length);
    $scope.myJson.plot.styles.splice(0, $scope.myJson.plot.styles.length);

    for(var i = 0; i<SelectedEvent.event.length; i++){

    $scope.myJson.scaleX.values.push(SelectedEvent.event[i])
    $scope.myJson.series[0].values.push(SelectedEvent.distanceLevel[i])

    }
    for(var i = 0; i<10; i++){
    $scope.myJson.plot.styles.push($scope.colors[i]);
    }
    }
    else {
        $scope.myJson.title.text = "Total Distance";
         $scope.myJson.scaleX.values.splice(0, $scope.myJson.scaleX.values.length);

             $scope.myJson.plot.styles.splice(0, $scope.myJson.plot.styles.length);
        for(var i = 0; i<3; i++){
            $scope.myJson.scaleX.values.push($scope.activityLevelInverse[i]);
            }

$scope.myJson.series[0].values.splice(0, $scope.myJson.series[0].values.length);
    var eventToDisplay = (SelectedEvent.diffNumber*4);
    $scope.myJson.series[0].values.push($scope.events[eventToDisplay].factive);
    $scope.myJson.series[0].values.push($scope.events[eventToDisplay].vactive);
    $scope.myJson.series[0].values.push($scope.events[eventToDisplay].eactive);
    $scope.myJson.plot.styles.splice(0, $scope.myJson.plot.styles.length);
        $scope.myJson.plot.styles.push("#FF6666");
        $scope.myJson.plot.styles.push("#FFFF99");
        $scope.myJson.plot.styles.push("#99FF99");
             }



        }





    $scope.myJson = {
         type : "bar",
               title:{
                 backgroundColor : "transparent",
                 fontColor :"black",
                 text : ""
               },
               plot: {
               styles: []
               },
               plotArea: {
                   margin:'dynamic'
                 },
               backgroundColor : "white",
               scaleX: {

                               values: [],
                               item: {
                                    fontAngle: -45,
                                    fontSize: "9px"
                                    },
                               label: {
                               text:"Activity"
                               }

                           },
                scaleY: {
                label: {
                        text:"Miles"
                         }
                },
                           series :[
                                   {
                                     values : []

                                   }

                                   ]

               };





}])