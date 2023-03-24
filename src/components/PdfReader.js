import React from "react";
import ViewSDKClient from "../utils/viewSdkClient";


const PdfReader = ({ url }) => {
    const loadPDF = () => {
        const viewSDKClient = new ViewSDKClient();
        viewSDKClient.ready().then(() => {
            viewSDKClient.previewFile(
                "pdf-div",
                {
                    embedMode: "FULL_WINDOW",
                    showDownloadPDF: false,
                    showZoomControl: false,
                    showAnnotationTools:false,
                    enableFormFilling:false,
                    showPrintPDF:false,
                    showBookmarks:false
                },
                url
            );
        });
    };
    return (
        <div className="mt-28">
            <div
                style={{ height: "100vh" }}
                id="pdf-div"
                className="full-window-div border border-gray-100 h-screen"
                onDocumentLoad={loadPDF()}
            ></div>
        </div>
    );
};
export default PdfReader;