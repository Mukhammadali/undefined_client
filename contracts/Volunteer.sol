pragma solidity >=0.4.22 <0.6.0;

contract Volunteer {

    struct Service {
        uint id;
        uint maxNum; // Max students who can enroll
        uint currentNum; // Current enrolled students
        string name;
        bool completed;
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
            name: _name,
            completed: false
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

    function completeVolunteering(uint volunteeringID) public {
        volunteerings[volunteeringID].completed = true;
        emit ApproveVolunteeringCompletion(volunteeringID);
    }

    function completeService(uint serviceID) public {
        services[serviceID].completed = true;
        emit ApproveServiceCompletion(serviceID);
    }


    event EstablishVolunteering (
        uint indexed _studentID,
        uint indexed _serviceID
    );

    event ApproveVolunteeringCompletion(
        uint indexed _volunteeringID
    );

    event ApproveServiceCompletion(
        uint indexed _serviceID
    );

    // Setters

    function setService(string memory name, uint max, uint current) public {
        addService(services.length, max, current, name);
    }

    function setStudent(string memory name) public {
        addStudent(students.length, name);
    }

    function setVolunteering(uint studentID, uint serviceID) public {
        require(
            studentID < studentsCount && serviceID < servicesCount,
            "Invalid ID of student or service"
        );
        addVolunteering(studentID, serviceID);
    }

    // Getters

    function getService(uint id) public view
        returns(
        uint,
        uint, 
        uint,
        string memory,
        bool
        ) {
        return(
            id,
            services[id].maxNum,
            services[id].currentNum,
            services[id].name,
            services[id].completed
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
        setService("Service1", 20, 10);
        setStudent("Student1");

        setService("Service2", 10, 5);
        setStudent("Student2");

        setService("Service3", 15, 7);
        setStudent("Student3");
    }
}
