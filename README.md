To create the postgre database container in docker, run the docker-compose.yml file from Server/docker/

To install the necessary modules, run the npm command in the terminal in the server folder and in the client folder

To start the back-end server, run npm run back-start in the server folder in the terminal

To start the client server, run npm start in the client folder in the terminal

Functionalities implemented so far:

-login/register with the password saved in the database with hashing

- the main pages for the employee account and the head of department account

- in the employee page, you can use the request creation button to enter the leave request generation page

- the start and end days of the leave can be selected from a calendar

- download the application in PDF format to the employee's PC to be signed

- saving the PDF in BLOB format in the database

Future functionalities:

- the possibility to view all requests (and their statuses) created by an employee type user

- the possibility for a boss user to view all the requests created by the employees of his department

- the head of department type user can approve or reject leave requests

- the calendar in which the start and end days of leave are selected will have certain days that cannot be chosen (depending on a logic, e.g. if at least 2 employees from the same department have leave on a certain day, a third employee cannot take leave on that day)

- improving the design
