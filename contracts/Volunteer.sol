pragma solidity >=0.4.22 <0.6.0;

contract Volunteer {

    struct ServiceProvider{
        uint id;
        string name;
        mapping(uint => Service) services;
        uint numberOfServices;
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

    // For keeping track of id's of Service Providers in sercieProviders array
    // LATER: Find better solution
    mapping(string => uint) serviceProvidersIds;




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
        serviceProvidersIds[name] = id;
        serviceProvidersCount++;
        serviceProviders.push(ServiceProvider({
            id: id,
            name: name,
            numberOfServices: 0
        }));
    }

<<<<<<< HEAD
    // Creates new service and binds it to existing Service Provider
    function addServiceToServiceProvider(uint sp_id, string memory s_name, uint s_max, uint s_current, uint s_credits) public {
        setService(s_name, s_max, s_current, s_credits);
        serviceProviders[sp_id].services[serviceProviders[sp_id].numberOfServices] = services[servicesCount-1];
        serviceProviders[sp_id].numberOfServices++;
    }

    function completeVolunteering(uint volunteeringID) public {
=======
    function completeVolunteering(uint 2) public {
>>>>>>> 8a66983deecd294fc7b1fe003726f537d670b7e3
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
        require(!studentExists(id), "Student already exists.");
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

    // Creates new Service Provider
    function setServiceProvider(string memory name) public {
        addServiceProvider(serviceProviders.length, name);
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

    function getStudent(uint id) public view returns(uint, uint, string memory) {
        require(studentExists(id), "Student does not exist.");
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

    // Returns name of service at index of array services in Service Provider sp_name
    function getServiceProvidersService(string memory sp_name, uint index) public view returns(string memory) {
        require(index < serviceProviders[serviceProvidersIds[sp_name]].numberOfServices, "Our of range of services available in this Service Provider");
        return(
            serviceProviders[serviceProvidersIds[sp_name]].services[index].name
        );
    }


    function studentExists(uint id) public view returns( bool ){
        bool exists = false;
        for(uint i = 0; i < studentsCount; i++){
            if(students[i].id == id){
                exists = true;
                break;
            }
        }
        return (exists);
    }

    function studentEnrolledInService(uint studentID, uint serviceID) public view returns(bool){
        bool enrolled = false;
        for(uint i = 0; i < volunteeringsCount; i++){
            if(volunteerings[i].studentID == studentID && volunteerings[i].serviceID == serviceID){
                enrolled = true;
                break;
            }
        }
        return (enrolled);
    }


    // Constructor
    constructor () public {
        setService("Service1", 20, 10, 4);
        setStudent(16012786, "Student1");

        setService("Service2", 10, 5, 4);
        setStudent(16013086, "Student2");

        setService("Service3", 15, 7, 4);
        setStudent(16014086, "Student3");

        setServiceProvider("Provider1");
        addServiceToServiceProvider(serviceProvidersIds["Provider1"], "ServiceOfProvider1", 10, 0, 4);
        addServiceToServiceProvider(serviceProvidersIds["Provider1"], "ServiceOfProvider1_2", 10, 0, 4);
    }
