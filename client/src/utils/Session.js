import axios from "axios";
import uri from "./URL";


export const logout = () => {
    localStorage.removeItem("gstportal");
    window.location.href = "/login";
    console.log("Logged Out")
    return true
}

export const getAuthToken = () => {
    return localStorage.getItem('gstportal');
};

export const getUserDetails = async () => {
    const token = getAuthToken();

    if (!token) {
        return false;
    }

    try {
        const response = await axios.post(uri + "/authorize", {token}
            // {
            // headers: {
            //     Authorization: `Bearer ${token}`,
            //     'Content-Type': 'application/json',
            // },
            // }
        );
        if (response.status === 200) {
            const userDetails = response.data;
            return userDetails;
        } else {
            localStorage.removeItem('gstportal');
            return false;
        }
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        localStorage.removeItem('gstportal');
        window.location.href = "/login";
        return false;
    }
};
