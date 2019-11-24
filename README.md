"# COMPS381F_Restaurant_Project"   
**Testing Curl:**  
Insert:  
curl -H "Content-Type: application/json" -X POST -d '{"name":"381F","owner":"Ramond So"}' 127.0.0.1:5000/api/restaurant  
curl -H "Content-Type: application/json" -X POST -d '{"name":"382F","owner":"Ramond So","borough":"Kwon Tong","cuisine":"Water","address":{"street":"Kwon Tong Street","building":"APM","zipcode":"00852","coord":"22.3124573,114.2236401"}}' 127.0.0.1:5000/api/restaurant  
Insert Fail:   
curl -H "Content-Type: application/json" -X POST -d '{"name":"381F"}' 127.0.0.1:5000/api/restaurant     
Get All Restaurant:
curl -X GET 127.0.0.1:5000/api/restaurant/  
Get name start equal to 381F:
curl -X GET 127.0.0.1:5000/api/restaurant/name/381F
