const express=require('express');
const app=express();
const oracle=require('oracledb');
const bodyParser=require('body-parser');
const urlEncodedBodyParser=bodyParser.urlencoded({extended:false});
class Student
{
constructor(id,name,placementType,company,salary)
{
this.id=id;
this.name=name;
this.placementType=placementType;
this.company=company;
this.salary=salary;
}
getId()
{
return this.id;
}
getName()
{
return this.name;
}
getplacementType()
{
return this.placementType;
}
getCompany()
{
return this.company;
}
getSalary()
{
return this.salary;
}
}

//Data Retrive from Database.

app.get("/placements",async function(request,response){
var connection=null;
connection=await oracle.getConnection({
"user": "hr",
"password": "hr",
"connectionString": "localhost:1521/xepdb1"
});
var students=[];
var resultSet=await connection.execute("select * from student");
resultSet.rows.forEach((row)=>{
var id=row[0];
var name=row[1].trim();
var job_type=row[2];
var company=row[3].trim();
var salary=row[4];
var salary_type=row[5];
if(job_type=='F')
{
placementType="Full Time";
}
if(job_type=='I')
{
placementType="Internship";
}
if(salary_type=='Y')
{
if(salary>99000)
{
salary=(salary/100000)+" lac per annum.";
}
else
{
salary=salary+" per annum.";
}
}
if(salary_type=='M')
{
if(salary>99000)
{
salary=(salary/100000)+" lac per month."
}
else
{
salary=salary+" per month";
}
}
students.push(new Student(id,name,placementType,company,salary));
});
response.send(students);
});

// Code to Add an Entry in Database

app.post("/addPlacement",urlEncodedBodyParser,async function(request,response){
var id=request.body.id;
var name=request.body.name;
var placementType=request.body.placementType;
var company=request.body.company;
var salary=request.body.salary;
var salaryType=request.body.salaryType;

var connection=null;
connection=await oracle.getConnection({
"user" : "hr",
"password" : "hr",
"connectionString" : "localhost:1521/xepdb1"
});

var resultSet=await connection.execute(`select * from student where id=${id}`);
if(resultSet.rows.length>0)
{
await connection.close();
response.send({"success" : false,"error" : id+" exists."});
return;
}

await connection.execute(`insert into student values(${id},'${name}','${placementType}','${company}',${salary},'${salaryType}')`);
await connection.commit();
await connection.close();
response.send({"success" : true});
});



//Update a record in Database


app.post("/updatePlacement",urlEncodedBodyParser,async function(request,response){
var id=request.body.id;
var name=request.body.name;
var placementType=request.body.placementType;
var company=request.body.company;
var salary=request.body.salary;
var salaryType=request.body.salaryType;

var connection=null;
connection=await oracle.getConnection({
"user" : "hr",
"password" : "hr",
"connectionString" : "localhost:1521/xepdb1"
});

var resultSet=await connection.execute(`select * from student where id=${id}`);
if(resultSet.rows.length==0)
{
await connection.close();
response.send({"success" : false,"error" : id+" does not exist."});
return;
}
await connection.execute(`update student set name='${name}',job_type='${placementType}',company='${company}',salary=${salary},salary_type='${salaryType}' where id=${id}`);
await connection.commit();
await connection.close();
response.send({"success" : true});
});

//Delete a record in Database

app.post("/deletePlacement",urlEncodedBodyParser,async function(request,response){
var id=request.body.id;
var connection=null;
connection=await oracle.getConnection({
"user" : "hr",
"password" : "hr",
"connectionString" : "localhost:1521/xepdb1"
});

var resultSet=await connection.execute(`select * from student where id=${id}`);
if(resultSet.rows.length==0)
{
await connection.close();
response.send({"success" : false,"error" : id+" does not exist."});
return;
}
await connection.execute(`delete from student where id=${id}`);
await connection.commit();
await connection.close();
response.send({"success" : true});
});



app.listen(5050,function(err){
if(err)
{
return console.log(err);
}
console.log('Server is ready to accept the requests at port 5050');
});