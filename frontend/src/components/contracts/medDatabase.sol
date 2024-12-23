// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol"; 
contract MedicalRecords {

    // Struct to hold patient medical data
    struct Patient {
        address[] doctors;        // Array of doctors treating the patient
        string[] medicalData;     // Array to store medical data (e.g., file hashes later)
    }

    // Mappings
    mapping(address => Patient) private patients;     // Maps a patient's public address to their medical records
    mapping(address => bool) public verifiedDoctors;  // Stores verified doctors

    address owner;

    // Constructor to set the owner and add the first doctor
    constructor( address _doctor) {
        owner = msg.sender;
        addNewDoctor(_doctor);  // Only the owner can add the first doctor

        //add initial random data
        // string memory record = "Medical record for patient 1";
        // updateRecordByPatient(record);  
        // record = "Medical record for patient 2";
        // updateRecordByPatient(record);  
        // record = "Medical record for patient 3";
        // updateRecordByPatient(record);

        for (uint8 i=0;i<=10;i++){
            //random records
            
            string memory s=Strings.toString(i);
            patients[0x8bD0A4C1887cD12B07043F1F9bCa97D611C97233].medicalData.push(s);
            patients[0xBC51720Ea34de281A64896bD7B792BbC6bbf85df].medicalData.push(s);
            patients[0x3a94bD23Eb39cd8083A31C0e802F7f724e95b6c2].medicalData.push(s);
            patients[0x7BEb7983B03e75B4b7F62E2B13256Aec92C223Fa].medicalData.push(s);
            patients[0xBa02bBDffcba023572EbcACad22d3755704903ce].medicalData.push(s);
        }
    }

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyDoctor() {
        require(verifiedDoctors[msg.sender], "Only verified doctors can perform this action");
        _;
    }

    modifier patientExists(address _patient) {
        require(patients[_patient].doctors.length > 0 && patients[_patient].medicalData.length > 0, "Patient record does not exist");
        _;
    }

    // Function to add a new doctor (only owner can add new doctors)
    function addNewDoctor(address _doctor) public onlyOwner {
        require(!verifiedDoctors[_doctor], "Doctor already exists");
        verifiedDoctors[_doctor] = true;
    }
    
    // Function for a patient to update their own medical record
    function updateRecordByPatient(string memory _record) public  { //if not exists ,this will create it.
        patients[msg.sender].medicalData.push(_record);
        // Patient updates their own record, no need to update the doctor
    }
    function deleteRecord(address _patient, uint256 index) public onlyDoctor{
        require(index < patients[_patient].medicalData.length, "Record does not exist");
        
        patients[_patient].medicalData[index]=patients[_patient].medicalData[patients[_patient].medicalData.length-1];
        patients[_patient].medicalData.pop();
    }
    function deletePatient(address _patient) public onlyOwner{
        require(_patient != msg.sender, "Can't delete your own record");
        patients[_patient].medicalData = new string[](0);
        patients[_patient].doctors = new address[](0);
    }

    // Function for a doctor to update a patient's medical record
    function updateRecordByDoctor(address _patient, string memory _record) public onlyDoctor  { //if not exists it will create it
        patients[_patient].medicalData.push(_record);

        // Ensure the doctor isn't added multiple times
        bool doctorExists = false;
        for (uint i = 0; i < patients[_patient].doctors.length; i++) {
            if (patients[_patient].doctors[i] == msg.sender) {
                doctorExists = true;
                break;
            }
        }
        if (!doctorExists) {
            patients[_patient].doctors.push(msg.sender);  // Add doctor if not already in the list
        }
    }

    // Unified function to get medical records (for patient or doctor)
    function getMedicalRecord(address _patient) public view returns (string[] memory) {
        require(msg.sender == _patient || verifiedDoctors[msg.sender], "Access denied: Only patient or doctor can view records");

        if(patients[_patient].medicalData.length > 0)
        return patients[_patient].medicalData;
        //else return no medical records found
        else{
            string [] memory records = new string[](1);
            records[0] = "No records found";
            return records;
        }

    }

    // Function to get list of doctors treating a patient
    function getDoctors(address _patient) public view patientExists(_patient) returns (address[] memory) {
        require(msg.sender == _patient || verifiedDoctors[msg.sender], "Access denied: Only patient or doctor can view doctors");
        return patients[_patient].doctors;
    }

    
}



//contract address : 0xccA081c8989a41a7bE645c4f377d6B3c85d25686
//current doctors : 0xBC51720Ea34de281A64896bD7B792BbC6bbf85df , 0x3a94bD23Eb39cd8083A31C0e802F7f724e95b6c2 
//current owner : 0x3a94bD23Eb39cd8083A31C0e802F7f724e95b6c2