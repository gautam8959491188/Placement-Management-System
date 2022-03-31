import React from 'react'
import progress from './progress.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit,faTrash } from '@fortawesome/free-solid-svg-icons'
const getStudents=()=>{
var promise=new Promise((resolve)=>{
fetch("/placements").then((response)=>{
return response.json();
}).then((students)=>{
resolve(students);
});
});
return promise;
}

const addPlacement=(student)=>{
var promise=new Promise((resolve)=>{
var dataString= `id=${student.id}&name=${encodeURIComponent(student.name)}&placementType=${student.placementType}&company=${encodeURIComponent(student.company)}&salary=${student.salary}&salaryType=${student.salaryType}`;
//alert(dataString);	
fetch("/addPlacement",{
"method" : "POST",
"headers" : {
"Content-Type" : "application/x-www-form-urlencoded"
},
"body" : dataString
}).then((response)=>{
return response.json();
}).then((responseJSON)=>{
resolve(responseJSON);
});

});

return promise
}


const deletePlacement=(student)=>{
var promise=new Promise((resolve)=>{
var dataString= `id=${student.id}`;
//alert(dataString);	
fetch("/deletePlacement",{
"method" : "POST",
"headers" : {
"Content-Type" : "application/x-www-form-urlencoded"
},
"body" : dataString
}).then((response)=>{
return response.json();
}).then((responseJSON)=>{
resolve(responseJSON);
});

});

return promise
}




const AppExample16=()=>{
<h1>Thinking Machines</h1>
const [activeMode,setActiveMode]=React.useState("view");
const [students,setStudents]=React.useState([]);
const [selectedStudent,setSelectedStudent]=React.useState(null);
React.useEffect(()=>{
getStudents().then((s)=>{
setStudents(s);
});
},[]);
const onToolBarItemSelected=function(item){
if(item==="add") setActiveMode("add");
if(item==="cancel") setActiveMode("view");
}

const setViewMode=()=>{
setActiveMode("view");
}

const showEditForm=(studentId)=>{
//alert(`Student Id ${studentId} comes for editing.`);
var e=0;
while(e<students.length)
{
if(students[e].id==studentId)
{
setSelectedStudent(students[e]);
break;
}
e++;
}
setActiveMode("edit");
}

const showDeleteForm=(studentId)=>{
var e=0;
while(e<students.length)
{
if(students[e].id==studentId)
{
setSelectedStudent(students[e]);
break;
}
e++;
}
setActiveMode("delete");
}

const onStudentAdded=(student)=>{

if(student.placementType=='F')
{
student.placementType='Full time.';
}
if(student.placementType=='I') 
{
student.placementType='Internship.';
}

if(student.salaryType=='Y')
{
if(student.salary>99000)
{
student.salary=(student.salary/100000)+" lac per annum.";
}
else
{
student.salary=student.salary+" per annum.";
}
}
if(student.salaryType=='M')
{
if(student.salary>99000)
{
student.salary=(student.salary/100000)+" lac per month."
}
else
{
student.salary=student.salary+" per month.";
}
}
students.push(student);
}

const onStudentUpdated=(student)=>{}

const onStudentDeleted=(student)=>{
//alert(student.id);
var id=student.id;
var e=0;
var sid=students[e].id;
while(e<students.length)
{
if(sid!=id)
{
students.pop(student[e]);
}
e++;
}
setActiveMode("view");
}


return (
<div>

<ToolBar mode={activeMode} onItemSelected={onToolBarItemSelected}/>
{activeMode==="view" && <StudentsViewComponent students={students} onEdit={showEditForm} onDelete={showDeleteForm}/> }
{activeMode==="add" && <StudentAddComponent onStudentAdded={onStudentAdded} onDismiss={setViewMode}/> }
{activeMode==="edit" && <StudentEditComponent onStudentUpdated={onStudentUpdated} onDismiss={setViewMode} student={selectedStudent} /> }
{activeMode==="delete" && <StudentDeleteComponent onStudentDeleted={onStudentDeleted} onDismiss={setViewMode} student={selectedStudent} /> }
</div>
)
}
const ToolBar=({mode,onItemSelected})=>{
const targetAction=(ev)=>{
onItemSelected(ev.currentTarget.getAttribute("target_attribute"));
}
return (
<div>
<hr/>
{mode==="view" && <button type='button' onClick={targetAction} target_attribute="add">Add</button> }
{mode==="add" && <button type='button' onClick={targetAction} target_attribute="cancel">Cancel</button> }
<hr/>
</div>
)
}
const StudentsViewComponent=({students,onEdit,onDelete})=>{
const iconClicked=(ev)=>{
//alert(ev.currentTarget.id);
var studentId=ev.currentTarget.id.substring(1);
var operation=ev.currentTarget.id.substring(0,1);
if(operation=='D')
{
//alert(studentId+" to be deleted");
onDelete(studentId);
}
else if(operation=='E')
{
//alert(studentId+" to be edited");
onEdit(studentId);
}
}
return(
<div>
{
students.map((student)=>{
return(
<div key={student.id}>
<hr/>
Name : {student.name}<br/>
Company : {student.company} (Type : {student.placementType})<br/>
Salary : {student.salary}&nbsp;&nbsp;
<FontAwesomeIcon icon={faEdit} style={{'cursor':'pointer'}} onClick={iconClicked} id={'E'+student.id}/>
&nbsp;&nbsp;
<FontAwesomeIcon icon={faTrash} style={{'cursor':'pointer'}} onClick={iconClicked} id={'D'+student.id}/>
<hr/>
</div>
)
})
}
</div>
);
}

