pragma solidity >=0.4.22 <0.6.0;

contract Volunteer {

    struct Service {
        uint id;
        uint maxNum; // Max students who can enroll
        uint currentNum; // Current enrolled students
        string name;
    }

    struct Student {
        uint id;
        string name;
    }

    struct Volunteering {
        uint studentID;
        uint serviceID;
        bool completed;
    }

    Service[] public services;
    uint public servicesCount;

    Student[] public students;
    uint public studentsCount;

    Volunteering[] public volunteerings;
    uint public volunteeringsCount;


    function addService (uint _id, uint _max, uint _current, string memory _name) private {
        servicesCount ++;
        services.push(Service({
            id: _id,
            maxNum: _max,
            currentNum: _current,
            name: _name
        }));
    }

    function addStudent (uint _id, string memory _name) private {
        studentsCount ++;
        students.push(Student({
            id: _id,
            name: _name
        }));

    }

    function addVolunteering (uint studentID, uint serviceID) private {
        volunteeringsCount ++;
        volunteerings.push(Volunteering({
            studentID: studentID,
            serviceID: serviceID,
            completed: false
        }));
        emit EstablishVolunteering(studentID, serviceID);
    }

    function completeVolunteering(uint volunteeringID) private {
        volunteerings[volunteeringID].completed = true;
        emit ApproveVolunteeringCompletion(volunteeringID);
    }

    event EstablishVolunteering (
        uint indexed _studentID,
        uint indexed _serviceID
    );

    event ApproveVolunteeringCompletion(
        uint indexed _volunteeringID
    );

    // Setters

    function setService(string memory name, uint max, uint current) public {
        addService(services.length, max, current, name);
    }

    function setStudent(string memory name) public {
        addStudent(students.length, name);
    }

    function setVolunteering(uint studentID, uint serviceID) public {
        addVolunteering(studentID, serviceID);
    }

    // Getters

    function getService(uint id) public view
        returns(
        uint,
        uint, 
        uint,
        string memory
        ) {
        return(
            id,
            services[id].maxNum,
            services[id].currentNum,
            services[id].name
        );
    }

    function getStudent(uint id) public view
        returns(
        uint,
        string memory
        ) {
        return(
            id,
            students[id].name
        );
    }

    function getVolunteering(uint id) public view
        returns(
        uint,
        uint,
        bool
        ) {
        return(
            volunteerings[id].studentID,
            volunteerings[id].serviceID,
            volunteerings[id].completed
        );
    }


    // Constructor
    constructor () public {
        addService(1, 20, 10, "Sample Service");
        addStudent(1, "Sample Student");
        addVolunteering(0, 0);
    }
}
