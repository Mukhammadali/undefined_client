pragma solidity >=0.4.22 <0.6.0;

contract Volunteer {

    struct ServiceProvider{
        uint id;
        string name;
        Service[] services;
    }

    struct Service {
        uint id;
        uint maxNum;
        uint currentNum; 
        string name;
        bool completed;
        uint credits;
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

    ServiceProvider[] public serviceProviders;
    uint public serviceProvidersCount;



    function addService (uint _id, uint _max, uint _current, string memory _name, uint credits) private {
        servicesCount ++;
        services.push(Service({
            id: _id,
            maxNum: _max,
            currentNum: _current,
            name: _name,
            completed: false,
            credits: credits
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
        
        require(!services[serviceID].completed, "Service is expired");
        require(services[serviceID].currentNum < services[serviceID].maxNum, "Volunteers exceeded");
        services[serviceID].currentNum++;

        volunteerings.push(Volunteering({
            studentID: students[studentID].id,
            serviceID: serviceID,
            completed: false
        }));
        emit EstablishVolunteering(studentID, serviceID);
    }

    function addServiceProvider(uint id, string memory name) private {
        serviceProvidersCount++;
        serviceProviders.push(ServiceProvider({
            id: id,
            name: name,
            services: new Service[](100)
        }));
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

    function setService(string memory name, uint max, uint current, uint credits) public {
        addService(services.length, max, current, name, credits);
    }

    function setStudent(uint id, string memory name) public {
        addStudent(id, name);
    }

    function setVolunteering(uint studentID, uint serviceID) public {
        bool found = false;
        uint studentListID;
        for(uint i = 0; i < studentsCount; i++){
            if(students[i].id == studentID){
                studentListID = i;
                found = true;
                break;
            }
        }

        require(found, "Student is not found");
        require(
            studentListID < studentsCount && serviceID < servicesCount,
            "Invalid ID of student or service"
        );
        addVolunteering(studentListID, serviceID);
    }

    // Getters

    function getService(uint id) public view
        returns(
        uint, 
        uint, 
        uint,
        string memory,
        bool,
        uint
        ) {
        return(
            id,
            services[id].maxNum,
            services[id].currentNum,
            services[id].name,
            services[id].completed,
            services[id].credits
        );
    }

    function getStudent(uint id) public view
        returns(
        uint,
        uint,
        string memory
        ) {
        return(
            id,
            students[id].id,
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
        setService("Service1", 20, 10, 4);
        setStudent(16012786, "Student1");

        setService("Service2", 10, 5, 4);
        setStudent(16013086, "Student2");

        setService("Service3", 15, 7, 4);
        setStudent(16014086, "Student3");
    }
}