const StudentEditComponent=({onStudentUpdated,student,onDismiss})=>{
var id=student.id;
var name=student.name;
var placementType=student.placementType;
var company=student.company;
var salary=student.salary;
return(
<div>
<h1>Edit Panel</h1>
<label htmlFor='id'>Id.</label>
<input type='number' readOnly={true} id='id' value={id}/>
<br/>

<label htmlFor='name'>Name</label>
<input type='text' id='name' value={name}/>
<br/>

<label htmlFor='placementType'>Placement Type</label>
<input type='text' id='placementType' value={placementType}/>
<br/>

<label htmlFor='company'>Company</label>
<input type='text' id='company' value={company}/>
<br/>

<label htmlFor='salary'>Salary</label>
<input type='text' id='salary' value={salary}/>
<br/>
</div>
)
}



const StudentDeleteComponent=({onStudentDeleted,student,onDismiss})=>{

const yesHandler=()=>{
//alert(`Delete student of Id ${student.id}`)
deletePlacement(student).then(responseJSON=>{
if(responseJSON.success==true)
{
alert("Student Deleted Successfully.")
onStudentDeleted(student);
}

})
}

const noHandler=()=>{
onDismiss();
}

var id=student.id;
var name=student.name;
var placementType=student.placementType;
var company=student.company;
var salary=student.salary;

return(
<div>
<h1>Delete Panel.</h1>
<label htmlFor='id'>Id.</label>
<input type='number' readOnly={true} id='id' value={id}/>
<br/>

<label htmlFor='name'>Name</label>
<input type='text' id='name' value={name}/>
<br/>

<label htmlFor='placementType'>Placement Type</label>
<input type='text' id='placementType' value={placementType}/>
<br/>

<label htmlFor='company'>Company</label>
<input type='text' id='company' value={company}/>
<br/>

<label htmlFor='salary'>Salary</label>
<input type='text' id='salary' value={salary}/>
<br/><br/>
<button type='button' onClick={yesHandler}>OK</button>&nbsp;&nbsp;
<button type='button' onClick={noHandler}>Cancel</button>
</div>
)
}




