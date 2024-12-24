
import { create } from 'zustand';

// Define the initial Staff data structure
const initialState = {
    selectedStaff: 
    {
        name: "Default Staff",
        DOB: "2-34-2224",
        image: "assets/images/team/team-1.jpg",
        email: "default@gmail.com",
        publicAddress: "0x7BEb7983B03e75B4b7F62E2B13256Aec92C223Fa",
        contact: "0000000000",
        gender: "Male",
        aadhar: "XXXXXXXXXXXXXX",
    }

};


// Create the Zustand store for Staff management
const useStaffs = create((set) => ({
    ...initialState,
    
    // Add a new Staff
    addStaff: (Staff) =>
        set((state) => ({ selectedStaff:  Staff })),

    // Remove a Staff by their publicAddress
    removeStaff: () =>
        set((state) => ({
            selectedStaff: 
                {
                    name: "Default Staff",
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

    // Set a new Staff in the state (can be used for temporary storage)
    setNewStaff: (Staff) => set(() => ({ selectedStaff: Staff })),

   
}));

export default useStaffs;
