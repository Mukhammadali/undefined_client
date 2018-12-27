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
        uint providerID;
        string description;
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

    // ServiceProvider[] public serviceProviders;
    uint public serviceProvidersCount;

    // For keeping track of id's of Service Providers in sercieProviders array
    // LATER: Find better solution
    mapping(uint => ServiceProvider) public serviceProviders;




    function addService (uint _id, uint _max, uint _current, string memory _name, string memory description, uint credits, uint providerID) private {
        servicesCount ++;
        services.push(Service({
            id: _id,
            maxNum: _max,
            currentNum: _current,
            name: _name,
            description: description,
            completed: false,
            credits: credits,
            providerID: providerID
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
        // serviceProvidersIds[name] = id;
        serviceProvidersCount++;
        serviceProviders[id] = ServiceProvider({
            id: id,
            name: name,
            numberOfServices: 0
        });
    }

    // Creates new service and binds it to existing Service Provider
    function addServiceToServiceProvider(uint sp_id, string memory s_name, string memory s_description, uint s_max, uint s_current, uint s_credits) public {
        setService(s_name, s_description, s_max, s_current, s_credits, sp_id);
        serviceProviders[sp_id].services[serviceProviders[sp_id].numberOfServices] = services[servicesCount-1];
        serviceProviders[sp_id].numberOfServices++;
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

    function setService(string memory name, string memory description, uint max, uint current, uint credits, uint providerID) public {
        addService(services.length, max, current, name, description, credits, providerID);
    }

    function setStudent(uint id, string memory name) public {
        // require(!studentExists(id), "Student already exists.");
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
    function setServiceProvider(uint id, string memory name) public {
        addServiceProvider(id, name);
    }


    // Getters

    function getService(uint id) public view
        returns(
        uint, 
        uint,
        string memory,
        string memory,
        bool,
        uint,
        uint
        ) {
        return(
            services[id].maxNum,
            services[id].currentNum,
            services[id].name,
            services[id].description,
            services[id].completed,
            services[id].credits,
            services[id].providerID
        );
    }

    function getStudent(uint id) public view returns(uint, uint, string memory) {
        require(studentExists(id), "Student does not exist.");
        uint i = 0;
        for(i; i < studentsCount; i++){
            if(students[i].id == id){
                break;
            }
        }
        return(
            i,
            students[i].id,
            students[i].name
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
    function getServiceProvidersService(uint id, uint index) public view returns(string memory) {
        // require(index < serviceProviders[serviceProvidersIds[sp_name]].numberOfServices, "Our of range of services available in this Service Provider");
        return(
            serviceProviders[id].services[index].name
        );
    }

    function editService(uint id, string memory new_name, string memory new_description, uint new_max, uint new_current, bool new_completed, uint new_credits) public {
        services[id].name = new_name;
        services[id].description = new_description;
        services[id].maxNum = new_max;
        services[id].currentNum = new_current;
        services[id].completed = new_completed;
        services[id].credits = new_credits;        
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
        setServiceProvider(1501010, "Provider1");
        setServiceProvider(1501011, "Provider2");
        setServiceProvider(1501012, "Provider3");

        setService("Service1", "Description to Service1", 20, 10, 4, 1501010);
        setService("Service2", "Description to Service2", 10, 5, 4, 1501011);
        setService("Service3", "Description to Service3", 15, 7, 4, 1501011);

        setStudent(16012786, "Student1");
        setStudent(16013086, "Student2");
        setStudent(16014086, "Student3");

        addServiceToServiceProvider(1501010, "ServiceOfProvider1", "Description to ServiceOfProvider1",  10, 0, 4);
        addServiceToServiceProvider(1501010, "ServiceOfProvider1_2", "Description to ServiceOfProvider1_2", 10, 0, 4);

        addServiceToServiceProvider(1501011, "ServiceOfProvider2", "Description to ServiceOfProvider2", 8, 0, 9);
        addServiceToServiceProvider(1501011, "ServiceOfProvider2_2", "Description to ServiceOfProvider2_2", 8, 0, 9);

        addServiceToServiceProvider(1501012, "ServiceOfProvider3", "Description to ServiceOfProvider3", 3, 0, 1);
        addServiceToServiceProvider(1501012, "ServiceOfProvider3_2", "Description to ServiceOfProvider3_2", 3, 0, 1);
    
    }
}

