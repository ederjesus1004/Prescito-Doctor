import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const months = [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
    ];

    const slotDateFormat = (slotDate) => {
        if (!slotDate) return "";
        
        const dateArray = slotDate.split("_");
        const [day, month, year] = dateArray;
        
        if (!day || !month || !year) return "";
        
        const monthIndex = Number(month) - 1;
        if (monthIndex < 0 || monthIndex >= months.length) return "";
        
        return `${day} ${months[monthIndex]} ${year}`;
    };

    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
    };

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
