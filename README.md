"# COMPS381F_Restaurant_Project"   
**Testing Curl:**  
curl -H "Content-Type: application/json" -X POST -d '{"name":"381F","owner":"Ramond So"}' 127.0.0.1:5000/api/restaurant  
curl -H "Content-Type: application/json" -X POST -d '{"name":"382F","owner":"Ramond So","borough":"Kwon Tong","cuisine":"Water","address":{"street":"Kwon Tong Street","building":"APM","zipcode":"00852","coord":"22.3124573,114.2236401"}}' 127.0.0.1:5000/api/restaurant    