const StudentAddComponent=({onStudentAdded,onDismiss})=>{
const [displayWhat,setDisplayWhat]=React.useState("formSection");

const [id,setId]=React.useState(0);
const [idError,setIdError]=React.useState("");

const [name,setName]=React.useState("");
const [nameError,setNameError]=React.useState("");

const [company,setCompany]=React.useState("");
const [companyError,setCompanyError]=React.useState("");

const [salary,setSalary]=React.useState(0);
const [salaryError,setSalaryError]=React.useState("");

const [salaryType,setSalaryType]=React.useState("Y");
const [fullTimeChecked,setFullTimeChecked]=React.useState("checked");
const [internshipChecked,setInternshipChecked]=React.useState("");
const [placementType,setPlacementType]=React.useState("F");
const [formError,setFormError]=React.useState("");

const idChanged=(ev)=>{
setId(ev.target.value);
}

const nameChanged=(ev)=>{
setName(ev.target.value);
}

const companyChanged=(ev)=>{
setCompany(ev.target.value);
}

const salaryChanged=(ev)=>{
setSalary(ev.target.value);
}

const salaryTypeChanged=(ev)=>{
setSalaryType(ev.target.value);
}

const placementTypeChanged=(ev)=>{
if(ev.target.value=='F' && ev.target.checked)
{
setPlacementType("F");
setFullTimeChecked("checked");
setInternshipChecked("");
}
if(ev.target.value=='I' && ev.target.checked)
{
setPlacementType("I");
setInternshipChecked("checked");
setFullTimeChecked("");
}
}

const clearAllErrors=()=>{
setFormError("");
setIdError("");
setNameError("");
setCompanyError("");
setSalaryError("");
}

const clearForm=()=>{
setId(0);
setName("");
setPlacementType("F");
setFullTimeChecked("checked");
setInternshipChecked("");
setSalaryType("Y");
setCompany("");
setSalary(0);
}

const yesHandler=()=>{
setDisplayWhat("formSection");
}
const noHandler=()=>{
onDismiss();
}


const addClickedHandler=()=>{
clearAllErrors();
var hasErrors=false;
if(id<=0 || id=="")
{
setIdError(" * ");
hasErrors=true;
}
if(name=="") 
{
setNameError(" * ");
hasErrors=true;
}
if(company=="") 
{
setCompanyError(" * ");
hasErrors=true;
}
if(salary<=0 || salary=="") 
{
setSalaryError(" * ");
hasErrors=true;
}
if(hasErrors=="true") return;

var student={
"id" : id,
"name" : name,
"placementType" : placementType,
"company" : company,
"salary" : salary,
"salaryType" : salaryType
};

setDisplayWhat("processingSection");

addPlacement(student).then((responseJSON)=>{
if(responseJSON.success==true)
{
onStudentAdded(student);
clearForm();
setDisplayWhat("addMoreSection");
}
else
{
setFormError(responseJSON.error);
setDisplayWhat("formSection");
}
});
}

if(displayWhat==="formSection") return (
<div>
<div style={{color : 'red'}}>{formError}</div>

<label htmlFor='id'>Id.</label>
<input type='number' id='id' value={id} onChange={idChanged}/>
<span style={{color : 'red'}}> {idError} </span>
<br/>
<label htmlFor='name'>Name</label>
<input type='text' id='name' value={name} onChange={nameChanged}/>
<span style={{color : 'red'}}> {nameError} </span>
<br/>
Placement Type
<input type='radio' id='fullTime' name='placememtType' checked={fullTimeChecked} value='F' onChange={placementTypeChanged}/>Full Time.
&nbsp;&nbsp;&nbsp;
<input type='radio' id='internship' name='placememtType' checked={internshipChecked} value='I' onChange={placementTypeChanged}/>Internship.<br/>
<label htmlFor='company'>Company</label>
<input type='text' id='company' value={company} onChange={companyChanged}/>
<span style={{color : 'red'}}> {companyError} </span>
<br/>
<label htmlFor='salary'>Salary</label>
<input type='number' id='salary' value={salary} onChange={salaryChanged}/>
<select id='salaryType' value={salaryType} onChange={salaryTypeChanged}>
<option value='Y'>per annum</option>
<option value='M'>per month</option>
</select>
<span style={{color : 'red'}}> {salaryError} </span>
<br/>
<button type='button' onClick={addClickedHandler}>Add.</button>
</div>
)

if(displayWhat==="processingSection") return(
<div>
<img src={progress} />
</div>
)

if(displayWhat==="addMoreSection") return(
<div>
Add More ?<br/>
<button type='button' onClick={yesHandler}>Add.</button>
<button type='button' onClick={noHandler}>Cancel.</button>
</div>
)
}


export default AppExample16;