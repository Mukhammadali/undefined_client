pragma solidity >=0.4.22 <0.6.0;

contract Volunteer {

    struct Service {
        uint id; 
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


    function addService (uint _id, string memory _name) private {
        servicesCount ++;
        services.push(Service({
            id: _id,
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
    

    // Constructor
    constructor () public {
        addService(1, "Sample Service");
        addStudent(1, "Sample Student");
        addVolunteering(0, 0);
    }
}