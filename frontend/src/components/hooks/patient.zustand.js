import { create } from 'zustand';

// Define the initial patient data structure
const initialState = {
    selectedPatient: 
    {
        name: "Default Patient",
        DOB: "2-34-2224",
        image: "assets/images/team/team-1.jpg",
        email: "default@gmail.com",
        publicAddress: "0x7BEb7983B03e75B4b7F62E2B13256Aec92C223Fa",
        contact: "0000000000",
        gender: "Male",
        aadhar: "XXXXXXXXXXXXXX",
    }

};


// Create the Zustand store for patient management
const usePatients = create((set) => ({
    ...initialState,
    
    // Add a new patient
    addPatient: (patient) =>
        set((state) => ({ selectedPatient:  patient })),

    // Remove a patient by their publicAddress
    removePatient: () =>
        set((state) => ({
            selectedPatient: 
                {
                    name: "Default Patient",
                    DOB: "2-34-2224",
                    image: "assets/images/team/team-1.jpg",
                    email: "default@gmail.com",
                    publicAddress: "0x7BEb7983B03e75B4b7F62E2B13256Aec92C223Fa",
                    contact: "0000000000",
                    gender: "Male",
                    aadhar: "XXXXXXXXXXXXXX",
                }
        })
    ),

    // Set a new patient in the state (can be used for temporary storage)
    setNewPatient: (patient) => set(() => ({ selectedPatient: patient })),

   
}));

export default usePatients;
