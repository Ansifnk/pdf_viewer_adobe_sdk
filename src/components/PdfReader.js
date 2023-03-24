import React from "react";
import { saveAnnotation } from "../helperFunctions/saveAnnotation";
import ViewSDKClient from "../utils/viewSdkClient";

const previewConfigs = {
    embedMode: "FULL_WINDOW",
    showDownloadPDF: false,
    showZoomControl: false,
    showAnnotationTools: true,
    enableFormFilling: false,
    showPrintPDF: false,
    showBookmarks: false,
    includePDFAnnotations: true,
    enableAnnotationAPIs: true
}

const customFlags = {
    showToolbar: true,
    showCommentsPanel: false,
    downloadWithAnnotations: true,
    showToolsOnTextSelection: false,
    printWithAnnotations: true,
}

const PdfReader = ({ url }) => {

    const loadPDF = () => {
        const viewSDKClient = new ViewSDKClient();
        viewSDKClient.ready().then(() => {
            const previewFilePromise = viewSDKClient.previewFile(
                "pdf-div",
                previewConfigs,
                url
            );


            // Codes below this are used to control annotations configs.

            const eventOptions = {
                listenOn: [
                    "ANNOTATION_ADDED", "ANNOTATION_UPDATED", "ANNOTATION_DELETED"
                ]
            }

            previewFilePromise
                .then(async (adobeViewer) => {

                    let list_of_annotations = await JSON.parse(localStorage.getItem('ANNOTATION')) ?? [] // retrieve already saved annotations


                    adobeViewer.getAnnotationManager()
                        .then(annotationManager => {
                            annotationManager.setConfig(customFlags)
                                .then(() => console.log("Success"))
                                .catch(error => console.log(error));

                            annotationManager.addAnnotations(list_of_annotations)

                                .then(() => console.log("Success"))

                                .catch(error => console.log(error));

                            annotationManager.getAnnotations()
                                .then(result => {
                                    console.log("GET all annotations", result);
                                    viewSDKClient.annots = result;
                                    console.log('viewSDKClient.annots in init');
                                    console.log(viewSDKClient.annots);
                                })
                                .catch(e => {
                                    console.log(e);
                                });

                            annotationManager.registerEventListener(  // register events to listen changes in annotations.
                                function (event) {
                                    console.log(event.type, event.data)
                                    if (event.type === 'ANNOTATION_ADDED') {
                                        viewSDKClient.annots = [...viewSDKClient.annots, event.data];
                                        // saveAnnotation([...viewSDKClient.annots])
                                    } else if (event.type === 'ANNOTATION_UPDATED') {
                                        viewSDKClient.annots = [...(viewSDKClient.annots.filter(a => a.id !== event.data.id)), event.data]
                                    } else if (event.type === 'ANNOTATION_DELETED') {
                                        viewSDKClient.annots = viewSDKClient.annots.filter(a => a.id !== event.data.id);
                                    }
                                },
                                eventOptions
                            );
                        })
                        .catch(e => {
                            console.log(e);
                        });
                })
                .catch(e => {
                    console.log(e);
                });


            viewSDKClient.registerSaveApiHandler(); // for registering save event for saving annotations and other configs.
            viewSDKClient.registerGetUserProfileApiHandler();
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