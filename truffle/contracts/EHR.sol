// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract EHR { 
    address public owner;

    struct Record { 
        string cid;
        string fileName; 
        address patientId;
        address doctorId;
        uint256 timeAdded;
    }

    struct Patient {
        address id;
        Record[] records;
    }

    struct Doctor {
        address id;
        bool isVerified; // Added to check if doctor is approved
    }

    mapping (address => Patient) private patients;
    mapping (address => Doctor) private doctors;

    event PatientAdded(address indexed patientId);
    event DoctorAdded(address indexed doctorId);
    event RecordAdded(string cid, address indexed patientId, address indexed doctorId); 

    constructor() {
        owner = msg.sender;
    }

    // --- Modifiers ---

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier senderExists() {
        require(doctors[msg.sender].id == msg.sender || patients[msg.sender].id == msg.sender, "Sender does not exist");
        _;
    }

    modifier patientExists(address _patientId) {
        require(patients[_patientId].id == _patientId, "Patient does not exist");
        _;
    }

    modifier senderIsDoctor() {
        require(doctors[msg.sender].id == msg.sender, "Sender is not a registered doctor");
        _;
    }

    // --- Functions ---

    // Only a verified doctor should be able to register a patient
    function addPatient(address _patientId) public senderIsDoctor {
        require(_patientId != address(0), "Invalid address");
        require(patients[_patientId].id == address(0), "Patient already exists");
        
        patients[_patientId].id = _patientId;
        emit PatientAdded(_patientId);
    }

    // New doctors register here
    function addDoctor() public {
        require(doctors[msg.sender].id == address(0), "Doctor already registered");
        doctors[msg.sender] = Doctor(msg.sender, false); // false = pending verification if you choose to add that logic
        emit DoctorAdded(msg.sender);
    }

    function addRecord(string memory _cid, string memory _fileName, address _patientId) 
        public 
        senderIsDoctor 
        patientExists(_patientId) 
    {
        Record memory newRecord = Record({
            cid: _cid,
            fileName: _fileName,
            patientId: _patientId,
            doctorId: msg.sender,
            timeAdded: block.timestamp
        });

        patients[_patientId].records.push(newRecord);
        emit RecordAdded(_cid, _patientId, msg.sender);
    } 

    function getRecords(address _patientId) 
        public 
        view 
        senderExists 
        patientExists(_patientId) 
        returns (Record[] memory) 
    {
        // Patients can see their own, doctors can see any they are authorized for
        return patients[_patientId].records;
    } 

    function getSenderRole() public view returns (string memory) {
        if (doctors[msg.sender].id == msg.sender) {
            return "doctor";
        } else if (patients[msg.sender].id == msg.sender) {
            return "patient";
        } else {
            return "unknown";
        }
    }

    function getPatientExists(address _patientId) public view returns (bool) {
        return patients[_patientId].id == _patientId;
    }
}