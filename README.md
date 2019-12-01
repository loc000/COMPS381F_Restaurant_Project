"# COMPS381F_Restaurant_Project"   
Github Link: https://github.com/loc000/COMPS381F_Restaurant_Project/
Demo Server Link: https://comps381f-restaurant-project.herokuapp.com/
**Testing Curl:**  
Insert:  
curl -H "Content-Type: application/json" -X POST -d '{"name":"381F","owner":"demo01"}' https://comps381f-restaurant-project.herokuapp.com/api/restaurant  
curl -H "Content-Type: application/json" -X POST -d '{"name":"382F","owner":"demo02","borough":"Kwon Tong","cuisine":"Water","address":{"street":"Kwon Tong Street","building":"APM","zipcode":"00852","coord":"22.3124573,114.2236401"}}' https://comps381f-restaurant-project.herokuapp.com/api/restaurant  
Insert Fail:   
curl -H "Content-Type: application/json" -X POST -d '{"name":"381F"}' https://comps381f-restaurant-project.herokuapp.com/api/restaurant     
Get All Restaurant:
curl -X GET https://comps381f-restaurant-project.herokuapp.com/api/restaurant/  
Get name start equal to 381F:
curl -X GET https://comps381f-restaurant-project.herokuapp.com/api/restaurant/name/381F
curl -X GET https://comps381f-restaurant-project.herokuapp.com/api/restaurant/borough/Kwon%20Tong
curl -X GET https://comps381f-restaurant-project.herokuapp.com/api/restaurant/cuisine/Water