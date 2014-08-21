document.addEventListener('DOMContentLoaded', function(){
  if $('#map'){
    map_controller = new BootMap.Controller
    map_view = new BootMap.View(map_controller)
    map_controller.view = map_view
    map_controller.fetchUsers()
    map_controller.initializeMap(37.769, -5, 2)
    map_view.drawMap()
  }
});