import axios from 'axios';
import uri from "../utils/URL";
import DownloadIcon from '@mui/icons-material/Download';


const DownloadExcelButton = () => {
    const downloadExcel = async () => {
        try {
            const response = await axios.get(uri + '/download-excel', {
                responseType: 'blob', // Important
            });

            // Create a URL for the file and make it downloadable
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Demands.xlsx'); // Set the file name
            document.body.appendChild(link);
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading the file', error);
        }
    };

    return (
        <div style={{ width: '100%', padding: '5px 2vw', display: 'flex', justifyContent: 'flex-end' }}>
            <DownloadIcon onClick={downloadExcel} />
        </div>
    );
};

export default DownloadExcelButton;
