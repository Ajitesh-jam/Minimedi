import Web3 from "web3";
import medicalRecordsABI from "../contracts/abi.json";

const contractAddress = "0x9768B94a6Bc6687D0229587adceaD04908D73d3f"; 

// Initialize Web3 and contract
export function Utils() {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        return web3;
    }
}

// Initialize the contract instance
export const medicalRecordsContract = () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        return new web3.eth.Contract(medicalRecordsABI, contractAddress);
    } else {
        throw new Error("MetaMask is not installed. Please install MetaMask and try again.");
    }
};

// Get connected accounts
export const getAccounts = async () => {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            return accounts;
        } catch (error) {
            throw new Error(`Error fetching accounts: ${error.message}`);
        }
    } else {
        throw new Error("MetaMask is not installed.");
    }
};

// Add a new doctor (only owner can call this)
export const addNewDoctor = async (doctorAddress) => {
    const contract = medicalRecordsContract();
    const accounts = await getAccounts();

    try {
        const response = await contract.methods
            .addNewDoctor(doctorAddress)
            .send({ from: 0x3a94bD23Eb39cd8083A31C0e802F7f724e95b6c2 });

            console.log("doctor added successfully");
        return response;
    } catch (error) {
        throw new Error(`Error adding doctor: ${error.message}`);
    }
};

// Update medical record by patient
export const updateRecordByPatient = async (record) => {
    const contract = medicalRecordsContract();
    const accounts = await getAccounts();

    try {
        const response = await contract.methods
            .updateRecordByPatient(record)
            .send({ from: accounts[0] });
        return response;
    } catch (error) {
        throw new Error(`Error updating record: ${error.message}`);
    }
};

// Update medical record by doctor
export const updateRecordByDoctor = async (patientAddress, record) => {
    const contract = medicalRecordsContract();
    const accounts = await getAccounts();

    try {

        //const gasPrice = await web3.eth.getGasPrice();
		// const gasLimit = await updateRecordByDoctor.methods
        //     .updateRecordByDoctor(patientAddress, record)
        //     .estimateGas({
        //     from: connectedAccount		
		// });

        const response = await contract.methods
            .updateRecordByDoctor(patientAddress, record)
            .send({ from: accounts[0],
             });



        return response;
    } catch (error) {
        throw new Error(`Error updating patient's record: ${error.message}`);
    }
};

// Get medical records of a patient
export const getMedicalRecord = async (patientAddress,DoctorAddress) => {
    const contract = medicalRecordsContract();

    console.log(`Getting ${patientAddress} from ${DoctorAddress}`);
    try {
        const records = await contract.methods
            .getMedicalRecord(patientAddress)
            .call({ from: DoctorAddress });
        
            console.log("Fetched Records by web3 utils : ",records);
        return records;
    } catch (error) {
        throw new Error(`Error fetching medical records: ${error.message}`);
    }
};

// Get doctors treating a patient
export const getDoctors = async (patientAddress) => {
    const contract = medicalRecordsContract();
    const accounts = await getAccounts();

    try {
        const doctors = await contract.methods
            .getDoctors(patientAddress)
            .call({ from: accounts[0] });
        return doctors;
    } catch (error) {
        throw new Error(`Error fetching doctors: ${error.message}`);
    }
};

// Delete a patient's medical record (only owner)
export const deletePatient = async (patientAddress) => {
    const contract = medicalRecordsContract();
    const accounts = await getAccounts();

    try {
        const response = await contract.methods
            .deletePatient(patientAddress)
            .send({ from: accounts[0] });
        return response;
    } catch (error) {
        throw new Error(`Error deleting patient record: ${error.message}`);
    }
};

// Delete a specific medical record by index (only doctor)
export const deleteRecord = async (patientAddress, index) => {
    const contract = medicalRecordsContract();
    const accounts = await getAccounts();

    try {
        const response = await contract.methods
            .deleteRecord(patientAddress, index)
            .send({ from: accounts[0] });
        return response;
    } catch (error) {
        throw new Error(`Error deleting record: ${error.message}`);
    }
};

